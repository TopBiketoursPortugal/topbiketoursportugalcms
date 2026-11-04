/**
 * One-time migration: split each tour's monolithic `packages[].included` rows
 * into three purposeful pricing tables.
 *
 *   table 1  packages   -> real inclusions (Yes/No/info rows)   [keeps price]
 *   table 2  packages2  -> seasonal prices                      [matrix, no price]
 *   table 3  packages3  -> paid add-ons / supplements           [matrix, no price]
 *
 * Each package keeps the SAME column shape across the three tables (same title,
 * popular, duration). Classification is heuristic — REVIEW THE DIFF. The script
 * is idempotent: a tour that already has non-empty packages2/packages3 is skipped.
 *
 * Run:  node tools/split-pricing-tables.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { parse, stringify } from 'yaml';

const TOURS_DIR = 'src/content/tours';

// --- file discovery ---------------------------------------------------------
function listMdx(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...listMdx(full));
    else if (entry.endsWith('.mdx') || entry.endsWith('.md')) out.push(full);
  }
  return out;
}

// --- classification ---------------------------------------------------------
const normTitle = (t) => String(t ?? '').replace(/^[\s*•-]+/, '').trim();

const isSeasonTitle = (title) => /season/i.test(normTitle(title));

// A row carries a price signal when its value names a surcharge / amount.
function hasPriceSignal(row) {
  const desc = String(row.description ?? '');
  return (
    /^\s*\+/.test(desc) || // "+270 €..."
    /\bextra\b/i.test(desc) || // "extra 350€"
    /\d[\d.,]*\s*€/.test(desc) || // "350€", "270 €"
    /€\s*\d/.test(desc) // "€350"
  );
}

// Add-on by title alone (always paid): supplements / upgrades.
const isAddonTitle = (title) => /supplement|upgrade/i.test(normTitle(title));

/**
 * Decide each row-title's table ONCE per tour (across all package columns) so
 * the same conceptual row lands in the same table in every column:
 *   - season titles -> seasons
 *   - any column has a price signal (or title is a supplement/upgrade) -> addons
 *   - otherwise -> features (Yes/No/X/info inclusions)
 */
function buildTitleMap(packages) {
  const map = new Map(); // normTitle -> 'seasons' | 'addons' | 'features'
  for (const pkg of packages) {
    for (const row of pkg.included ?? []) {
      const key = normTitle(row.title);
      const prev = map.get(key);
      let bucket = 'features';
      if (isSeasonTitle(row.title)) bucket = 'seasons';
      else if (hasPriceSignal(row) || isAddonTitle(row.title)) bucket = 'addons';
      // Stickiness: once a title is seen as season/addon anywhere, keep it.
      if (prev === 'seasons' || bucket === 'seasons') map.set(key, 'seasons');
      else if (prev === 'addons' || bucket === 'addons') map.set(key, 'addons');
      else map.set(key, 'features');
    }
  }
  return map;
}

// --- per-package split ------------------------------------------------------
function emptyPriced(pkg, currency) {
  return {
    title: pkg.title ?? '',
    popular: pkg.popular ?? false,
    duration: '1',
    price: { price: 0, promo: 0, currency, bestValue: false }
  };
}

// --- main -------------------------------------------------------------------
const FM = /^---\r?\n([\s\S]*?)\r?\n---(\r?\n[\s\S]*)?$/;
let changed = 0;
let skipped = 0;
const flags = [];

for (const file of listMdx(TOURS_DIR)) {
  const raw = readFileSync(file, 'utf8');
  const m = raw.match(FM);
  if (!m) continue;

  let data;
  try {
    data = parse(m[1]) ?? {};
  } catch (e) {
    console.warn(`! YAML parse failed, skipping: ${file}\n  ${e.message}`);
    continue;
  }

  const packages = Array.isArray(data.packages) ? data.packages : [];
  if (packages.length === 0) continue;

  // Idempotency: already migrated.
  const has = (a) => Array.isArray(a) && a.length > 0;
  if (has(data.packages2) || has(data.packages3)) {
    skipped++;
    continue;
  }

  const titleMap = buildTitleMap(packages);
  const newPackages = [];
  const seasonsTable = [];
  const addonsTable = [];
  let counts = { features: 0, seasons: 0, addons: 0 };

  for (const pkg of packages) {
    const currency = pkg.price?.currency ?? 'EUR';
    const included = Array.isArray(pkg.included) ? pkg.included : [];
    const buckets = { features: [], seasons: [], addons: [] };

    for (const row of included) {
      const bucket = titleMap.get(normTitle(row.title)) ?? 'features';
      buckets[bucket].push(row);
      counts[bucket]++;
      // Flag add-on rows that read like a plain inclusion (carried along for
      // column parity) so they can be spot-checked.
      if (bucket === 'addons' && /^(yes|no|x)$/i.test(String(row.description ?? '').trim())) {
        flags.push(`  ${file} :: "${normTitle(row.title)}" -> addons (value "${row.description}")`);
      }
    }

    newPackages.push({ ...pkg, included: buckets.features });
    if (buckets.seasons.length) {
      seasonsTable.push({ ...emptyPriced(pkg, currency), included: buckets.seasons });
    }
    if (buckets.addons.length) {
      addonsTable.push({ ...emptyPriced(pkg, currency), included: buckets.addons });
    }
  }

  // Nothing to split out — leave the file untouched.
  if (seasonsTable.length === 0 && addonsTable.length === 0) {
    skipped++;
    continue;
  }

  data.packages = newPackages;
  if (seasonsTable.length) data.packages2 = seasonsTable;
  if (addonsTable.length) data.packages3 = addonsTable;

  const body = m[2] ?? '\n';
  const yamlOut = stringify(data, { lineWidth: 0 });
  writeFileSync(file, `---\n${yamlOut}---${body}`, 'utf8');
  changed++;
  console.log(
    `✓ ${file}  (features:${counts.features} seasons:${counts.seasons} addons:${counts.addons})`
  );
}

console.log(`\nDone. ${changed} migrated, ${skipped} skipped.`);
if (flags.length) {
  console.log(`\n⚠ ${flags.length} low-confidence add-on rows — please review:`);
  console.log(flags.join('\n'));
}
