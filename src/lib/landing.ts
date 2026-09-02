/**
 * The two Meta ad landing pages, as data.
 *
 * These are not site pages. A visitor arrives from a paid social ad with no
 * intent beyond the ad they just tapped, which changes three things: the page
 * carries no navigation (every link out is an exit), the form sits above the
 * fold (roughly 60% of visitors never scroll), and the copy answers the ad
 * rather than the search term.
 *
 * Everything asserted here is traceable to src/lib/site.ts — the named jobs,
 * the counts, the warranty, the reviews. Nothing on a paid page may claim
 * something the organic site cannot back, which is the rule scripts/
 * check-trust.mjs already enforces across the rest of the codebase.
 *
 * Both pages are noindex. They duplicate the service pages' subject matter by
 * design, and letting them compete with pages that are already ranking would
 * cost more than the ads earn.
 */

import { portfolioTally, projects, serviceAreas, siteConfig } from "@/lib/site";

export type LandingCampaign = "commercial" | "residential";

export type LandingProof = { figure: string; unit: string; label: string };

/** Delivered work, named, for the proof strip. */
const delivered = projects.filter((project) => project.status === "Delivered");
const inProgress = projects.filter((project) => project.status === "In progress");

/**
 * Counts, derived rather than written.
 *
 * A number typed into copy is a number that goes stale the first time the
 * project list changes, and the difference is invisible until a client notices
 * the site claims eleven jobs and lists nine.
 */
export const landingCounts = {
  delivered: portfolioTally.delivered,
  inProgress: portfolioTally.inProgress,
  cities: serviceAreas.length,
  documented: delivered.length,
  underway: inProgress.length,
  yearsBuilding: new Date().getFullYear() - siteConfig.foundedYear,
};

/** One item in the bar under the hero. */
export type LandingFeature = { title: string; text: string };

/**
 * A renovation, before and after.
 *
 * Empty until the client sends the pairs. The section renders nothing while the
 * list is empty rather than shipping a placeholder — a "before" that is not a
 * real before is the one thing on a renovation page nobody would forgive.
 */
export type LandingBeforeAfter = {
  before: string;
  /**
   * The room stripped back, between the two.
   *
   * Optional, and worth having where it exists. Two finished photographs prove
   * the room changed; the middle frame proves who changed it — that the floor
   * was protected, that the strip-out was controlled, that somebody was on site
   * doing the work rather than photographing a showroom.
   */
  during?: string;
  after: string;
  caption: string;
};

export type LandingContent = {
  campaign: LandingCampaign;
  /** Ad-side label, echoed into GHL so the pipeline shows which page produced the lead. */
  leadSource: string;
  path: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  /** Set in the bold sans. */
  headline: string;
  /** Set in serif italic beneath it — the accent line. */
  headlineAccent: string;
  subhead: string;
  /** The four-up bar under the hero. */
  features: LandingFeature[];
  /** Renovation pairs. Replaces the process section once populated. */
  beforeAfter?: LandingBeforeAfter[];
  /**
   * Shown instead of the review cards where the reviews do not fit the
   * audience. Residential uses it because every review Oberizon holds is from
   * a clinic owner.
   */
  assurances?: Array<{ title: string; text: string }>;
  /** Three short lines under the headline. Not a feature list — objections. */
  reassurance: string[];
  formHeading: string;
  formNote: string;
  proof: LandingProof[];
  /** What the visitor is afraid of, and the answer. */
  objections: Array<{ question: string; answer: string }>;
  steps: Array<{ step: string; title: string; text: string }>;
  gallery: Array<{ image: string; caption: string }>;
  closingHeading: string;
  closingText: string;
};

