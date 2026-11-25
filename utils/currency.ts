import Languages from 'src/../data/languages.json';
import type { LanguageCodes } from 'src/schemas/language';
import RateSnapshot from 'src/../data/exchange-rates.json';
import { t } from 'utils/i18n';

/**
 * Every price in `src/content` is authored in euros and every booking is
 * charged in euros, so EUR is the currency of record: it is what the schema
 * markup publishes, what the WeTravel checkout collects, and the only figure
 * rendered when JavaScript is unavailable. USD and CAD exist because the
 * competitors we are ranking against localise their prices — Viator renders
 * CA$ to Canadian searchers, GetYourGuide renders US$ to American ones — and
 * the first 90 days target both markets. They are conversions of the euro
 * price, never a price in their own right.
 */
export const CURRENCY_OF_RECORD = 'EUR' as const;

export const SUPPORTED_CURRENCIES = ['EUR', 'USD', 'CAD'] as const;

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export function isSupportedCurrency(value: string): value is SupportedCurrency {
  return (SUPPORTED_CURRENCIES as readonly string[]).includes(value);
}

export type ExchangeRates = {
  base: typeof CURRENCY_OF_RECORD;
  source: string;
  sourceUrl: string;
  /** Publication date of the rates, `YYYY-MM-DD`. Shown to the visitor. */
  date: string;
  fetchedAt: string;
  rates: Record<SupportedCurrency, number>;
};

const ECB_DAILY_URL =
  'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml';

/**
 * The ECB publishes one reference rate per currency against the euro at
 * ~16:00 CET on TARGET working days. It is free, needs no key, has no quota,
 * and is euro-based — which is exactly our base — so no cross-rate arithmetic
 * is needed and there is no vendor to go away.
 *
 * Refresh cadence is therefore "once per site build": the rates are read here
 * at build time and baked into the static HTML, so a visitor's browser makes
 * no request to the ECB or to us, and a converted price cannot shift under
 * them mid-session. `data/exchange-rates.json` is the committed fallback for
 * builds with no network (and for `astro dev` offline); `pnpm rates:update`
 * refreshes it.
 *
 * The rate date travels with the figure into the UI, so a stale rate is
 * visible to the visitor rather than silently wrong.
 */
const SNAPSHOT = RateSnapshot as ExchangeRates;

function parseEcbDaily(xml: string): ExchangeRates | null {
  const date = /time=['"]([\d-]{10})['"]/.exec(xml)?.[1];
  if (!date) return null;

  const rates: Partial<Record<SupportedCurrency, number>> = { EUR: 1 };
  for (const currency of SUPPORTED_CURRENCIES) {
    if (currency === CURRENCY_OF_RECORD) continue;
    const rate = new RegExp(
      `currency=['"]${currency}['"]\\s+rate=['"]([\\d.]+)['"]`
    ).exec(xml)?.[1];
    const parsed = Number(rate);
    // A partial parse is worse than the snapshot: it would silently drop one
    // of the two target markets back to its euro price.
    if (!Number.isFinite(parsed) || parsed <= 0) return null;
    rates[currency] = parsed;
  }

  return {
    base: CURRENCY_OF_RECORD,
    source: SNAPSHOT.source,
    sourceUrl: ECB_DAILY_URL,
    date,
    fetchedAt: new Date().toISOString(),
    rates: rates as Record<SupportedCurrency, number>
  };
}

let ratesPromise: Promise<ExchangeRates> | undefined;

/**
 * Memoised for the lifetime of the build process: ~1,400 pages render prices
 * and none of them should cost a network round-trip.
 */
export function getExchangeRates(): Promise<ExchangeRates> {
  ratesPromise ??= (async () => {
    try {
      const response = await fetch(ECB_DAILY_URL, {
        signal: AbortSignal.timeout(5000)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const live = parseEcbDaily(await response.text());
      if (!live) throw new Error('could not parse ECB reference rates');
      console.log(
        `💱 exchange rates — ECB reference rates for ${live.date} ` +
          `(USD ${live.rates.USD}, CAD ${live.rates.CAD})`
      );
      return live;
    } catch (error) {
      console.warn(
        `💱 exchange rates — live ECB fetch failed (${
          error instanceof Error ? error.message : error
        }); using the committed snapshot of ${SNAPSHOT.date}`
      );
      return SNAPSHOT;
    }
  })();

  return ratesPromise;
}

/**
 * Converted figures are deliberately rounded. "$1,749.70" reads as a price we
 * are quoting and could be held to; "$1,750" reads as what it is — the euro
 * price, approximately, in a currency the visitor thinks in. The step scales
 * with the amount so a €35 day tour keeps its precision while a €1,596
 * holiday does not advertise a false one.
 */
function roundingStep(amount: number): number {
  if (amount < 100) return 1;
  if (amount < 1000) return 5;
  return 10;
}

export function convertFromEur(
  amountInEur: number,
  currency: SupportedCurrency,
  rates: ExchangeRates
): number {
  if (currency === CURRENCY_OF_RECORD) return amountInEur;
  const converted = amountInEur * (rates.rates[currency] ?? 1);
  const step = roundingStep(converted);
  return Math.round(converted / step) * step;
}

/**
 * `currencyDisplay: 'symbol'` rather than `'narrowSymbol'` on purpose: narrow
 * renders CAD as a bare "$" in en-US, which is indistinguishable from USD to
 * the one audience that needs to tell them apart. `'symbol'` gives "CA$".
 *
 * Fraction digits are dropped because a holiday is €1,596, never €1,596.00,
 * and the two trailing zeros cost real width in a tour card's tightest row.
 */
export function formatMoney(
  amount: number,
  currency: SupportedCurrency,
  language: LanguageCodes
): string {
  return new Intl.NumberFormat(Languages[language].locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * "Approximate, charged in euros, at the ECB rate of <date>" — the one
 * sentence that has to accompany a converted figure. Shared by the switcher's
 * tooltip and the visible note in the tour booking sidebar so the two can
 * never disagree about which rate date is on screen.
 *
 * The wording itself is the Content Writer's to own; the date is substituted
 * for `$1`, following the `.replace('$1', …)` convention already used across
 * `data/i18n.json`.
 */
export async function getApproximationNote(
  language: LanguageCodes
): Promise<string> {
  const rates = await getExchangeRates();
  const rateDate = new Intl.DateTimeFormat(Languages[language].locale, {
    dateStyle: 'long',
    timeZone: 'UTC'
  }).format(new Date(`${rates.date}T00:00:00Z`));

  return t('Currency.Approximate.Note', language).replace('$1', rateDate);
}
