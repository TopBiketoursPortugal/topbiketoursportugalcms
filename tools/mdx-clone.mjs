import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  copyFileSync,
  globSync
} from 'fs';
import { join, dirname, basename, sep } from 'path';
import { v7 as uuidv7 } from 'uuid'; // For generating GUIDs
import simpleGit from 'simple-git'; // For Git operations

/**
 * Translation stubs.
 *
 * Every English (.mdx) content entry has one sibling per non-default language,
 * living in `src/content/<collection>/<lang>/<same-filename>`. This script
 * makes sure those siblings exist:
 *
 *   pnpm mdx-clone            pre-commit mode — for every *newly added* English
 *                             entry, drop a stub in each language folder and
 *                             stage it, so it lands in the same commit.
 *   pnpm mdx-clone --all      bulk mode — walk the whole content tree and create
 *                             a stub for every English entry that has no
 *                             counterpart yet in a language folder. Nothing is
 *                             staged; used when a language is first added.
 *   --lang de,nl              limit either mode to some languages.
 *   --dry                     report what would be created, write nothing.
 *
 * The language list comes from data/languages.json (`isDefault` marks the
 * source language) so adding a language there is enough to start cloning into it.
 */

const git = simpleGit();

const REPO_ROOT = new URL('../', import.meta.url).pathname.replace(
  /^\/([A-Za-z]:)/,
  '$1'
);
const LANGUAGES_DATA = JSON.parse(
  readFileSync(join(REPO_ROOT, 'data/languages.json'), 'utf8')
);
const DEFAULT_LANGUAGE =
  Object.values(LANGUAGES_DATA).find((l) => l.isDefault)?.code ?? 'en';
const ALL_TARGETS = Object.keys(LANGUAGES_DATA).filter(
  (code) => code !== DEFAULT_LANGUAGE
);

/**
 * Collections whose entries are not translated. Testimonials are quoted in
 * the reviewer's own words and shown as-is; a stub per language would only
 * be 168 × N files nobody translates.
 */
const SKIP_COLLECTIONS = ['testimonials'];

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const opt = (name) => {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  if (hit) return hit.slice(name.length + 3);
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--')
    ? argv[i + 1]
    : undefined;
};

const BULK = flag('all');
const DRY = flag('dry');
const TARGETS = (
  opt('lang')
    ?.split(',')
    .map((s) => s.trim()) ?? ALL_TARGETS
)
  .filter(Boolean)
  .filter((code) => {
    if (ALL_TARGETS.includes(code)) return true;
    console.warn(`Unknown language "${code}" — not in data/languages.json`);
    return false;
  });

/** True if `file` (posix or win path) sits inside a language subfolder. */
function isTranslation(file) {
  const parts = file.split(/[\\/]/);
  return parts.some(
    (p) => Object.keys(LANGUAGES_DATA).includes(p) && p !== DEFAULT_LANGUAGE
  );
}

// Function to get newly added .mdx files
async function getNewMdxFiles() {
  const status = await git.status();
  return status.created.filter(
    (file) => file.endsWith('.mdx') && !isTranslation(file)
  );
}

/** Every English content entry in the tree (paths relative to the repo root). */
function getAllSourceMdxFiles() {
  return globSync('src/content/**/*.mdx', { cwd: REPO_ROOT })
    .map((f) => f.split(sep).join('/'))
    .filter((f) => !isTranslation(f))
    .filter((f) => !SKIP_COLLECTIONS.includes(f.split('/')[2]))
    .sort();
}

/**
 * Turn a verbatim copy of an English entry into an unpublished stub for
 * `language`. Three edits, each load-bearing:
 *
 *   id       a fresh one, or the copy collides with the entry it came from
 *   language the target code, or the copy resolves to its original's URL —
 *            routes.mjs trusts frontmatter over the folder, so a stub left at
 *            `en` fails the build with a duplicate-url error
 *   draft    keeps it out of the collections until someone translates it
 *            (src/schemas/published-glob.ts)
 *
 * `path` is deliberately left alone: the language prefix already makes the URL
 * unique, and the English slug is the right placeholder until a translator
 * picks a localised one.
 */
