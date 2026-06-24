/**
 * One-off: strip markdown H1 (`# ...`) lines from tour content so each tour page
 * has a single H1 (the hero title). Removes the H1 line and one immediately
 * following blank line. Leaves H2+ (`## ...`) untouched.
 *
 * Run: node tools/remove-content-h1.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const TOURS_DIR = 'src/content/tours';

function listMdx(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...listMdx(full));
    else if (entry.endsWith('.mdx') || entry.endsWith('.md')) out.push(full);
  }
  return out;
}

// H1 = line whose first non-whitespace is a single `#` followed by a space.
const isH1 = (line) => /^\s*#(?!#)\s/.test(line);
const isBlank = (line) => /^\s*$/.test(line);

let changed = 0;
for (const file of listMdx(TOURS_DIR)) {
  const lines = readFileSync(file, 'utf8').split('\n');
  const out = [];
  let removed = 0;
  for (let i = 0; i < lines.length; i++) {
    if (isH1(lines[i])) {
      removed++;
      // also drop a single following blank line to avoid a leading gap
      if (isBlank(lines[i + 1])) i++;
      continue;
    }
    out.push(lines[i]);
  }
  if (removed > 0) {
    writeFileSync(file, out.join('\n'), 'utf8');
    changed++;
    console.log(`✓ ${file} (removed ${removed} H1)`);
  }
}
console.log(`\nDone. ${changed} files updated.`);
