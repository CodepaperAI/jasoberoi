export type NavItem = {
  label: string;
  href?: string;
  items?: Array<{ label: string; href: string }>;
};

export type Feature = {
  title: string;
  text: string;
};

export type SitePage = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  eyebrow: string;
  heading: string;
  subheading: string;
  heroImage: string;
  introTitle: string;
  intro: string;
  proof: string[];
  featureTitle: string;
  features: Feature[];
  cards?: Array<{ title: string; text: string; image?: string }>;
  canonicalPath: string;
};

export type ConstructionService = {
  name: string;
  slug: string;
  primaryKeyword: string;
  relatedKeywords: string[];
  vertical: "Healthcare" | "Commercial" | "Residential";
  intent: string;
  summary: string;
  scope: string[];
  proof: string[];
  image: string;
};

/**
 * Why a city page is allowed to ask Google to rank it.
 *
 * Strategy §5.2: "Build a page only where Oberizon can put something on it that
 * no competitor can put on theirs." A city with neither a delivered project nor
 * measured search demand has nothing to say that Seasons Contracting could not
 * also say — and Seasons draws one organic visit a month. Those pages stay live
 * and linkable but are excluded from the sitemap and marked noindex.
 *
 * A page graduates by gaining evidence, never by editing the gate.
 */
export type CityEvidence =
  /** A delivered or in-progress Oberizon project in this city. */
  | "project"
  /** No project yet, but measured Canadian search volume justifies the page (strategy §6.3). */
  | "measured-demand"
  /** Neither. Noindex until one of the above is true. */
  | "none";

export type ServiceArea = {
  city: string;
  slug: string;
  regionNote: string;
  neighborhoods: string[];
  localSignals: string;
  evidence: CityEvidence;
  /** Shown on the page when evidence is "measured-demand" — honest adjacent-market labelling. */
  evidenceNote?: string;
};

export type Project = {
  slug: string;
  name: string;
  /** Street address as recorded on the live site. */
  address: string;
  citySlug: string;
  vertical: ConstructionService["vertical"];
  discipline: string;
  status: "Delivered" | "In progress";
  /**
   * TODO(client): scope, timeline, photographs and the named challenge solved.
   * Strategy §7: "We built a dental clinic" ranks for nothing — the challenge is
   * what a practice owner searches for and remembers. Left undefined rather than
   * invented; scripts/check-trust.mjs reports each gap.
   */
  scope?: string;
  timeline?: string;
  challenge?: string;
  images?: string[];
};

export type Review = {
  author: string;
  role: string;
  /** TODO(client): confirm city for reviews that do not record one. */
  city?: string;
  /** TODO(client): confirm review dates — dated reviews convert materially better. */
  date?: string;
  /**
   * TODO(client): a real headshot, if the reviewer agrees to one. Left undefined
   * rather than filled with a stock portrait — a stranger's face against a named
   * testimonial invents a person. ReviewAvatar falls back to a person glyph.
   */
  image?: string;
  quote: string;
};

export type ConstructionPseoPage = {
  city: ServiceArea;
  service: ConstructionService;
  path: string;
  title: string;
  description: string;
  h1: string;
  keywords: string[];
  intro: string;
  quickFacts: string[];
  pricingBrief: string;
  localProof: string;
  marketContext: string;
  serviceFocus: Feature[];
  faqs: Array<{ question: string; answer: string }>;
  /** `why` explains what the linked page is for, so the rail reads as guidance rather than an SEO footer. */
  internalLinks: Array<{ label: string; href: string; why?: string }>;
  projects: Project[];
  reviews: Review[];
  /** False when the city has no project and no measured demand — page renders noindex. */
  indexable: boolean;
};

import { pricingSentence, ratesConfirmedByClient } from "@/lib/pricing";

const imageBase = "/oberizon/optimized";

export const siteConfig = {
  name: "Oberizon Construction",
  legalName: "Oberizon Construction",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.oberizonconstruction.ca",
  tagline: "Healthcare, commercial, and luxury construction managed from review to handover.",
  email: "jo@oberizon.ca",
  phone: "(604) 385-3770",
  phoneHref: "tel:+16043853770",
  address: "Suite 305, 1493 Foster St, White Rock, BC V4B 0C4",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=1493+Foster+St+305+White+Rock+BC",
  heroVideo: "https://jas-project.s3.ap-south-1.amazonaws.com/home-page-video.mp4",
  foundedYear: 2014,
  founderName: "Jas Oberoi",
  founderRole: "Founder & Principal",
  // TODO(client): confirm BC contractor licence + WorkSafeBC account number for public display.
  // Placeholder text is intentionally non-numeric so no false schema/citations leak until confirmed.
  licenceStatus: "BC-licensed general contractor",
  insuranceStatus: "Fully insured, WorkSafeBC registered",
  warranty: "2-5-10 Home Warranty on residential builds",
};

export const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/oberizon_construction" },
  { label: "Facebook", href: "https://www.facebook.com/Oberizon" },
  { label: "TikTok", href: "https://www.tiktok.com/@oberoi_construction" },
  { label: "YouTube", href: "https://www.youtube.com/channel/UCXnubLHaLMq3oBTR8w0ylUg" },
];

export const navigation: NavItem[] = [
  { label: "About Us", href: "/about" },
  {
    label: "Services",
    items: [
      { label: "Healthcare Construction", href: "/construction/white-rock/healthcare-construction" },
      { label: "Dental Clinic Construction", href: "/construction/white-rock/dental-clinic-construction" },
      { label: "Medical Clinic Construction", href: "/construction/white-rock/medical-clinic-construction" },
      { label: "Commercial Construction", href: "/construction/white-rock/commercial-construction" },
      { label: "Luxury Residential", href: "/construction/white-rock/luxury-residential-construction" },
      { label: "All Services", href: "/services" },
    ],
  },
  { label: "Projects", href: "/projects" },
  { label: "Service Areas", href: "/construction" },
  // Top level rather than buried under Services: it carries the cost calculator,
  // which is the only page on the site a visitor might arrive wanting to use.
  // Gated so nothing links to unconfirmed rates.
  ...(ratesConfirmedByClient ? [{ label: "Cost Guide", href: "/cost" }] : []),
  { label: "Contact", href: "/contact" },
];

