import {
  constructionServices,
  getProjectsForCity,
  getReviewsForCity,
  serviceAreas,
  type Project,
  type Review,
  type ServiceArea,
} from "@/lib/site";
import { serviceRates } from "@/lib/pricing";

/**
 * City hub pages — the page about the place, which the site did not have.
 *
 * The site had fourteen cities × ten services and nothing at `/construction/{city}/`.
 * That is a real hole rather than a tidiness complaint: the index page's own
 * card markup carried the comment "here it would point nowhere, because
 * /construction/{city}/ does not exist yet", so the city names on the one page
 * built to route people by city were not links.
 *
 * It also left a whole class of query homeless. "Commercial contractors
 * Vancouver" is a city-level, trade-generic search. The nearest page was
 * /construction/vancouver/commercial-construction/, whose H1 is "Commercial
 * Construction in Vancouver, BC" and whose job is a different question. A hub
 * answers "who builds commercial space in this city, and what is different
 * about building here" — then hands off to whichever of the ten services the
 * visitor actually wants.
 *
 * ── What stops this being a doorway page ──────────────────────────────────
 *
 * Google's scaled-content policy targets templated pages that differ only by a
 * swapped city name. The defence is that every hub carries something no
 * competitor can copy, and `checkCityHubStructure` in scripts/check-trust.mjs
 * makes that mechanical:
 *
 *   1. Municipal permit facts, each traceable to the municipality's own page,
 *      with the citations rendered. The hub is the only page on the site that
 *      renders `permits.authority`, `permits.pathway`, `permits.timeline` and
 *      `permits.sources` — until now those were carried in the data and shown
 *      to nobody.
 *   2. A per-city `angle` and `constraint`, written per city, never templated.
 *   3. Delivered local work with addresses, or nothing at all in that slot.
 *
 * A hub that cannot supply 1 and 2 does not get built. That is why this covers
 * five cities and not fourteen — the other nine have `NO_PERMIT_DATA` and no
 * written angle, so they would be exactly the templated page the policy targets.
 * A city graduates by gaining evidence, never by relaxing the gate.
 *
 * ── Copy rules, same as the landing pages ─────────────────────────────────
 *
 * At most two commas per sentence averaged over any field, and no field repeats
 * a sentence that already exists in src/lib/site.ts or src/lib/hubs.ts. The
 * similarity checker compares all pairs; moving duplication from city-vs-city
 * to hub-vs-city would only relocate the problem where the measurement is.
 */

/**
 * The five cities with enough of their own to carry a hub.
 *
 * Ordered by the brief: White Rock is the head office, then the four markets
 * with delivered work or measured demand behind them.
 */
export const CITY_HUB_SLUGS = [
  "white-rock",
  "surrey",
  "vancouver",
  "burnaby",
  "abbotsford",
] as const;

export type CityHubSlug = (typeof CITY_HUB_SLUGS)[number];

export type CityHub = {
  city: ServiceArea;
  path: string;
  title: string;
  description: string;
  /** Primary keyword first, the way the consultant's sheet is ordered. */
  keywords: string[];
  h1: string;
  /** Two or three sentences under the H1. Written per city. */
  lead: string;
  /**
   * The single fact about building here that a contractor who has not worked
   * the city could not write. Rendered as the answer-first paragraph.
   */
  angle: string;
  /** What that fact costs you in practice, if you get it wrong. */
  constraint: string;
  /** Why cost sits where it does here. Prose only — the band stays site-wide. */
  costRationale: string;
  /** Site-wide commercial band, for the figure beside the rationale. */
  costBand: string;
  services: Array<{ label: string; href: string; why: string }>;
  neighbours: Array<{ label: string; href: string; why: string }>;
  faqs: Array<{ question: string; answer: string }>;
  projects: Project[];
  reviews: Review[];
  heroImage: string;
  indexable: boolean;
};

/**
 * The hub's own opener, distinct from `city.heroIntro`.
 *
 * `heroIntro` already renders on all ten of that city's service pages, so
 * reusing it here would put an eleventh copy on the page whose job is to be
 * different from those ten. These lead with the permit route instead, because
 * that is what a city hub is for and what the service pages do not cover.
 */
