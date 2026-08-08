import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
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
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">Every city, every service</p>
          <h2 className="h-section mt-4">Find your city.</h2>
          <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-muted">
            Every service in every city we cover — all {serviceAreas.length * constructionServices.length}{" "}
            of them, on the page. Nothing to open.
          </p>

          {/*
            All open, in columns.

            This was fourteen <details> rows. Collapsing it did solve the
            repetition, but it also put every destination one click away, and
            the point of this page is that a visitor lands on it and sees their
            own city immediately.

            Columns are what make that possible without a 4,700px wall: the
            same 140 links laid out three-up read as fourteen scannable blocks
            rather than one long scroll. City names are bold and set in the
            display face so the eye lands on the place first and the ten
            services under it read as its contents.

            Anchor text stays "{service} in {city}" rather than the shorter
            "{service}" the heading would allow. This page exists for
            location+service search and the anchor is the strongest signal on
            it, so the redundancy is deliberate.
          */}
          <div className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {serviceAreas.map((city) => {
              const delivered = projects.filter(
                (project) => project.citySlug === city.slug,
              ).length;

              return (
                /*
                  Subgrid, so the rules line up across columns.

                  Region notes run 29 to 60 characters, which is one line in
                  some columns and two in others, and that pushed each city's
                  service list to a different height — the horizontal rules
                  stopped agreeing across the row and the whole grid read as
                  untidy. Subgrid makes the three bands (name, note, list)
                  share rows with every other card, at every breakpoint. A
                  fixed min-height would only be correct at one width.
                */
                <div key={city.slug} className="row-span-3 grid grid-rows-subgrid gap-0">
                  <div className="flex items-baseline gap-3">
                    <MapPin
                      className="shrink-0 translate-y-0.5 text-accent"
                      size={17}
                      aria-hidden="true"
                    />
                    <h3 className="h-card text-ink">{city.city}</h3>
                    {delivered > 0 ? (
                      <span className="ui-font ml-auto shrink-0 text-xs font-extrabold uppercase tracking-[0.14em] text-accent">
                        {delivered} built
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1.5 pl-8 text-sm leading-6 text-muted">
                    {city.regionNote}.
                  </p>

                  <ul className="mt-4 border-t border-line pl-8">
                    {constructionServices.map((service) => (
                      <li key={service.slug}>
                        <Link
                          href={`/construction/${city.slug}/${service.slug}`}
                          className="group/link flex items-center justify-between gap-3 border-b border-line py-2 text-sm leading-6 text-ink transition hover:text-accent"
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
                      </li>
                    ))}
                  </ul>
                </div>
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
