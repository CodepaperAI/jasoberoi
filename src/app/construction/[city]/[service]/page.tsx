import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Building2 } from "lucide-react";
import {
  ExperienceBlock,
  LandingCta,
  LandingFaqs,
  LandingHero,
  ProjectProof,
  ReviewsBlock,
  WhyTheseServices,
} from "@/components/LandingSections";
import { ScopeList } from "@/components/SectionPrimitives";
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
  // Every city × service page is still built and still reachable. Only the
  // sitemap entry and the robots directive are gated on evidence.
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
    index: page.indexable,
  });
}

export default async function ConstructionRoute({ params }: ConstructionProps) {
  const { city, service } = await params;
  const page = getConstructionPage(city, service);

  if (!page) {
    notFound();
  }

  const serviceLabel = page.service.name.toLowerCase();

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

      {/* 1 — Keyword confirmation: the H1 is the target keyword verbatim. */}
      <LandingHero
        eyebrow={`${page.city.city} Construction`}
        heading={page.h1}
        intro={page.intro}
        image={page.service.image}
        evidenceNote={page.city.evidenceNote}
      />

      {/* 2 — Experience. */}
      <ExperienceBlock city={page.city} items={page.projects} />

      {/* 3 — The work that earns the trust. */}
      <ProjectProof items={page.projects} cityName={page.city.city} />

      {/* 4 — Reviews. */}
      <ReviewsBlock items={page.reviews} />

      {/* Scope detail: what the service actually covers in this city. */}
      <section className="bg-white px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-orange-600">
              Local planning
            </p>
            <h2 className="serif-font mt-4 text-4xl leading-tight text-zinc-950 sm:text-5xl">
              How does Oberizon plan {serviceLabel} in {page.city.city}?
            </h2>
            <p className="mt-5 text-xl font-medium leading-8 text-slate-600">{page.localProof}</p>
            <p className="mt-4 text-xl font-medium leading-8 text-slate-600">{page.marketContext}</p>

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
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-orange-600">
              What&apos;s included
            </p>
            <h2 className="serif-font mt-4 text-4xl leading-tight text-zinc-950 sm:text-5xl">
              Scope of {serviceLabel} in {page.city.city}.
            </h2>
            <p className="mt-5 text-xl font-medium leading-8 text-slate-600">{page.pricingBrief}.</p>
          </div>
          <ScopeList items={page.service.scope} />
        </div>
      </section>

      {/* 5 — Why these services: internal links that explain themselves. */}
      <WhyTheseServices links={page.internalLinks} cityName={page.city.city} />

      {/* 6 — FAQs. */}
      {/* The questions below already name the service and the city; repeating
          both in the heading pushed it onto two lines and added a fifth
          mention of the city to the page. */}
      <LandingFaqs items={page.faqs} heading="Frequently asked." />

      {/* 7 — The ask, once the page has earned it. */}
      <LandingCta
        heading={`Planning ${serviceLabel} in ${page.city.city}?`}
        body="Before you commit to a space, drawings, a budget, or a construction timeline, book a consultation and we will tell you what has to be planned before construction starts."
      />
    </>
  );
}
