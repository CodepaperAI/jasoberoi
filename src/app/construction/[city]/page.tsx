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
import { CityCostContext, CityNeighbours } from "@/components/CityHubSections";
import { CityPermitBlock } from "@/components/CityPermitBlock";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, cityHubJsonLd, faqJsonLd } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { CITY_HUB_SLUGS, getCityHub } from "@/lib/cityHubs";

type CityHubProps = {
  params: Promise<{ city: string }>;
};

/**
 * The city hub: /construction/{city}/.
 *
 * A sibling of the [service] segment beneath it, not a layout — each is a leaf
 * page with its own metadata and its own generateStaticParams. Only the five
 * cities in CITY_HUB_SLUGS are generated, and `dynamicParams = false` means the
 * other nine 404 rather than rendering a hub with nothing in it. That is
 * deliberate: a hub without sourced permit facts and a written local angle is
 * exactly the templated city page Google's scaled-content policy targets, so
 * the absence of a page is the correct output until a city has the evidence.
 *
 * The route owns head output. buildMetadata emits the canonical and the robots
 * directive, and no component below renders a head element of its own.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return CITY_HUB_SLUGS.map((city) => ({ city }));
}

export async function generateMetadata({ params }: CityHubProps): Promise<Metadata> {
  const { city } = await params;
  const hub = getCityHub(city);

  if (!hub) {
    return {};
  }

  return buildMetadata({
    title: hub.title,
    description: hub.description,
    path: hub.path,
    image: hub.heroImage,
    keywords: hub.keywords,
    index: hub.indexable,
  });
}

export default async function CityHubRoute({ params }: CityHubProps) {
  const { city } = await params;
  const hub = getCityHub(city);

  if (!hub) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: "Construction", href: "/construction" },
          { label: hub.city.city, href: hub.path },
        ])}
      />
      <JsonLd data={cityHubJsonLd(hub)} />
      <JsonLd data={faqJsonLd(hub.faqs)} />

      {/* 1 — The keyword, verbatim, as the H1. */}
      <LandingHero
        eyebrow={`${hub.city.city}, BC`}
        heading={hub.h1}
        intro={hub.lead}
        image={hub.heroImage}
        evidenceNote={hub.city.evidenceNote}
        compact
      />

      {/* 2 — Experience, before any claim about this city in particular. */}
      <ExperienceBlock city={hub.city} items={hub.projects} />

      {/* 3 — The reason this page is allowed to exist: municipal permit facts
              with their citations, which no competitor page in this market
              carries. Placed high because it is the differentiated content. */}
      <CityPermitBlock hub={hub} />

      {/* 4 — Delivered work in this city, with addresses. Renders nothing where
              there is none rather than borrowing a job from a neighbour. */}
      <ProjectProof items={hub.projects} cityName={hub.city.city} />

      {/* 5 — Reviews, this city's first. */}
      <ReviewsBlock items={hub.reviews} />

      {/* 6 — Cost and the local market. */}
      <CityCostContext hub={hub} />

      {/* 7 — Down to the ten services, each with the reason to pick it. This is
              the link set the hub exists to carry; without it the page is an
              orphan competing with the very pages it should be gathering. */}
      <WhyTheseServices links={hub.services} cityName={hub.city.city} />

      {/* 8 — Sideways, to the cities that compete for the same searcher. */}
      <CityNeighbours hub={hub} />

      {/* 9 — FAQs, carrying the FAQPage schema. */}
      <LandingFaqs items={hub.faqs} heading="Frequently asked." />

      {/* 10 — The ask, last, once the page has earned it. */}
      <LandingCta
        heading={`Planning a commercial build in ${hub.city.city}?`}
        body="Before you sign a lease, commit to drawings or set an opening date, book a consultation and we will tell you what has to be planned before construction starts."
      />
    </>
  );
}
