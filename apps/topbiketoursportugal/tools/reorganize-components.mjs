/**
 * Reorganizes src/components into the astro-component-starter taxonomy:
 *   building-blocks/  core UI primitives (buttons, cards, typography, ...)
 *   page-sections/    full-width CMS blocks (hero, text, timeline, ...)
 *   navigation/       breadcrumbs, mega-menu
 * Domain dirs (blog, tours, schema, snippets, collection sub-cards live with
 * their block) stay put.
 *
 * Because `_component` names are path-derived, this also rewrites:
 *  - all import/glob specifiers across src/ (relative specifiers are resolved
 *    from the importer's ORIGINAL location and re-emitted as root-based
 *    `src/components/...` specifiers when they cross directory boundaries)
 *  - `_component:` values in content frontmatter and structure-value files
 *
 * Run once with `node tools/reorganize-components.mjs`. Uses `git mv`.
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const EXTS = new Set(['.astro', '.ts', '.tsx', '.js', '.jsx', '.mjs']);

// top-level dir under src/components → new subpath under src/components
const MOVES = {
  background: 'building-blocks/background',
  buttons: 'building-blocks/buttons',
  card: 'building-blocks/card',
  container: 'building-blocks/container',
  form: 'building-blocks/form',
  grid: 'building-blocks/grid',
  'item-grid': 'building-blocks/item-grid',
  linkbutton: 'building-blocks/linkbutton',
  'pricing-table': 'building-blocks/pricing-table',
  rating: 'building-blocks/rating',
  'responsive-image': 'building-blocks/responsive-image',
  separator: 'building-blocks/separator',
  stack: 'building-blocks/stack',
  tabs: 'building-blocks/tabs',
  testimonials: 'building-blocks/testimonials',
  tooltip: 'building-blocks/tooltip',
  typography: 'building-blocks/typography',
  utility: 'building-blocks/utility',
  'widget-wrapper': 'building-blocks/widget-wrapper',
  accordion: 'page-sections/accordion',
  collection: 'page-sections/collection',
  'featured-posts': 'page-sections/featured-posts',
  'featured-testimonials': 'page-sections/featured-testimonials',
  'featured-tours': 'page-sections/featured-tours',
  features: 'page-sections/features', // merges into the starter group dir
  gallery: 'page-sections/gallery',
  headline: 'page-sections/headline',
  hero: 'page-sections/heroes/hero',
  'left-right': 'page-sections/left-right',
  text: 'page-sections/text',
  timeline: 'page-sections/timeline',
  'two-column-markdown': 'page-sections/two-column-markdown',
  'wetravel-button': 'page-sections/wetravel-button',
  youtube: 'page-sections/youtube',
  breadcrumbs: 'navigation/breadcrumbs',
  'mega-menu': 'navigation/mega-menu'
};

// old `_component` name → new (path-derived, filename-collapse rule)
const NAME_MAP = {
  accordion: 'page-sections/accordion',
  collection: 'page-sections/collection',
  'featured-posts': 'page-sections/featured-posts',
  'featured-testimonials': 'page-sections/featured-testimonials',
  'featured-tours': 'page-sections/featured-tours',
  features: 'page-sections/features',
  gallery: 'page-sections/gallery',
  headline: 'page-sections/headline',
  hero: 'page-sections/heroes/hero',
  'left-right': 'page-sections/left-right',
  text: 'page-sections/text',
  timeline: 'page-sections/timeline',
  'two-column-markdown': 'page-sections/two-column-markdown',
  'wetravel-button': 'page-sections/wetravel-button',
  youtube: 'page-sections/youtube',
  'buttons/primary': 'building-blocks/buttons/primary',
  'buttons/secondary': 'building-blocks/buttons/secondary'
};

const toPosix = (p) => p.split(path.sep).join('/');

function newRepoPath(repoPath) {
  const m = repoPath.match(/^src\/components\/([^/]+)(\/.*)?$/);
  if (!m) return repoPath;
  const [, top, rest] = m;
  if (!(top in MOVES)) return repoPath;
  return `src/components/${MOVES[top]}${rest ?? ''}`;
}

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      yield* walk(p);
    } else {
      yield toPosix(p);
    }
  }
}

// ---- pass 1: rewrite specifiers in all source files (at OLD locations) ----
let rewrites = 0;
for (const file of walk('src')) {
  if (!EXTS.has(path.extname(file))) continue;
  const original = fs.readFileSync(file, 'utf8');
  let content = original;

  // (a) root-based and absolute specifiers + glob patterns + path templates
  content = content.replace(
    /src\/components\/([a-z-]+)\//g,
    (whole, top) => (top in MOVES ? `src/components/${MOVES[top]}/` : whole)
  );
  // (b) @components alias imports
  content = content.replace(
    /@components\/([a-z-]+)\//g,
    (whole, top) => (top in MOVES ? `@components/${MOVES[top]}/` : whole)
  );
  // (c) relative specifiers on import-ish lines, resolved from the OLD dir
  const importerOldDir = path.posix.dirname(file);
  const importerNewDir = path.posix.dirname(newRepoPath(file));
  content = content
    .split('\n')
    .map((line) => {
      if (!/\bfrom\s|\bimport\s*\(|import\.meta\.glob|^import\s/.test(line)) {
        return line;
      }
      return line.replace(/(['"])(\.{1,2}\/[^'"]*)\1/g, (whole, q, spec) => {
        const absTarget = path.posix.normalize(
          path.posix.join(importerOldDir, spec)
        );
        if (!absTarget.startsWith('src/')) return whole;
        const newTarget = newRepoPath(absTarget);
        // Still resolves identically from the importer's NEW location? keep.
        const stillResolves =
          path.posix.normalize(path.posix.join(importerNewDir, spec)) ===
          newTarget;
        if (stillResolves) return whole;
        return `${q}${newTarget}${q}`;
      });
    })
    .join('\n');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    rewrites++;
  }
}
console.log(`rewrote specifiers in ${rewrites} files`);

// ---- pass 2: rename `_component:` values in content + structure-values ----
const nameEntries = Object.entries(NAME_MAP).sort(
  (a, b) => b[0].length - a[0].length
);
let renames = 0;
for (const file of walk('src/content')) {
  if (!/\.(md|mdx)$/.test(file)) continue;
  const original = fs.readFileSync(file, 'utf8');
  let content = original;
  for (const [oldName, newName] of nameEntries) {
    content = content.replaceAll(
      new RegExp(`(_component:\\s*)${oldName.replace('/', '\\/')}\\s*$`, 'gm'),
      `$1${newName}`
    );
  }
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    renames++;
  }
}
console.log(`renamed _component in ${renames} content files`);

for (const file of walk('src/components')) {
  if (!file.endsWith('.cloudcannon.structure-value.yml')) continue;
  const original = fs.readFileSync(file, 'utf8');
  let content = original;
  for (const [oldName, newName] of nameEntries) {
    content = content.replaceAll(
      new RegExp(`(_component:\\s*)${oldName.replace('/', '\\/')}\\s*$`, 'gm'),
      `$1${newName}`
    );
  }
  if (content !== original) fs.writeFileSync(file, content, 'utf8');
}
console.log('renamed _component in structure-value files');

// ---- pass 3: git mv ----
const run = (cmd) => execSync(cmd, { stdio: 'inherit' });
for (const [top, dest] of Object.entries(MOVES)) {
  const from = `src/components/${top}`;
  const to = `src/components/${dest}`;
  if (!fs.existsSync(from)) {
    console.warn(`missing, skipped: ${from}`);
    continue;
  }
  if (fs.existsSync(to)) {
    // merge into existing dir (starter group dirs, e.g. features)
    for (const entry of fs.readdirSync(from)) {
      run(`git mv "${from}/${entry}" "${to}/${entry}"`);
    }
    fs.rmSync(from, { recursive: true, force: true });
  } else {
    fs.mkdirSync(path.dirname(to), { recursive: true });
    run(`git mv "${from}" "${to}"`);
  }
}
console.log('moves complete');