function prepareStub(file, language) {
  const content = readFileSync(file, 'utf8');
  const newGuid = uuidv7();
  const map = idMapFor(language);

  let updated = content.replace(
    /(id: ['"]?)[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(['"]?)/gis,
    `$1${newGuid}$2`
  );
  if (/^language:.*$/m.test(updated)) {
    updated = updated.replace(/^language:.*$/m, `language: ${language}`);
  } else {
    updated = updated.replace(/^---\r?\n/, `---\nlanguage: ${language}\n`);
  }
  if (!/^draft:/m.test(updated)) {
    updated = updated.replace(/^---\r?\n/, '---\ndraft: true\n');
  }
  updated = remapReferences(updated, map);

  writeFileSync(file, updated, 'utf8');
  const sourceId = ID_LINE.exec(content)?.[1];
  if (sourceId) map.set(sourceId.toLowerCase(), newGuid);
  console.log(`Prepared ${LANGUAGES_DATA[language].name} stub: ${file}`);
}

const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
const ID_LINE = /^id:\s*['"]?([0-9a-f-]{36})['"]?\s*$/m;

/**
 * English id -> `language` id, for every entry that has a counterpart under a
 * `<language>/` folder with the same filename. Built lazily, once per language
 * per run, and extended as stubs are created so a tour cloned after its region
 * still sees the region's new id.
 */
const idMaps = new Map();
function idMapFor(language) {
  if (idMaps.has(language)) return idMaps.get(language);
  const map = new Map();
  for (const source of getAllSourceMdxFiles()) {
    const target = source.replace(/\/([^/]+)$/, `/${language}/$1`);
    const abs = join(REPO_ROOT, target);
    if (!existsSync(abs)) continue;
    const from = ID_LINE.exec(
      readFileSync(join(REPO_ROOT, source), 'utf8')
    )?.[1];
    const to = ID_LINE.exec(readFileSync(abs, 'utf8'))?.[1];
    if (from && to && from !== to) map.set(from.toLowerCase(), to);
  }
  idMaps.set(language, map);
  return map;
}

/**
 * A translated entry points at translated neighbours: the Portuguese tour
 * references the Portuguese region, tags, bikes and related posts, not the
 * English ones (that is how the region pages find their tours — same
 * language, same id). Rewrite every known English id in the body except the
 * entry's own `id:` line, which prepareStub has already replaced. Unknown ids
 * (an entry with no counterpart yet) are left as they are.
 */
function remapReferences(content, map) {
  if (!map.size) return content;
  const own = ID_LINE.exec(content)?.[0];
  return content.replace(UUID, (id, offset) => {
    // leave the entry's own id line alone
    if (
      own &&
      content.indexOf(own) <= offset &&
      offset < content.indexOf(own) + own.length
    )
      return id;
    return map.get(id.toLowerCase()) ?? id;
  });
}

/**
 * Copy `file` into its `<language>/` sibling folder. Returns the new path, or
 * undefined when the counterpart already exists (on disk or in git's view).
 */
async function cloneFileTo(file, language, { checkGit = true } = {}) {
  const fileDir = dirname(file);
  const fileName = basename(file);
  const langDir = join(fileDir, language);
  const targetPath = join(langDir, fileName);

  if (existsSync(targetPath)) return undefined;

  if (checkGit) {
    const status = await git.status();
    const allFiles = [
      ...status.not_added,
      ...status.created,
      ...status.modified,
      ...status.staged
    ];
    if (allFiles.includes(targetPath)) {
      console.warn(
        `File already tracked in Git: ${targetPath}. Skipping clone.`
      );
      return undefined;
    }
  }

  if (DRY) {
    console.log(`[dry] would create ${targetPath}`);
    return targetPath;
  }

  if (!existsSync(langDir)) mkdirSync(langDir, { recursive: true });
  copyFileSync(file, targetPath);
  console.log(`Cloned: ${targetPath}`);
  return targetPath;
}

async function preCommit() {
  const newMdxFiles = await getNewMdxFiles();

  if (newMdxFiles.length === 0) {
    console.log('No new .mdx files added. Skipping clone process.');
    return;
  }

  for (const file of newMdxFiles) {
    if (!existsSync(file)) {
      console.warn(`File does not exist: ${file}`);
      continue;
    }
    for (const language of TARGETS) {
      const target = await cloneFileTo(file, language);
      if (!target || DRY) continue;
      prepareStub(target, language);
      // Stage it, so the stub lands in the same commit as its original.
      await git.add(target);
    }
  }

  console.log('Pre-commit hook completed successfully.');
}

async function bulk() {
  const sources = getAllSourceMdxFiles();
  const created = [];
  for (const file of sources) {
    for (const language of TARGETS) {
      const target = await cloneFileTo(join(REPO_ROOT, file), language, {
        checkGit: false
      });
      if (!target) continue;
      created.push([target, language]);
      if (!DRY) prepareStub(target, language);
    }
  }
  // Second pass: a page cloned before the tours it features could not yet
  // see the tours' new ids. Now every stub exists, so every reference resolves.
  if (!DRY) {
    for (const [target, language] of created) {
      const map = idMapFor(language);
      const before = readFileSync(target, 'utf8');
      const after = remapReferences(before, map);
      if (after !== before) writeFileSync(target, after, 'utf8');
    }
  }
  console.log(
    `${DRY ? 'Would create' : 'Created'} ${created.length} stub(s) across ${TARGETS.join(', ')} ` +
      `for ${sources.length} source entr(ies).`
  );
}

async function main() {
  try {
    if (BULK) await bulk();
    else await preCommit();
  } catch (error) {
    console.error('Error in mdx-clone:', error);
    process.exit(1); // Exit with a non-zero code to prevent the commit
  }
}

main();
