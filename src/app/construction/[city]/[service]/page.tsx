import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Building2 } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { InternalLinkRail, ScopeList } from "@/components/SectionPrimitives";
import { JsonLd } from "@/components/JsonLd";
import {
  breadcrumbJsonLd,
  constructionServiceJsonLd,
  constructionWebPageJsonLd,
  faqJsonLd,
} from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { getAllConstructionPages, getConstructionPage } from "@/lib/site";

type ConstructionProps = {
  params: Promise<{ city: string; service: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllConstructionPages().map((page) => ({
    city: page.city.slug,
    service: page.service.slug,
  }));
}

export async function generateMetadata({ params }: ConstructionProps): Promise<Metadata> {
  const { city, service } = await params;
  const page = getConstructionPage(city, service);

  if (!page) {
    return {};
  }

  return buildMetadata({
    title: page.title,
    description: page.description,
    path: page.path,
    image: page.service.image,
    keywords: page.keywords,
  });
}

export default async function ConstructionRoute({ params }: ConstructionProps) {
  const { city, service } = await params;
  const page = getConstructionPage(city, service);

  if (!page) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: "Construction", href: "/construction" },
          { label: page.city.city, href: page.path },
        ])}
      />
      <JsonLd data={constructionServiceJsonLd(page)} />
      <JsonLd data={constructionWebPageJsonLd(page)} />
      <JsonLd data={faqJsonLd(page.faqs)} />

      <section className="relative isolate overflow-hidden pt-24">
        <Image
          src={page.service.image}
          alt={`${page.h1} project image`}
          fill
          sizes="100vw"
          priority
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-stone-950 via-stone-950/[0.86] to-stone-950/[0.42]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(110deg,rgba(243,162,27,0.14)_0_1px,transparent_1px_100%)] bg-[length:76px_76px]" />
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
          <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-amber-300">
            {page.city.city} Construction
          </p>
          <h1 className="display-font steel-shadow mt-4 max-w-5xl break-words text-[2.55rem] uppercase leading-none text-white sm:text-7xl">
            {page.h1}
          </h1>
          <p className="mt-6 max-w-3xl text-xl font-semibold leading-8 text-white/82">
            {page.intro}
          </p>
          <ButtonLink href="/contact" className="mt-8">
            Book a Project Review
          </ButtonLink>
        </div>
      </section>

      <section className="industrial-surface">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-amber-300">
              Local Planning
            </p>
            <h2 className="display-font mt-4 text-4xl uppercase leading-none text-white sm:text-5xl">
              Local strategy for {page.city.city}
            </h2>
            <p className="mt-5 text-xl font-medium leading-8 text-white/[0.74]">{page.localProof}</p>
          </div>
          <ScopeList items={page.service.scope} />
        </div>
      </section>

      <section className="bg-stone-950 px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-amber-300">
              Search Coverage
            </p>
            <h2 className="display-font mt-4 text-4xl uppercase leading-none text-white sm:text-5xl">
              {page.service.name} coverage in {page.city.city}
            </h2>
            <p className="mt-5 text-xl font-medium leading-8 text-white/[0.74]">
              {page.marketContext}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {page.city.neighborhoods.map((area) => (
                <span
                  key={area}
                  className="rounded-sm border border-white/[0.12] bg-white/[0.04] px-3 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-white/[0.72]"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {page.serviceFocus.map((item) => (
              <article
                key={item.title}
                className="rounded-sm border border-white/[0.12] bg-white/[0.04] p-5"
              >
                <Building2 className="text-amber-300" size={24} aria-hidden="true" />
                <h3 className="display-font mt-4 text-2xl uppercase text-white">{item.title}</h3>
                <p className="mt-2 text-base font-medium leading-6 text-white/[0.7]">{item.text}</p>
              </article>
            ))}

            <div className="rounded-sm border border-amber-400/30 bg-amber-500/10 p-5">
              <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-amber-300">
                Keyword Coverage
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {page.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-sm bg-stone-950/70 px-3 py-2 text-xs font-extrabold uppercase text-white/[0.74]"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="industrial-surface px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="display-font text-4xl uppercase text-white">Frequently Asked Questions</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {page.faqs.map((faq) => (
              <article key={faq.question} className="rounded-sm border border-white/[0.12] bg-stone-950/60 p-5">
                <h3 className="display-font text-2xl uppercase text-white">{faq.question}</h3>
                <p className="mt-3 text-base font-medium leading-6 text-white/[0.7]">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stone-950 px-5 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="display-font text-3xl uppercase text-white">Next Project Lanes</h2>
          <div className="mt-6">
            <InternalLinkRail links={page.internalLinks} />
          </div>
        </div>
      </section>
    </>
  );
}
