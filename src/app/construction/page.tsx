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
                <dd className="h-card-lg mt-2 text-ink">{serviceAreas.length}</dd>
              </div>
              <div>
                <dt className="ui-font text-xs font-extrabold uppercase tracking-[0.14em] text-muted">
                  Head office
                </dt>
                <dd className="h-card-lg mt-2 text-ink">White Rock</dd>
              </div>
              <div>
                <dt className="ui-font text-xs font-extrabold uppercase tracking-[0.14em] text-muted">
                  Delivered
                </dt>
                <dd className="h-card-lg mt-2 text-ink">{portfolioTally.delivered}+</dd>
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

            The type was then measured against the reference this was designed
            from. Scaled to our container, its heading is ~50px and its city
            names ~22px — sizes this page already had. What made ours read as
            small was 140 rows of 14px link text, which the reference has none
            of. So the rows go to 17px and the city names to 30px, and the
            trade that makes that possible is in the card comment below.
          */}
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {serviceAreas.map((city) => {
              const delivered = projects.filter(
                (project) => project.citySlug === city.slug,
              ).length;
              const headingId = `city-${city.slug}`;

              return (
                /*
                  A white card on the cream section, and subgrid inside it.

                  Region notes run 29 to 60 characters, which is one line in
                  some columns and two in others, and that pushed each city's
                  service list to a different height — the horizontal rules
                  stopped agreeing across the row. Subgrid makes the three bands
                  (name, note, list) share rows with every other card, at every
                  breakpoint, and the card edge makes that alignment more
                  visible rather than less. A fixed min-height would only ever
                  be correct at one width.

                  Lifted rather than outlined: a soft shadow, no border. That is
                  what separates a card that reads as an object from the ringed
                  boxes this site had everywhere before.

                  No arrow on the card itself, though the reference has one.
                  There it means the whole card is a link; here it would point
                  nowhere, because /construction/{city}/ does not exist yet.
                */
                <div
                  key={city.slug}
                  className="row-span-3 grid grid-rows-subgrid gap-0 rounded-2xl bg-white p-5 shadow-[0_1px_2px_rgba(20,18,15,0.04),0_10px_28px_-14px_rgba(20,18,15,0.16)] sm:p-7"
                >
                  <div className="flex items-baseline gap-3">
                    <MapPin
                      className="shrink-0 translate-y-1 text-accent"
                      size={18}
                      aria-hidden="true"
                    />
                    <h3 id={headingId} className="h-card-lg text-ink">
                      {city.city}
                    </h3>
                    {delivered > 0 ? (
                      <span className="ui-font ml-auto shrink-0 text-xs font-extrabold uppercase tracking-[0.14em] text-accent">
                        {delivered} built
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-base leading-7 text-muted">
                    {city.regionNote}.
                  </p>

                  {/*
                    The city is the heading now, not part of every link.

                    "Luxury Residential Construction in New Westminster" measures
                    386px in Barlow at this size and a three-column card has
                    about 302px of text width, so the long ones wrapped — which
                    is the raggedness this whole change exists to remove. The
                    location still reads from the heading above, the URL slug and
                    the target page's own title; aria-labelledby keeps it in the
                    accessible name, so a screen reader still announces
                    "Commercial Construction, White Rock".
                  */}
                  <ul aria-labelledby={headingId} className="mt-5 border-t border-line">
                    {constructionServices.map((service) => (
                      <li key={service.slug}>
                        <Link
                          href={`/construction/${city.slug}/${service.slug}`}
                          className="group/link flex items-center justify-between gap-3 border-b border-line py-2.5 text-[1.0625rem] leading-6 text-ink transition hover:text-accent"
                        >
                          <span>{service.name}</span>
                          <ArrowRight
                            size={15}
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