export const commercialLanding: LandingContent = {
  campaign: "commercial",
  leadSource: "Meta Ads – Commercial",
  path: "/lp/commercial",
  metaTitle: "Commercial Build-Outs & Fit-Outs in Metro Vancouver | Oberizon Construction",
  metaDescription:
    "Office, retail and clinic build-outs across Metro Vancouver. Permits, trades and inspections run by one team from a White Rock office.",
  eyebrow: "Offices · Retail · Clinics",
  headline: "Your space is finished on the",
  headlineAccent: "date we promised.",
  subhead:
    "Offices, Retail, Clinics and Medical Suites across the Lower Mainland. Permits, trades, inspections and handover are run by one team, so the date you gave your staff and your customers is a plan rather than a hope.",
  reassurance: [
    "One site lead, not a rotating cast of subcontractors",
    "Permits and inspections handled, not handed back to you",
    "Weekly progress calls with the person actually on site",
  ],
  features: [
    { title: "Permits handled", text: "Building and trade permits are ours to run and ours to chase." },
    { title: "One site lead", text: "The same person on site every day, not a rotating cast." },
    { title: "Weekly progress calls", text: "From whoever was actually standing in the space." },
    { title: "Clean handover", text: "Inspections cleared and deficiencies closed before you get the keys." },
  ],
  formHeading: "Get a build plan for your space",
  formNote:
    "Tell us the address and the stage you are at. You will hear back the same working day, from the office rather than a call centre.",
  proof: [
    { figure: String(landingCounts.delivered), unit: "+", label: "Builds delivered" },
    { figure: "90", unit: "", label: "Day clinic, five operatories" },
    { figure: String(landingCounts.cities), unit: "", label: "Lower Mainland cities" },
    { figure: String(landingCounts.yearsBuilding), unit: "yrs", label: "Building since 2021" },
  ],
  objections: [
    {
      question: "Can we keep operating while you build?",
      answer:
        "In most cases yes. The space is zoned and sealed, and the disruptive work is scheduled outside clinical hours with the route between zones agreed in writing before the first barrier goes up.",
    },
    {
      question: "Who deals with the city?",
      answer:
        "We do. Building permit, trade permits and the inspection sequence are ours to run and ours to chase. You are told what was approved and when, not asked to follow it up.",
    },
    {
      question: "What happens when something is found behind a wall?",
      answer:
        "You get a call and a number the same day, before the work continues. The cost of a surprise is a conversation, not a line item you discover at the end.",
    },
    {
      question: "Do you understand clinical requirements?",
      answer:
        "Operatory plumbing and suction runs, sterilization layouts, imaging shielding, dispensary security and infection-control barriers are the ordinary content of our week. Most of what we build is clinical.",
    },
  ],
  steps: [
    { step: "01", title: "Walk the space", text: "We see it, measure it and price the risk before you commit to anything." },
    { step: "02", title: "Plan and permit", text: "Drawings and permits go in while long-lead equipment is ordered against real dates." },
    { step: "03", title: "Build", text: "One site lead holds the trades and calls you every week with what moved." },
    { step: "04", title: "Open", text: "Inspections cleared and the deficiency list closed before you take the keys." },
  ],
  gallery: [
    { image: "/oberizon/optimized/project-shine-dental-reception-live.jpg", caption: "The Shine Dental — White Rock" },
    { image: "/oberizon/optimized/project-abby-dental-operatory-live.jpg", caption: "Marshall Road dental clinic — Abbotsford" },
    { image: "/oberizon/optimized/project-skinholic-reception-live.jpg", caption: "Skinholic Aesthetics med spa — Aldergrove" },
    { image: "/oberizon/optimized/project-kanwarveer-sterilization-live.jpg", caption: "Family dentist clinic — Lower Mainland" },
  ],
  closingHeading: "Send us the address and the stage you are at.",
  closingText:
    "Lease signed, drawings in hand, or still deciding whether the space works — all three are worth a conversation. The earlier we see it, the more of the budget is still yours to direct.",
};

