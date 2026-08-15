import { pricingSentence, ratesConfirmedByClient } from "@/lib/pricing";
import { cityCommercialMeta, cityDescription, cityTitle } from "@/lib/seoCopy";

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

/**
 * How much unique substance a city page actually carries.
 *
 * `evidence` answers "may this page ask to rank"; `tier` answers "does it have
 * enough of its own to be worth reading". They are close but not the same, and
 * Richmond is why: no delivered project, so evidence is "none", but a named
 * client review and its own permit requirements — enough to stand up as B.
 *
 * A: delivered project with photography.
 * B: real local substance — a review, measured demand, sourced permit detail.
 * C: nothing yet that a competitor could not also write. noindex, follow.
 */
export type CityTier = "A" | "B" | "C";

/**
 * Municipal permit facts, each traceable to the municipality's own page.
 *
 * Every field is nullable and every populated field carries a source. This is a
 * licensed contractor's site: a wrong permit timeline is a liability long before
 * it is an SEO problem, so nothing here may be inferred, averaged or written
 * from memory. Null renders nothing and appears in NEEDS-VERIFICATION.md.
 *
 * `timeline` is null almost everywhere on purpose. BC municipalities publish
 * what a commercial application must contain; they do not publish how long
 * review takes. That gap is real and is Jas's to fill from experience.
 */
export type CityPermitInfo = {
  /** The municipality's own name for the department. */
  authority: string | null;
  /** The commercial / tenant-improvement pathway, as the municipality describes it. */
  pathway: string | null;
  /** Commercial review window. Null unless the municipality publishes one. */
  timeline: string | null;
  /** What is specific about building commercially here. Sourced, not inferred. */
  notes: string | null;
  /** Pages the above was read from. Required whenever any field is non-null. */
  sources: string[];
};

export type ServiceArea = {
  city: string;
  slug: string;
  regionNote: string;
  neighborhoods: string[];
  localSignals: string;
  evidence: CityEvidence;
  /** Shown on the page when evidence is "measured-demand" — honest adjacent-market labelling. */
  evidenceNote?: string;
  tier: CityTier;
  /** 2–3 sentences that open this city's pages. Written per city, not templated. */
  heroIntro: string | null;
  /** 3–4 sentences on the commercial and healthcare landscape here. */
  localContext: string | null;
  /**
   * Why this city's cost sits where it does. Prose only — the numeric range
   * stays single and site-wide until Jas confirms it. Varying a per-square-foot
   * band by city without a source would be inventing the one number an owner
   * actually acts on.
   */
  costRationale: string | null;
  permits: CityPermitInfo;
};

const NO_PERMIT_DATA: CityPermitInfo = {
  authority: null,
  pathway: null,
  timeline: null,
  notes: null,
  sources: [],
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
  /** Resolved per city × service so neighbouring pages do not open alike. */
  heroImage: string;
};


const imageBase = "/oberizon/optimized";

export const siteConfig = {
  name: "Oberizon Construction",
  legalName: "Oberizon Construction",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.oberizonconstruction.ca",
  tagline: "Healthcare, commercial, and luxury construction managed from review to handover.",
  email: "jo@oberizon.ca",
  phone: "(604) 385-3770",
  phoneHref: "tel:+16043853770",
  /**
   * WhatsApp is a separate line from the main office number, and it matters more
   * than it looks: the enquiry forms compose a mailto because the site is a
   * static export with no server to POST to, which silently loses any visitor
   * whose phone has no mail client configured. WhatsApp gives that visitor a
   * route that always works, so it sits beside every form rather than replacing
   * one. See the note in src/lib/contact.ts.
   *
   * wa.me wants the number in full international form with no punctuation.
   */
  whatsapp: "(778) 994-7450",
  whatsappHref:
    "https://wa.me/17789947450?text=" +
    encodeURIComponent("Hi Oberizon, I'd like to talk about a construction project."),
  address: "Suite 305, 1493 Foster St, White Rock, BC V4B 0C4",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=1493+Foster+St+305+White+Rock+BC",
  heroVideo: "https://jas-project.s3.ap-south-1.amazonaws.com/home-page-video.mp4",
  foundedYear: 2021,
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
export const resourceLinks = [
  { label: "2026 Cost Guide & Calculator", href: "/cost" },
  { label: "Construction Guides & Cost Breakdowns", href: "/blog" },
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
    // Interpolated, not typed. The hardcoded "since 2014" that used to sit here
    // survived the year change in siteConfig and contradicted the stats band.
    value: `Building across the Lower Mainland since ${siteConfig.foundedYear}`,
  },
];