/**
 * Footer resources.
 *
 * Linked unconditionally, deliberately separated from `ratesConfirmedByClient`.
 * Those are two different questions:
 *
 *   Can a visitor find this?      — yes, by client request
 *   Should Google rank it?        — not until the rates are confirmed
 *
 * So the footer link is live while the page stays noindex, out of the sitemap
 * and out of the main navigation. The residual risk is real and worth naming: a
 * visitor who reaches the calculator from here can generate a figure Oberizon
 * has not yet agreed to be held to.
 */
export const resourceLinks = [{ label: "2026 Cost Guide & Calculator", href: "/cost" }];


export const stats = [
  { value: "10+ Years", label: "Building across the Lower Mainland since 2014" },
  { value: "90 Days", label: "Featured dental clinic delivery window" },
  { value: "1 Team", label: "Planning, permits, trades, inspections, handover" },
];

export const trustItems = [
  "BC-licensed general contractor",
  "Fully insured, WorkSafeBC registered",
  "Planning before construction",
  "Permits and inspections managed",
  "Healthcare workflow coordination",
  "Senior oversight from review to handover",
];

export const credentials = [
  {
    label: "Licence",
    value: "BC-licensed general contractor",
  },
  {
    label: "Insurance",
    value: "Fully insured, WorkSafeBC registered",
  },
  {
    label: "Warranty",
    value: "2-5-10 Home Warranty on residential builds",
  },
  {
    label: "Established",
    value: "Building across the Lower Mainland since 2014",
  },
];

export const homePage = {
  title: "Medical, Dental & Commercial Construction BC | Oberizon Construction",
  description:
    "Oberizon Construction builds healthcare, commercial, dental, pharmacy, clinic, office, and luxury residential projects across White Rock and the Lower Mainland.",
  canonicalPath: "/",
  keywords: [
    "commercial construction",
    "commercial construction company",
    "commercial general contractor",
    "commercial builders",
    "healthcare construction",
    "healthcare construction company",
    "dental clinic construction",
    "medical clinic construction",
    "pharmacy construction",
    "commercial renovation",
    "office renovation contractor",
    "luxury residential construction",
    "Lower Mainland construction company",
  ],
};

