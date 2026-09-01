import { constructionServices, serviceAreas, type ConstructionService } from "@/lib/site";
import { formatMoney, getRate, pricingSentence, roundEstimate } from "@/lib/pricing";
import { serviceMeta } from "@/lib/seoCopy";

/**
 * Service hub pages — the missing middle of the funnel.
 *
 * Until now every money service existed only as fourteen city variants, so seven
 * indexable pages competed for "dental office renovation" and nothing
 * consolidated the topic. Internal links ran sideways: every link on the
 * Abbotsford page went to another Abbotsford page, because there was nothing
 * above it to link up to.
 *
 * A hub is the page for the *subject*. It answers the cost question first, shows
 * the work, then hands off to whichever of the fourteen cities the visitor
 * actually cares about.
 *
 * Copy here follows the same rules the landing pages do and the gate enforces:
 * at most two commas per sentence, and the city name is never in it, because a
 * hub is deliberately not about one city.
 */

export type ServiceHub = {
  service: ConstructionService;
  path: string;
  title: string;
  description: string;
  /** The consultant's keyword set, primary first. */
  keywords: string[];
  h1: string;
  /** Answer-first: the technical detail that separates us, below the price. */
  shortAnswer: string;
  /** The published range, one sentence. */
  priceLine: string;
  /** "$240,000 – $520,000" for the display figure. */
  typicalRange: string;
  /** The constraint that is true of this build type, opening the hero. */
  lead: string;
  faqs: Array<{ question: string; answer: string }>;
  cities: Array<{ label: string; href: string }>;
  siblings: Array<{ label: string; href: string; why?: string }>;
};

/** One sentence on what actually makes each build type hard. */
const hubLead: Record<string, string> = {
  "commercial-construction":
    "A commercial build is won or lost on the permit sequence, long before anyone breaks ground.",
  "commercial-renovation":
    "Renovating an occupied space means working around a business that still has to trade.",
  "office-renovation-contractor":
    "An office renovation runs while staff are still in the building.",
  "healthcare-construction":
    "Clinical space answers to CSA Z8000 and IPAC barriers, not standard commercial code alone.",
  "dental-clinic-construction":
    "A dental clinic is suction lines and plumbing long before it is finishes.",
  "dental-office-renovation":
    "Renovating a dental office means working around a live clinic that still has patients booked.",
  "medical-clinic-construction":
    "A medical clinic has to satisfy Fraser Health before it can open its doors.",
  "pharmacy-construction":
    "A pharmacy is a security and compounding problem wrapped inside a retail fit-out.",
  "clinic-renovation-contractor":
    "Renovating a working clinic means the practice keeps seeing patients throughout.",
  "luxury-residential-construction":
    "A custom home is a finish schedule with a house attached to it.",
};

/** The detail a contractor who has built one would volunteer, per strategy §5.2. */
const hubDetail: Record<string, string> = {
  "commercial-construction":
    "Base-building services rarely match what the drawings assume. We verify electrical capacity and make-up air before pricing.",
  "commercial-renovation":
    "Work is phased around trading hours. Noisy demolition happens when the space is empty, not when customers are in it.",
  "office-renovation-contractor":
    "Staff stay in the building, so the job runs in zones. Each zone is sealed, finished and handed back before the next one opens.",
  "healthcare-construction":
    "Operatory clearances, suction runs and sterilization separation are planned first. Patient and staff flow follow from them.",
  "dental-clinic-construction":
    "Chair positions fix the plumbing. Move a chair after the slab is poured and you are cutting concrete, not adjusting a drawing.",
  "dental-office-renovation":
    "The shutdown is planned before a wall is touched. Most clinics keep operating through the work, in phases.",
  "medical-clinic-construction":
    "Exam room count drives the mechanical load. Accessibility review under the BC Building Code happens before drawings are sealed.",
  "pharmacy-construction":
    "Dispensary sightlines and security glazing come first. USP 795/797 compounding rooms need pressure cascades designed in, not added.",
  "clinic-renovation-contractor":
    "Infection control barriers go up before demolition starts. The practice keeps its schedule and the dust stays on our side.",
  "luxury-residential-construction":
    "Millwork and imported fixtures set the critical path. They are ordered against the framing schedule, not after it.",
};

