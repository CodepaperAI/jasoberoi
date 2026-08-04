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
          <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-orange-600">
            Location + Service SEO
          </p>
          <h1 className="serif-font mt-5 max-w-5xl text-5xl leading-tight tracking-tight text-zinc-950 sm:text-7xl">
            Construction Services By City
          </h1>
          <p className="mt-6 max-w-3xl text-xl font-medium leading-8 text-slate-600">
            Healthcare, dental, medical, pharmacy, commercial renovation, office renovation, and
            luxury residential construction pages for Lower Mainland service areas.
          </p>
          <ButtonLink href="/contact" className="mt-8">
            Book a Consultation
          </ButtonLink>
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {serviceAreas.map((city) => (
              <article
                key={city.slug}
                className="live-card-shadow rounded-3xl bg-white p-6 ring-1 ring-slate-200"
              >
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 shrink-0 text-orange-600" size={22} aria-hidden="true" />
                  <div>
                    <h2 className="serif-font text-3xl text-zinc-950">{city.city}</h2>
                    <p className="mt-2 text-base font-medium leading-6 text-slate-600">
                      {city.regionNote}. Common project conversations include{" "}
                      {city.neighborhoods.slice(0, 3).join(", ")}.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-2">
                  {constructionServices.map((service) => (
                    <Link
                      key={service.slug}
                      href={`/construction/${city.slug}/${service.slug}`}
                      className="flex min-h-12 items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-extrabold uppercase tracking-[0.06em] text-zinc-800 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
                    >
                      <span>
                        {service.name} in {city.city}
                      </span>
                      <ArrowRight size={17} aria-hidden="true" />
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
