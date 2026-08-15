import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ExperienceBlock,
  LandingCta,
  LandingFaqs,
  LandingHero,
  ProjectProof,
  ReviewsBlock,
  WhyTheseServices,
} from "@/components/LandingSections";
import { JsonLd } from "@/components/JsonLd";
import { LocalDelivery } from "@/components/LocalDelivery";
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
    image: page.heroImage,
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
        image={page.heroImage}
        evidenceNote={page.city.evidenceNote}
        compact
      />

      {/* 2 — Experience. */}
      <ExperienceBlock city={page.city} items={page.projects} />

      {/* 3 — The work that earns the trust. */}
      <ProjectProof items={page.projects} cityName={page.city.city} />

      {/* 4 — Reviews. */}
      <ReviewsBlock items={page.reviews} />

      {/* How the work runs here: planning, price, scope and focus in one section. */}
      <LocalDelivery page={page} />

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
