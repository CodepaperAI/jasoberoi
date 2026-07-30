import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { serviceAreas, seoServices } from "@/lib/site";

const pageTitle = "Real Estate Services by City | The Oberoi Group";
const pageDescription =
  "Find The Oberoi Group's local real estate service pages for commercial real estate, residential real estate, buying a home, and selling property across the Lower Mainland.";

export const metadata: Metadata = buildMetadata({
  title: pageTitle,
  description: pageDescription,
  path: "/real-estate",
  keywords: [
    "White Rock real estate services",
    "South Surrey real estate agent",
    "Lower Mainland commercial real estate",
    "buying a home in BC",
    "selling a property in BC",
  ],
});

export default function RealEstateIndexPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: "Real Estate", href: "/real-estate" },
        ])}
      />

      <section className="relative isolate overflow-hidden pt-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[url('/assets/images/optimized/hero-desktop.jpg')] bg-cover bg-center opacity-[0.34]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/[0.9] to-black/[0.58]" />
        </div>
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase text-red-300">Service Areas</p>
          <h1 className="display-font mt-3 max-w-5xl text-5xl font-bold uppercase leading-none text-white sm:text-7xl">
            Real Estate Services By City
          </h1>
          <p className="mt-6 max-w-3xl text-xl font-semibold leading-8 text-white/80">
            Location and service pages for clients comparing commercial real estate, residential
            real estate, buying, and selling support across White Rock, South Surrey, Surrey,
            Vancouver, Burnaby, Richmond, Delta, Langley, and Abbotsford.
          </p>
          <ButtonLink href="/contact" className="mt-8">
            Talk To The Team
          </ButtonLink>
        </div>
      </section>

      <section className="grain-surface px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {serviceAreas.map((city) => (
              <article
                key={city.slug}
                className="rounded-md border border-white/[0.12] bg-black/[0.48] p-5"
              >
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 shrink-0 text-red-400" size={22} aria-hidden="true" />
                  <div>
                    <h2 className="display-font text-3xl font-bold uppercase text-white">
                      {city.city}
                    </h2>
                    <p className="mt-2 text-base font-medium leading-6 text-white/[0.72]">
                      Advisory support across {city.regionNote}, including {city.neighborhoods.slice(0, 3).join(", ")}.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-2">
                  {seoServices.map((service) => (
                    <Link
                      key={service.slug}
                      href={`/real-estate/${city.slug}/${service.slug}`}
                      className="flex min-h-12 items-center justify-between rounded border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-sm font-bold uppercase text-white/[0.78] transition hover:border-red-500 hover:bg-red-600 hover:text-white"
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
