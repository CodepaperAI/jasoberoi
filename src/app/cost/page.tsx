import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";
import { PageHero, ReviewCta } from "@/components/SectionPrimitives";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, faqJsonLd, websiteJsonLd } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { constructionServices } from "@/lib/site";
import { CostCalculator } from "@/components/CostCalculator";
import {
  formatMoney,
  ratesConfirmedByClient,
  formatRateBand,
  roundEstimate,
  serviceRates,
} from "@/lib/pricing";

const HERO_IMAGE = "/oberizon/optimized/project-commercial-13.jpg";

/**
 * Derived from src/lib/pricing.ts, not restated.
 *
 * These seven brackets used to be written out by hand here, alongside another
 * copy of the same numbers in site.ts. They had already drifted: this page said
 * a pharmacy runs $140-$230 per sq ft while the rest of the site said
 * $180-$250, and a visitor could read both figures in one session.
 */
const COST_BRACKETS = serviceRates.map((rate) => {
  const service = constructionServices.find((item) => item.slug === rate.slug);
  const low = roundEstimate(rate.low * rate.typicalSqFt);
  const high = roundEstimate(rate.high * rate.typicalSqFt);
  return {
    scope: service?.name ?? rate.slug,
    range: `${formatRateBand(rate)} / sq ft`,
    typical: `${formatMoney(low)} - ${formatMoney(high)} for a ${rate.typicalSqFt.toLocaleString("en-CA")} sq ft space`,
    driver: rate.driver,
  };
});

const FACTORS = [
  {
    title: "Base-building condition",
    body: "An older shell with tired mechanical, unlevel floors, or missing services adds cost before design decisions are even made. Site review picks this up early.",
  },
  {
    title: "Services and equipment coordination",
    body: "Dental compressors, vacuum lines, imaging, medical gas, and lab equipment need service locations planned before construction. Missed early = expensive later.",
  },
  {
    title: "Permits and approval pathway",
    body: "Complying pathway vs full building permit vs development permit changes both timeline and cost. Lower Mainland municipalities each have their own controls.",
  },
  {
    title: "Finish level",
    body: "Millwork depth, stone selections, ceiling detail, custom lighting, and glazing systems can shift a project 25–40% at the same footprint.",
  },
  {
    title: "Schedule pressure",
    body: "A lease that starts before construction wraps forces trade sequencing choices that add cost. Realistic scheduling protects the budget.",
  },
];

const TIMELINE = [
  { phase: "Feasibility & review", weeks: "1 – 3 weeks" },
  { phase: "Design & selections", weeks: "6 – 12 weeks" },
  { phase: "Permits & tender", weeks: "6 – 16 weeks" },
  { phase: "Construction (2,500 sq ft clinic)", weeks: "10 – 16 weeks" },
  { phase: "Construction (4,500 sq ft luxury home)", weeks: "10 – 14 months" },
  { phase: "Deficiencies & handover", weeks: "1 – 3 weeks" },
];

const FAQS = [
  {
    question: "How much does it cost to build a dental clinic in BC?",
    answer:
      "A dental clinic in the Lower Mainland typically runs $300–$450 per square foot turnkey, or roughly $750,000–$1,125,000 for a 2,500 sq ft space. The final number depends on operatory count, equipment package, base building condition, and finish level. Oberizon completed a full 2,500 sq ft dental clinic in White Rock in 90 days end to end.",
  },
  {
    question: "How much does a commercial tenant improvement cost in the Lower Mainland?",
    answer:
      "Commercial tenant improvements in Metro Vancouver typically range $120–$220 per square foot depending on layout complexity, finish level, and base-building condition. A 2,000–2,500 sq ft office fit-out is usually $240,000–$550,000.",
  },
  {
    question: "What drives the biggest cost swings on a healthcare construction project?",
    answer:
      "Service and equipment coordination is the single largest variable. Compressed air, dental vacuum, medical gas, water treatment, and imaging equipment locations need to be locked before construction. Late equipment changes are the most expensive change orders in healthcare construction.",
  },
  {
    question: "Is a fixed price or cost-plus contract better for healthcare construction?",
    answer:
      "Fixed price gives cost certainty but transfers all risk to the contractor, which shows up in higher contingency. Cost-plus with a guaranteed maximum price is common on complex healthcare projects because it lets equipment and finish decisions evolve during construction without renegotiating the whole contract.",
  },
  {
    question: "How long does a healthcare construction project take?",
    answer:
      "A typical 2,500 sq ft dental or medical clinic runs 10–16 weeks of construction after permits, plus 6–12 weeks of design and 6–16 weeks of permitting. Oberizon has delivered a fully functioning dental clinic in 90 days total when equipment and permits were pre-coordinated.",
  },
  {
    question: "Does Oberizon publish fixed prices per project type?",
    answer:
      "No. Every project is priced against the site, base-building condition, equipment package, and finish selections. The ranges on this page are 2026 Lower Mainland market indications so owners can budget realistically before design starts.",
  },
];