export const homePage = {
  // Consultant copy. His note: "Commercial Construction" (bare term) is the
  // highest-volume keyword on the whole site at 1000/mo CA, so the title leads
  // with it. "Commercial Renovation" and "Healthcare Construction" are
  // deliberately kept off this page so it does not compete with their own hubs.
  title: "Commercial Construction Company in BC | Oberizon Construction",
  description:
    "Commercial construction company in White Rock & the Lower Mainland — healthcare, dental, medical, pharmacy, office & luxury residential builds. Free quotes.",
  canonicalPath: "/",
  keywords: [
    "Commercial Construction",
    "commercial construction company",
    "Commercial Builders",
    "commercial general contractor",
    "construction company Lower Mainland",
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

export const navigation: NavItem[] = [
  { label: "About Us", href: "/about" },
  {
    // Generated from the service list and pointed at the hubs. These five links
    // used to hardcode /construction/white-rock/*, so anyone in Abbotsford who
    // opened the Services menu landed on a White Rock page.
    label: "Services",
    items: [
      ...constructionServices
        .slice(0, 6)
        .map((service) => ({ label: service.name, href: `/services/${service.slug}` })),
      { label: "All Services", href: "/services" },
    ],
  },
  { label: "Projects", href: "/projects" },
  { label: "Service Areas", href: "/construction" },
  // Eleven posts shipped with nothing linking to them, so the only way in was
  // typing the URL. A page reachable solely from the sitemap gets crawled and
  // never read, and Google discounts a section the site itself does not link to.
  { label: "Guides", href: "/blog" },
  // Top level rather than buried under Services: it carries the cost calculator,
  // which is the only page on the site a visitor might arrive wanting to use.
  // Gated so nothing links to unconfirmed rates.
  ...(ratesConfirmedByClient ? [{ label: "Cost Guide", href: "/cost" }] : []),
  { label: "Contact", href: "/contact" },
];

export const serviceAreas: ServiceArea[] = [
  {
    city: "White Rock",
    slug: "white-rock",
    regionNote: "White Rock and the Semiahmoo Peninsula",
    neighborhoods: ["Uptown White Rock", "Five Corners", "Marine Drive", "East Beach"],
    localSignals: "tight commercial footprints, healthcare demand, coastal retail, and high-finish residential expectations",
    evidence: "project",
    tier: "A",
    heroIntro:
      "Our office is in White Rock, which means a site visit here costs you a phone call rather than a scheduled trip. The commercial stock on and around Marine Drive and Five Corners is small-footprint and largely older, so the constraint is rarely the design — it is what the building will actually support once a wall comes down.",
    localContext:
      "White Rock's commercial space is concentrated in the uptown blocks around Johnston Road and Five Corners, with the Marine Drive strip running retail and hospitality. It is a compact market with an older population, which is why dental, denture, physiotherapy and optometry practices take up so much of the professional tenancy. Units are small and often sit above or behind retail, so servicing and access are the first questions, not the last. The city is geographically enclaved within Surrey but permits separately, under its own Building Division.",
    costRationale:
      "White Rock sits at the middle of the range: no travel cost from our office, but the older small-footprint stock means base-building surprises are more common than in newer buildings.",
    permits: {
      authority: "City of White Rock Building Division",
      pathway:
        "White Rock issues a distinct Commercial Tenant Improvement permit, separate from the residential stream.",
      timeline: null,
      notes:
        "White Rock permits independently of Surrey despite being surrounded by it — a Surrey approval carries no weight here. The Building Division reviews against the City's Zoning Bylaw and Official Community Plan as well as the provincial construction regulations, so a use that is permitted in a neighbouring municipality still has to clear White Rock's own zoning.",
      sources: ["https://www.whiterockcity.ca/941/Building-Permits"],
    },
  },
  {
    city: "Surrey",
    slug: "surrey",
    regionNote: "Surrey's growing commercial and healthcare corridors",
    neighborhoods: ["City Centre", "Guildford", "Fleetwood", "Newton"],
    localSignals: "population growth, healthcare access needs, transit-oriented commercial nodes, and tenant improvement activity",
    evidence: "project",
    tier: "A",
    heroIntro:
      "We have two clinics in progress in Surrey right now — a pharmacy on 156 Street and a dental build on Whalley Boulevard. Surrey is a different problem from the smaller municipalities around it: the corridors are newer, the buildings are bigger, and the approval path runs through a city that processes a very high volume of commercial applications.",
    localContext:
      "Surrey's commercial activity spreads across several distinct centres rather than one downtown — City Centre around Whalley and King George, Guildford, Fleetwood and Newton each carry their own professional and retail tenancy. Much of the healthcare space is in newer mixed-use and strata buildings, which usually means better base-building services than the older Fraser Valley stock but tighter strata rules about noise, hours and shared systems. The city has been adding population faster than almost anywhere in the province, and clinic demand has followed it into the suburban centres rather than staying downtown.",
    costRationale:
      "Surrey generally prices at the lower-middle of the range: newer base buildings mean fewer structural surprises, and there is no travel premium from White Rock.",
    permits: NO_PERMIT_DATA,
  },
  {
    city: "Vancouver",
    slug: "vancouver",
    regionNote: "Vancouver's dense healthcare and commercial market",
    neighborhoods: ["Mount Pleasant", "Kitsilano", "Cambie", "Downtown"],
    localSignals: "limited space, complex building coordination, strict schedules, and high finish standards",
    evidence: "project",
    tier: "A",
    heroIntro:
      "We delivered a residential project on West Cordova, so we know what a downtown Vancouver build actually costs in coordination time. The work here is rarely about the trades — it is about elevator bookings, loading bay windows, strata approvals and the fact that nothing arrives on site whenever it is convenient.",
    localContext:
      "Vancouver's professional and clinical tenancy is spread thin across the city — Cambie and Mount Pleasant carry a lot of the medical and dental space, Kitsilano and the West Side run smaller practices, and downtown is mostly office and retail. Buildings are older and denser than anywhere else in the region, and a large share of commercial space is strata-owned, which adds an approval layer before the city is even involved. Access is the recurring cost: limited loading, restricted work hours in mixed residential buildings, and material handling that has to be scheduled rather than assumed.",
    costRationale:
      "Vancouver sits at the top of the range. Access restrictions, strata coordination and older base buildings add time that does not show up on a drawing, and trade rates downtown run higher than the Fraser Valley.",
    permits: NO_PERMIT_DATA,
  },
  {
    city: "Burnaby",
    slug: "burnaby",
    regionNote: "Burnaby's central Lower Mainland business districts",
    neighborhoods: ["Metrotown", "Brentwood", "Lougheed", "Edmonds"],
    localSignals: "transit-linked growth, professional office demand, mixed-use buildings, and clinic build-out opportunities",
    evidence: "measured-demand",
    evidenceNote:
      "No Burnaby project on the books yet. The tower-podium buildings described here are ones we work in elsewhere in the region.",
    tier: "B",
    heroIntro:
      "Almost every commercial suite in Burnaby sits underneath somebody's apartment. That single fact governs the work here: restricted hours, strata approval before the city sees anything, and mechanical routing that has to respect the floors above. We have not delivered a Burnaby project yet, and would rather say so than imply a local record we do not have.",
    localContext:
      "Burnaby's commercial space clusters around four town centres rather than a single core, and the newer supply at Metrotown, Brentwood and Lougheed is largely podium retail and professional space beneath residential towers. That building type dictates most of the work: shared services, strata rules, and mechanical routing that has to respect the residential floors above. Older stock around Edmonds and Hastings runs smaller and closer to the Vancouver pattern. The clinic demand here is steady rather than spiking, tied to the residential density arriving with each tower completion.",
    costRationale:
      "Burnaby prices near Vancouver rather than the Fraser Valley: podium space under occupied residential means restricted hours and more coordination than a standalone building.",
    permits: NO_PERMIT_DATA,
  },
  {
    city: "Richmond",
    slug: "richmond",
    regionNote: "Richmond's commercial corridors and healthcare communities",
    neighborhoods: ["Brighouse", "Steveston", "Cambie", "Ironwood"],
    localSignals: "retail density, airport access, medical offices, and business parks with specialized improvement needs",
    evidence: "none",
    // Indexed at B on the strength of a named client review and Richmond's own
    // published commercial requirements — not on a project, which there is not
    // one of. If the unattributed Kanwarveer clinic turns out to be Richmond,
    // this becomes an A. See NEEDS-VERIFICATION.md.
    tier: "B",
    heroIntro:
      "Richmond is the one municipality in the region that publishes exactly what a commercial application has to contain before it will be accepted at all. That is useful, and it changes how we prepare a Richmond submission: the drawing set is assembled to their list first, because an incomplete package is not queued, it is refused.",
    localContext:
      "Richmond's commercial space runs from the Brighouse city centre through the Ironwood and Bridgeport business parks out to the older Steveston village stock, and the mix is unusually varied for one municipality. A large share of the medical and dental tenancy sits in mid-rise professional buildings around No. 3 Road, while the business parks carry the light-industrial and lab-adjacent work. Much of the city is built on delta soil, which is why structural changes get engineering attention earlier here than in most Lower Mainland municipalities.",
    costRationale:
      "Richmond sits mid-range. The documentation bar is higher than average, which front-loads drawing cost, but the newer No. 3 Road stock is generally straightforward once approved.",
    permits: {
      authority: "City of Richmond — Building Approvals",
      pathway:
        "Commercial applications are submitted through the MyPermit portal and are assessed against a published document checklist.",
      timeline: null,
      notes:
        "Richmond will not accept an incomplete commercial application — its own guidance states that applications require all documentation and drawings listed on the form, and that incomplete applications will not be accepted. The commercial set has to include a site plan showing the whole building and the tenant location, a dimensioned floor plan with exits and fire separations, and a plumbing layout sized to the current BC Plumbing Code. Where exterior alterations are involved and the property sits in a development permit area, a Development Permit may be required before the building permit.",
      sources: [
        "https://www.richmond.ca/business-development/building-approvals/permits.htm",
        "https://www.richmond.ca/business-development/e-plan/mypermit.htm",
      ],
    },
  },
  {
    city: "Langley",
    slug: "langley",
    regionNote: "Langley City and the Township",
    neighborhoods: ["Willoughby", "Walnut Grove", "Murrayville", "Brookswood"],
    localSignals: "new residential growth, professional services expansion, healthcare demand, and custom home activity",
    evidence: "project",
    tier: "A",
    heroIntro:
      "We have two dental builds in progress on 272 Street in Langley, in the same complex. Langley splits into the City and the Township, and which one your address falls in decides who reviews the permit — a distinction that catches people out more often than any technical detail on the drawings.",
    localContext:
      "Langley's professional space has followed its residential growth outward, so much of the newer clinic and office tenancy sits in Willoughby and along the 200 Street corridor rather than in the older City core. A lot of it is recent construction in mixed-use or standalone commercial buildings, which generally means adequate base-building services and fewer structural surprises than the older municipalities. Walnut Grove, Murrayville and Brookswood carry smaller neighbourhood practices. The market skews toward family healthcare — dental, medical and pharmacy — tracking the young families that have driven the area's growth.",
    costRationale:
      "Langley prices at the lower-middle of the range: newer buildings, straightforward access, and a short trip from White Rock keep coordination cost down.",
    permits: NO_PERMIT_DATA,
  },
  {
    city: "Abbotsford",
    slug: "abbotsford",
    regionNote: "Abbotsford and the central Fraser Valley",
    neighborhoods: ["Historic Downtown", "Clearbrook", "McMillan", "Auguston"],
    localSignals: "Fraser Valley growth, clinic and pharmacy demand, industrial access, and value-focused commercial build-outs",
    evidence: "project",
    tier: "A",
    heroIntro:
      "We have delivered two projects in Abbotsford — a dental clinic on Marshall Road and the Skinholic Aesthetics interior — and both are photographed on this site. Abbotsford runs its permits through Planning and Development Services, and tenant improvements are a defined permit category here rather than something folded into the general commercial stream.",
    localContext:
      "Abbotsford's commercial base is split between the historic downtown, the Clearbrook and McMillan corridors, and a substantial industrial and agricultural-processing sector that most Lower Mainland municipalities do not have. Healthcare tenancy concentrates near Abbotsford Regional Hospital and along the main arterials, with clinic and pharmacy demand tracking the city's steady residential growth. Building stock is a genuine mix — mid-century commercial downtown alongside newer suburban construction — so the base-building condition varies more here than in a newer municipality, and it is the thing worth checking before pricing.",
    costRationale:
      "Abbotsford is typically the lowest-cost city on our range: trade rates in the Fraser Valley run below Metro Vancouver and most sites have straightforward access and parking. The offset is travel time from White Rock on larger jobs.",
    permits: {
      authority: "City of Abbotsford — Planning and Development Services",
      pathway:
        "Abbotsford treats Tenant Improvement Permits as a distinct permit category, separate from the residential and complex-project streams.",
      timeline: null,
      notes:
        "Tenant improvements are their own application type in Abbotsford rather than a subset of a general commercial permit, so the submission route differs from a new-build. The city publishes building permit wait times separately from the application pages, which is worth checking at the point of application rather than assumed from a previous job.",
      sources: [
        "https://www.abbotsford.ca/buildingpermits",
        "https://www.abbotsford.ca/permits",
      ],
    },
  },
  {
    city: "Chilliwack",
    slug: "chilliwack",
    regionNote: "Chilliwack and the eastern Fraser Valley",
    neighborhoods: ["Downtown Chilliwack", "Sardis", "Promontory", "Vedder"],
    localSignals: "expanding residential communities, healthcare access needs, commercial renewal, and new service businesses",
        evidence: "none",
    // Tier C: no delivered project, no measured demand, and no sourced permit
    // detail yet. Built and linkable, but noindex — a page that says only what
    // a competitor could also say is the failure mode strategy 3.2 measures.
    tier: "C",
    heroIntro: null,
    localContext: null,
    costRationale: null,
    permits: NO_PERMIT_DATA,
  },
  {
    city: "Coquitlam",
    slug: "coquitlam",
    regionNote: "Coquitlam and the northeast Metro Vancouver market",
    neighborhoods: ["Town Centre", "Austin Heights", "Burquitlam", "Maillardville"],
    localSignals: "mixed-use growth, clinic demand, strata commercial spaces, and office renovation opportunities",
        evidence: "none",
    // Tier C: no delivered project, no measured demand, and no sourced permit
    // detail yet. Built and linkable, but noindex — a page that says only what
    // a competitor could also say is the failure mode strategy 3.2 measures.
    tier: "C",
    heroIntro: null,
    localContext: null,
    costRationale: null,
    permits: NO_PERMIT_DATA,
  },
  {
    city: "North Vancouver",
    slug: "north-vancouver",
    regionNote: "North Vancouver and the North Shore",
    neighborhoods: ["Lonsdale", "Marine Drive", "Edgemont", "Lynn Valley"],
    localSignals: "high-finish expectations, limited access windows, healthcare demand, and boutique commercial spaces",
    evidence: "measured-demand",
    evidenceNote:
      "No North Shore project on the books yet. What follows comes from clinics and offices built to the same standards on the other side of the bridges.",
    tier: "B",
    heroIntro:
      "Two bridges decide the schedule on the North Shore. Every delivery, trade call and inspection is booked around them, and on a fixed price that cost belongs in the number rather than turning up later as a change order. We have not delivered a North Shore project yet; this is what we would plan for if you asked us to.",
    localContext:
      "North Vancouver's commercial space runs along Lonsdale from the waterfront up through Central Lonsdale, with Edgemont and Lynn Valley carrying smaller neighbourhood tenancy. The Lower Lonsdale redevelopment has added newer podium commercial space, while Central Lonsdale professional buildings house much of the medical and dental practice. Finish expectations run high across the North Shore, and site access is genuinely tighter than in the suburbs — narrow lots, steep grades and limited staging area are normal rather than exceptional.",
    costRationale:
      "The North Shore carries a travel and access premium: bridge-dependent scheduling, constrained sites and higher finish expectations all push toward the upper half of the range.",
    permits: NO_PERMIT_DATA,
  },
  {
    city: "West Vancouver",
    slug: "west-vancouver",
    regionNote: "West Vancouver and premium North Shore properties",
    neighborhoods: ["Dundarave", "Ambleside", "Park Royal", "Caulfeild"],
    localSignals: "luxury residential expectations, boutique healthcare spaces, premium finishes, and careful site coordination",
        evidence: "none",
    // Tier C: no delivered project, no measured demand, and no sourced permit
    // detail yet. Built and linkable, but noindex — a page that says only what
    // a competitor could also say is the failure mode strategy 3.2 measures.
    tier: "C",
    heroIntro: null,
    localContext: null,
    costRationale: null,
    permits: NO_PERMIT_DATA,
  },
  {
    city: "Delta",
    slug: "delta",
    regionNote: "Delta and the Ladner and Tsawwassen communities",
    neighborhoods: ["Tsawwassen", "Ladner", "North Delta", "Sunshine Hills"],
    localSignals: "family communities, medical and dental access, commercial renewal, and suburban service businesses",
        evidence: "none",
    // Tier C: no delivered project, no measured demand, and no sourced permit
    // detail yet. Built and linkable, but noindex — a page that says only what
    // a competitor could also say is the failure mode strategy 3.2 measures.
    tier: "C",
    heroIntro: null,
    localContext: null,
    costRationale: null,
    permits: NO_PERMIT_DATA,
  },
  {
    city: "New Westminster",
    slug: "new-westminster",
    regionNote: "New Westminster's historic and high-density commercial areas",
    neighborhoods: ["Uptown", "Downtown", "Sapperton", "Queensborough"],
    localSignals: "older building conditions, healthcare tenancy, mixed-use projects, and tight urban construction sequencing",
        evidence: "none",
    // Tier C: no delivered project, no measured demand, and no sourced permit
    // detail yet. Built and linkable, but noindex — a page that says only what
    // a competitor could also say is the failure mode strategy 3.2 measures.
    tier: "C",
    heroIntro: null,
    localContext: null,
    costRationale: null,
    permits: NO_PERMIT_DATA,
  },
  {
    city: "Tri-Cities",
    slug: "tri-cities",
    regionNote: "Coquitlam and the Port Moody corridor",
    neighborhoods: ["Port Moody", "Port Coquitlam", "Coquitlam Centre", "Burke Mountain"],
    localSignals: "rapid growth, family healthcare demand, strata commercial units, and service-business build-outs",
        evidence: "none",
    // Tier C: no delivered project, no measured demand, and no sourced permit
    // detail yet. Built and linkable, but noindex — a page that says only what
    // a competitor could also say is the failure mode strategy 3.2 measures.
    tier: "C",
    heroIntro: null,
    localContext: null,
    costRationale: null,
    permits: NO_PERMIT_DATA,
  },
];

/**
 * The full portfolio, as confirmed by Jas Oberoi on 2026-08-05.
 *
 * `projects` below is the documented subset — the jobs with an address, a city
 * and a photograph the site can point at. This tally is larger because most of
 * the work predates the site and has no publishable record yet.
 *
 * The two must never contradict each other: this is the ceiling, the documented
 * list is the floor, and check-trust enforces that. When a job here gets an
 * address and a photograph it moves into `projects` and the documented count
 * rises to meet the claim.
 *
 * This is the one number on the site that is asserted rather than derived, which
 * is why it carries a date and a name. Anyone changing it needs the same.
 */
export const portfolioTally = {
  delivered: 35,
  inProgress: 5,
  confirmedOn: "2026-08-05",
};

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
    // Client photography, 2026-08-05. Reception first — it carries the Shine
    // signage, which is the only thing here a competitor cannot also photograph.
    images: [
      `${imageBase}/project-shine-dental-reception-live.jpg`,
      `${imageBase}/project-shine-dental-operatory-live.jpg`,
      `${imageBase}/project-shine-dental-sterilization-live.jpg`,
      `${imageBase}/project-shine-dental-live.jpg`,
    ],
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
    images: [
      `${imageBase}/project-abby-dental-reception-live.jpg`,
      `${imageBase}/project-abby-dental-operatory-live.jpg`,
      `${imageBase}/project-abby-dental-corridor-live.jpg`,
      `${imageBase}/project-abby-dental-sterilization-live.jpg`,
      `${imageBase}/project-abby-dental-live.jpg`,
    ],
  },
  {
    // The missing city is resolved: the client's own 2026-08-05 photo set files
    // this and the Marshall Road clinic together as "Abbotsford Shine Dental
    // Clinic and Skinholic Aesthetics Medical Spa", which places the med spa in
    // Abbotsford alongside it. That is the client stating it, so the strategy
    // §11 TODO is closed and Abbotsford now carries two pieces of local proof.
    slug: "skinholic-aesthetics",
    name: "Skinholic Aesthetics",
    address: "Abbotsford, BC",
    citySlug: "abbotsford",
    vertical: "Healthcare",
    discipline: "Med spa",
    status: "Delivered",
    images: [
      `${imageBase}/project-skinholic-reception-live.jpg`,
      `${imageBase}/project-skinholic-feature-wall-live.jpg`,
      `${imageBase}/project-skinholic-lobby-live.jpg`,
      `${imageBase}/project-skinholic-treatment-live.jpg`,
      `${imageBase}/project-skinholic-alcove-live.jpg`,
    ],
  },
  {
    // TODO(client): confirm the address and completion date. Seventeen finished
    // photographs arrived on 2026-08-05 for a clinic that appears nowhere in the
    // project records, so it is published without a city — the same treatment
    // Skinholic had until its own photo set resolved it. check-trust warns on the
    // missing city every build until an address arrives.
    slug: "kanwarveer-family-dentist",
    name: "Dr. Kanwarveer Family Dentist Clinic",
    address: "Lower Mainland, BC",
    citySlug: "",
    vertical: "Healthcare",
    discipline: "Dental clinic",
    status: "Delivered",
    images: [
      `${imageBase}/project-kanwarveer-reception-live.jpg`,
      `${imageBase}/project-kanwarveer-operatory-live.jpg`,
      `${imageBase}/project-kanwarveer-corridor-live.jpg`,
      `${imageBase}/project-kanwarveer-sterilization-live.jpg`,
    ],
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
  // Local work only. This used to top the list up from other cities whenever a
  // city had fewer than three, so a Chilliwack page presented White Rock and
  // Abbotsford clinics under a "near Chilliwack" heading. That is the padding
  // an owner checks and catches. A city with no delivered work returns nothing,
  // the proof block renders nothing, and the page keeps the process detail and
  // the cost calculator instead — which are at least true.
  return projects
    .filter((project) => project.citySlug === citySlug)
    .slice(0, limit);
}

/**
 * Reviews for a city page, nearest-first.
 *
 * A review that names this city is the strongest thing on the page, so it leads.
 * The rest follow in their original order — nothing is invented, relocated or
 * relabelled, only reordered.
 */
export function getReviewsForCity(citySlug: string, cityName: string): Review[] {
  const isLocal = (review: Review) =>
    review.city === cityName || review.city?.toLowerCase() === citySlug;

  return [...reviews.filter(isLocal), ...reviews.filter((r) => !isLocal(r))];
}

export const mainPages: SitePage[] = [
  {
    slug: "about",
    title: "General Contractor in BC | About Oberizon Construction",
    description:
      "General contractor based in White Rock, BC — meet the team behind Oberizon Construction's healthcare, commercial & residential projects across the Lower Mainland.",
    keywords: [
      "general contractor BC",
      "construction company White Rock",
      "BC builders",
      "Lower Mainland contractor",
      "Oberizon Construction team",
    ],
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
      `Building across the Lower Mainland since ${siteConfig.foundedYear}`,
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
    slug: "projects",
    title: "Construction Projects in BC | Oberizon Construction Portfolio",
    description:
      "See completed dental, medical, commercial & luxury residential construction projects across the Lower Mainland — the Oberizon Construction portfolio.",
    keywords: [
      "construction projects BC",
      "commercial construction portfolio",
      "Lower Mainland construction projects",
      "dental clinic construction projects",
      "Oberizon Construction portfolio",
    ],
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
    // Photographs of the actual named job, not stock standing in for it. This
    // grid previously showed dental-clinic.jpg for The Shine Dental and
    // project-clinic-9.jpg for Abbotsford while real photographs of both sat
    // unused — the page asking a visitor to believe in delivered work was the
    // one page not showing it.
    cards: [
      {
        title: "The Shine Dental, White Rock",
        text: "Dental clinic construction with operatories, sterilization, workflow, and technical services coordinated.",
        image: `${imageBase}/project-shine-dental-reception-live.jpg`,
      },
      {
        title: "Skinholic Aesthetics, Abbotsford",
        text: "Med spa interior built around treatment flow, client experience, privacy, and finish detail.",
        image: `${imageBase}/project-skinholic-reception-live.jpg`,
      },
      {
        title: "Dental Clinic, Abbotsford",
        text: "Dental clinic build-out with clinical service coordination and clean handover.",
        image: `${imageBase}/project-abby-dental-reception-live.jpg`,
      },
      {
        title: "Dr. Kanwarveer Family Dentist Clinic",
        text: "Family dental clinic with a glass-partitioned operatory corridor, sterilization suite, and full millwork package.",
        image: `${imageBase}/project-kanwarveer-reception-live.jpg`,
      },
      {
        title: "Luxury Residential",
        text: "Custom residential construction with high-end finish planning and project control.",
        image: `${imageBase}/project-luxury-live.jpg`,
      },
      {
        title: "Private Office, White Rock",
        text: "Commercial office interior built for professional use and daily operation.",
        image: `${imageBase}/project-private-office-live.jpg`,
      },
    ],
    canonicalPath: "/projects",
  },
  {
    slug: "contact",
    title: "Tenant Improvement Contractor BC | Oberizon Construction",
    description:
      "Tenant improvement contractor serving White Rock & the Lower Mainland — contact Oberizon Construction to book a free consultation for your next project.",
    keywords: [
      "tenant improvement contractor",
      "contact construction company BC",
      "free construction quote Lower Mainland",
      "book construction consultation",
      "White Rock contractor contact",
    ],
    eyebrow: "Book a Consultation",
    heading: "Planning a clinic, commercial space, or luxury home?",
    subheading:
      "Book a consultation before you commit to a space, drawings, budget, or construction timeline.",
    heroImage: `${imageBase}/reception.jpg`,
    introTitle: "Book a consultation.",
    intro:
      "Oberizon will help you understand scope, permits, services, budget risks, schedule pressure, and what needs to be planned before construction starts.",
    proof: [
      siteConfig.phone,
      `WhatsApp ${siteConfig.whatsapp}`,
      siteConfig.email,
      "Suite 305, 1493 Foster St",
    ],
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
      `Ask for three things: clinics actually delivered with addresses you can verify, a written per-square-foot range rather than 'it depends', and the name of the person who will run your site from permit to handover. Oberizon has built healthcare and commercial projects across the Lower Mainland since ${siteConfig.foundedYear}.`,
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
 * What is hard about each build type — keyed on the service, not its vertical.
 *
 * The page already carries a `constraint` and a `technical` paragraph, but both
 * are chosen by vertical: three variants covering ten services. Six healthcare
 * services therefore rendered the same two paragraphs, which is most of why two
 * services in one city measured 83% identical.
 *
 * These render *in addition to* those, not instead of them. Removing indexed
 * text from pages that rank is the risky half of this work and is gated on
 * Search Console data; adding distinct text is not, and similarity is a ratio.
 */
const serviceConstraint: Record<string, string> = {
  "commercial-construction":
    "A ground-up commercial build is a servicing problem before it is a building problem. Power, water and storm capacity to the lot decide the schedule long before anyone prices drywall.",
  "commercial-renovation":
    "The building keeps trading while you work in it. Every noisy hour, every shared corridor and every fire-alarm isolation has to be agreed with a landlord who has other tenants to answer to.",
  "office-renovation-contractor":
    "Staff stay in the building, so the work is measured in decibels and dust as much as in square feet. Data cabling density is usually the item that has been under-scoped.",
  "healthcare-construction":
    "Clinical space is reviewed twice — once by the municipality and once by the health authority — and the two ask for different things. Drawings that satisfy a building department can still come back from a clinical reviewer.",
  "dental-clinic-construction":
    "Chair positions fix the plumbing. Once vacuum, air and drain are in the slab, moving an operatory is a concrete job, not a drawing revision.",
  "dental-office-renovation":
    "The practice keeps seeing patients, so the clinic is rebuilt in zones with a working sterilization route maintained throughout. Losing sterilization for a day closes the whole practice, not one operatory.",
  "medical-clinic-construction":
    "Exam and procedure rooms carry different requirements, and which one a room is called on the drawings decides its ventilation, clearances and finishes. Renaming a room after permit is a redesign.",
  "pharmacy-construction":
    "A pharmacy is a secure area wrapped in a retail space. The dispensary boundary, sightlines and controlled-substance storage are fixed early, because they dictate where every wall can go.",
  "clinic-renovation-contractor":
    "Construction happens inside a live clinical environment, so infection control governs the site, not just the finished space. Barriers, negative air and route separation are part of the build, not the cleanup.",
  "luxury-residential-construction":
    "The finish schedule is the critical path. Stone, millwork and specialty glazing are ordered against framing dates, because a six-week lead time discovered late is a six-week delay.",
};

/**
 * The detail someone who has actually built one would volunteer, per service.
 *
 * Deliberately not lifted from `hubDetail` in hubs.ts, which covers the same ten
 * services for the hub pages. Copying it would move the duplication from
 * city-vs-city to city-vs-hub, and the all-pairs measurement would find it.
 */
const serviceDetail: Record<string, string> = {
  "commercial-construction":
    "We confirm the service capacity at the property line before pricing the build. An upgrade to the transformer or the water service runs on the utility's timeline rather than the site's. No amount of crew recovers those weeks once they are lost.",
  "commercial-renovation":
    "Work is sequenced against the tenancy schedule: demolition and anything that breaks the fire-alarm loop happens after hours, finishing trades run in the day. The programme is written around the landlord's approval turnaround, which is the item most often assumed rather than confirmed.",
  "office-renovation-contractor":
    "Acoustic separation between meeting rooms and open floor is specified at drawing stage — a partition taken to the ceiling tile instead of the deck is the single most common complaint after handover, and it cannot be fixed without reopening the ceiling.",
  "healthcare-construction":
    "We produce the drawing set against CSA Z8000 expectations before it goes to the municipality, so the clinical reviewer and the building department are looking at the same package. Two review cycles run in parallel rather than one after the other.",
  "dental-clinic-construction":
    "Vacuum and compressed-air runs follow the chair layout, and the compressor and pump are sized for the final operatory count, not the opening one. A five-chair clinic plumbed for five cannot take a sixth without new trunk lines.",
  "dental-office-renovation":
    "The clinic is split into zones and rebuilt one at a time, with dust barriers and a temporary sterilization route kept in service. Weekend cutovers cover anything that would take an operatory offline mid-week.",
  "medical-clinic-construction":
    "Room naming is fixed with the practice before the drawings are sealed, because a procedure room, an exam room and a treatment room carry different air-change and clearance expectations under health authority review.",
  "pharmacy-construction":
    "The dispensary is laid out for sightlines and separation first — counter, consultation area and secure storage — and the millwork follows that. Where compounding is planned, the room is built to the USP 795 or USP 797 standard that applies, which cannot be retrofitted into a finished space.",
  "clinic-renovation-contractor":
    "Hoardings, negative air machines and a separated construction route go in before demolition starts, and staff and patient circulation is agreed with the practice in writing. IPAC expectations apply to the site during the work, not only to the space at handover.",
  "luxury-residential-construction":
    "Long-lead items are ordered against the framing schedule rather than at finishing stage, and the site is protected to a standard that assumes the finishes are already installed. Most damage on a high-finish build happens after the expensive material arrives.",
};

/**
 * Two questions per service that only apply to that build type.
 *
 * Written to satisfy checkFaqSpecificity in scripts/check-trust.mjs: any
 * question matching cost / how long / permits has to answer with a figure or a
 * named standard, never "it depends on scope".
 */
const serviceFaqs: Record<string, Array<{ question: string; answer: string }>> = {
  "commercial-construction": [
    {
      question: "What decides the schedule on a ground-up commercial build?",
      answer:
        "Servicing capacity at the property line. Power, water and storm have to carry the finished building, and a utility upgrade runs on the utility's timeline rather than the site's — which is why we confirm it before pricing rather than during construction.",
    },
    {
      question: "What is checked before a fixed price is given?",
      answer:
        "Electrical capacity, make-up air and the condition of anything being kept. A fixed price given without verifying those is a fixed price with a change order already in it.",
    },
  ],
  "commercial-renovation": [
    {
      question: "Can the business keep trading during a commercial renovation?",
      answer:
        "Usually yes. Work is split into zones, with demolition and anything affecting the fire-alarm loop scheduled after hours. Phasing around an operating business typically extends the programme by roughly a third against an empty unit, and protects the revenue that would otherwise stop.",
    },
    {
      question: "Who approves the work in a leased commercial unit?",
      answer:
        "The landlord approves the drawings before the building permit is applied for, and that approval window is the most commonly underestimated part of the schedule. We ask for a defined response time in writing rather than assuming one.",
    },
  ],
  "office-renovation-contractor": [
    {
      question: "How is noise handled when staff stay in the building?",
      answer:
        "Demolition, coring and anything percussive runs outside working hours, and finishing trades run during the day behind sealed hoardings. The programme is built around the tenancy's quiet hours rather than the trades' preference.",
    },
    {
      question: "What is most often under-scoped in an office fit-out?",
      answer:
        "Data and low-voltage density, and acoustic separation. Partitions stopped at the ceiling tile rather than the deck are the most common post-handover complaint, and correcting them means reopening the ceiling.",
    },
  ],
  "healthcare-construction": [
    {
      question: "Why does a clinical fit-out get reviewed twice?",
      answer:
        "The municipality reviews the building permit and the regional health authority reviews the clinical layout, and they assess different things. We prepare one package against CSA Z8000 expectations so both reviews can run in parallel instead of sequentially.",
    },
    {
      question: "What does CSA Z8000 change about a clinic build?",
      answer:
        "It shapes infection control zoning, ventilation, clearances and finishes — coved base, sealed joints, cleanable surfaces. Applying it from the drawing stage avoids the redesign that follows a reviewer sending a package back.",
    },
  ],
  "dental-clinic-construction": [
    {
      question: "Why do operatory positions have to be final before construction?",
      answer:
        "Each chair needs its own vacuum line, compressed-air line and dedicated drain, and those run in or under the slab. Moving an operatory after the rough-in is concrete work, not a drawing revision.",
    },
    {
      question: "Should the compressor be sized for the chairs being installed now?",
      answer:
        "Size for the final operatory count, not the opening one. A clinic plumbed for five chairs cannot take a sixth without new trunk lines, and the cost difference at rough-in stage is far smaller than the retrofit.",
    },
  ],
  "dental-office-renovation": [
    {
      question: "Can a dental practice keep seeing patients during a renovation?",
      answer:
        "Yes, by rebuilding in zones and keeping a working sterilization route in service throughout. Phasing around live patient hours typically adds 30 to 50% to the programme against a full closure, and protects production days that would otherwise be lost.",
    },
    {
      question: "What has to stay running while a clinic is renovated?",
      answer:
        "Sterilization, above everything. Losing it for a day closes the practice rather than one operatory, so a temporary route is established before the permanent one comes offline.",
    },
  ],
  "medical-clinic-construction": [
    {
      question: "Does it matter what a room is called on the drawings?",
      answer:
        "Yes. An exam room, a treatment room and a procedure room carry different air-change, clearance and finish expectations under health authority review, so the names are fixed with the practice before the set is sealed. Renaming a room after permit is a redesign.",
    },
    {
      question: "Which health authority reviews a Lower Mainland clinic?",
      answer:
        "Fraser Health or Vancouver Coastal Health, depending on the address, and the review applies where there are procedure rooms, sterilization or diagnostic imaging. We confirm which applies before drawings start.",
    },
  ],
  "pharmacy-construction": [
    {
      question: "What has to be settled first in a pharmacy fit-out?",
      answer:
        "The dispensary boundary, sightlines and secure storage. Those decide where walls can go and where the millwork lands, so they are fixed before layout rather than adjusted around a finished plan.",
    },
    {
      question: "What changes if the pharmacy will compound?",
      answer:
        "Compounding brings the applicable USP 795 or USP 797 requirements into the build — a dedicated room with its own ventilation and finishes. It cannot be retrofitted into a completed space, so it is decided before drawings.",
    },
  ],
  "clinic-renovation-contractor": [
    {
      question: "How is infection control handled while a clinic is under construction?",
      answer:
        "Hoardings, negative air machines and a construction route separated from patient circulation go in before demolition. IPAC expectations apply to the site during the work, not only to the finished space.",
    },
    {
      question: "Can renovation happen around treatment hours?",
      answer:
        "Yes. The clinic is divided into zones and the disruptive work is scheduled outside clinical hours, with the route between them agreed with the practice in writing before the first barrier goes up.",
    },
  ],
  "luxury-residential-construction": [
    {
      question: "What sets the schedule on a high-finish home?",
      answer:
        "The finish schedule, not the framing. Stone, custom millwork and specialty glazing carry the longest lead times, so they are ordered against framing dates rather than at finishing stage.",
    },
    {
      question: "When does site protection start on a luxury build?",
      answer:
        "Before the expensive material arrives, and to a standard that assumes it is already installed. Most damage on a high-finish build happens after delivery, not during construction.",
    },
  ],
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

/**
 * Photography pools by vertical, for pages with no local project to show.
 *
 * Every one of these sits in public/oberizon/optimized already; three of them
 * (clinic-11, clinic-12, healthcare-5) had never been referenced by anything.
 */
const heroPool: Record<ConstructionService["vertical"], string[]> = {
  Healthcare: [
    `${imageBase}/project-clinic-9.jpg`,
    `${imageBase}/project-clinic-10.jpg`,
    `${imageBase}/project-clinic-11.jpg`,
    `${imageBase}/project-clinic-12.jpg`,
    `${imageBase}/project-healthcare-3.jpg`,
    `${imageBase}/project-healthcare-4.jpg`,
    `${imageBase}/project-healthcare-5.jpg`,
    `${imageBase}/dental-clinic.jpg`,
    `${imageBase}/project-dental-1.jpg`,
    `${imageBase}/project-med-spa.jpg`,
  ],
  Commercial: [
    `${imageBase}/project-office.jpg`,
    `${imageBase}/project-commercial-2.jpg`,
    `${imageBase}/project-commercial-13.jpg`,
    `${imageBase}/hero-commercial.webp`,
    `${imageBase}/reception.jpg`,
  ],
  Residential: [
    `${imageBase}/project-residential.jpg`,
    `${imageBase}/project-luxury-live.jpg`,
  ],
};

/**
 * The photograph a city × service page opens on.
 *
 * Every one of these pages used `service.image`, so all fourteen cities opened
 * on the same picture — ten images carrying a hundred and forty pages, one of
 * them heading thirty. Pages that read alike and look alike are the same
 * problem twice, and the fix costs nothing but wiring: thirty-six photographs
 * were already on disk and twelve were in use.
 *
 * A delivered local project wins, because then the page opens on work actually
 * done in that city rather than on stock from somewhere else. The index shift
 * by service keeps the ten services within one city from repeating a frame.
 *
 * Deliberately not the OG image alone — this is the hero a visitor sees. It
 * changes no title, description, h1, canonical or robots directive, so it
 * carries no ranking risk.
 */
export function heroImageFor(city: ServiceArea, service: ConstructionService) {
  const cityIndex = serviceAreas.findIndex((area) => area.slug === city.slug);
  const serviceIndex = constructionServices.findIndex((item) => item.slug === service.slug);

  const local = projects
    .filter((project) => project.citySlug === city.slug && project.images?.length)
    .filter((project) => project.vertical === service.vertical);

  if (local.length) {
    const shots = local.flatMap((project) => project.images ?? []);
    return shots[serviceIndex % shots.length];
  }

  const pool = heroPool[service.vertical];
  return pool[(cityIndex + serviceIndex) % pool.length] ?? service.image;
}

export function getAllConstructionPages(): ConstructionPseoPage[] {
  return serviceAreas.flatMap((city) =>
    constructionServices.map((service) => {
      const path = `/construction/${city.slug}/${service.slug}`;
      const primary = `${service.primaryKeyword} in ${city.city}, BC`;
      const keywords = buildKeywordCluster(service, city);
      const pricing = buildPricingBrief(service);

      /*
        The description this replaces was ungrammatical on all 140 pages:

          "Need commercial construction in White Rock, BC? Oberizon Construction
           manages hire a commercial construction company with clear scope,
           budget, and schedule control across White Rock and the Semiahmoo
           Peninsula."

        `service.intent` is a verb phrase, written for "…if you need to {intent}"
        where it is used elsewhere, so dropping it after "manages" produced
        "manages hire a". 216 characters too, so Google truncated whatever
        survived. The SEO consultant caught this on the fourteen pages his sheet
        covers; it was running on every one of the 140.

        His formula replaces it. Where he wrote the copy himself — the fourteen
        commercial-construction pages — his exact strings win, because his
        wording varies per city in ways a template cannot reproduce.
      */
      const seo =
        service.slug === "commercial-construction" ? cityCommercialMeta[city.slug] : undefined;

      return {
        city,
        service,
        path,
        title: seo?.title ?? cityTitle(service.name, city.city),
        description:
          seo?.description ??
          cityDescription(service.name, city.city, service.slug, city.regionNote),
        h1: `${service.name} in ${city.city}, BC`,
        // His researched set where he supplied one, our generated cluster
        // otherwise. Metadata only — the trust gate blocks these from being
        // rendered into the page body.
        keywords: seo?.keywords ?? keywords,
        // The service lead states the constraint for this build type; the city's
        // own opener states what is true here. Where a city has no written
        // opener it falls back to the old shared sentence, which is honest
        // about there being nothing city-specific to say yet.
        intro: [
          serviceLead[service.slug] ?? "",
          city.heroIntro ??
            "We plan that before the site gets busy. Drawings, permits and trades are sequenced by one team out of White Rock.",
        ]
          .filter(Boolean)
          .join(" ")
          .trim(),
        quickFacts: buildQuickFacts(service, city, pricing),
        pricingBrief: pricing,
        localProof:
          city.permits.notes ??
          `Oberizon works across the Lower Mainland, including ${city.regionNote}. Every project is planned around site access, inspection windows and how the finished space has to run.`,
        marketContext:
          city.localContext ??
          `${city.city} work is shaped by ${firstClauses(city.localSignals, 2)}. We use that to set scope and sequence before demolition starts.`,
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
          // White Rock is an enclave inside Surrey and the head office is in
          // White Rock, so these two pages chase the same searcher. Pointing
          // them at each other with the reason stated settles which is which,
          // rather than leaving Google to pick between two near-equals.
          ...(city.slug === "white-rock"
            ? [
                {
                  label: `${service.name} in Surrey`,
                  href: `/construction/surrey/${service.slug}`,
                  why: "Surrey permits separately and covers the corridors beyond the peninsula — start there if your address is outside White Rock.",
                },
              ]
            : []),
          ...(city.slug === "surrey"
            ? [
                {
                  label: `${service.name} in White Rock`,
                  href: `/construction/white-rock/${service.slug}`,
                  why: "White Rock is an enclave inside Surrey with its own Building Division, and our office is there — start there if your address is on the peninsula.",
                },
              ]
            : []),
          {
            label: "All service areas",
            href: "/construction",
            why: "Compare how Oberizon works across the Lower Mainland.",
          },
          {
            label: `All ${service.name}`,
            href: `/services/${service.slug}`,
            why: `See the full service, pricing and every city we build it in.`,
          },
          // Ungated, matching the footer. Indexing and the sitemap stay gated
          // on ratesConfirmedByClient; reachability does not.
          {
            label: "Estimate your build",
            href: `/cost?service=${service.slug}`,
            why: "Set your own square footage and see the range.",
          },
        ],
        heroImage: heroImageFor(city, service),
        projects: getProjectsForCity(city.slug),
        reviews: getReviewsForCity(city.slug, city.city),
        // Tier, not evidence. Richmond has no project but does have a named
        // client review and its own sourced permit requirements, which is
        // enough to be worth reading; a page graduates by gaining substance.
        indexable: city.tier !== "C",
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

  // Where the city publishes its own permit route, say that instead of
  // repeating the head-office sentence on all fourteen pages.
  const opening = city.permits.authority
    ? `${city.permits.pathway ?? `Permits here are issued by ${city.permits.authority}.`} We prepare the submission to that route, from a White Rock head office.`
    : `Oberizon delivers ${service.name.toLowerCase()} from a White Rock head office. Work runs across ${city.regionNote}.`;

  // The cost band is site-wide and unconfirmed, so the number never varies by
  // city. What legitimately varies is why a city sits where it does in it.
  const priced = `2026 pricing is ${pricing.toLowerCase().replace(/\.$/, "")}. The final number moves with base-building condition and finish level.`;

  return [
    opening,
    city.costRationale ? `${priced} ${city.costRationale}` : priced,
    // The service-specific pair leads, because it is the part that differs
    // between two services in the same city — which is what a reader comparing
    // them actually needs. The vertical-keyed pair follows rather than being
    // replaced: those sentences are indexed on pages that rank.
    serviceConstraint[service.slug],
    serviceDetail[service.slug],
    `${constraint} Projects here typically sit around ${neighborhoodList}.`,
    technical,
    // A service with no entry in the maps above would otherwise render an empty
    // card. Filtering here rather than defaulting to "" keeps the gap visible
    // in the data instead of shipping a blank block to a visitor.
  ].filter((fact): fact is string => Boolean(fact));
}

/**
 * "Do you work here?" answered with what is actually true of this city.
 *
 * Three genuinely different answers — delivered work, work in progress, or no
 * work yet — rather than one sentence with the city name swapped in. The
 * no-work-yet answer says so plainly. A page that implies local delivery it
 * cannot show is the claim an owner rings up to check.
 */
function cityAnswer(city: ServiceArea, service: ConstructionService) {
  const label = service.name.toLowerCase();
  const local = getProjectsForCity(city.slug);
  const delivered = local.filter((project) => project.status === "Delivered");
  const active = local.filter((project) => project.status === "In progress");

  if (delivered.length) {
    return `Yes — we have delivered ${delivered.length === 1 ? "a project" : `${delivered.length} projects`} in ${city.city}, including ${delivered[0].name}. We run ${label} across the Lower Mainland from a White Rock head office.`;
  }

  if (active.length) {
    return `Yes — we have ${active.length === 1 ? "a project" : `${active.length} projects`} in progress in ${city.city} right now, including ${active[0].name}. We run ${label} across the Lower Mainland from a White Rock head office.`;
  }

  return `Yes, though we should be straight with you: we have not completed a ${city.city} project yet. We run ${label} across the Lower Mainland from a White Rock head office, and ${city.regionNote} is inside the area we serve.`;
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
      answer: cityAnswer(city, service),
    },
    {
      question: `Who issues the building permit for ${service.name.toLowerCase()} in ${city.city}?`,
      answer: city.permits.authority
        ? `The building permit is issued by ${city.permits.authority}, reviewed against the BC Building Code and the city's own zoning. ${city.permits.pathway ?? ""}${
            city.permits.timeline
              ? ` Review typically runs ${city.permits.timeline}.`
              : " We confirm the current review window with the city at application rather than quoting one from a previous job."
          }`.trim()
        : `${city.city} issues its own building permit, reviewed against the BC Building Code and the city's zoning bylaw, and the route differs from neighbouring municipalities. We confirm the current requirements with the city at the start of every job rather than working from the last one.`,
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
    // Service-specific questions, appended rather than replacing the city set.
    // Two services in one city now answer different questions, which is the
    // difference a reader comparing them is looking for.
    ...(serviceFaqs[service.slug] ?? []),
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
/**
 * The two cards that follow "Project review", per service.
 *
 * These replaced a card shared by all 140 pages ("Managed execution") and one
 * chosen by vertical, which meant six healthcare services showed the same
 * "Clinical workflow" text in the same city. Replacement rather than removal:
 * the page keeps three cards of the same length, and generic becomes specific.
 * Nothing indexed is deleted, which is the part of this work that carries risk
 * while pages are ranking.
 */
const serviceFocusCards: Record<string, [Feature, Feature]> = {
  "commercial-construction": [
    {
      title: "Servicing confirmed",
      text: "Capacity at the property line is verified before the price is fixed. A utility upgrade is a timeline nobody on site can compress.",
    },
    {
      title: "Approvals in parallel",
      text: "Development permit, building permit and servicing agreements run alongside each other wherever the municipality allows it.",
    },
  ],
  "commercial-renovation": [
    {
      title: "Trading protected",
      text: "Noisy work runs outside opening hours. The unit keeps trading and the neighbouring tenants are not the ones complaining.",
    },
    {
      title: "Landlord approvals",
      text: "Drawing sign-off is scheduled with a defined response window written into the programme rather than assumed.",
    },
  ],
  "office-renovation-contractor": [
    {
      title: "Acoustic separation",
      text: "Partitions are taken to the deck where privacy matters. Correcting that after handover means reopening the ceiling.",
    },
    {
      title: "Cabling density",
      text: "Data and low-voltage are counted at drawing stage rather than discovered on the day the desks arrive.",
    },
  ],
  "healthcare-construction": [
    {
      title: "Two reviews, one package",
      text: "The set is built to CSA Z8000 expectations so the health authority and the building department read the same drawings.",
    },
    {
      title: "Infection control zoning",
      text: "Clean and soiled routes are separated on the plan before a single wall is priced.",
    },
  ],
  "dental-clinic-construction": [
    {
      title: "Chair-side services",
      text: "Vacuum, air and drain run to each chair position, sized for the final operatory count rather than the opening one.",
    },
    {
      title: "Sterilization flow",
      text: "Dirty to clean runs one direction. The corridor is set before any millwork is ordered.",
    },
  ],
  "dental-office-renovation": [
    {
      title: "Sterilization kept live",
      text: "A temporary route is in service before the permanent one comes offline. Losing sterilization closes the practice, not one room.",
    },
    {
      title: "Zone by zone",
      text: "Operatories come out of service in planned groups, with weekend cutovers for anything that would otherwise cost a weekday.",
    },
  ],
  "medical-clinic-construction": [
    {
      title: "Room naming fixed early",
      text: "Exam, treatment and procedure rooms carry different requirements. The names are agreed before the drawing set is sealed.",
    },
    {
      title: "Health authority review",
      text: "Fraser Health or Vancouver Coastal Health depending on the address, confirmed before drawings start rather than after.",
    },
  ],
  "pharmacy-construction": [
    {
      title: "Dispensary boundary",
      text: "Sightlines, counter and secure storage are set first. Every other wall on the plan follows from them.",
    },
    {
      title: "Compounding standard",
      text: "Where compounding is planned the room is built to the applicable USP 795 or USP 797 requirements from drawing stage.",
    },
  ],
  "clinic-renovation-contractor": [
    {
      title: "Barriers before demolition",
      text: "Hoardings and negative air go in first. IPAC expectations apply to the site during the work, not only to the finished space.",
    },
    {
      title: "Separated circulation",
      text: "The construction route is agreed with the practice in writing before the first wall is opened.",
    },
  ],
  "luxury-residential-construction": [
    {
      title: "Long-lead ordered early",
      text: "Stone, custom millwork and specialty glazing are ordered against framing dates rather than at finishing stage.",
    },
    {
      title: "Site protection",
      text: "Protection is installed to a standard that assumes the finishes are already in. Most damage happens after delivery.",
    },
  ],
};

function buildServiceFocus(service: ConstructionService): Feature[] {
  // "Project review" stays: it already carries the service keyword, and it is
  // the card a visitor reads first. The two behind it are now per service
  // rather than one shared by every page and one chosen by vertical.
  const review: Feature = {
    title: "Project review",
    text: `We walk the space and price the risk before you commit to ${service.primaryKeyword}. Permits and services are the two that bite.`,
  };

  const cards = serviceFocusCards[service.slug];
  if (!cards) {
    // A service with no entry falls back to the vertical text rather than
    // rendering one card where the layout expects three.
    return [
      review,
      {
        title: "Managed execution",
        text: "One team holds the trades, the inspections and the deficiency list. You get one number to call.",
      },
      service.vertical === "Healthcare"
        ? {
            title: "Clinical workflow",
            text: "Operatory clearances, suction runs and sterilization separation are planned first. Patient and staff flow follow from them.",
          }
        : service.vertical === "Commercial"
          ? {
              title: "Business operation",
              text: "Reception, storage and customer flow are set against your opening date. The build is sequenced to protect it.",
            }
          : {
              title: "Finish control",
              text: "Millwork and fixtures are long-lead items. They are ordered before framing closes, not after.",
            },
    ];
  }

  return [review, ...cards];
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
  "/services",
  ...constructionServices.map((service) => `/services/${service.slug}`),
  ...mainPages.map((page) => page.canonicalPath),
  ...getAllConstructionPages()
    .filter((page) => page.indexable)
    .map((page) => page.path),
];
