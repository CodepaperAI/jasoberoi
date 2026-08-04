"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { Calculator, Mail } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import {
  contingency,
  finishLevels,
  formatMoney,
  formatRateBand,
  getRate,
  roundEstimate,
  serviceRates,
  type FinishLevel,
} from "@/lib/pricing";
import { siteConfig, constructionServices } from "@/lib/site";

/**
 * Clinic and commercial build cost estimator.
 *
 * The SEO strategy identified this as the opening in the market: almost no BC
 * contractor publishes figures, "because they are afraid of being held to a
 * price. That reluctance is the opening." A calculator is the strongest form of
 * publishing them.
 *
 * Three deliberate choices, all from the checklist's build standards:
 *
 * 1. The result is never gated. Lead capture comes after the number, not in
 *    front of it — the checklist is explicit that gating the basic result is
 *    what makes tools fail.
 * 2. No new dependencies. Plain state and arithmetic; the site ships next,
 *    react and lucide-react and nothing else, and you cannot recover Core Web
 *    Vitals from a heavy widget later.
 * 3. Every rate comes from src/lib/pricing.ts, so the numbers here can never
 *    disagree with the table below or the landing pages. Stale or contradictory
 *    calculators destroy the trust the rest of the site is built to earn.
 */

const CALCULABLE = serviceRates.map((rate) => ({
  slug: rate.slug,
  name: constructionServices.find((service) => service.slug === rate.slug)?.name ?? rate.slug,
}));

/**
 * The query string, as an external store.
 *
 * Landing pages deep-link in as /cost?service=<slug>. next.config.ts sets
 * `output: "export"`, so reading searchParams on the server is not available —
 * it opts the route into dynamic rendering and the build fails outright.
 *
 * Reading it in an effect and calling setState would work but is the pattern
 * React now lints against, and on a prerendered page it also causes a hydration
 * mismatch: the server renders the default while the client immediately renders
 * something else. useSyncExternalStore is built for exactly this — the server
 * snapshot keeps hydration honest, and subscribing to popstate means the tool
 * also follows browser back and forward.
 */
const subscribeToLocation = (onChange: () => void) => {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
};