export const constructionServices: ConstructionService[] = [
  {
    name: "Commercial Construction",
    slug: "commercial-construction",
    primaryKeyword: "commercial construction",
    relatedKeywords: [
      "commercial construction company",
      "commercial builders",
      "commercial general contractor",
      "commercial contractors Vancouver",
    ],
    vertical: "Commercial",
    intent: "hire a commercial construction company with clear scope, budget, and schedule control",
    summary:
      "Commercial spaces built around operations, access, finish quality, inspections, and business continuity.",
    scope: [
      "commercial build-outs and tenant improvements",
      "trade coordination and site sequencing",
      "scope, budget, schedule, and deficiency control",
    ],
    proof: ["Commercial interiors", "Office and retail", "Permit and trade coordination"],
    image: `${imageBase}/project-commercial-2.jpg`,
  },
  {
    name: "Commercial Renovation",
    slug: "commercial-renovation",
    primaryKeyword: "commercial renovation",
    relatedKeywords: [
      "commercial renovation contractor",
      "commercial office space renovation",
      "office renovation contractor",
      "commercial builders",
    ],
    vertical: "Commercial",
    intent: "renovate an active or upcoming business space without losing control of schedule or cost",
    summary:
      "Renovations planned around how the space needs to function before demolition, trades, and finishes begin.",
    scope: [
      "existing space review and scope mapping",
      "phased renovation planning",
      "finish, millwork, service, and handover coordination",
    ],
    proof: ["Commercial renovation", "Tenant improvements", "Operational planning"],
    image: `${imageBase}/project-office.jpg`,
  },
  {
    name: "Office Renovation Contractor",
    slug: "office-renovation-contractor",
    primaryKeyword: "office renovation contractor",
    relatedKeywords: [
      "office renovation contractor",
      "commercial office space renovation",
      "office contractor",
      "commercial general contractor",
    ],
    vertical: "Commercial",
    intent: "renovate or build an office that supports staff flow, client experience, and daily operation",
    summary:
      "Private offices and professional interiors built with layout, acoustic, finish, and workflow discipline.",
    scope: [
      "office layout and finish planning",
      "meeting rooms, reception, storage, and staff areas",
      "construction sequencing with minimal operational friction",
    ],
    proof: ["Private office builds", "Professional interiors", "Finish control"],
    image: `${imageBase}/project-office.jpg`,
  },
  {
    name: "Healthcare Construction",
    slug: "healthcare-construction",
    primaryKeyword: "healthcare construction",
    relatedKeywords: [
      "healthcare construction company",
      "healthcare facility construction",
      "healthcare general contractors",
      "healthcare contractors",
    ],
    vertical: "Healthcare",
    intent: "build a healthcare space where services, permits, patient flow, and handover cannot be improvised",
    summary:
      "Healthcare projects managed around compliance, equipment, service locations, patient flow, and operational readiness.",
    scope: [
      "clinical layout and service coordination",
      "equipment, millwork, plumbing, and electrical planning",
      "inspection, deficiency, and handover management",
    ],
    proof: ["Dental", "Medical", "Pharmacy", "Physio", "Med spa"],
    image: `${imageBase}/project-healthcare-3.jpg`,
  },
  {
    name: "Dental Clinic Construction",
    slug: "dental-clinic-construction",
    primaryKeyword: "dental clinic construction",
    relatedKeywords: [
      "dental office construction",
      "dental construction",
      "dental contractor",
      "dental office construction companies",
      "dental construction company",
      "dental builder",
      "dental clinic construction contractors",
      "dental clinic construction contractors near me",
    ],
    vertical: "Healthcare",
    intent: "build a dental clinic with operatories, sterilization, services, millwork, and equipment planned early",
    summary:
      "Dental clinic builds coordinated around operatories, sterilization, plumbing, electrical, cabinetry, and patient flow.",
    scope: [
      "operatory and sterilization coordination",
      "dental plumbing, electrical, equipment, and millwork planning",
      "inspection readiness and clean handover",
    ],
    proof: ["90-day dental build", "Operatories mapped", "Service locations coordinated"],
    image: `${imageBase}/dental-clinic.jpg`,
  },
  {
    name: "Dental Office Renovation",
    slug: "dental-office-renovation",
    primaryKeyword: "dental office renovation",
    relatedKeywords: [
      "dental office renovation",
      "dental office contractors near me",
      "dental contractor",
      "dental construction company",
    ],
    vertical: "Healthcare",
    intent: "renovate a dental office while protecting workflow, patient experience, and technical service requirements",
    summary:
      "Dental office renovations built around the realities of clinical workflow and technical service coordination.",
    scope: [
      "existing clinic review and renovation phasing",
      "operatory, sterilization, reception, and staff-area updates",
      "deficiency control before reopening or launch",
    ],
    proof: ["Dental offices", "Clinical flow", "Technical service planning"],
    image: `${imageBase}/project-dental-1.jpg`,
  },
  {
    name: "Medical Clinic Construction",
    slug: "medical-clinic-construction",
    primaryKeyword: "medical clinic construction",
    relatedKeywords: [
      "medical office construction",
      "medical construction company",
      "medical builder",
      "medical clinic contractor",
      "clinic contractors",
    ],
    vertical: "Healthcare",
    intent: "build a medical clinic with exam rooms, reception, services, privacy, and staff workflow coordinated",
    summary:
      "Medical clinics built around intake, exam rooms, staff circulation, patient comfort, and inspection readiness.",
    scope: [
      "exam room, reception, and support-area planning",
      "privacy, services, finishes, and daily-use details",
      "construction management through inspection and handover",
    ],
    proof: ["Medical office construction", "Clinic workflow", "Patient-facing interiors"],
    image: `${imageBase}/project-clinic-9.jpg`,
  },
  {
    name: "Pharmacy Construction",
    slug: "pharmacy-construction",
    primaryKeyword: "pharmacy construction",
    relatedKeywords: [
      "pharmacy construction",
      "healthcare construction",
      "healthcare facility construction",
      "commercial construction company",
    ],
    vertical: "Healthcare",
    intent: "build a pharmacy with customer flow, back-of-house function, storage, security, and handover clarity",
    summary:
      "Pharmacy construction planned around customer experience, dispensing workflow, storage, security, and inspection timing.",
    scope: [
      "retail, dispensing, storage, and staff-area planning",
      "millwork, services, accessibility, and security coordination",
      "construction sequence and launch handover",
    ],
    proof: ["Healthcare retail", "Pharmacy workflow", "Commercial finish control"],
    image: `${imageBase}/project-clinic-10.jpg`,
  },
  {
    name: "Clinic Renovation Contractor",
    slug: "clinic-renovation-contractor",
    primaryKeyword: "clinic renovation contractor",
    relatedKeywords: [
      "clinic renovation contractor",
      "clinic contractors",
      "healthcare contractors",
      "medical office construction",
    ],
    vertical: "Healthcare",
    intent: "renovate a healthcare clinic with service, schedule, staff, and patient impacts mapped before work starts",
    summary:
      "Clinic renovations planned around clinical continuity, infection-sensitive details, services, and final readiness.",
    scope: [
      "clinic assessment and phasing",
      "service, finish, equipment, and patient-flow coordination",
      "deficiency management and reopening support",
    ],
    proof: ["Clinics", "Med spas", "Physio", "Operational readiness"],
    image: `${imageBase}/project-med-spa.jpg`,
  },
  {
    name: "Luxury Residential Construction",
    slug: "luxury-residential-construction",
    primaryKeyword: "luxury residential construction",
    relatedKeywords: [
      "luxury residential construction",
      "luxury custom homes",
      "custom residential construction",
      "residential construction company",
    ],
    vertical: "Residential",
    intent: "build a high-end home with detail, finish, sequencing, and senior oversight managed tightly",
    summary:
      "Luxury residential projects controlled through planning, sequencing, finish standards, and clear owner communication.",
    scope: [
      "custom home planning and construction management",
      "finish, millwork, fixture, and detail coordination",
      "quality control through final walkthrough and handover",
    ],
    proof: ["Custom homes", "High-end finishes", "Senior oversight"],
    image: `${imageBase}/project-residential.jpg`,
  },
];