export const metadata: Metadata = buildMetadata({
  // noindex until the client signs off on the ranges. A calculator invites the
  // visitor to generate a figure and hold you to it, so the page stays live and
  // testable but does not ask to rank until the numbers are confirmed.
  index: ratesConfirmedByClient,
  title: "Cost of Construction in BC — 2026 Guide | Oberizon Construction",
  description:
    "Real 2026 cost ranges for healthcare, dental, medical, pharmacy, commercial, and luxury residential construction across White Rock and the Lower Mainland — from Oberizon Construction.",
  path: "/cost",
  image: HERO_IMAGE,
  keywords: [
    "cost of dental clinic construction BC",
    "medical clinic construction cost Lower Mainland",
    "commercial tenant improvement cost Vancouver",
    "pharmacy construction cost BC",
    "luxury home construction cost per square foot BC",
    "healthcare construction cost per sq ft",
  ],
});

export default function CostPage() {
  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: "Cost Guide", href: "/cost" },
        ])}
      />
      <JsonLd data={faqJsonLd(FAQS)} />

      <PageHero
        eyebrow="2026 Cost Guide"
        heading="Cost of Construction in BC"
        subheading="Real 2026 cost ranges for healthcare, dental, medical, pharmacy, commercial, and luxury residential projects across White Rock and the Lower Mainland."
        image={HERO_IMAGE}
      />

      <section className="bg-[#f8faff] px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <CostCalculator />
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-orange-600">
                How to read this page
              </p>
              <h2 className="serif-font mt-4 text-4xl leading-tight text-zinc-950 sm:text-5xl">
                Real 2026 numbers, not marketing brackets.
              </h2>
              <p className="mt-5 text-lg font-medium leading-8 text-slate-600">
                Every range below reflects current 2026 turnkey pricing across the Lower Mainland
                &mdash; design, permits, construction, and site connections included. Ranges move
                with base-building condition, service coordination, and finish level. Use them to
                budget before design starts, not after.
              </p>
            </div>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-orange-50/70">
                  <tr>
                    <th className="px-5 py-4 text-xs font-extrabold uppercase tracking-[0.14em] text-orange-700">
                      Project type
                    </th>
                    <th className="px-5 py-4 text-xs font-extrabold uppercase tracking-[0.14em] text-orange-700">
                      Per sq ft
                    </th>
                    <th className="px-5 py-4 text-xs font-extrabold uppercase tracking-[0.14em] text-orange-700">
                      Typical total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {COST_BRACKETS.map((row) => (
                    <tr key={row.scope} className="align-top">
                      <th
                        scope="row"
                        className="px-5 py-4 text-sm font-bold text-zinc-950"
                      >
                        {row.scope}
                        {/* What moves the number, rather than a general
                            description of the service — this is a cost table. */}
                        <p className="mt-2 text-xs font-medium leading-6 text-slate-500">
                          Driven by {row.driver}.
                        </p>
                      </th>
                      <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-zinc-950">
                        {row.range}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                        {row.typical}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-orange-600">
              What moves the number
            </p>
            <h2 className="serif-font mt-4 text-4xl leading-tight text-zinc-950 sm:text-5xl">
              Five factors that decide the final budget.
            </h2>
            <p className="mt-5 text-lg font-medium leading-8 text-slate-600">
              A range is only useful if you know which end of it your project sits on. These are
              the factors that move a healthcare or commercial project 20–40% inside the same
              square footage.
            </p>
          </div>
          <div className="grid gap-4">
            {FACTORS.map((factor) => (
              <article
                key={factor.title}
                className="live-card-shadow rounded-3xl bg-white p-6 ring-1 ring-slate-200"
              >
                <h3 className="text-2xl font-bold text-zinc-950">{factor.title}</h3>
                <p className="mt-2 text-base font-medium leading-7 text-slate-600">
                  {factor.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-orange-600">
                Typical timeline
              </p>
              <h2 className="serif-font mt-4 text-4xl leading-tight text-zinc-950 sm:text-5xl">
                From feasibility to handover.
              </h2>
              <p className="mt-5 text-lg font-medium leading-8 text-slate-600">
                A realistic project schedule so lease dates, equipment orders, and opening plans
                line up with construction.
              </p>
            </div>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left">
                <tbody className="divide-y divide-slate-200">
                  {TIMELINE.map((row) => (
                    <tr key={row.phase}>
                      <th
                        scope="row"
                        className="w-3/5 px-5 py-4 text-sm font-bold text-zinc-950"
                      >
                        {row.phase}
                      </th>
                      <td className="px-5 py-4 text-sm font-semibold text-orange-700">
                        {row.weeks}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-orange-600">
            Frequently asked
          </p>
          <h2 className="serif-font mt-4 text-4xl leading-tight text-zinc-950 sm:text-5xl">
            Cost questions we hear most often.
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {FAQS.map((faq) => (
              <article
                key={faq.question}
                className="live-card-shadow rounded-3xl bg-white p-6 ring-1 ring-slate-200"
              >
                <h3 className="text-xl font-bold leading-snug text-zinc-950">
                  {faq.question}
                </h3>
                <p className="mt-4 text-base font-medium leading-7 text-slate-600">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-start gap-4 rounded-3xl border border-orange-200 bg-orange-50 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-orange-700">
                Next step
              </p>
              <p className="mt-2 text-2xl font-bold text-zinc-950">
                Get a real number for your specific project.
              </p>
              <p className="mt-2 text-base font-medium leading-7 text-slate-700">
                Send us the space, project type, and target timeline. We come back with a scoped
                estimate for your project — not a generic range.
              </p>
            </div>
            <ButtonLink href="/contact">Request a project review</ButtonLink>
          </div>
        </div>
      </section>

      <ReviewCta />
    </>
  );
}