export function CostCalculator() {
  const search = useSyncExternalStore(
    subscribeToLocation,
    () => window.location.search,
    () => "",
  );

  const linkedService = useMemo(() => {
    const requested = new URLSearchParams(search).get("service");
    return requested && CALCULABLE.some((item) => item.slug === requested) ? requested : null;
  }, [search]);

  // Null until the visitor picks something, so a deep link stays in control
  // until they override it.
  const [chosenSlug, setChosenSlug] = useState<string | null>(null);
  const [chosenSqFt, setChosenSqFt] = useState<number | null>(null);
  const [finish, setFinish] = useState<FinishLevel>("standard");

  const slug = chosenSlug ?? linkedService ?? "dental-clinic-construction";
  const sqFt = chosenSqFt ?? getRate(slug)?.typicalSqFt ?? 2500;

  const setSlug = (value: string) => {
    setChosenSlug(value);
    setChosenSqFt(null); // fall back to the new build type's typical size
  };
  const setSqFt = (value: number) => setChosenSqFt(value);

  const estimate = useMemo(() => {
    const rate = getRate(slug);
    if (!rate || !Number.isFinite(sqFt) || sqFt <= 0) return null;

    const factor = finishLevels.find((level) => level.id === finish)?.factor ?? 1;
    const low = roundEstimate(rate.low * sqFt * factor);
    const high = roundEstimate(rate.high * sqFt * factor);

    return {
      rate,
      low,
      high,
      allInLow: roundEstimate(low * (1 + contingency.low)),
      allInHigh: roundEstimate(high * (1 + contingency.high)),
      perSqFtLow: Math.round(rate.low * factor),
      perSqFtHigh: Math.round(rate.high * factor),
    };
  }, [slug, sqFt, finish]);

  const serviceName = CALCULABLE.find((item) => item.slug === slug)?.name ?? "";

  const mailto = estimate
    ? `mailto:${siteConfig.email}?subject=${encodeURIComponent(
        `Estimate request — ${serviceName}`,
      )}&body=${encodeURIComponent(
        [
          `Project: ${serviceName}`,
          `Size: ${sqFt.toLocaleString("en-CA")} sq ft`,
          `Finish: ${finishLevels.find((level) => level.id === finish)?.label}`,
          "",
          `Estimated build: ${formatMoney(estimate.low)} – ${formatMoney(estimate.high)}`,
          `With ${Math.round(contingency.low * 100)}–${Math.round(contingency.high * 100)}% contingency: ${formatMoney(estimate.allInLow)} – ${formatMoney(estimate.allInHigh)}`,
          "",
          "Please confirm this against my actual space.",
        ].join("\n"),
      )}`
    : "#";

  const field =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-zinc-900 outline-none focus:border-orange-400";
  const label = "block text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500";

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
      <div>
        <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.22em] text-orange-600">
          <Calculator size={17} aria-hidden="true" />
          Estimate your build
        </p>
        <h2 className="serif-font mt-4 text-4xl leading-tight text-zinc-950 sm:text-5xl">
          What will it <span className="orange-italic">actually cost?</span>
        </h2>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          Move the numbers and see a real range. No form, no email required to see the result.
        </p>

        <div className="mt-8 grid gap-5">
          <div>
            <label className={label} htmlFor="calc-service">
              What are you building?
            </label>
            <select
              id="calc-service"
              className={`${field} mt-2`}
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
            >
              {CALCULABLE.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={label} htmlFor="calc-size">
              How much space? — {sqFt.toLocaleString("en-CA")} sq ft
            </label>
            <input
              id="calc-size"
              type="range"
              min={500}
              max={10000}
              step={100}
              value={sqFt}
              onChange={(event) => setSqFt(Number(event.target.value))}
              className="mt-3 w-full accent-orange-600"
            />
            <div className="mt-1 flex justify-between text-xs font-semibold text-slate-400">
              <span>500</span>
              <span>10,000 sq ft</span>
            </div>
          </div>

          <div>
            <span className={label}>Finish level</span>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {finishLevels.map((level) => (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => setFinish(level.id)}
                  aria-pressed={finish === level.id}
                  className={[
                    "rounded-xl border px-3 py-3 text-sm font-bold transition",
                    finish === level.id
                      ? "border-orange-600 bg-orange-600 text-white"
                      : "border-slate-200 bg-white text-zinc-700 hover:border-orange-300",
                  ].join(" ")}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {estimate ? (
        <div className="overflow-hidden rounded-3xl ring-1 ring-slate-200">
          <div className="bg-[#0f1115] px-7 py-8 text-white">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-orange-400">
              Estimated build
            </p>
            <p className="serif-font mt-4 text-4xl leading-none sm:text-5xl">
              {formatMoney(estimate.low)}
              <span className="orange-italic mx-2 text-3xl">–</span>
              {formatMoney(estimate.high)}
            </p>
            <p className="mt-4 text-sm text-white/60">
              ${estimate.perSqFtLow}–${estimate.perSqFtHigh} per sq ft · driven by{" "}
              {estimate.rate.driver}
            </p>
          </div>

          <div className="bg-white p-7">
            <div className="flex items-baseline justify-between gap-4 border-b border-slate-200 pb-4">
              <span className="text-sm font-semibold text-slate-600">
                Plus {Math.round(contingency.low * 100)}–{Math.round(contingency.high * 100)}%
                contingency, which is standard on a clinic build
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-4 pt-4">
              <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
                All-in
              </span>
              <span className="text-2xl font-bold text-zinc-950">
                {formatMoney(estimate.allInLow)} – {formatMoney(estimate.allInHigh)}
              </span>
            </div>

            {/* Assumptions beside the number, per the checklist's build standard —
                the surrounding content is what ranks and what makes the tool
                credible rather than a lead-bait widget. */}
            <p className="mt-6 text-sm leading-6 text-slate-500">
              Turnkey: design, permits, construction and site connections. Excludes land, clinical
              equipment purchase, and GST. A range is not a quote — the base-building condition sets
              where inside it you land. Published rate for this build type is{" "}
              {formatRateBand(estimate.rate)} per sq ft.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_auto]">
              <ButtonLink href="/contact">Book a Consultation</ButtonLink>
              <a
                href={mailto}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-zinc-900/15 px-6 py-3 text-sm font-bold text-zinc-900 transition hover:border-orange-300 hover:text-orange-600"
              >
                <Mail size={16} aria-hidden="true" />
                Email me this estimate
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
