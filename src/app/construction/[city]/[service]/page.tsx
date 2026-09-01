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
import { hasCityHub } from "@/lib/cityHubs";

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

  /*
    Where a city hub exists, this page sits under it.

    The breadcrumb used to read Home › Construction › {City} with the {City}
    crumb pointing at *this* page — so the trail claimed a level of hierarchy
    the site did not have, and the city crumb was a self-link. Now that
    /construction/{city}/ exists for five cities, the trail is the real one and
    the leaf is the service. The other nine keep the previous two-level shape
    rather than linking to a page that does not exist.
  */
  const cityHubPath = `/construction/${page.city.slug}`;
  const underHub = hasCityHub(page.city.slug);

  const crumbs = underHub
    ? [
        { label: "Home", href: "/" },
        { label: "Construction", href: "/construction" },
        { label: page.city.city, href: cityHubPath },
        { label: page.service.name, href: page.path },
      ]
    : [
        { label: "Home", href: "/" },
        { label: "Construction", href: "/construction" },
        { label: page.city.city, href: page.path },
      ];

  /*
    A link up to the hub, first in the rail.

    Every link this template renders runs sideways — nine other services in the
    same city, plus /construction and the service hub. Nothing pointed at the
    city itself, because nothing was there to point at. Prepending rather than
    appending because "everything we do in this city" is the more useful
    destination than the ninth adjacent service.
  */
  const internalLinks = underHub
    ? [
        {
          label: `Commercial Contractors in ${page.city.city}`,
          href: cityHubPath,
          why: `Permits, delivered work and every service we run in ${page.city.city}.`,
        },
        ...page.internalLinks,
      ]
    : page.internalLinks;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
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
      <ExperienceBlock city={page.city} items={page.projects} vertical={page.service.vertical} />

      {/* 3 — The work that earns the trust. */}
      <ProjectProof
        items={page.projects}
        cityName={page.city.city}
        vertical={page.service.vertical}
      />

      {/* 4 — Reviews. */}
      <ReviewsBlock items={page.reviews} />

      {/* How the work runs here: planning, price, scope and focus in one section. */}
      <LocalDelivery page={page} />

      {/* 5 — Why these services: internal links that explain themselves. */}
      <WhyTheseServices links={internalLinks} cityName={page.city.city} />

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