const hubLead: Record<CityHubSlug, string> = {
  "white-rock":
    "Our office is on Foster Street, which puts most of the work on this page inside a ten-minute drive. White Rock is surrounded by Surrey but permits independently of it, through its own Building Division. An approval from the municipality next door carries no weight here.",
  surrey:
    "Surrey publishes what its own permit review actually takes, and it is the only municipality we work in that does. A medical clinic tenant improvement has its own category here with a three-week target, held separately from the general commercial queue. We have two clinics in progress in the city.",
  vancouver:
    "Vancouver is the only municipality in the region that does not build to the BC Building Code. It permits under its own Vancouver Building By-law, runs a separate tenant improvement stream for office space, and applies access rules that decide more of a downtown schedule than the trades do.",
  burnaby:
    "Almost every commercial suite in Burnaby sits underneath somebody's apartment, and the permit route forks before you get that far. A tenant improvement here goes to either a fast track or a full plan review, and a plan checker decides which. Which side you land on is largely set by what the space is going to be used for.",
  abbotsford:
    "Abbotsford treats a tenant improvement as its own permit category rather than folding it into a general commercial application. That changes the submission route rather than just the paperwork. We have delivered two projects here and both are photographed on this site.",
};

/**
 * The detail that separates a contractor who has built in this city from one
 * who has read its website. Each of these is sourced — see `permits.sources`
 * on the same city in src/lib/site.ts.
 */
const hubAngle: Record<CityHubSlug, string> = {
  "white-rock":
    "White Rock is a geographic enclave inside Surrey that runs its own Building Division, its own Zoning Bylaw and its own Official Community Plan. A use that is permitted on one side of the boundary can be refused on the other, and the boundary is not obvious from the street.",
  surrey:
    "Surrey splits tenant improvements into three streams rather than one. A Minor Tenant Improvement targets 3 business days, a Medical Clinic Tenant Improvement targets 3 weeks and a New Tenant Improvement targets 10 weeks. Which stream a job lands in is decided by a city building official on the scope of work, not by the applicant.",
  vancouver:
    "Vancouver's Tenant Improvement Program removes the development permit and expedites the field review for office tenants in eligible buildings. Any commercial office building permitted after 31 January 2007 is on that list automatically. It is an office programme, so a clinic fit-out does not qualify and runs the standard route.",
  burnaby:
    "Burnaby's own guide lists what disqualifies a tenant improvement from the fast track, and anything requiring Fraser Health Authority approval is on that list. Fraser Health approval is required before the building permit application for personal service establishments, which covers salons, esthetics, laser and skin care.",
  abbotsford:
    "Abbotsford issues Tenant Improvement Permits as a distinct application type, separate from the residential and complex-project streams. The city also publishes its building permit wait times apart from the application pages, so the current window is checkable at the point of application rather than assumed from a previous job.",
};

/** What the angle costs you if it is discovered late rather than planned for. */
const hubConstraint: Record<CityHubSlug, string> = {
  "white-rock":
    "The practical effect is that zoning has to be confirmed against White Rock's own bylaw before a lease is signed. Finding out afterwards that the use needs a rezoning is not a drawing revision, it is a different building.",
  surrey:
    "The practical effect is that scope decides schedule more than square footage does. A clinic fit-out kept inside the medical stream clears in about three weeks; the same work packaged as a general tenant improvement sits against a ten-week target instead.",
  vancouver:
    "The practical effect is that eligibility is worth checking before the lease. An office tenant in a post-2007 building skips a development permit entirely, and a tenant one building over does not.",
  burnaby:
    "The practical effect is that a med spa or salon needs Fraser Health sign-off in hand before the permit application goes in, and it will not fast track. Sequencing that approval after the building permit application is what turns a simple fit-out into a two-stage wait.",
  abbotsford:
    "The practical effect is that the application is assembled to the tenant improvement route from the start. A commercial package submitted through the wrong stream comes back, and the resubmission is the delay rather than the review.",
};

