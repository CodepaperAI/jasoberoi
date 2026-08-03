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

      <section className="soft-grid relative overflow-hidden px-5 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-orange-600">
              {page.city.city} Construction
            </p>
            <h1 className="serif-font mt-5 break-words text-5xl leading-tight tracking-tight text-zinc-950 sm:text-6xl lg:text-7xl">
              {page.h1}
            </h1>
            <p className="mt-6 max-w-3xl text-xl font-medium leading-8 text-slate-600">
              {page.intro}
            </p>
            <ButtonLink href="/contact" className="mt-8">
              Book a Project Review
            </ButtonLink>
          </div>
          <div className="relative min-h-[480px] overflow-hidden rounded-[2rem] bg-zinc-900 shadow-2xl shadow-slate-900/12">
            <Image
              src={page.service.image}
              alt={`${page.h1} project image`}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-6 lg:px-8" aria-label="Quick facts">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-orange-600">
            Quick facts about {page.service.name.toLowerCase()} in {page.city.city}
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {page.quickFacts.map((fact) => (
              <p
                key={fact}
                className="rounded-3xl border border-orange-100 bg-orange-50/60 p-6 text-base font-medium leading-7 text-zinc-800"
              >
                {fact}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-orange-600">
              Local Planning
            </p>
            <h2 className="serif-font mt-4 text-4xl leading-tight text-zinc-950 sm:text-5xl">
              How does Oberizon plan {page.service.name.toLowerCase()} in {page.city.city}?
            </h2>
            <p className="mt-5 text-xl font-medium leading-8 text-slate-600">{page.localProof}</p>
          </div>
          <ScopeList items={page.service.scope} />
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-orange-600">
              Local scope
            </p>
            <h2 className="serif-font mt-4 text-4xl leading-tight text-zinc-950 sm:text-5xl">
              What&apos;s included in {page.service.name.toLowerCase()} in {page.city.city}?
            </h2>
            <p className="mt-5 text-xl font-medium leading-8 text-slate-600">
              {page.marketContext}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {page.city.neighborhoods.map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-zinc-700"
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
                className="live-card-shadow rounded-3xl bg-white p-6 ring-1 ring-slate-200"
              >
                <Building2 className="text-orange-600" size={24} aria-hidden="true" />
                <h3 className="mt-4 text-2xl font-bold text-zinc-950">{item.title}</h3>
                <p className="mt-2 text-base font-medium leading-7 text-slate-600">{item.text}</p>
              </article>
            ))}

            <div className="rounded-3xl border border-orange-200 bg-orange-50 p-6">
              <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-orange-700">
                Keyword Coverage
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {page.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full bg-white px-3 py-2 text-xs font-extrabold uppercase text-zinc-800 ring-1 ring-orange-100"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="serif-font text-4xl text-zinc-950">
            Frequently asked about {page.service.name.toLowerCase()} in {page.city.city}
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {page.faqs.map((faq) => (
              <article key={faq.question} className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
                <h3 className="text-2xl font-bold text-zinc-950">{faq.question}</h3>
                <p className="mt-3 text-base font-medium leading-7 text-slate-600">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="serif-font text-3xl text-zinc-950">Next Project Lanes</h2>
          <div className="mt-6">
            <InternalLinkRail links={page.internalLinks} />
          </div>
        </div>
      </section>
    </>
  );
}