/** Two hub-level questions per service, on top of the two generated below. */
const hubQuestions: Record<string, Array<{ question: string; answer: string }>> = {
  "commercial-construction": [
    {
      question: "How long does a commercial build take?",
      answer:
        "Budget 6 to 16 weeks for permits, then 10 to 16 weeks on site for a 2,500 sq ft fit-out. Permit time varies more than construction time.",
    },
  ],
  "commercial-renovation": [
    {
      question: "Can we stay open during the renovation?",
      answer:
        "Usually yes. Work is phased and sealed by zone so the business keeps trading, which adds a little to the schedule and removes the cost of closing.",
    },
  ],
  "office-renovation-contractor": [
    {
      question: "Do staff have to move out?",
      answer:
        "Not normally. The floor is split into zones, each sealed and handed back finished before the next opens.",
    },
  ],
  "healthcare-construction": [
    {
      question: "What is healthcare construction?",
      answer:
        "Build-outs for clinical spaces governed by CSA Z8000 and IPAC infection-control barriers, not standard commercial code alone.",
    },
  ],
  "dental-clinic-construction": [
    {
      question: "How long does it take to build a dental clinic?",
      answer:
        "Typically 90 to 120 days from permit to handover for a standard operatory fit-out. Our fastest delivered clinic with five operatories took exactly 90 days.",
    },
    {
      question: "What does a dental office build-out include?",
      answer:
        "Suction and compressed air at every operatory, plumbing set to fixed chair positions and heavier electrical for imaging. HVAC follows CSA Z8000 and finishes come last.",
    },
  ],
  "dental-office-renovation": [
    {
      question: "Do we have to close the clinic?",
      answer:
        "Most clinics keep seeing patients. The work runs in phases behind sealed barriers, planned around your booking schedule.",
    },
  ],
  "medical-clinic-construction": [
    {
      question: "What permits are required for a medical clinic in BC?",
      answer:
        "A building permit, mechanical and electrical trade permits, and an accessibility review under the BC Building Code. Fraser Health sign-off is typically required before occupancy.",
    },
    {
      question: "What does a medical office build-out include?",
      answer:
        "Exam rooms sized to the mechanical load, accessible circulation under the BC Building Code and sealed finishes for infection control. Fraser Health reviews the result before occupancy.",
    },
  ],
  "pharmacy-construction": [
    {
      question: "What makes a pharmacy build different?",
      answer:
        "Security glazing and dispensary sightlines are designed in from the start. Compounding rooms need USP 795/797 pressure cascades, which cannot be retrofitted cheaply.",
    },
  ],
  "clinic-renovation-contractor": [
    {
      question: "How is infection control handled during renovation?",
      answer:
        "IPAC barriers go up before demolition. Negative pressure is maintained on our side so the practice keeps operating.",
    },
  ],
  "luxury-residential-construction": [
    {
      question: "How long does a custom home take?",
      answer:
        "Ten to fourteen months of construction for a 4,500 sq ft home, after design and permits. Long-lead millwork drives the critical path.",
    },
  ],
  "custom-home-building": [
    {
      question: "When do I have to have my finishes chosen?",
      answer:
        "Before framing completes. Stone, custom millwork and specialty glazing are ordered against framing dates, so a selection still open at drywall stops the site rather than the showroom.",
    },
  ],
  "home-renovation": [
    {
      question: "Can we stay in the house during the work?",
      answer:
        "Usually yes. The house is zoned and sealed so the rooms you cannot lose — a kitchen, a bathroom and a route between them — stay in use, and the noisy work is scheduled against that rather than around it.",
    },
  ],
};

function buildFaqs(service: ConstructionService) {
  const rate = getRate(service.slug);
  const specific = hubQuestions[service.slug] ?? [];

  const generated = [
    {
      question: `How much does ${service.primaryKeyword} cost?`,
      answer: rate
        ? `${pricingSentence(service.slug)}. Base-building condition and finish level move that number most.`
        : "Price varies by scope, finish level and site conditions.",
    },
    {
      question: `Where does Oberizon deliver ${service.primaryKeyword}?`,
      answer: `Across the Lower Mainland from a White Rock head office, covering ${serviceAreas.length} cities from White Rock out to Chilliwack.`,
    },
    {
      question: `What should I have ready before starting?`,
      answer:
        "The address, your lease stage and a target opening date. Drawings and a budget range help. The more we know early, the tighter the feasibility comes back.",
    },
  ];

  return [...specific, ...generated];
}

export function getServiceHub(slug: string): ServiceHub | undefined {
  const service = constructionServices.find((item) => item.slug === slug);
  if (!service) return undefined;

  const rate = getRate(slug);
  const typicalLow = rate ? formatMoney(roundEstimate(rate.low * rate.typicalSqFt)) : "";
  const typicalHigh = rate ? formatMoney(roundEstimate(rate.high * rate.typicalSqFt)) : "";

  return {
    service,
    path: `/services/${slug}`,
    // Consultant copy where it exists, template behind it. All ten services are
    // covered by the sheet today, so the fallback is only load-bearing if an
    // eleventh service is added before he supplies a row for it — at which point
    // a generated title beats a missing one.
    //
    // What the template produced was not wrong so much as too long: every one of
    // these descriptions ran 203-224 characters, so Google truncated all ten.
    title: serviceMeta[slug]?.title ?? `${service.name} in BC | Oberizon Construction`,
    description:
      serviceMeta[slug]?.description ??
      `${service.summary} Oberizon delivers ${service.primaryKeyword} across the Lower Mainland from a White Rock head office.`,
    keywords: serviceMeta[slug]?.keywords ?? [
      service.primaryKeyword,
      ...service.relatedKeywords,
    ],
    h1: service.name,
    lead: hubLead[slug] ?? service.summary,
    // pricingSentence already carries the typical total, so this does not repeat it.
    shortAnswer: hubDetail[slug] ?? service.summary,
    priceLine: rate ? `${pricingSentence(slug)}.` : "Price varies by scope and site conditions.",
    typicalRange: rate ? `${typicalLow} – ${typicalHigh}` : "",
    faqs: buildFaqs(service),
    // The link set that did not exist anywhere before: hub down to every spoke.
    cities: serviceAreas.map((area) => ({
      label: area.city,
      href: `/construction/${area.slug}/${slug}`,
    })),
    siblings: constructionServices
      .filter((item) => item.slug !== slug && item.vertical === service.vertical)
      .slice(0, 3)
      .concat(
        constructionServices.filter((item) => item.vertical !== service.vertical).slice(0, 2),
      )
      .map((item) => ({
        label: item.name,
        href: `/services/${item.slug}`,
        why: `Choose this if you need to ${item.intent}.`,
      })),
  };
}

export function getAllServiceHubs(): ServiceHub[] {
  return constructionServices
    .map((service) => getServiceHub(service.slug))
    .filter((hub): hub is ServiceHub => hub !== undefined);
}