/**
 * Why cost sits where it does here.
 *
 * Deliberately not `city.costRationale`, which already renders on all ten of
 * that city's service pages. The numeric band stays site-wide and unchanged:
 * varying a per-square-foot range by city without a source would be inventing
 * the one number an owner actually acts on.
 */
const hubCost: Record<CityHubSlug, string> = {
  "white-rock":
    "There is no travel cost from our office and no downtown access premium. What moves a White Rock number is the building stock — small older units where a wall coming down reveals what the drawings did not show.",
  surrey:
    "Surrey prices at the lower-middle of the band. Newer base buildings mean fewer structural surprises than the older municipalities, and the drive from White Rock is short enough that it adds nothing to a job.",
  vancouver:
    "Vancouver sits at the top of the band and the reason is access rather than trades. Elevator bookings, loading windows and restricted work hours in mixed residential buildings add days that never appear on a drawing.",
  burnaby:
    "Burnaby prices closer to Vancouver than to the Fraser Valley. Podium space under occupied residential means restricted hours and strata coordination before the city is even involved.",
  abbotsford:
    "Abbotsford is usually the lowest-cost city on our range. Fraser Valley trade rates run below Metro Vancouver and most sites have straightforward access and parking. The offset is travel time from White Rock on larger jobs.",
};

/**
 * Why a visitor would click through to each service from this city.
 *
 * Keyed on the city as well as the service where the city genuinely changes the
 * answer, which is the whole argument for these pages existing. Everything else
 * falls back to the service's own `intent`, so a missing entry degrades to a
 * true sentence rather than a blank.
 */
const serviceWhy: Partial<Record<CityHubSlug, Partial<Record<string, string>>>> = {
  surrey: {
    "medical-clinic-construction":
      "Surrey reviews this under its own Medical Clinic Tenant Improvement stream, against a three-week target.",
    "dental-clinic-construction":
      "Runs through Surrey's clinic stream rather than the general commercial queue.",
    "clinic-renovation-contractor":
      "Clinic work here keeps its own permit category, which is the difference between three weeks and ten.",
  },
  vancouver: {
    "office-renovation-contractor":
      "Check the Tenant Improvement Program first — a post-2007 office building skips the development permit.",
    "commercial-renovation":
      "Downtown work is scheduled around loading and elevator access before it is scheduled around trades.",
    "luxury-residential-construction":
      "We delivered a residential build on West Cordova, so the downtown access problem is a known quantity.",
  },
  burnaby: {
    "healthcare-construction":
      "Fraser Health approval is required first here, and it removes the job from the fast track.",
    "clinic-renovation-contractor":
      "Plan the Fraser Health sign-off before the permit application, not after it.",
  },
  "white-rock": {
    "dental-clinic-construction":
      "The Shine Dental is ten minutes from the office and is photographed on this site.",
  },
  abbotsford: {
    "dental-clinic-construction":
      "The Marshall Road clinic is ours, delivered and photographed.",
    "healthcare-construction":
      "Skinholic Aesthetics is ours — a med spa interior delivered in the city.",
  },
};

/**
 * Neighbouring cities, with the reason to go there rather than stay here.
 *
 * These are the pairs that genuinely compete for one searcher. Stating which is
 * which settles it rather than leaving Google to pick between two near-equals,
 * which is the same treatment the White Rock and Surrey service pages already
 * give each other.
 */
const hubNeighbours: Record<CityHubSlug, Array<{ slug: string; why: string }>> = {
  "white-rock": [
    {
      slug: "surrey",
      why: "White Rock is an enclave inside Surrey with its own Building Division. If your address is off the peninsula it is a Surrey permit, not ours.",
    },
  ],
  surrey: [
    {
      slug: "white-rock",
      why: "White Rock permits separately despite being surrounded by Surrey, and our office is there.",
    },
    {
      slug: "abbotsford",
      why: "Further up the valley, where trade rates and site access both work in your favour.",
    },
  ],
  vancouver: [
    {
      slug: "burnaby",
      why: "The same podium-under-residential problem, one municipality east, with a different permit route.",
    },
  ],
  burnaby: [
    {
      slug: "vancouver",
      why: "Denser and older stock, and the only municipality that does not use the BC Building Code.",
    },
    {
      slug: "surrey",
      why: "Newer buildings and published permit timelines, if the address is south of the river.",
    },
  ],
  abbotsford: [
    {
      slug: "surrey",
      why: "Bigger corridors and a city that publishes what its permit review takes.",
    },
  ],
};