export const serviceAreas: ServiceArea[] = [
  {
    city: "White Rock",
    slug: "white-rock",
    regionNote: "White Rock and the Semiahmoo Peninsula",
    neighborhoods: ["Uptown White Rock", "Five Corners", "Marine Drive", "East Beach"],
    localSignals: "tight commercial footprints, healthcare demand, coastal retail, and high-finish residential expectations",
    evidence: "project",
  },
  {
    city: "Surrey",
    slug: "surrey",
    regionNote: "Surrey's growing commercial and healthcare corridors",
    neighborhoods: ["City Centre", "Guildford", "Fleetwood", "Newton"],
    localSignals: "population growth, healthcare access needs, transit-oriented commercial nodes, and tenant improvement activity",
    evidence: "project",
  },
  {
    city: "Vancouver",
    slug: "vancouver",
    regionNote: "Vancouver's dense healthcare and commercial market",
    neighborhoods: ["Mount Pleasant", "Kitsilano", "Cambie", "Downtown"],
    localSignals: "limited space, complex building coordination, strict schedules, and high finish standards",
    evidence: "project",
  },
  {
    city: "Burnaby",
    slug: "burnaby",
    regionNote: "Burnaby's central Lower Mainland business districts",
    neighborhoods: ["Metrotown", "Brentwood", "Lougheed", "Edmonds"],
    localSignals: "transit-linked growth, professional office demand, mixed-use buildings, and clinic build-out opportunities",
    evidence: "measured-demand",
    evidenceNote:
      "Burnaby is an adjacent market served from the White Rock office. Oberizon has not yet delivered a Burnaby project.",
  },
  {
    city: "Richmond",
    slug: "richmond",
    regionNote: "Richmond's commercial corridors and healthcare communities",
    neighborhoods: ["Brighouse", "Steveston", "Cambie", "Ironwood"],
    localSignals: "retail density, airport access, medical offices, and business parks with specialized improvement needs",
    evidence: "none",
  },
  {
    city: "Langley",
    slug: "langley",
    regionNote: "Langley City and the Township",
    neighborhoods: ["Willoughby", "Walnut Grove", "Murrayville", "Brookswood"],
    localSignals: "new residential growth, professional services expansion, healthcare demand, and custom home activity",
    evidence: "project",
  },
  {
    city: "Abbotsford",
    slug: "abbotsford",
    regionNote: "Abbotsford and the central Fraser Valley",
    neighborhoods: ["Historic Downtown", "Clearbrook", "McMillan", "Auguston"],
    localSignals: "Fraser Valley growth, clinic and pharmacy demand, industrial access, and value-focused commercial build-outs",
    evidence: "project",
  },
  {
    city: "Chilliwack",
    slug: "chilliwack",
    regionNote: "Chilliwack and the eastern Fraser Valley",
    neighborhoods: ["Downtown Chilliwack", "Sardis", "Promontory", "Vedder"],
    localSignals: "expanding residential communities, healthcare access needs, commercial renewal, and new service businesses",
    evidence: "none",
  },
  {
    city: "Coquitlam",
    slug: "coquitlam",
    regionNote: "Coquitlam and the northeast Metro Vancouver market",
    neighborhoods: ["Town Centre", "Austin Heights", "Burquitlam", "Maillardville"],
    localSignals: "mixed-use growth, clinic demand, strata commercial spaces, and office renovation opportunities",
    evidence: "none",
  },
  {
    city: "North Vancouver",
    slug: "north-vancouver",
    regionNote: "North Vancouver and the North Shore",
    neighborhoods: ["Lonsdale", "Marine Drive", "Edgemont", "Lynn Valley"],
    localSignals: "high-finish expectations, limited access windows, healthcare demand, and boutique commercial spaces",
    evidence: "measured-demand",
    evidenceNote:
      "North Vancouver is an adjacent market served from the White Rock office. Oberizon has not yet delivered a North Shore project.",
  },
  {
    city: "West Vancouver",
    slug: "west-vancouver",
    regionNote: "West Vancouver and premium North Shore properties",
    neighborhoods: ["Dundarave", "Ambleside", "Park Royal", "Caulfeild"],
    localSignals: "luxury residential expectations, boutique healthcare spaces, premium finishes, and careful site coordination",
    evidence: "none",
  },
  {
    city: "Delta",
    slug: "delta",
    regionNote: "Delta and the Ladner and Tsawwassen communities",
    neighborhoods: ["Tsawwassen", "Ladner", "North Delta", "Sunshine Hills"],
    localSignals: "family communities, medical and dental access, commercial renewal, and suburban service businesses",
    evidence: "none",
  },
  {
    city: "New Westminster",
    slug: "new-westminster",
    regionNote: "New Westminster's historic and high-density commercial areas",
    neighborhoods: ["Uptown", "Downtown", "Sapperton", "Queensborough"],
    localSignals: "older building conditions, healthcare tenancy, mixed-use projects, and tight urban construction sequencing",
    evidence: "none",
  },
  {
    city: "Tri-Cities",
    slug: "tri-cities",
    regionNote: "Coquitlam and the Port Moody corridor",
    neighborhoods: ["Port Moody", "Port Coquitlam", "Coquitlam Centre", "Burke Mountain"],
    localSignals: "rapid growth, family healthcare demand, strata commercial units, and service-business build-outs",
    evidence: "none",
  },
];

/**
 * Oberizon's delivered and in-progress builds, as recorded on the live site and
 * in the SEO strategy §4.5. Addresses and verticals are documented facts.
 *
 * Scope, timeline, challenge and photographs are deliberately absent rather than
 * invented — see the TODO on the Project type. Strategy §7 requires a named
 * challenge on every project page, and that has to come from the client.
 */
export const projects: Project[] = [
  {
    slug: "shine-dental-white-rock",
    name: "The Shine Dental",
    address: "White Rock, BC",
    citySlug: "white-rock",
    vertical: "Healthcare",
    discipline: "Dental clinic",
    status: "Delivered",
    images: [`${imageBase}/project-shine-dental-live.jpg`],
  },
  {
    slug: "private-office-white-rock",
    name: "Private office build",
    address: "White Rock, BC",
    citySlug: "white-rock",
    vertical: "Commercial",
    discipline: "Commercial office",
    status: "Delivered",
    images: [`${imageBase}/project-private-office-live.jpg`],
  },
  {
    slug: "dental-clinic-marshall-road-abbotsford",
    name: "Marshall Road dental clinic",
    address: "104-33069 Marshall Road, Abbotsford, BC",
    citySlug: "abbotsford",
    vertical: "Healthcare",
    discipline: "Dental clinic",
    status: "Delivered",
    images: [`${imageBase}/project-abby-dental-live.jpg`],
  },
  {
    // TODO(client): strategy §11 flags that Skinholic Aesthetics has no recorded
    // city on the site or in the research. Confirm before this appears on a city page.
    slug: "skinholic-aesthetics",
    name: "Skinholic Aesthetics",
    address: "Lower Mainland, BC",
    citySlug: "",
    vertical: "Healthcare",
    discipline: "Med spa",
    status: "Delivered",
    images: [`${imageBase}/project-med-spa.jpg`],
  },
  {
    // The Vancouver evidence referenced in the strategy's city-page table.
    slug: "west-cordova-residential-vancouver",
    name: "West Cordova residential build",
    address: "West Cordova, Vancouver, BC",
    citySlug: "vancouver",
    vertical: "Residential",
    discipline: "Luxury residential",
    status: "Delivered",
    images: [`${imageBase}/project-luxury-live.jpg`],
  },
  {
    slug: "pharmacy-156-st-surrey",
    name: "156 St pharmacy",
    address: "#1-2233 156 St, Surrey, BC",
    citySlug: "surrey",
    vertical: "Healthcare",
    discipline: "Pharmacy",
    status: "In progress",
  },
  {
    slug: "dental-clinic-whalley-blvd-surrey",
    name: "Whalley Blvd dental clinic",
    address: "#111-10767 Whalley Blvd, Surrey, BC",
    citySlug: "surrey",
    vertical: "Healthcare",
    discipline: "Dental clinic",
    status: "In progress",
  },
  {
    slug: "dental-clinic-b115-272-st-langley",
    name: "272 St dental clinic (B115)",
    address: "#B115-8100 272 St, Langley, BC",
    citySlug: "langley",
    vertical: "Healthcare",
    discipline: "Dental clinic",
    status: "In progress",
  },
  {
    slug: "dental-clinic-e100-272-st-langley",
    name: "272 St dental clinic (E100)",
    address: "#E100-8100 272 St, Langley, BC",
    citySlug: "langley",
    vertical: "Healthcare",
    discipline: "Dental clinic",
    status: "In progress",
  },
];

