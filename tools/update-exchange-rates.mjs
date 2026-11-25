#!/usr/bin/env node
/**
 * Refreshes data/exchange-rates.json from the ECB's daily euro reference
 * rates. Run with `pnpm rates:update`.
 *
 * The site does NOT depend on this script to stay current: utils/currency.ts
 * reads the same feed at build time, so every deploy already picks up that
 * day's rate. The committed file is the fallback used when a build has no
 * network (and by `astro dev` offline), so it is worth refreshing when it
 * drifts — the script exits without writing when nothing moved materially,
 * to keep that out of the diff noise.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ECB_DAILY_URL =
  'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml';
const TARGET = path.resolve('data/exchange-rates.json');
const CURRENCIES = ['USD', 'CAD'];

// Below this the fallback is close enough that rewriting the file (and so
// rebuilding 1,400 pages) buys nothing. 0.5% of a €1,596 holiday is ~$9.
const MATERIAL_DRIFT = 0.005;

const current = JSON.parse(readFileSync(TARGET, 'utf8'));

const response = await fetch(ECB_DAILY_URL, {
  signal: AbortSignal.timeout(15000)
});
if (!response.ok) {
  console.error(`✖ ECB request failed: HTTP ${response.status}`);
  process.exit(1);
}

const xml = await response.text();
const date = /time=['"]([\d-]{10})['"]/.exec(xml)?.[1];
if (!date) {
  console.error('✖ could not read the rate date from the ECB feed');
  process.exit(1);
}

const rates = { EUR: 1 };
for (const currency of CURRENCIES) {
  const match = new RegExp(
    `currency=['"]${currency}['"]\\s+rate=['"]([\\d.]+)['"]`
  ).exec(xml);
  const value = Number(match?.[1]);
  if (!Number.isFinite(value) || value <= 0) {
    console.error(`✖ no usable ${currency} rate in the ECB feed`);
    process.exit(1);
  }
  rates[currency] = value;
}

const drift = CURRENCIES.map((currency) => {
  const before = current.rates?.[currency];
  const after = rates[currency];
  const change = before ? Math.abs(after - before) / before : Infinity;
  return { currency, before, after, change };
});

const material = drift.filter(({ change }) => change >= MATERIAL_DRIFT);

for (const { currency, before, after, change } of drift) {
  console.log(
    `   ${currency}: ${before} → ${after} (${(change * 100).toFixed(2)}%)`
  );
}

if (material.length === 0 && current.date) {
  console.log(
    `✓ no material drift since ${current.date} — data/exchange-rates.json left alone`
  );
  process.exit(0);
}

writeFileSync(
  TARGET,
  `${JSON.stringify(
    {
      base: 'EUR',
      source: current.source,
      sourceUrl: ECB_DAILY_URL,
      date,
      fetchedAt: new Date().toISOString(),
      rates
    },
    null,
    2
  )}\n`,
  'utf8'
);

console.log(`✓ data/exchange-rates.json updated to the ECB rates of ${date}`);