/** The commercial band, read from pricing.ts rather than restated here. */
function commercialBand() {
  const rate = serviceRates.find((item) => item.slug === "commercial-construction");
  return rate ? `$${rate.low}–$${rate.high} per sq ft` : "";
}

/**
 * A hub title that survives the SERP.
 *
 * Same measured 62-character threshold and the same two moves the city-service
 * titles use — drop to the short brand, then drop the "in" — so a long city
 * name loses the brand suffix rather than having it truncated by Google.
 */
function hubTitle(cityName: string): string {
  const variants = [
    `Commercial Contractors in ${cityName}, BC | Oberizon Construction`,
    `Commercial Contractors in ${cityName}, BC | Oberizon`,
    `Commercial Contractors ${cityName}, BC | Oberizon`,
  ];
  return variants.find((variant) => variant.length <= 62) ?? variants[variants.length - 1];
}

/**
 * The description, capped at Google's ~160 characters.
 *
 * Built from the city's own permit fact rather than a benefit phrase, because
 * that is the thing the page has and the competing pages do not.
 */
const hubDescription: Record<CityHubSlug, string> = {
  "white-rock":
    "Commercial contractors in White Rock, BC. Local office on Foster St, White Rock's own Building Division route, delivered clinic and office work. Free quotes.",
  surrey:
    "Commercial contractors in Surrey, BC — including Surrey's own Medical Clinic Tenant Improvement permit stream and its published review targets. Free quotes.",
  vancouver:
    "Commercial contractors in Vancouver, BC. Vancouver Building By-law, the Tenant Improvement Program for office tenants, and downtown access planning. Free quotes.",
  burnaby:
    "Commercial contractors in Burnaby, BC — fast track versus full plan review, Fraser Health approvals, and podium space under occupied residential. Free quotes.",
  abbotsford:
    "Commercial contractors in Abbotsford, BC, where tenant improvements are their own permit category. Two delivered projects in the city. Free quotes.",
};

/** The consultant's cluster shape: primary first, then the local variants. */
function hubKeywords(city: ServiceArea): string[] {
  return [
    `Commercial Contractors ${city.city}`,
    `commercial contractor ${city.city}`,
    `general contractor ${city.city}`,
    `commercial construction ${city.city}`,
    `tenant improvement contractor ${city.city}`,
  ];
}

/**
 * City-level questions, answered with a figure or a named authority.
 *
 * checkFaqSpecificity treats any question mentioning cost, timing or permits as
 * one that has to answer with a number or a named code. These are written to
 * that rule rather than around it.
 */
function hubFaqs(city: ServiceArea, slug: CityHubSlug): Array<{ question: string; answer: string }> {
  const permits = city.permits;
  const band = commercialBand();

  const permitAnswer = permits.authority
    ? `${permits.authority} issues it, reviewed against the ${permits.code ?? "BC Building Code"} and the city's own zoning. ${permits.pathway ?? ""}`.trim()
    : `${city.city} issues its own building permit and the route differs from neighbouring municipalities. We confirm the current requirements at the start of every job.`;

  const timingAnswer = permits.timeline
    ? `${city.city} publishes its own targets: ${permits.timeline}. The clock starts on a complete application rather than on the day it is handed in.`
    : `${city.city} does not publish a commercial review window, so we confirm the current one with the city at application rather than quoting a figure from a previous job. Budget 6 to 16 weeks for permits and 10 to 16 weeks on site for a 2,500 sq ft fit-out.`;

  return [
    {
      question: `Who issues the building permit in ${city.city}?`,
      answer: permitAnswer,
    },
    {
      question: `How long does a commercial permit take in ${city.city}?`,
      answer: timingAnswer,
    },
    {
      question: `What does commercial construction cost in ${city.city}?`,
      answer: `Commercial construction runs ${band} in 2026, and that band is the same across every city we work in. ${hubCost[slug]}`,
    },
    {
      question: `What makes building in ${city.city} different?`,
      answer: hubAngle[slug],
    },
    {
      question: `Does Oberizon work in ${city.city}?`,
      answer:
        getProjectsForCity(city.slug).length > 0
          ? `Yes. ${getProjectsForCity(city.slug)
              .map((project) => project.name)
              .join(", ")} — addresses and photographs are on this page. Every job is run from the White Rock office rather than handed to a local sub.`
          : `Yes, from the White Rock office, across ${city.regionNote}. ${city.evidenceNote ?? "Ask us for the nearest comparable job to yours."}`,
    },
  ];
}