/**
 * Client reviews as published on the live site, corrected per the Fixes Brief §8
 * (the first quote referred to a "new office project" under a "What Clinic Owners
 * Say" heading, and spelled the company name in lower case).
 *
 * TODO(client): confirm review dates and the missing cities. Reviews carrying a
 * name, neighbourhood and date convert materially better than undated quotes.
 */
export const reviews: Review[] = [
  {
    author: "Dr. Kanwar",
    role: "Clinic Owner",
    quote:
      "Very impressed with Oberizon Construction and the way they handled our dental clinic build. The team managed everything from planning to execution, and the final result was exactly what we envisioned.",
  },
  {
    author: "Dr. Satpreet",
    role: "Clinic Owner",
    quote:
      "We hired Oberizon to build out our dental clinic and they did an amazing job. The place looks so clean and modern, exactly the look we were going for.",
  },
  {
    author: "Dr. Bradley",
    role: "Clinic Owner",
    city: "Richmond",
    quote:
      "Working with Oberizon on our dental clinic was a great experience from start to finish. Jas Oberoi and his team were professional, responsive, and genuinely invested in getting the details right.",
  },
];

/**
 * Projects to show on a landing page, nearest-first: the page's own city, then
 * any other delivered work. Returns only projects with a recorded city, so the
 * unconfirmed Skinholic entry never renders as local proof.
 */
export function getProjectsForCity(citySlug: string, limit = 3): Project[] {
  const located = projects.filter((project) => project.citySlug !== "");
  const local = located.filter((project) => project.citySlug === citySlug);
  const rest = located.filter((project) => project.citySlug !== citySlug);

  return [...local, ...rest].slice(0, limit);
}

