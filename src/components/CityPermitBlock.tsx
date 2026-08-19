import { Building2, CalendarClock, ExternalLink, FileCheck2 } from "lucide-react";
import type { CityHub } from "@/lib/cityHubs";

/**
 * The municipal permit facts, with their citations shown.
 *
 * Every one of these fields already existed on `ServiceArea.permits` and not one
 * of them reached a visitor. `permits.notes` was folded into `localProof` on the
 * city-service pages; `authority`, `pathway` and `timeline` were used only to
 * assemble a sentence inside an FAQ answer; and `sources` — the array that is
 * the reason any of it is publishable — was rendered nowhere on the site.
 *
 * So this block is not new research being displayed, it is research the site had
 * already done and was hiding. It is also the thing that makes a city hub
 * defensible rather than a doorway page: a competitor can copy a paragraph about
 * a city, and cannot copy having read the municipality's own permit pages.
 *
 * The citations are rendered deliberately and visibly. On a licensed
 * contractor's site a permit claim is a liability before it is an SEO asset, so
 * a reader gets to check it — and a null field renders nothing at all rather
 * than a hedge, which is the rule the data file already enforces.
 */

/**
 * A citation label a reader can tell apart.
 *
 * Hostname alone rendered both of Vancouver's two sources as "vancouver.ca",
 * which makes a list of citations look like a mistake rather than evidence.
 * Host plus the final path segment is enough to distinguish them and short
 * enough not to wrap.
 */
function sourceLabel(url: string): string {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    const last = parsed.pathname.split("/").filter(Boolean).pop();
    if (!last) return host;
    const isPdf = /\.pdf$/i.test(last);
    const name = last.replace(/\.(aspx|html?|htm|pdf)$/i, "");
    return `${host} / ${name}${isPdf ? " (PDF)" : ""}`;
  } catch {
    return url;
  }
}

export function CityPermitBlock({ hub }: { hub: CityHub }) {
  const { permits } = hub.city;

  // Nothing sourced means nothing rendered. The hub gate in check-trust.mjs
  // stops a city reaching this state, but the component should not assume it.
  if (!permits.authority && !permits.pathway) {
    return null;
  }

  const rows = [
    permits.authority && {
      icon: Building2,
      label: "Permit authority",
      value: permits.authority,
    },
    permits.pathway && {
      icon: FileCheck2,
      label: "Commercial route",
      value: permits.pathway,
    },
    permits.timeline && {
      icon: CalendarClock,
      label: "Published review window",
      value: `Review runs ${permits.timeline}.`,
    },
  ].filter((row): row is { icon: typeof Building2; label: string; value: string } => Boolean(row));

  return (
    <section className="bg-paper px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="eyebrow">Permits</p>
            <h2 className="h-section mt-4">
              Building in <span className="orange-italic">{hub.city.city}.</span>
            </h2>

            {/* Answer-first: the fact that only applies here, then what it
                costs you. These are the two fields the hub gate requires, and
                they are written per city rather than templated. */}
            <p className="mt-5 text-lg font-medium leading-8 text-muted">{hub.angle}</p>
            <p className="mt-4 text-lg leading-8 text-muted">{hub.constraint}</p>

            {/*
              `permits.notes` is deliberately NOT rendered here.

              It was, and a screenshot of the built page showed why that was
              wrong: `notes` and `angle` are written from the same municipal
              source, so the Vancouver hub said the Tenant Improvement Program
              removes the development permit, then said it again three inches
              below under a different heading. Five hubs had the same fault.

              `notes` still earns its place — it renders as `localProof` on the
              ten city-service pages beneath this one, where `angle` does not
              exist. Here it is a near-verbatim repeat, and repeating a
              paragraph inside one page is padding whichever heading sits above
              it. The specific pair stays: the fact, then what it costs you.
            */}
          </div>

          <div className="overflow-hidden rounded-3xl ring-1 ring-slate-200">
            <dl className="divide-y divide-line bg-white">
              {rows.map((row) => {
                const Icon = row.icon;
                return (
                  <div key={row.label} className="flex gap-4 p-6 sm:p-7">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-raised text-accent ring-1 ring-orange-100">
                      <Icon size={19} aria-hidden="true" />
                    </span>
                    <div>
                      <dt className="ui-font text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">
                        {row.label}
                      </dt>
                      <dd className="mt-2 text-base leading-7 text-slate-700">{row.value}</dd>
                    </div>
                  </div>
                );
              })}

              {/*
                The full published timeline, where the municipality publishes
                one. Separate from the `timeline` row above because that field
                is a short fragment interpolated mid-sentence elsewhere, while
                this is the whole table in prose — figures, targets and the date
                they were read. Surrey is currently the only city with one.
              */}
              {permits.timelineDetail ? (
                <div className="bg-ink p-6 text-white sm:p-7">
                  <p className="ui-font text-xs font-extrabold uppercase tracking-[0.14em] text-orange-400">
                    What the city commits to
                  </p>
                  <p className="mt-3 text-base leading-7 text-white/75">
                    {permits.timelineDetail}
                  </p>
                </div>
              ) : null}
            </dl>

            {permits.sources.length > 0 ? (
              <div className="border-t border-line bg-raised px-6 py-5 sm:px-7">
                <p className="ui-font text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">
                  Read from
                </p>
                <ul className="mt-3 grid gap-2">
                  {permits.sources.map((source) => (
                    <li key={source}>
                      {/*
                        rel="nofollow" is deliberate. These are citations for a
                        reader, not endorsements, and a municipal site does not
                        need the signal. noopener is required with _blank.
                      */}
                      <a
                        href={source}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="group inline-flex items-start gap-2 text-sm font-medium leading-6 text-slate-500 transition hover:text-accent"
                      >
                        <ExternalLink
                          size={14}
                          aria-hidden="true"
                          className="mt-1 shrink-0 text-slate-300 transition group-hover:text-accent"
                        />
                        <span className="underline decoration-slate-300 underline-offset-4 group-hover:decoration-accent">
                          {sourceLabel(source)}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
