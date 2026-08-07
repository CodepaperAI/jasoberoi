import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { constructionServices, serviceAreas } from "@/lib/site";

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
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-x-12 gap-y-16 md:grid-cols-2 xl:grid-cols-3">
            {/*
              Rows on rules, not 140 pills.

              Each of the fourteen cities listed its ten services as a rounded,
              bordered, filled pill — boxes inside a box, 140 of them on one
              page. The labels were also uppercase, bold and letterspaced, which
              is fine on a three-word chip and hostile on "Dental Clinic
              Construction in New Westminster": at that length uppercase kills
              word shape, and the strings wrapped mid-phrase leaving orphans
              like "ROCK" and "VANCOUVER" alone on a second line.

              Sentence case, hairline rules, one arrow. The city name is the
              heading and the services are simply its list.

              h-full plus flex-col also fixes the alignment: the cards used to
              size to their own content, so a city with a three-line description
              pushed its list down and none of the columns lined up.
            */}
            {serviceAreas.map((city) => (
              <article key={city.slug} className="flex h-full flex-col">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-2 shrink-0 text-accent" size={20} aria-hidden="true" />
                  <div>
                    <h2 className="h-card text-ink">{city.city}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {city.regionNote}. Common project conversations include{" "}
                      {city.neighborhoods.slice(0, 3).join(", ")}.
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-line">
                  {constructionServices.map((service) => (
                    <Link
                      key={service.slug}
                      href={`/construction/${city.slug}/${service.slug}`}
                      className="group flex items-center justify-between gap-4 border-b border-line py-3 text-sm font-semibold text-ink transition hover:text-accent"
                    >
                      <span>
                        {service.name} in {city.city}
                      </span>
                      <ArrowRight
                        size={15}
                        aria-hidden="true"
                        className="shrink-0 text-ink/25 transition group-hover:translate-x-0.5 group-hover:text-accent"
                      />
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
