import {
  Banknote,
  CheckCircle2,
  ClipboardList,
  Layers,
  Ruler,
  Store,
  Stethoscope,
} from "lucide-react";
import type { ConstructionPseoPage } from "@/lib/site";

/**
 * How the work runs in this city — planning, cost, scope and focus in one place.
 *
 * This replaces three consecutive sections that all used the same layout: a long
 * serif heading on the left, a stack of cards on the right, three times running.
 * Each heading was a full sentence carrying both the service and the city, so
 * they wrapped to three lines and ate most of the vertical space they occupied.
 *
 * One section, three visual registers instead: prose, a price band, then cards.
 * The price in particular was set as small grey body copy, which is the wrong
 * treatment for the single most useful number on the page.
 */

/** Distinct icon per focus card. All three previously shared one building glyph. */
const focusIcons: Record<string, typeof Ruler> = {
  "Project review": ClipboardList,
  "Managed execution": Layers,
  "Clinical workflow": Stethoscope,
  "Business operation": Store,
  "Finish control": Ruler,
};

/** Scope items are stored as lowercase fragments; they render as sentences. */
function sentenceCase(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function LocalDelivery({ page }: { page: ConstructionPseoPage }) {
  // "$120–$260 per sq ft depending on…" — split the figure from its qualifier so
  // the number can be set large and the caveat stays honest beside it.
  const [priceFigure, ...priceRest] = page.pricingBrief.split(/\s+(?=depending|turnkey|—)/);

  return (
    <section className="bg-paper px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="eyebrow">
              Local planning
            </p>
            <h2 className="h-section mt-4">
              How it runs <span className="orange-italic">in {page.city.city}.</span>
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted">{page.localProof}</p>
            <p className="mt-4 text-lg leading-8 text-muted">{page.marketContext}</p>

            <div className="mt-7 flex flex-wrap gap-2">
              {page.city.neighborhoods.map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* The price, given the weight it deserves, with the scope beneath it. */}
          <div className="overflow-hidden rounded-3xl ring-1 ring-slate-200">
            <div className="bg-ink px-7 py-8 text-white">
              <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-orange-400">
                <Banknote size={16} aria-hidden="true" />
                2026 range
              </p>
              <p className="serif-font mt-4 text-4xl leading-none sm:text-5xl">{priceFigure}</p>
              {priceRest.length > 0 ? (
                <p className="mt-3 text-sm leading-6 text-white/60">{priceRest.join(" ")}</p>
              ) : null}
            </div>

            <div className="bg-white p-7">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400">
                What that covers
              </p>
              <ul className="mt-5 grid gap-3">
                {page.service.scope.map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle2
                      className="mt-0.5 shrink-0 text-accent"
                      size={19}
                      aria-hidden="true"
                    />
                    <span className="text-base leading-7 text-slate-700">{sentenceCase(item)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {page.serviceFocus.map((item) => {
            const Icon = focusIcons[item.title] ?? ClipboardList;
            return (
              <article
                key={item.title}
                className="rounded-2xl bg-raised p-6 ring-1 ring-slate-200/70"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-accent ring-1 ring-orange-100">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-zinc-950">{item.title}</h3>
                <p className="mt-2 text-base leading-7 text-muted">{item.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