export const mainPages: SitePage[] = [
  {
    slug: "about",
    title: "About Oberizon Construction | Trusted BC Builders",
    description:
      "Meet Oberizon Construction, a White Rock-based construction company managing healthcare, commercial, and luxury residential projects across the Lower Mainland.",
    keywords: ["Oberizon Construction", "construction company White Rock", "commercial builders BC"],
    eyebrow: "About Oberizon",
    heading: "A builder for spaces that cannot be improvised.",
    subheading:
      "Oberizon manages complex builds where planning, permits, services, trades, timelines, and finish quality need one accountable process.",
    heroImage: `${imageBase}/project-commercial-13.jpg`,
    introTitle: "Planning before construction gets loud.",
    intro:
      "From dental clinics and pharmacies to commercial interiors and luxury homes, Oberizon is built around the work that happens before the site gets busy: review, scope, services, sequencing, and handover.",
    proof: [
      "BC-licensed general contractor",
      "Fully insured, WorkSafeBC registered",
      "Building across the Lower Mainland since 2014",
      "White Rock HQ",
      "Healthcare and commercial focus",
    ],
    featureTitle: "How Oberizon works",
    features: [
      {
        title: "Review First",
        text: "The project, space, drawings, budget, timeline, and risk are reviewed before construction begins.",
      },
      {
        title: "One Managed Process",
        text: "Permits, trades, construction, inspections, deficiencies, and handover stay connected.",
      },
      {
        title: "Built Around Operations",
        text: "The finished space is planned around patients, staff, customers, equipment, and daily use.",
      },
    ],
    cards: [
      {
        title: "Healthcare",
        text: "Dental, medical, pharmacy, physio, and med spa projects with service and workflow control.",
        image: `${imageBase}/project-healthcare-4.jpg`,
      },
      {
        title: "Commercial",
        text: "Offices, retail spaces, and tenant improvements planned around business operations.",
        image: `${imageBase}/project-office.jpg`,
      },
      {
        title: "Residential",
        text: "Luxury residential construction with senior oversight and finish discipline.",
        image: `${imageBase}/project-residential.jpg`,
      },
    ],
    canonicalPath: "/about",
  },
  {
    slug: "services",
    title: "Construction Services in BC | Medical, Dental & Commercial",
    description:
      "Explore Oberizon Construction services for healthcare construction, dental clinics, medical clinics, pharmacy construction, commercial renovations, offices, and luxury homes.",
    keywords: ["construction services BC", "healthcare construction company", "commercial renovation contractor"],
    eyebrow: "Services",
    heading: "Construction services for complex spaces.",
    subheading:
      "Healthcare, commercial, and luxury residential projects need more than trades. They need a managed plan from review to handover.",
    heroImage: `${imageBase}/project-commercial-13.jpg`,
    introTitle: "End-to-end expertise. Exceptional outcomes.",
    intro:
      "Oberizon supports owners and operators through advisory, project management, construction solutions, equipment coordination, operational readiness, and move management.",
    proof: ["Advisory", "Project management", "Construction solutions", "Operational readiness"],
    featureTitle: "Service lanes",
    features: [
      {
        title: "Healthcare Builds",
        text: "Dental, medical, pharmacy, physio, and med spa spaces built around workflow and services.",
      },
      {
        title: "Commercial Interiors",
        text: "Offices, retail, and tenant improvements built around how the business operates.",
      },
      {
        title: "Luxury Residential",
        text: "Custom homes and high-end residential projects managed with finish control.",
      },
    ],
    cards: constructionServices.slice(0, 6).map((service) => ({
      title: service.name,
      text: service.summary,
      image: service.image,
    })),
    canonicalPath: "/services",
  },
  {
    slug: "projects",
    title: "Our Construction Projects | Oberizon Construction",
    description:
      "View selected Oberizon Construction projects including dental clinics, medical spa interiors, private offices, commercial interiors, and luxury residential construction.",
    keywords: ["construction projects BC", "dental clinic construction project", "commercial interior projects"],
    eyebrow: "Projects",
    heading: "Selected projects across the Lower Mainland.",
    subheading:
      "Healthcare, commercial, and residential projects where the planning shows up in the finished space.",
    heroImage: `${imageBase}/dental-clinic.jpg`,
    introTitle: "Built with structure from the beginning.",
    intro:
      "The strongest projects are not rescued at the end. They are set up early through layout, service locations, material flow, trade sequencing, inspections, and deficiency control.",
    proof: ["Dental clinic construction", "Commercial offices", "Med spa interiors", "Luxury residential"],
    featureTitle: "Recent work",
    features: [
      {
        title: "The Shine Dental",
        text: "Dental clinic construction with operatory, sterilization, and workflow coordination.",
      },
      {
        title: "Skinholic Aesthetics",
        text: "Medical spa interior built around client experience, treatment flow, and finish detail.",
      },
      {
        title: "Private Office",
        text: "Commercial office interior built for professional use and daily operation.",
      },
    ],
    cards: [
      {
        title: "The Shine Dental, White Rock",
        text: "Dental clinic construction with operatories, sterilization, workflow, and technical services coordinated.",
        image: `${imageBase}/dental-clinic.jpg`,
      },
      {
        title: "Skinholic Aesthetics",
        text: "Med spa interior built around treatment flow, client experience, privacy, and finish detail.",
        image: `${imageBase}/project-med-spa.jpg`,
      },
      {
        title: "Dental Clinic, Abbotsford",
        text: "Dental clinic build-out with clinical service coordination and clean handover.",
        image: `${imageBase}/project-clinic-9.jpg`,
      },
      {
        title: "Luxury Residential",
        text: "Custom residential construction with high-end finish planning and project control.",
        image: `${imageBase}/project-residential.jpg`,
      },
      {
        title: "Private Office, White Rock",
        text: "Commercial office interior built for professional use and daily operation.",
        image: `${imageBase}/project-office.jpg`,
      },
    ],
    canonicalPath: "/projects",
  },
  {
    slug: "contact",
    title: "Contact Oberizon Construction | Book a Free Consultation",
    description:
      "Contact Oberizon Construction in White Rock, BC to review a healthcare, dental, medical, pharmacy, commercial, office, or luxury residential construction project.",
    keywords: ["contact Oberizon Construction", "construction consultation White Rock", "commercial contractor consultation"],
    eyebrow: "Book a Consultation",
    heading: "Planning a clinic, commercial space, or luxury home?",
    subheading:
      "Book a consultation before you commit to a space, drawings, budget, or construction timeline.",
    heroImage: `${imageBase}/reception.jpg`,
    introTitle: "Book a consultation.",
    intro:
      "Oberizon will help you understand scope, permits, services, budget risks, schedule pressure, and what needs to be planned before construction starts.",
    proof: [siteConfig.phone, siteConfig.email, "Suite 305, 1493 Foster St"],
    featureTitle: "What to bring",
    features: [
      {
        title: "Project Type",
        text: "Dental, medical, pharmacy, commercial, office, clinic renovation, or luxury residential.",
      },
      {
        title: "Location",
        text: "The city, building type, lease stage, and any constraints you already know.",
      },
      {
        title: "Timeline",
        text: "Opening target, permit expectations, equipment timing, and decision deadlines.",
      },
    ],
    canonicalPath: "/contact",
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy | Oberizon Construction",
    description:
      "Read Oberizon Construction's privacy policy for website inquiries, consultation requests, and contact information handling.",
    keywords: ["Oberizon privacy policy"],
    eyebrow: "Privacy",
    heading: "Privacy Policy",
    subheading:
      "How website inquiries and contact details are handled when visitors request a construction consultation.",
    heroImage: `${imageBase}/hero-commercial.webp`,
    introTitle: "Information handling",
    intro:
      "Information submitted through the website is used to respond to project inquiries, provide requested construction guidance, and maintain communication.",
    proof: ["Contact information", "Project inquiry details", "Website analytics"],
    featureTitle: "Policy summary",
    features: [
      {
        title: "Collection",
        text: "The site may collect contact details, inquiry details, and standard analytics data.",
      },
      {
        title: "Use",
        text: "Information is used to respond to requests and improve the website experience.",
      },
      {
        title: "Choice",
        text: "Visitors can contact Oberizon to request updates or removal of submitted details.",
      },
    ],
    canonicalPath: "/privacy-policy",
  },
];

// Four steps, one sentence each. These were comma-strings of up to seven nouns —
// the same pattern that made the landing pages read as padded.
export const processSteps = [
  {
    number: "01",
    title: "Review",
    text: "We walk the space and price the risk before you commit to anything.",
  },
  {
    number: "02",
    title: "Plan",
    text: "Drawings and permits go in while equipment and long-lead items are ordered.",
  },
  {
    number: "03",
    title: "Build",
    text: "One site lead holds the trades and calls you with progress every week.",
  },
  {
    number: "04",
    title: "Handover",
    text: "Inspections cleared and the deficiency list closed before you take the keys.",
  },
];