export const residentialLanding: LandingContent = {
  campaign: "residential",
  leadSource: "Meta Ads – Residential",
  path: "/lp/residential",
  metaTitle: "Custom Homes & Home Renovations in Metro Vancouver | Oberizon Construction",
  metaDescription:
    "Custom home building and full home renovations across Metro Vancouver, covered by the 2-5-10 Home Warranty and run by one team from drawings to handover.",
  eyebrow: "Custom homes · Renovations · Additions",
  headline: "Your home is finished on the",
  headlineAccent: "date we promised.",
  subhead:
    "New custom homes and full renovations across Metro Vancouver. One team handles the drawings, the permits, the trades and the finishing — and every build is covered by the 2-5-10 Home Warranty.",
  reassurance: [
    "2-5-10 Home Warranty on residential builds",
    "Selections closed before drywall, so the schedule holds",
    "You keep a kitchen, a bathroom and a way through the house",
  ],
  features: [
    { title: "2-5-10 warranty", text: "Two years on labour, five on the envelope, ten on structure." },
    { title: "Selections closed early", text: "Fixed before framing finishes, so the schedule holds." },
    { title: "You keep the house", text: "A kitchen, a bathroom and a route between them stay in use." },
    { title: "One site lead", text: "The same person on site every day, start to handover." },
  ],
  formHeading: "Get a plan and a realistic timeline",
  formNote:
    "Tell us what you are thinking of doing and where. You will hear back the same working day, from the office rather than a call centre.",
  proof: [
    { figure: "2-5-10", unit: "", label: "Home Warranty" },
    { figure: String(landingCounts.delivered), unit: "+", label: "Builds delivered" },
    { figure: String(landingCounts.cities), unit: "", label: "Lower Mainland cities" },
    { figure: String(landingCounts.yearsBuilding), unit: "yrs", label: "Building since 2021" },
  ],
  objections: [
    {
      question: "Can we live in the house while you work?",
      answer:
        "Usually yes. The house is zoned and sealed, and the sequence is written around the rooms you cannot lose — a kitchen, a bathroom and a route between them stay in use.",
    },
    {
      question: "Why do renovations always run late?",
      answer:
        "Two reasons, and both are avoidable. Selections left open until drywall stop the site rather than the showroom, so yours are closed before framing finishes. And where an addition meets existing structure, we open and inspect that connection before committing the schedule, not after.",
    },
    {
      question: "How do I know the price will hold?",
      answer:
        "The scope is written down before the number is given, and anything found behind a wall comes to you as a call and a figure the same day. A quote that cannot explain what it excludes is not a quote.",
    },
    {
      question: "What is the 2-5-10 warranty?",
      answer:
        "British Columbia's mandatory new-home warranty: two years on labour and materials, five on the building envelope, ten on structure. It applies to our residential builds.",
    },
  ],
  steps: [
    { step: "01", title: "We walk the site", text: "We see the house or the lot, and say plainly what is realistic and what is not." },
    { step: "02", title: "Design and permit", text: "Drawings and permits go in while long-lead millwork, stone and glazing are ordered." },
    { step: "03", title: "Build", text: "One site lead holds the trades, and the house you live in stays livable." },
    { step: "04", title: "Handover", text: "Deficiency list closed and warranty documented before you move back in." },
  ],
  /*
    Client photography, 2026-09-02. The residential library was two exteriors of
    the same two houses and no interior at all, which is why this page had to
    open on a driveway. These are finished rooms in a delivered home.
  */
  gallery: [
    { image: "/oberizon/optimized/project-custom-home-hero-live.jpg", caption: "Completed custom home — Metro Vancouver" },
    { image: "/oberizon/optimized/project-custom-home-entry-live.jpg", caption: "Double-height entry and living room" },
    { image: "/oberizon/optimized/project-custom-home-kitchen-live.jpg", caption: "Kitchen, same build" },
    { image: "/oberizon/optimized/project-custom-home-living-live.jpg", caption: "Living and dining, same build" },
  ],
  /*
    Residential shows these instead of the review cards. Every review Oberizon
    holds is from a clinic owner, and a homeowner reading dental testimonials on
    a home-building page learns nothing about whether their house is safe.
    Every line here is checkable against siteConfig or BC's warranty rules
    rather than being a claim about how good the work is.

    TODO(client): replace with real homeowner reviews the moment there are any.
    Attributed quotes from people who had a house built outperform any list of
    guarantees, and this section exists only because that list does not exist yet.
  */
  /*
    One room, three stages, all verified as the same kitchen: same bay window,
    same circular ceiling soffit above it, same range and hood in the same
    position. That check is the only thing that makes a before/after worth
    anything.

    TODO(client): the living-room "before" is in the library as
    project-reno-living-before.jpg and has no matching "after" yet. Send the
    finished shot of that room and it becomes the second pair.
  */
  beforeAfter: [
    {
      before: "/oberizon/optimized/project-reno-kitchen-before.jpg",
      during: "/oberizon/optimized/project-reno-kitchen-during.jpg",
      after: "/oberizon/optimized/project-reno-kitchen-after.jpg",
      caption: "Kitchen renovation — Metro Vancouver",
    },
  ],
  assurances: [
    {
      title: "2-5-10 Home Warranty",
      text: "British Columbia's mandatory new-home warranty: two years on labour and materials, five on the building envelope, ten on structure.",
    },
    {
      title: "Licensed and insured",
      text: "A BC-licensed general contractor, fully insured and WorkSafeBC registered, with the coverage in place before anyone is on site.",
    },
    {
      title: "The scope is written first",
      text: "What is included is agreed in writing before a number is given, so the quote can explain what it excludes.",
    },
    {
      title: "One site lead throughout",
      text: "The same person runs the trades from the first walk to the day you move back in, and calls you weekly with what moved.",
    },
  ],
  closingHeading: "Tell us what you are thinking of building.",
  closingText:
    "A full custom home, an addition, or one floor of an existing house. We will tell you what it realistically takes before anyone talks about a price.",
};

export const landingPages: LandingContent[] = [commercialLanding, residentialLanding];

export function getLanding(campaign: LandingCampaign) {
  return landingPages.find((page) => page.campaign === campaign);
}
