import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Plus } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { constructionServices, projects, serviceAreas } from "@/lib/site";

const pageTitle = "Construction Services by City | Oberizon Construction";
const pageDescription =
  "Find Oberizon Construction service pages for healthcare construction, dental clinic construction, medical clinic construction, pharmacy construction, commercial renovation, office renovation, and luxury residential construction across BC.";

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/construction",
  keywords: [
    "construction services by city",
    "commercial construction company BC",
    "healthcare construction BC",
    "dental clinic construction BC",
    "commercial renovation contractor BC",
  ],
});

export default function ConstructionIndexPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: "Construction", href: "/construction" },
        ])}
      />

      <section className="soft-grid relative overflow-hidden px-5 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">
            Location + Service SEO
          </p>
          <h1 className="h-hero mt-5">
            Construction Services By City
          </h1>
          <p className="mt-6 max-w-3xl text-xl font-medium leading-8 text-muted">
            Healthcare, dental, medical, pharmacy, commercial renovation, office renovation, and
            luxury residential construction pages for Lower Mainland service areas.
          </p>
          <ButtonLink href="/contact" className="mt-8">
            Book a Consultation
          </ButtonLink>
        </div>
      </section>

      <section className="bg-paper px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/*
            Fourteen cities, not a hundred and forty rows.

            Every city listed the identical ten services in full, so this page
            was the same block repeated fourteen times — 140 rows over 4,686px,
            with no imagery and nothing to distinguish one city from the next.
            Styling could not fix that; the repetition was the design.

            <details> rather than a JS accordion: every one of the 140 links stays
            in the delivered HTML, so nothing changes for crawlers, and the page
            works with JavaScript off. What changes is that a visitor scans
            fourteen places instead of reading the same list fourteen times.

            The delivered-project count is the one thing that genuinely differs
            between these cities, so it is the one thing shown on the closed row.
          */}
          <div className="border-t border-line">
            {serviceAreas.map((city) => {
              const delivered = projects.filter(
                (project) => project.citySlug === city.slug,
              ).length;

              return (
                <details key={city.slug} className="group border-b border-line">
                  <summary className="flex cursor-pointer list-none items-baseline gap-4 py-6 transition hover:text-accent">
                    <MapPin
                      className="shrink-0 translate-y-1 text-accent"
                      size={18}
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="h-card block text-ink transition group-hover:text-accent">
                        {city.city}
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-muted">
                        {city.regionNote}. {city.neighborhoods.slice(0, 3).join(", ")}.
                      </span>
                    </span>
                    {delivered > 0 ? (
                      <span className="ui-font hidden shrink-0 text-xs font-extrabold uppercase tracking-[0.14em] text-accent sm:block">
                        {delivered} delivered
                      </span>
                    ) : null}
                    <Plus
                      size={18}
                      strokeWidth={2.5}
                      aria-hidden="true"
                      className="shrink-0 translate-y-1 text-ink/30 transition duration-300 group-open:rotate-45 group-hover:text-accent"
                    />
                  </summary>

                  {/* Two columns so ten services read as a set rather than a
                      column of ten more full-width rows. */}
                  <div className="grid gap-x-10 pb-8 pl-9 sm:grid-cols-2">
                    {constructionServices.map((service) => (
                      <Link
                        key={service.slug}
                        href={`/construction/${city.slug}/${service.slug}`}
                        className="group/link flex items-center justify-between gap-3 border-b border-line py-2.5 text-sm text-ink transition hover:text-accent"
                      >
                        <span>
                          {service.name} in {city.city}
                        </span>
                        <ArrowRight
                          size={14}
                          aria-hidden="true"
                          className="shrink-0 text-ink/20 transition group-hover/link:translate-x-0.5 group-hover/link:text-accent"
                        />
                      </Link>
                    ))}
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