/**
 * The five questions strategy §8 identifies as AI-search targets.
 *
 * Answered per the §8 Do/Don't table: a real number or named regulation inside
 * the first 50 words, never "costs vary depending on scope". AI systems cite
 * pages that answer directly and specifically; almost no BC contractor publishes
 * figures, and that reluctance is the opening.
 */
export const aiFaqs = [
  {
    question: "What is healthcare construction?",
    answer:
      "Build-outs for clinical spaces — dental, medical, pharmacy — governed by CSA Z8000 and IPAC infection-control barriers, not standard commercial code alone. Operatory clearances, suction and compressed-air runs, imaging shielding, and sterilization corridor separation all have to be planned before construction begins.",
  },
  {
    question: "How long does it take to build a dental clinic?",
    answer:
      "Typically 90–120 days from permit to handover for a standard operatory fit-out. Oberizon's fastest delivered project — a full clinic with five operatories — took exactly 90 days, because equipment and services were coordinated before demolition started.",
  },
  {
    question: "What permits are required for a medical clinic in BC?",
    answer:
      "Expect a building permit, mechanical and electrical trade permits, and an accessibility review under the BC Building Code. Fraser Health sign-off is typically required before occupancy, and strata or landlord approval is needed on most tenant improvements.",
  },
  {
    question: "What is the cost of building a pharmacy in British Columbia?",
    answer:
      "$180–$250 per square foot for a standard BC pharmacy build-out. A 1,500 sq ft pharmacy typically runs $270,000–$375,000, before dispensary security glazing and USP 795/797 compounding-room pressure cascades.",
  },
  {
    question: "What should you look for in a healthcare construction contractor?",
    answer:
      "Ask for three things: clinics actually delivered with addresses you can verify, a written per-square-foot range rather than 'it depends', and the name of the person who will run your site from permit to handover. Oberizon has built healthcare and commercial projects across the Lower Mainland since 2014.",
  },
];

export function getMainPage(slug: string) {
  return mainPages.find((page) => page.slug === slug);
}

export function getConstructionPage(citySlug: string, serviceSlug: string) {
  return getAllConstructionPages().find(
    (page) => page.city.slug === citySlug && page.service.slug === serviceSlug,
  );
}

/**
 * The one thing that is actually true of each build type, in a sentence.
 *
 * These open every landing page. The previous opener — "For owners searching for
 * {keyword}, Oberizon Construction brings a structured process before the site
 * gets busy" — was 49 words and nine commas that said nothing a competitor could
 * not also say. Leading with the real constraint is both better writing and the
 * §5.2 rule applied to prose: say the thing only someone who has built one knows.
 */
