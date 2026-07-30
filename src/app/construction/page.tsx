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

      <section className="relative isolate overflow-hidden pt-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[url('/oberizon/optimized/hero-commercial.webp')] bg-cover bg-center opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/[0.88] to-stone-950/[0.42]" />
        </div>
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
          <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-amber-300">
            Location + Service SEO
          </p>
          <h1 className="display-font steel-shadow mt-4 max-w-5xl break-words text-[2.55rem] uppercase leading-none text-white sm:text-7xl">
            Construction Services By City
          </h1>
          <p className="mt-6 max-w-3xl text-xl font-semibold leading-8 text-white/80">
            Healthcare, dental, medical, pharmacy, commercial renovation, office renovation, and
            luxury residential construction pages for Lower Mainland service areas.
          </p>
          <ButtonLink href="/contact" className="mt-8">
            Book a Project Review
          </ButtonLink>
        </div>
      </section>

      <section className="industrial-surface px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {serviceAreas.map((city) => (
              <article
                key={city.slug}
                className="rounded-sm border border-white/[0.12] bg-stone-950/[0.52] p-5"
              >
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 shrink-0 text-amber-300" size={22} aria-hidden="true" />
                  <div>
                    <h2 className="display-font text-3xl uppercase text-white">{city.city}</h2>
                    <p className="mt-2 text-base font-medium leading-6 text-white/[0.68]">
                      {city.regionNote}. Common project conversations include{" "}
                      {city.neighborhoods.slice(0, 3).join(", ")}.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-2">
                  {constructionServices.map((service) => (
                    <Link
                      key={service.slug}
                      href={`/construction/${city.slug}/${service.slug}`}
                      className="flex min-h-12 items-center justify-between rounded-sm border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-sm font-extrabold uppercase text-white/[0.76] transition hover:border-amber-400 hover:bg-amber-500 hover:text-stone-950"
                    >
                      <span>{service.name} in {city.city}</span>
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