/**
 * Hero image, taken off the city's own delivered work where there is some.
 *
 * Two things were wrong here. The fallback was hero-commercial.webp, a luxury
 * house, so every city hub without a delivered project opened on a villa. And
 * the "first local project" rule opened Vancouver on the West Cordova house,
 * because that is Vancouver's only delivered job — a hub whose headline offer
 * is clinic and commercial build-outs, led by a photograph of a home.
 *
 * Residential work is skipped for the hero specifically. It stays in the hub's
 * project list below, where it is proof of local delivery; it is just not the
 * first thing a clinic owner sees.
 */
function hubHeroImage(city: ServiceArea): string {
  const local = getProjectsForCity(city.slug).filter((project) => project.images?.length);
  const nonResidential = local.find((project) => project.vertical !== "Residential");
  return (
    nonResidential?.images?.[0] ?? "/oberizon/optimized/project-shine-dental-reception-live.jpg"
  );
}

export function getAllCityHubs(): CityHub[] {
  return CITY_HUB_SLUGS.map((slug) => {
    const city = serviceAreas.find((area) => area.slug === slug);
    if (!city) {
      throw new Error(`cityHubs: no serviceArea for "${slug}"`);
    }

    return {
      city,
      path: `/construction/${city.slug}`,
      title: hubTitle(city.city),
      description: hubDescription[slug],
      keywords: hubKeywords(city),
      h1: `Commercial Contractors in ${city.city}, BC`,
      lead: hubLead[slug],
      angle: hubAngle[slug],
      constraint: hubConstraint[slug],
      costRationale: hubCost[slug],
      costBand: commercialBand(),
      services: constructionServices.map((service) => ({
        label: service.name,
        href: `/construction/${city.slug}/${service.slug}`,
        why:
          serviceWhy[slug]?.[service.slug] ??
          `Choose this if you need to ${service.intent}.`,
      })),
      neighbours: hubNeighbours[slug].map((entry) => {
        const neighbour = serviceAreas.find((area) => area.slug === entry.slug);
        return {
          label: neighbour ? neighbour.city : entry.slug,
          href: `/construction/${entry.slug}`,
          why: entry.why,
        };
      }),
      faqs: hubFaqs(city, slug),
      projects: getProjectsForCity(city.slug),
      reviews: getReviewsForCity(city.slug, city.city),
      heroImage: hubHeroImage(city),
      // Every hub city is tier A or B by construction — the five were chosen on
      // having permit sources and a written angle, which is a strictly higher
      // bar than the tier gate. Kept as an expression rather than `true` so a
      // city demoted in site.ts stops indexing here too.
      indexable: city.tier !== "C",
    };
  });
}

export function getCityHub(slug: string): CityHub | undefined {
  return getAllCityHubs().find((hub) => hub.city.slug === slug);
}

/** Label and href only, for anything that needs the list without the bodies. */
export const cityHubLinks = CITY_HUB_SLUGS.map((slug) => {
  const city = serviceAreas.find((area) => area.slug === slug);
  return { slug, label: city?.city ?? slug, href: `/construction/${slug}` };
});

/** Does this city have a hub? Used by the index and the service pages to link up. */
export function hasCityHub(slug: string): boolean {
  return (CITY_HUB_SLUGS as readonly string[]).includes(slug);
}