const serviceLead: Record<string, string> = {
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

/**
 * Keeps the first `count` comma-separated clauses of a string.
 *
 * Several `localSignals` entries are four-item noun strings. Rendered whole they
 * pushed sentences past four commas, which is most of why the pages read as
 * padded. The data stays complete; only the prose is trimmed.
 */
function firstClauses(text: string, count: number) {
  const parts = text.split(",").map((part) => part.replace(/^\s*and\s+/, "").trim());
  const kept = parts.slice(0, count);
  if (kept.length < 2) return kept[0];
  // Comma-join rather than "and"-join: several clauses contain their own "and"
  // ("clinic and pharmacy demand"), and joining those with another one produced
  // "Fraser Valley growth and clinic and pharmacy demand".
  return kept.join(", ");
}

export function getAllConstructionPages(): ConstructionPseoPage[] {
  return serviceAreas.flatMap((city) =>
    constructionServices.map((service) => {
      const path = `/construction/${city.slug}/${service.slug}`;
      const primary = `${service.primaryKeyword} in ${city.city}, BC`;
      const keywords = buildKeywordCluster(service, city);
      const pricing = buildPricingBrief(service);

      return {
        city,
        service,
        path,
        title: `${service.name} in ${city.city}, BC | Oberizon Construction`,
        description: `Need ${primary}? Oberizon Construction manages ${service.intent} across ${city.regionNote}.`,
        h1: `${service.name} in ${city.city}, BC`,
        keywords,
        intro: `${serviceLead[service.slug] ?? ""} We plan that before the site gets busy. Drawings, permits and trades are sequenced by one team out of White Rock.`.trim(),
        quickFacts: buildQuickFacts(service, city, pricing),
        pricingBrief: pricing,
        localProof: `Oberizon works across the Lower Mainland, including ${city.regionNote}. Every project is planned around site access, inspection windows and how the finished space has to run.`,
        marketContext: `${city.city} work is shaped by ${firstClauses(city.localSignals, 2)}. We use that to set scope and sequence before demolition starts.`,
        serviceFocus: buildServiceFocus(service),
        faqs: buildPseoFaqs(service, city, primary, pricing),
        internalLinks: [
          ...constructionServices
            .filter((item) => item.slug !== service.slug)
            .slice(0, 4)
            // No city in the label: the section heading above already says
            // "Also built in {city}", and repeating it six times wrapped the
            // longer labels onto two lines.
            .map((item) => ({
              label: item.name,
              href: `/construction/${city.slug}/${item.slug}`,
              why: `Choose this if you need to ${item.intent}.`,
            })),
          {
            label: "All service areas",
            href: "/construction",
            why: "Compare how Oberizon works across the Lower Mainland.",
          },
          ...(ratesConfirmedByClient
            ? [
                {
                  label: "Full 2026 cost guide",
                  href: `/cost?service=${service.slug}`,
                  why: "See per-square-foot ranges before you set a budget.",
                },
              ]
            : []),
        ],
        projects: getProjectsForCity(city.slug),
        reviews,
        indexable: city.evidence !== "none",
      };
    }),
  );
}

// Reads from src/lib/pricing.ts rather than restating the numbers. These strings
// used to be written out here by hand alongside another copy in app/cost/page.tsx,
// and the two had already drifted apart on pharmacy construction.
function buildPricingBrief(service: ConstructionService): string {
  return pricingSentence(service.slug);
}

function buildQuickFacts(
  service: ConstructionService,
  city: ServiceArea,
  pricing: string,
): string[] {
  const neighborhoodList = formatList(city.neighborhoods.slice(0, 3));

  // What each vertical is actually hard about. This replaces three near-identical
  // sentences that differed only in the word before "project neighborhoods".
  const constraint =
    service.vertical === "Healthcare"
      ? "Equipment, services and shielding are set before a single wall goes up. Getting that order wrong is what pushes an opening date."
      : service.vertical === "Commercial"
        ? "Tenant improvement timing is agreed with the landlord before demolition. Late approvals cost more days than any trade does."
        : "Finish schedules drive the sequence. Long-lead millwork and fixtures are ordered before framing is closed in.";

  // The detail a contractor who has actually built one would volunteer. This is
  // the §5.2 rule applied to the page body: content no competitor can copy
  // because they have not done the work.
  const technical =
    service.vertical === "Healthcare"
      ? "Operatory clearances and the sterilization corridor are set before millwork is ordered. Suction and compressed-air runs follow the chair layout, not the other way round. Imaging rooms need their shielding specified at drawing stage, because retrofitting lead is a demolition job."
      : service.vertical === "Commercial"
        ? "Base-building services rarely match what the drawings assume. We verify the electrical capacity and the make-up air before pricing, because discovering a shortfall after demolition is what turns a fixed price into a change order."
        : "Long-lead millwork and imported fixtures set the critical path. We order them against the framing schedule, so the trades are not waiting on a countertop.";

  return [
    `Oberizon delivers ${service.name.toLowerCase()} from a White Rock head office. Work runs across ${city.regionNote}.`,
    `2026 pricing is ${pricing.toLowerCase().replace(/\.$/, "")}. The final number moves with base-building condition and finish level.`,
    `${constraint} Projects here typically sit around ${neighborhoodList}.`,
    technical,
  ];
}

function buildPseoFaqs(
  service: ConstructionService,
  city: ServiceArea,
  primary: string,
  pricing: string,
) {
  return [
    {
      question: `Does Oberizon handle ${service.name.toLowerCase()} in ${city.city}?`,
      answer: `Yes. We run ${service.name.toLowerCase()} across the Lower Mainland from a White Rock head office, ${city.regionNote} included.`,
    },
    {
      question: `How much does ${service.primaryKeyword} cost in ${city.city}?`,
      answer: `${pricing}. Base-building condition and finish level move that number most. The full 2026 breakdown is in the cost guide at /cost.`,
    },
    {
      question: `What areas near ${city.city} does Oberizon serve for ${service.name.toLowerCase()}?`,
      answer: `Most conversations start around ${formatList(city.neighborhoods.slice(0, 3))}. We travel further when the scope justifies it.`,
    },
    {
      question: `What should I prepare before starting ${service.name.toLowerCase()} in ${city.city}?`,
      answer: `The address, your lease stage and a target opening date. Drawings and a budget range help. The more we know early, the tighter the feasibility comes back.`,
    },
    {
      question: `Can Oberizon review my ${city.city} space before I commit?`,
      answer: `Yes. A review finds the permit and service risks before you sign a lease or a design. That is the cheapest point to find them — a change after drawings are sealed costs weeks, not hours.`,
    },
  ];
}

function buildKeywordCluster(service: ConstructionService, city: ServiceArea) {
  return [
    `${service.primaryKeyword} in ${city.city}, BC`,
    `${city.city} ${service.primaryKeyword}`,
    ...service.relatedKeywords.map((keyword) => `${keyword} ${city.city}`),
    `${service.vertical.toLowerCase()} construction ${city.regionNote}`,
  ];
}

// No longer takes a city: these three cards describe how the work is run, which
// does not change between Surrey and Langley. Injecting the city name into each
// of them was part of what pushed one page to twelve mentions.
function buildServiceFocus(service: ConstructionService): Feature[] {
  const shared = [
    {
      title: "Project review",
      text: `We walk the space and price the risk before you commit to ${service.primaryKeyword}. Permits and services are the two that bite.`,
    },
    {
      title: "Managed execution",
      text: "One team holds the trades, the inspections and the deficiency list. You get one number to call.",
    },
  ];

  if (service.vertical === "Healthcare") {
    return [
      ...shared,
      {
        title: "Clinical workflow",
        text: "Operatory clearances, suction runs and sterilization separation are planned first. Patient and staff flow follow from them.",
      },
    ];
  }

  if (service.vertical === "Commercial") {
    return [
      ...shared,
      {
        title: "Business operation",
        text: "Reception, storage and customer flow are set against your opening date. The build is sequenced to protect it.",
      },
    ];
  }

  return [
    ...shared,
    {
      title: "Finish control",
      text: "Millwork and fixtures are long-lead items. They are ordered before framing closes, not after.",
    },
  ];
}

function formatList(items: string[]) {
  if (items.length <= 1) {
    return items.join("");
  }

  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

/**
 * Paths submitted in the XML sitemap.
 *
 * Every one of the 140 city × service pages is still built and still reachable —
 * only the ones without evidence are withheld from the sitemap and marked
 * noindex. Asking Google to rank a page that claims local expertise Oberizon
 * cannot demonstrate is the exact failure mode strategy §3.2 measures at
 * Seasons Contracting: ranked #1 on several queries, one organic visit a month.
 */
export const allStaticPaths = [
  "/",
  "/construction",
  // The cost guide carries the calculator, so it stays out of the sitemap until
  // the client has confirmed the ranges it generates. Same rule as the city
  // evidence gate: built and reachable, but not asking to rank yet.
  ...(ratesConfirmedByClient ? ["/cost"] : []),
  ...mainPages.map((page) => page.canonicalPath),
  ...getAllConstructionPages()
    .filter((page) => page.indexable)
    .map((page) => page.path),
];
