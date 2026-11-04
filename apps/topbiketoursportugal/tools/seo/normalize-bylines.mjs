#!/usr/bin/env node
/**
 * Collapse every blog `author` value onto one canonical byline per language.
 *
 * The field is free text typed in CloudCannon, and eight years of editing left
 * 8 distinct values in English and up to 17 in Spanish — including the CMS
 * placeholder `Admin` rendered as a visible byline, the placeholder welded onto
 * a real byline by a folded YAML block (`AdminWritten by Sérgio Marques…`), a
 * missing first letter (`op Bike Tours Portugal Editorial Team`), a stray space
 * before the comma, and English bylines left on German, Spanish, French and
 * Dutch posts.
 *
 * `utils/schema-author.ts` already normalises all of that for the *schema*, so
 * the structured author survived. The **visible** byline did not: readers saw
 * "AdminWritten by Sérgio Marques" and "Admin". That is a trust signal on the
 * page itself, which is what E-E-A-T is actually about.
 *
 * Authorship is a fact about the business, not something to infer: the owner
 * confirmed Sérgio Marques wrote or directed the posts previously filed under
 * the house "Editorial Team" byline, so those are credited to him too. Anything
 * naming a *different* team member is left untouched — this script never
 * reassigns authorship away from a named person.
 *
 *   node tools/seo/normalize-bylines.mjs --dry
 *   node tools/seo/normalize-bylines.mjs --report changes.json
 */
import { readFileSync, writeFileSync, globSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('../../', import.meta.url).pathname;
const DRY = process.argv.includes('--dry');
const reportFlag = process.argv.indexOf('--report');
const REPORT = reportFlag > -1 ? process.argv[reportFlag + 1] : null;

/**
 * One byline per language. Same person, same role, written in the language of
 * the post — a German reader should not meet an English job title.
 */
const CANONICAL = {
  en: 'Written by Sérgio Marques, Founder & Route Designer, Top Bike Tours Portugal',
  pt: 'Escrito por Sérgio Marques, Fundador e Designer de Rotas, Top Bike Tours Portugal',
  de: 'Von Sérgio Marques, Gründer & Routenplaner, Top Bike Tours Portugal',
  es: 'Por Sérgio Marques, fundador y diseñador de rutas, Top Bike Tours Portugal',
  fr: "Par Sérgio Marques, fondateur et concepteur d'itinéraires, Top Bike Tours Portugal",
  nl: 'Geschreven door Sérgio Marques, oprichter & routeontwerper, Top Bike Tours Portugal'
};

/**
 * Team members other than Sérgio. A byline naming one of them is left exactly
 * as it is: reassigning a post away from the person credited with writing it
 * would be inventing authorship, which is the opposite of what this is for.
 * (No post currently names anyone else — this is a guard, not a no-op waiting
 * to be removed.)
 */
const OTHER_TEAM_NAMES = globSync('*.mdx', {
  cwd: join(ROOT, 'src/content/team')
})
  .map((file) => {
    const front = /^---\n([\s\S]*?)\n---/.exec(
      readFileSync(join(ROOT, 'src/content/team', file), 'utf8')
    );
    return /^title:[^\S\n]*(.+)$/m.exec(front?.[1] ?? '')?.[1]?.trim() ?? '';
  })
  .filter((name) => name && !/s[ée]rgio/i.test(name));

/** Values that mean "no identified author": placeholders and house bylines. */
const UNATTRIBUTED =
  /^(admin(istrator)?|author|)$|editorial\s*team|redaktionsteam|equipo\s+editorial|[ée]quipe\s+[ée]ditoriale|redactie(team)?|^top bike tours portugal$/i;

const dir = (language) =>
  language === 'en'
    ? join(ROOT, 'src/content/blog')
    : join(ROOT, 'src/content/blog', language);

const changes = [];

for (const [language, canonical] of Object.entries(CANONICAL)) {
  for (const file of globSync('*.mdx', { cwd: dir(language) })) {
    const path = join(dir(language), file);
    const text = readFileSync(path, 'utf8');

    // `author` may be a plain scalar, a quoted scalar, or a folded block
    // (`author: >-` followed by indented lines) — all three occur.
    const match =
      /^author:[^\S\n]*(?:>-?|\|-?)?[^\S\n]*\n((?:[^\S\n]+\S[^\n]*\n)+)/m.exec(
        text
      ) ?? /^author:[^\S\n]*(.*)$/m.exec(text);
    if (!match) continue;

    const raw = match[1]
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .join(' ')
      .replace(/^['"]|['"]$/g, '')
      .trim();

    if (raw === canonical) continue;

    // Never take a post away from a different named author.
    const namesSomeoneElse = OTHER_TEAM_NAMES.some((name) =>
      raw.toLowerCase().includes(name.toLowerCase())
    );
    if (namesSomeoneElse) {
      changes.push({ language, file, from: raw, to: null, action: 'skipped' });
      continue;
    }

    const isSergio = /s[ée]rgio\s+marques/i.test(raw);
    const isUnattributed = UNATTRIBUTED.test(raw.trim());
    if (!isSergio && !isUnattributed) {
      changes.push({ language, file, from: raw, to: null, action: 'skipped' });
      continue;
    }

    const next = text.replace(
      match[0],
      `author: ${JSON.stringify(canonical)}\n`
    );
    if (next === text) continue;
    if (!DRY) writeFileSync(path, next);
    changes.push({
      language,
      file,
      from: raw,
      to: canonical,
      action: isSergio ? 'normalised' : 'attributed'
    });
  }
}

const byAction = changes.reduce((acc, c) => {
  acc[c.action] = (acc[c.action] ?? 0) + 1;
  return acc;
}, {});
console.log(
  `${DRY ? '[dry] ' : ''}bylines: ${changes.filter((c) => c.action !== 'skipped').length} file(s) ${DRY ? 'would change' : 'updated'}`,
  byAction
);
for (const c of changes.filter((c) => c.action === 'skipped')) {
  console.log(`  skipped ${c.language}/${c.file}: ${c.from}`);
}
if (REPORT) {
  writeFileSync(REPORT, JSON.stringify(changes, null, 1));
  console.log(`wrote ${REPORT} (${changes.length} rows)`);
}
