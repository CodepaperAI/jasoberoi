import Link from "next/link";
import { ArrowRight, Banknote, MapPin } from "lucide-react";
import type { CityHub } from "@/lib/cityHubs";

/**
 * Cost and market context for a city hub.
 *
 * The band is site-wide and deliberately does not move by city. Varying a
 * per-square-foot range per municipality without a source would be inventing the
 * one number an owner actually acts on, so what varies here is the explanation
 * of where this city sits inside the single band — which is a claim we can
 * stand behind, and is also the more useful half.
 */
export function CityCostContext({ hub }: { hub: CityHub }) {
  return (
    <section className="bg-raised px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <p className="eyebrow">The market here</p>
            <h2 className="h-section mt-4">
              What {hub.city.city} <span className="orange-italic">is like to build in.</span>
            </h2>

            {/* The city's own commercial and healthcare landscape. This is the
                one field shared with the service pages, and it is shared on
                purpose: it is a description of the place, so writing a second
                version of it would mean one of the two is less true. */}
            {hub.city.localContext ? (
              <p className="mt-5 text-lg leading-8 text-muted">{hub.city.localContext}</p>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-2">
              {hub.city.neighborhoods.map((area) => (
                <span
                  key={area}
                  className="ui-font inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500"
                >
                  <MapPin size={12} aria-hidden="true" className="text-accent" />
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl ring-1 ring-slate-200">
            <div className="bg-ink px-7 py-8 text-white">
              <p className="ui-font flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-orange-400">
                <Banknote size={16} aria-hidden="true" />
                2026 commercial range
              </p>
              <p className="serif-font mt-4 text-4xl leading-none sm:text-5xl">{hub.costBand}</p>
              <p className="mt-3 text-sm leading-6 text-white/60">
                The same band applies in every city we work in. What changes is why a job sits
                high or low inside it.
              </p>
            </div>
            <div className="bg-white p-7">
              <p className="ui-font text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400">
                Why {hub.city.city} sits where it does
              </p>
              <p className="mt-4 text-base leading-7 text-slate-700">{hub.costRationale}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Neighbouring cities, with the reason to go there instead.
 *
 * Two adjacent city pages chase one searcher, and left alone Google picks
 * between two near-equals. Saying which is which — and why — settles it, and is
 * the same treatment the White Rock and Surrey service pages already give each
 * other. Kept small on purpose: this is guidance, not a link farm.
 */
export function CityNeighbours({ hub }: { hub: CityHub }) {
  if (hub.neighbours.length === 0) {
    return null;
  }

  return (
    <section className="bg-paper px-5 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow">Not quite the right city?</p>
        <h2 className="h-section mt-4">Next door.</h2>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {hub.neighbours.map((neighbour) => (
            <Link
              key={neighbour.href}
              href={neighbour.href}
              className="group flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-raised px-6 py-5 transition hover:border-orange-300"
            >
              <span className="ui-font flex items-center justify-between gap-3 text-sm font-extrabold uppercase tracking-[0.08em] text-zinc-900 group-hover:text-accent">
                Contractors in {neighbour.label}
                <ArrowRight size={18} aria-hidden="true" className="shrink-0" />
              </span>
              <span className="text-sm font-medium leading-6 text-slate-500">{neighbour.why}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
