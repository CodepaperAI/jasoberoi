import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { LandingCta } from "@/components/LandingSections";
import { PageHero } from "@/components/SectionPrimitives";
import { getAllServiceHubs } from "@/lib/hubs";
import { breadcrumbJsonLd } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { serviceAreas } from "@/lib/site";

/**
 * The top of the funnel: every service, grouped, each with its price and a link
 * to its hub.
 *
 * This was previously a generic content page rendered through the /[slug]
 * catch-all, with six decorative cards that linked nowhere useful. The Services
 * dropdown in the header, meanwhile, sent every visitor to a White Rock city
 * page regardless of where they were.
 *
 * Showing the price on the card is deliberate and taken from the reference page:
 * a visitor deciding between services is usually deciding on budget, and making
 * them click into each one to find out is friction that costs the click.
 */

const HERO_IMAGE = "/oberizon/optimized/hero-commercial.webp";

const GROUPS = [
  {
    id: "Healthcare",
    title: "Healthcare",
    // Was "Five of eight delivered commercial builds are clinical" — a fraction
    // that matched no count in the data and never had. The clinical focus is
    // real and visible in the project list; the arithmetic was invented.
    blurb: "Where we differentiate. Dental, medical and pharmacy build-outs are most of the work.",
  },
  {
    id: "Commercial",
    title: "Commercial",
    blurb: "The volume. Offices, retail and tenant improvements across the Lower Mainland.",
  },
  {
    id: "Residential",
    title: "Residential",
    blurb: "Custom homes, run with the same planning discipline as the clinical work.",
  },
] as const;

export const metadata: Metadata = buildMetadata({
  title: "Construction Services in BC | Oberizon Construction",
  description:
    "Healthcare, commercial and luxury residential construction across the Lower Mainland — with 2026 cost ranges for every service, from Oberizon Construction in White Rock.",
  path: "/services",
  image: HERO_IMAGE,
  keywords: [
    "construction services BC",
    "healthcare construction Lower Mainland",
    "commercial construction company BC",
    "dental clinic construction BC",
  ],
});

export default function ServicesPage() {
  const hubs = getAllServiceHubs();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
        ])}
      />

      <PageHero
        eyebrow="Services"
        heading="What Oberizon builds"
        subheading={`Ten services across healthcare, commercial and residential — delivered in ${serviceAreas.length} Lower Mainland cities from a White Rock head office.`}
        image={HERO_IMAGE}
      />

      {GROUPS.map((group, index) => {
        const inGroup = hubs.filter((hub) => hub.service.vertical === group.id);
        if (inGroup.length === 0) return null;

        return (
          <section
            key={group.id}
            className={[
              "px-5 py-20 sm:px-6 lg:px-8",
              index % 2 === 0 ? "bg-paper" : "bg-raised",
            ].join(" ")}
          >
            <div className="mx-auto max-w-7xl">
              <p className="eyebrow">
                {group.title}
              </p>
              <h2 className="h-section mt-4 max-w-3xl">
                {group.blurb}
              </h2>

              <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {inGroup.map((hub) => (
                  <Link
                    key={hub.path}
                    href={hub.path}
                    className="group flex flex-col justify-between gap-6 rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-lg"
                  >
                    <div>
                      <h3 className="flex items-start justify-between gap-3 text-xl font-bold text-zinc-950 group-hover:text-accent">
                        {hub.service.name}
                        <ArrowRight
                          size={18}
                          aria-hidden="true"
                          className="mt-1 shrink-0 text-slate-300 group-hover:text-orange-500"
                        />
                      </h3>
                      <p className="mt-3 text-base leading-7 text-muted">
                        {hub.service.summary}
                      </p>
                    </div>
                    {/* Price on the card: a visitor choosing between services is
                        usually choosing on budget. */}
                    <p className="border-t border-slate-100 pt-4 text-sm font-bold text-zinc-900">
                      from{" "}
                      <span className="orange-italic text-lg">
                        {hub.typicalRange.split("–")[0]?.trim()}
                      </span>
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <LandingCta
        heading="Not sure which one you need?"
        body="Tell us the space and what has to happen in it. We will tell you which of these it is, and what it costs, before anyone draws anything."
      />
    </>
  );
}
