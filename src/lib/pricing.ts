/**
 * Every construction rate the site publishes, in one place.
 *
 * Before this file the same numbers were written out by hand in three places —
 * `buildPricingBrief()` in site.ts, `COST_BRACKETS` in app/cost/page.tsx, and
 * the pharmacy answer in `aiFaqs` — and they had already drifted: /cost said a
 * pharmacy runs $140–$230 per sq ft while the rest of the site said $180–$250.
 * A visitor could read both figures in one session.
 *
 * The build gate now compares every published rate against this table, so that
 * class of contradiction cannot come back.
 *
 * Sources: the ranges are Oberizon's own, carried over from the live site.
 * Published Vancouver figures for dental build-outs run $150–$225 per sq ft
 * against our $180–$320, so ours sit above the local published floor — which is
 * exactly why `ratesConfirmedByClient` exists below.
 */

export type FinishLevel = "standard" | "mid" | "high";

export type ServiceRate = {
  /** Matches ConstructionService["slug"] in site.ts. */
  slug: string;
  /** Dollars per square foot, turnkey. */
  low: number;
  high: number;
  /** The size the published "typically $Xk–$Yk" example is based on. */
  typicalSqFt: number;
  /** What moves the number most for this build type. */
  driver: string;
};

/**
 * Has the client confirmed, in writing, that he will stand behind these ranges?
 *
 * A calculator amplifies a number far beyond a line of body copy — it invites
 * the visitor to generate a figure and hold you to it. Until this is true the
 * cost page is built and testable but carries noindex, stays out of the sitemap
 * and stays out of the navigation. scripts/check-trust.mjs enforces that.
 *
 * TODO(client): Jas to confirm each range below, then flip this to true.
 */
export const ratesConfirmedByClient = false;

/** 15–20% is the published standard contingency for clinic build-outs. */
export const contingency = { low: 0.15, high: 0.2 };

/**
 * Multipliers on the base range. Standard is the published rate as-is; the
 * others move within the same band rather than beyond it, because the published
 * high already represents a high-finish build.
 */
export const finishLevels: Array<{ id: FinishLevel; label: string; factor: number }> = [
  { id: "standard", label: "Standard", factor: 1 },
  { id: "mid", label: "Mid-range", factor: 1.12 },
  { id: "high", label: "High finish", factor: 1.25 },
];

export const serviceRates: ServiceRate[] = [
  {
    slug: "commercial-construction",
    low: 120,
    high: 220,
    typicalSqFt: 2500,
    driver: "base-building condition and finish level",
  },
  {
    slug: "commercial-renovation",
    low: 95,
    high: 180,
    typicalSqFt: 2500,
    driver: "the condition of what is already there",
  },
  {
    slug: "office-renovation-contractor",
    low: 120,
    high: 220,
    typicalSqFt: 2500,
    driver: "layout, finishes and services",
  },
  {
    slug: "healthcare-construction",
    low: 150,
    high: 320,
    typicalSqFt: 2500,
    driver: "service coordination and finish level",
  },
  {
    slug: "dental-clinic-construction",
    low: 180,
    high: 320,
    typicalSqFt: 2500,
    driver: "operatory count, suction runs and imaging shielding",
  },
  {
    slug: "dental-office-renovation",
    low: 120,
    high: 260,
    typicalSqFt: 2000,
    driver: "how much of the clinic stays open during the work",
  },
  {
    slug: "medical-clinic-construction",
    low: 150,
    high: 260,
    typicalSqFt: 2500,
    driver: "exam room count and accessibility requirements",
  },
  {
    slug: "pharmacy-construction",
    low: 180,
    high: 250,
    typicalSqFt: 1500,
    driver: "dispensary security and compounding-room compliance",
  },
  {
    slug: "clinic-renovation-contractor",
    low: 120,
    high: 240,
    typicalSqFt: 2000,
    driver: "phasing around a practice that keeps operating",
  },
  {
    slug: "luxury-residential-construction",
    low: 500,
    high: 1200,
    typicalSqFt: 4500,
    driver: "finish level, millwork and site conditions",
  },
];

export function getRate(slug: string) {
  return serviceRates.find((rate) => rate.slug === slug);
}

/** "$180–$320" — the per-square-foot band, formatted once. */
export function formatRateBand(rate: ServiceRate) {
  return `$${rate.low}–$${rate.high}`;
}

/** Rounds to the nearest $5k so an estimate never reads as a quote. */
export function roundEstimate(value: number) {
  return Math.round(value / 5000) * 5000;
}

export function formatMoney(value: number) {
  return `$${value.toLocaleString("en-CA")}`;
}

/**
 * The one-line pricing sentence used across the landing pages. Generated rather
 * than written out, so it can never disagree with the calculator beside it.
 */
export function pricingSentence(slug: string) {
  const rate = getRate(slug);
  if (!rate) return "Price varies by scope, finish level, and site conditions.";

  const low = roundEstimate(rate.low * rate.typicalSqFt);
  const high = roundEstimate(rate.high * rate.typicalSqFt);
  const asK = (value: number) =>
    value >= 1_000_000
      ? `$${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`
      : `$${Math.round(value / 1000)}k`;

  return `${formatRateBand(rate)} per sq ft turnkey — typically ${asK(low)}–${asK(high)} for a ${rate.typicalSqFt.toLocaleString("en-CA")} sq ft space`;
}
