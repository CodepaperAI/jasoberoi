import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AwardsMarquee, CurtainCta } from "@/components/SectionPrimitives";
import { ButtonLink } from "@/components/ButtonLink";
import { awards, serviceAreas, seoServices, stats } from "@/lib/site";

export function HomeExperience() {
  return (
    <>
      <section className="relative isolate min-h-[84svh] overflow-hidden pt-16">
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet="/assets/images/optimized/hero-mobile.jpg"
          />
          <img
            src="/assets/images/optimized/hero-desktop.jpg"
            alt="Jas Oberoi and Maria Hussain with red sports car"
            width={2400}
            height={1350}
            className="absolute inset-0 h-full w-full object-cover object-center"
            fetchPriority="high"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/[0.12] md:bg-gradient-to-r md:from-black/10 md:via-transparent md:to-black/30" />
        <div className="relative mx-auto flex min-h-[84svh] max-w-7xl items-start px-5 pb-20 pt-16 sm:px-6 sm:pt-20 lg:px-8">
          <div className="max-w-5xl">
            <h1 className="display-font reveal-up race-text-shadow text-5xl font-bold uppercase leading-none text-black sm:text-7xl lg:text-[6.7rem]">
              <span>Top 3 </span>
              <span className="text-white">Commercial Team</span>
            </h1>
            <p className="display-font reveal-up reveal-delay-1 race-text-shadow mt-4 max-w-4xl text-3xl font-bold uppercase leading-tight text-white sm:text-5xl">
              Across <span className="text-black">All of Canada</span> at RE/MAX
            </p>
            <p className="reveal-up reveal-delay-2 mt-4 text-lg font-bold uppercase text-white">
              Based on commission in 2025
            </p>
            <ButtonLink href="/contact" tone="black" className="reveal-up reveal-delay-3 mt-7">
              Make The Move
            </ButtonLink>
          </div>
        </div>
        <p className="absolute bottom-6 right-6 hidden max-w-44 text-right text-xs font-bold uppercase text-black/[0.45] md:block">
          Jas Oberoi Maria Hussain Partners at Oberoi Group
        </p>
      </section>

      <section className="bg-black">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 text-center sm:px-6 md:grid-cols-3 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="display-font text-5xl font-bold uppercase text-white sm:text-6xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-bold uppercase text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="checker-band" aria-hidden="true" />

      <section className="grain-surface overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-24 sm:px-6 lg:grid-cols-[1fr_0.75fr] lg:px-8">
          <div>
            <h2 className="display-font text-4xl font-bold uppercase text-white sm:text-5xl">
              The Real Estate Race
            </h2>
            <div className="mt-5 max-w-2xl space-y-4 text-lg font-medium leading-7 text-white/[0.78]">
              <p>Real estate moves fast and so do we.</p>
              <p>
                With an eye always on the market, a drive to outperform, and a network that runs
                deep, The Oberoi Group sets the pace in real estate.
              </p>
              <p>
                From finding the perfect property to crafting a winning investment strategy, we
                handle every move with precision and speed.
              </p>
            </div>
            <ButtonLink href="/contact" className="mt-10">
              Make The Move
            </ButtonLink>
          </div>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-md border border-white/10 bg-red-600">
            <Image
              src="/assets/images/optimized/partners-new.jpg"
              alt="Jas Oberoi and Maria Hussain"
              fill
              sizes="(min-width: 1024px) 33vw, 90vw"
              className="object-contain object-bottom"
            />
          </div>
        </div>
      </section>

      <AwardsMarquee awards={awards} />
      <CurtainCta />

      <section className="bg-black px-5 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-2">
            <Link
              href="/buyers-guide"
              className="red-button flex min-h-14 items-center justify-center gap-3 rounded-md px-6 py-4 text-center text-base font-bold uppercase text-white transition hover:-translate-y-0.5 hover:brightness-110"
            >
              Residential Real Estate <ArrowRight size={19} aria-hidden="true" />
            </Link>
            <Link
              href="/commercial-listing"
              className="red-button flex min-h-14 items-center justify-center gap-3 rounded-md px-6 py-4 text-center text-base font-bold uppercase text-white transition hover:-translate-y-0.5 hover:brightness-110"
            >
              Commercial Listing <ArrowRight size={19} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-14">
            <p className="text-sm font-bold uppercase text-red-300">Local Real Estate Advisors</p>
            <h2 className="display-font mt-3 text-4xl font-bold uppercase text-white">
              Built for Search. Written for People.
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {serviceAreas.slice(0, 9).map((city) => (
                <article key={city.slug} className="rounded-md border border-white/[0.12] bg-white/[0.04] p-5">
                  <h3 className="display-font text-2xl font-bold uppercase">{city.city}</h3>
                  <p className="mt-2 min-h-12 text-base font-medium leading-6 text-white/70">
                    Advisory support across {city.regionNote}.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {seoServices.map((service) => (
                      <Link
                        key={service.slug}
                        href={`/real-estate/${city.slug}/${service.slug}`}
                        className="rounded border border-white/[0.12] px-3 py-2 text-xs font-bold uppercase text-white/75 transition hover:border-red-500 hover:text-white"
                      >
                        {service.name}
                      </Link>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
