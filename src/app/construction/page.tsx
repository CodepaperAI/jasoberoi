import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Plus } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { CallLink, ProjectProof, ReviewsBlock } from "@/components/LandingSections";
import { PageHero, ReviewCta } from "@/components/SectionPrimitives";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import {
  constructionServices,
  portfolioTally,
  projects,
  reviews,
  serviceAreas,
} from "@/lib/site";

const HERO_IMAGE = "/oberizon/optimized/project-skinholic-lobby-live.jpg";

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

      {/*
        The same full-bleed hero every other interior page uses. This page was
        the one left on the old flat beige band, which is a large part of why it
        read as unfinished next to the rest of the site.
      */}
      <PageHero
        eyebrow="Service areas"
        heading="Construction Services By City"
        subheading="Healthcare, dental, medical, pharmacy, commercial renovation, office renovation, and luxury residential construction across 14 Lower Mainland cities."
        image={HERO_IMAGE}
      />

      {/*
        Coverage, before the index.

        Every guide to this page type says the same thing and this page had none
        of it: show the area on a map, say where the boundary is and why, prove
        you have worked there, then let people navigate. What was here was the
        navigation on its own — a list of fourteen places with no map, no proof
        and no reason to believe any of it.
      */}
      <section className="bg-paper px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="eyebrow">Where we work</p>
            <h2 className="h-section mt-4">
              {serviceAreas.length} cities, run from{" "}
              <span className="orange-italic">one White Rock office.</span>
            </h2>
            <p className="mt-5 text-lg font-medium leading-8 text-muted">
              The boundary is deliberate. Everything here is inside a working drive of the
              White Rock office, which is what lets the same team run permits, trades and
              inspections rather than handing a job to whoever is nearest.
            </p>

            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-line pt-8">
              <div>
                <dt className="ui-font text-xs font-extrabold uppercase tracking-[0.14em] text-muted">
                  Cities
                </dt>
                <dd className="h-card mt-2 text-ink">{serviceAreas.length}</dd>
              </div>
              <div>
                <dt className="ui-font text-xs font-extrabold uppercase tracking-[0.14em] text-muted">
                  Head office
                </dt>
                <dd className="h-card mt-2 text-ink">White Rock</dd>
              </div>
              <div>
                <dt className="ui-font text-xs font-extrabold uppercase tracking-[0.14em] text-muted">
                  Delivered
                </dt>
                <dd className="h-card mt-2 text-ink">{portfolioTally.delivered}+</dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/contact">Book a Consultation</ButtonLink>
              <CallLink />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-line">
            {/* z=9, not the office pin's default street zoom — this map has to
                show the coverage, so it is framed on the Lower Mainland with
                White Rock marked rather than on one block of Foster St. */}
            <iframe
              title="Oberizon Construction service area map"
              src="https://www.google.com/maps?q=White%20Rock%2C%20BC&z=9&output=embed"
              loading="lazy"
              className="h-[320px] w-full bg-stone sm:h-[460px]"
            />
          </div>
        </div>
      </section>

      {/*
        Proof before navigation. These are the delivered jobs that sit inside the
        service area, with the addresses attached — the difference between
        claiming to serve a city and having built there.
      */}
      <ProjectProof
        items={projects.filter((project) => project.citySlug && project.images?.length)}
        heading="Delivered across the Lower Mainland."
      />

      <section className="bg-raised px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="eyebrow">Every city, every service</p>
          <h2 className="h-section mt-4 mb-12">
            Find your city.
          </h2>
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
      <ReviewsBlock items={reviews} />
      <ReviewCta />
    </>
  );
}
