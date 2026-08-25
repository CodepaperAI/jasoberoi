import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { constructionServices, postHeroImage } from "@/lib/site";

/**
 * The blog index, as data.
 *
 * The posts themselves are .mdx pages under src/app/blog, but the sitemap, the
 * index page and the service-page "related reading" rails all need to know what
 * exists without parsing MDX. This array is that answer, and it is the only
 * place a post is declared — an .mdx file with no entry here renders but is
 * never linked or submitted, which scripts/check-trust.mjs reports.
 *
 * `hubOf` / `childOf` exist because two posts target dental clinic cost. The
 * general post is the hub, the 5-operatory post its long-tail child. Stating
 * the relationship in data lets both pages link the right way round instead of
 * leaving Google to pick a winner — the same fix applied to White Rock and
 * Surrey on the city pages.
 */

/**
 * The reader's intent, and the axis the index groups on.
 *
 * `service` is the subject axis and it was doing both jobs, which is why the
 * index could only ever be one flat list: a cost guide and a permit guide for
 * the same build type are the same subject and completely different questions.
 * Someone arrives asking what it costs, how long it takes, or what the city
 * will ask for — which is what the hero on /blog has always promised — and
 * until now the page had no way to answer that.
 */
export const blogTopics = [
  "Cost",
  "Timelines",
  "Permits & Compliance",
  "Leases & Planning",
  "Design & Materials",
  "Clinic & Build Types",
  "Choosing a Contractor",
] as const;

export type BlogTopic = (typeof blogTopics)[number];

/** One line per topic, used as the supporting copy on each index cluster. */
export const topicBlurbs: Record<BlogTopic, string> = {
  Cost: "What each build type runs per square foot, and what a real project totals once the scope is honest.",
  Timelines: "How long each build actually takes, phase by phase, and the things that push the date back.",
  "Permits & Compliance":
    "What each authority wants, in what order, and which of them publishes a review window.",
  "Leases & Planning":
    "The decisions made before a drawing exists — the lease, the allowance, and whether to move at all.",
  "Design & Materials":
    "The specification choices that outlive the build, from flooring to the rooms video visits need.",
  "Clinic & Build Types":
    "What changes when the clinic is an optometry practice, a med spa, a vet hospital or a modular build.",
  "Choosing a Contractor":
    "How the delivery models differ, what to ask before you shortlist, and how to compare bids that priced different scopes.",
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  /** Date the post was written. Drives sitemap lastmod and the byline. */
  published: string;
  /** Service slug this post exists to feed. */
  service: string;
  /** Reader intent. Groups the index; see blogTopics above. */
  topic: BlogTopic;
  /** Short label for index cards and related-reading rails. */
  cardTitle: string;
  /** Reading time in minutes, rounded from the drafted word count. */
  minutes: number;
  /** Slug of the broader post this one is a long-tail child of. */
  childOf?: string;
  /** The lead card on the index. Exactly one post carries it. */
  featured?: boolean;
  /**
   * Overrides the photograph a post opens on. Left unset, postImage() deals one
   * from the pool for the post's vertical, which is what stops six healthcare
   * cards in a row opening on the same frame.
   */
  image?: string;
  /**
   * The post's H2 headings, in document order, for the table of contents.
   *
   * Duplicated from the .mdx body, which is exactly the arrangement that let the
   * FAQ arrays drift from the FAQ prose for months. The difference is that
   * check-trust now compares this list against the "## " lines in the file and
   * fails the build on any mismatch, so the duplication cannot rot.
   */
  sections?: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "dental-clinic-construction-cost-bc",
    title: "How Much Does It Cost to Build a Dental Clinic in BC? (2026)",
    description:
      "What a dental clinic costs to build in BC in 2026, broken down by clinic size, with the line items that move the number most.",
    published: "2026-08-14",
    service: "dental-clinic-construction",
    topic: "Cost",
    cardTitle: "Dental clinic construction cost in BC",
    minutes: 8,
    sections: [
      "Why Dental Clinic Construction Costs More Than a Standard Commercial Build",
      "Dental Clinic Construction Cost by Clinic Size (2026)",
      "What a Full Dental Construction Scope Actually Includes",
      "What Drives the Number Up",
      "A Realistic Way to Budget",
      "Conclusion",
    ],
  },
  {
    slug: "5-operatory-dental-clinic-cost-bc",
    title: "5-Operatory Dental Clinic Cost in BC: A 2026 Line-Item Breakdown",
    description:
      "A real line-item cost breakdown for a 5-operatory dental clinic in BC: square footage, per-operatory costs, plumbing, electrical and equipment.",
    published: "2026-08-13",
    service: "dental-clinic-construction",
    topic: "Cost",
    cardTitle: "5-operatory dental clinic cost",
    minutes: 9,
    childOf: "dental-clinic-construction-cost-bc",
    sections: [
      "Cost Breakdown by Line Item",
      "Cost Per Operatory: What Is Actually in That Number",
      "Equipment Costs for a 5-Chair Clinic (Separate From Construction)",
      "How This Compares to Other Clinic Sizes",
      "Conclusion",
    ],
  },
  {
    slug: "dental-clinic-build-timeline",
    title: "Dental Clinic Build Timeline: From Lease Signing to First Patient",
    description:
      "A realistic dental clinic build timeline for BC, phase by phase from lease signing to opening day, plus the delays that push it back.",
    published: "2026-08-11",
    service: "dental-clinic-construction",
    topic: "Timelines",
    cardTitle: "Dental clinic build timeline",
    minutes: 8,
    sections: [
      "Phase by Phase",
      "What Commonly Causes Delays",
      "Where Dental and Medical Timelines Diverge",
      "Conclusion",
    ],
  },
  {
    slug: "commercial-lease-for-a-clinic-checklist",
    title: "12 Things to Check Before You Sign a Commercial Lease for a Clinic",
    description:
      "A 12-point clinic lease checklist covering the buildout issues that cost the most when they surface after signing rather than before.",
    published: "2026-08-12",
    service: "healthcare-construction",
    topic: "Leases & Planning",
    cardTitle: "Clinic lease checklist",
    minutes: 9,
    sections: [
      "The 12 Things to Verify",
      "Quick Reference",
      "Why CSA Z8000 Belongs in Your Lease Review",
      "A Note on Scope",
      "Conclusion",
    ],
  },
  {
    slug: "tenant-improvement-allowance-explained",
    title: "Tenant Improvement Allowance Explained: What It Covers",
    description:
      "What a tenant improvement allowance actually covers, what it rarely does, and how to price your buildout against it before signing.",
    published: "2026-08-06",
    service: "office-renovation-contractor",
    topic: "Leases & Planning",
    cardTitle: "Tenant improvement allowance",
    minutes: 7,
    sections: [
      "Who Pays for What",
      "How to Get More Before You Sign",
      "Conclusion",
    ],
  },
  {
    slug: "base-building-vs-tenant-improvement",
    title: "Base Building vs. Tenant Improvement: What Your Landlord Is Responsible For",
    description:
      "Where the landlord's base building scope ends and your tenant improvement begins — and why the boundary decides your budget.",
    published: "2026-08-05",
    service: "commercial-renovation",
    topic: "Leases & Planning",
    cardTitle: "Base building vs tenant improvement",
    minutes: 7,
    sections: [
      "What Is Actually in the Shell",
      "Where the Line Falls",
      "Why This Decides Your Budget",
      "Conclusion",
    ],
  },
  {
    slug: "dental-office-renovation-timeline",
    title: "How Long Does It Take to Renovate a Dental Office?",
    description:
      "A realistic dental office renovation timeline for BC practices, including how to keep seeing patients while the work runs.",
    published: "2026-08-08",
    service: "dental-office-renovation",
    topic: "Timelines",
    cardTitle: "Dental office renovation timeline",
    minutes: 7,
    sections: [
      "Renovation Timeline by Phase",
      "Where the Time Actually Goes",
      "Scope Changes the Timeline",
      "What Extends a Renovation",
      "Renovating While Staying Open",
      "Conclusion",
    ],
  },
  {
    slug: "dental-office-renovation-checklist",
    title: "Dental Office Renovation Checklist: 12 Steps",
    description:
      "A 12-step dental office renovation checklist for BC practices, ordered the way the work actually has to happen.",
    published: "2026-08-07",
    service: "dental-office-renovation",
    topic: "Leases & Planning",
    cardTitle: "Dental office renovation checklist",
    minutes: 8,
    sections: [
      "The 12 Steps",
      "Quick Reference",
      "Finding the Right Contractor",
      "Conclusion",
    ],
  },
  {
    slug: "medical-clinic-construction-permits-bc",
    title: "Medical Clinic Construction Permits in BC: A Step-by-Step Guide",
    description:
      "The permits a medical clinic build needs in BC — municipal, health authority, Technical Safety BC — and the order to pursue them in.",
    published: "2026-08-10",
    service: "medical-clinic-construction",
    topic: "Permits & Compliance",
    cardTitle: "Medical clinic permits in BC",
    minutes: 9,
    sections: [
      "What Permits Are Required",
      "The Permit Process, Step by Step",
      "Permit by Authority",
      "What Makes Medical Office Construction Different",
      "Conclusion",
    ],
  },
  {
    slug: "commercial-renovation-vs-new-construction",
    title: "Commercial Renovation vs. New Construction: Which Is Right for You?",
    description:
      "How to decide between renovating an existing commercial space and building new, on cost, timeline and risk.",
    published: "2026-08-09",
    service: "commercial-construction",
    topic: "Leases & Planning",
    cardTitle: "Renovation vs new construction",
    minutes: 8,
    sections: [
      "The Core Differences",
      "What a Renovation Actually Involves",
      "What New Construction Involves",
      "How to Decide",
      "Conclusion",
    ],
  },
  {
    slug: "luxury-home-builder-vs-general-contractor",
    title: "Luxury Home Builder vs. General Contractor: What's the Real Difference?",
    description:
      "What separates a luxury home builder from a general contractor, and which one a high-finish BC build actually needs.",
    published: "2026-08-04",
    service: "luxury-residential-construction",
    topic: "Choosing a Contractor",
    cardTitle: "Luxury builder vs general contractor",
    minutes: 7,
    sections: [
      "Side by Side",
      "What a Luxury Home Builder Actually Does",
      "What a General Contractor Does",
      "How to Choose",
      "Conclusion",
    ],
  },
  {
    slug: "csa-z8000-compliance-checklist",
    title: "CSA Z8000 Compliance Checklist for Healthcare Facility Construction",
    description:
      "A CSA Z8000 compliance checklist for healthcare facility construction in BC — space planning, infection control, ventilation, and what to verify before drawings.",
    published: "2026-08-18",
    service: "healthcare-construction",
    topic: "Permits & Compliance",
    cardTitle: "CSA Z8000 compliance checklist",
    minutes: 10,
    sections: [
      "What CSA Z8000 Actually Covers",
      "Is CSA Z8000 Mandatory in British Columbia?",
      "The CSA Z8000 Compliance Checklist",
      "Where CSA Z8000 Projects Go Wrong in BC",
      "How This Changes What You Should Budget",
      "Conclusion",
    ],
  },
  {
    slug: "medical-clinic-construction-cost-per-square-foot",
    title: "Medical Clinic Construction Cost Per Square Foot in Canada (2026)",
    description:
      "Medical clinic construction cost per square foot in BC, with totals by clinic size and how the rate compares to office, dental and healthcare build types.",
    published: "2026-08-18",
    service: "medical-clinic-construction",
    topic: "Cost",
    cardTitle: "Medical clinic cost per square foot",
    minutes: 9,
    sections: [
      "Medical Clinic Construction Cost by Size",
      "Medical Clinic Construction Cost in BC Specifically",
      "How Medical Clinic Cost Compares to Other Build Types",
      "What Drives Medical Clinic Cost Per Square Foot",
      "What the Per-Square-Foot Rate Does Not Include",
      "Using a Per-Square-Foot Rate Properly",
      "Conclusion",
    ],
  },
  {
    slug: "pharmacy-build-out-cost-bc",
    title: "Pharmacy Build-Out Cost Guide: What BC Pharmacy Owners Need to Know",
    description:
      "Pharmacy build-out cost in BC by size, where the budget actually goes, and what dispensary security and compounding add to a pharmacy construction project.",
    published: "2026-08-18",
    service: "pharmacy-construction",
    topic: "Cost",
    cardTitle: "Pharmacy build-out cost in BC",
    minutes: 9,
    sections: [
      "Pharmacy Build-Out Cost by Size",
      "Where the Money Actually Goes",
      "How Pharmacy Cost Compares to Other Healthcare Builds",
      "Standalone Retail vs. a Unit Inside a Medical Building",
      "What to Verify Before You Sign the Lease",
      "Conclusion",
    ],
  },
  {
    slug: "how-to-choose-a-commercial-general-contractor",
    title: "How to Choose a Healthcare Construction Contractor in BC: 10 Questions to Ask",
    description:
      "The ten questions to ask a healthcare construction contractor in BC before you shortlist, what a good answer sounds like, and how to compare bids that priced different scopes.",
    published: "2026-08-18",
    service: "healthcare-construction",
    topic: "Choosing a Contractor",
    cardTitle: "10 questions for a healthcare contractor",
    minutes: 11,
    sections: [
      "What to Look For in a Healthcare Construction Contractor",
      "Why a Medical Clinic Is Not a Standard Commercial Fit-Out",
      "The Seven Checks Before You Shortlist",
      "How to Compare Bids That Are Not Comparable",
      "The 10 Questions to Ask a Healthcare Construction Contractor",
      "Red Flags Worth Walking Away From",
      "Where Cost Should and Should Not Drive the Decision",
      "Conclusion",
    ],
  },
  {
    slug: "optometry-clinic-construction",
    title: "Optometry & Eye Clinic Construction: What to Know Before You Build",
    description:
      "Optometry clinic construction in BC — cost by size, how refraction method sets your floor plan, and the dispensary and equipment scope owners underestimate.",
    published: "2026-08-18",
    service: "medical-clinic-construction",
    topic: "Clinic & Build Types",
    cardTitle: "Optometry clinic construction",
    minutes: 10,
    sections: [
      "Optometry Clinic Construction Cost by Size",
      "The Exam Lane Question That Decides Your Floor Plan",
      "The Dispensary Is a Retail Build Inside a Clinical Build",
      "Equipment Coordination Is the Real Schedule Risk",
      "How an Eye Clinic Compares to Other Healthcare Builds",
      "What to Verify Before Signing the Lease",
      "Conclusion",
    ],
  },
  {
    slug: "physiotherapy-med-spa-clinic-construction",
    title: "Physiotherapy & Med Spa Clinic Build-Out Guide (BC)",
    description:
      "Physiotherapy clinic construction and med spa construction in BC — why open rehab floor and enclosed treatment rooms sit at opposite ends of the same cost band.",
    published: "2026-08-18",
    service: "healthcare-construction",
    topic: "Clinic & Build Types",
    cardTitle: "Physiotherapy & med spa build-out",
    minutes: 9,
    sections: [
      "What Each Build Type Actually Needs",
      "Physiotherapy Clinic Construction",
      "Med Spa Construction",
      "Cost by Size",
      "Building Both in One Tenancy",
      "Conclusion",
    ],
  },
  {
    slug: "office-renovation-cost-metro-vancouver",
    title: "Office Renovation Cost Guide for Metro Vancouver Businesses",
    description:
      "Office renovation cost in Metro Vancouver by size, refresh against full fit-out, what drives commercial construction cost per square foot, and what the landlord pays.",
    published: "2026-08-18",
    service: "office-renovation-contractor",
    topic: "Cost",
    cardTitle: "Office renovation cost in Metro Vancouver",
    minutes: 10,
    sections: [
      "Office Renovation Cost by Size",
      "Refresh or Fit-Out: The Decision That Sets Your Budget",
      "What Actually Drives Office Renovation Cost",
      "How Office Cost Compares to Other Commercial Builds",
      "What the Landlord Pays For",
      "Getting Comparable Bids",
      "Conclusion",
    ],
  },
  {
    slug: "best-flooring-for-medical-dental-clinics",
    title: "Best Flooring for Medical & Dental Clinics: Compliance and Durability Compared",
    description:
      "The best flooring for medical and dental clinics, zone by zone — why welded sheet vinyl owns the clinical areas, where LVT and rubber belong, and the installation details that decide lifespan.",
    published: "2026-08-20",
    service: "healthcare-construction",
    topic: "Design & Materials",
    cardTitle: "Best flooring for clinics",
    minutes: 9,
    sections: [
      "Why Clinic Flooring Is a Compliance Decision First",
      "Clinic Flooring Types Compared",
      "Zone by Zone: What We Specify and Why",
      "The Installation Details That Decide Lifespan",
      "How Flooring Fits the Budget",
      "Conclusion",
    ],
  },
  {
    slug: "clinic-design-trends-bc",
    title: "Medical & Dental Clinic Design Trends in BC for 2026",
    description:
      "The ten clinic design trends shaping BC medical and dental builds in 2026 — telehealth rooms, standardized footprints, acoustic privacy — and which must be decided before permit drawings.",
    published: "2026-08-20",
    service: "medical-clinic-construction",
    topic: "Design & Materials",
    cardTitle: "Clinic design trends in BC",
    minutes: 9,
    sections: [
      "The 10 Clinic Design Trends Shaping BC Builds in 2026",
      "What These Trends Mean for a Construction Budget",
      "Conclusion",
    ],
  },
  {
    slug: "modular-vs-traditional-clinic-construction",
    title: "Modular vs. Traditional Clinic Build-Outs: Cost & Timeline Compared",
    description:
      "Modular vs. traditional clinic construction compared honestly — where volumetric modular can physically go, why it saves schedule rather than money, and the prefab middle ground leased clinics actually use.",
    published: "2026-08-20",
    service: "healthcare-construction",
    topic: "Clinic & Build Types",
    cardTitle: "Modular vs traditional clinic build-outs",
    minutes: 9,
    sections: [
      "First, the Definitions",
      "Where Each Approach Can Physically Go",
      "Modular vs. Traditional: The Comparison",
      "The Cost Conversation, Honestly",
      "The Timeline Conversation — Modular's Real Advantage",
      "What We Recommend Clinic Owners Actually Do",
      "Conclusion",
    ],
  },
  {
    slug: "small-clinic-renovation-maximize-space",
    title: "Small Clinic Renovation: How to Maximize Space in Under 1,500 Sq Ft",
    description:
      "How a small clinic renovation reclaims the equivalent of a full exam room in under 1,500 sq ft — standardized rooms, sliding doors, a smaller waiting area — and what the work costs in BC.",
    published: "2026-08-20",
    service: "commercial-renovation",
    topic: "Design & Materials",
    cardTitle: "Small clinic renovation",
    minutes: 9,
    sections: [
      "Start With Utilization, Not With Walls",
      "The Space-Maximizing Moves, Ranked",
      "What a Small Clinic Renovation Costs",
      "Keeping the Practice Open While the Work Runs",
      "Conclusion",
    ],
  },
  {
    slug: "veterinary-clinic-construction",
    title: "Veterinary Clinic Construction: What's Different from Medical Clinic Build-Outs",
    description:
      "How veterinary clinic construction differs from medical clinic build-outs — washdown finishes and drains, kennel acoustics, species-separated waiting, and the CVBC accreditation path.",
    published: "2026-08-20",
    service: "healthcare-construction",
    topic: "Clinic & Build Types",
    cardTitle: "Veterinary clinic construction",
    minutes: 9,
    sections: [
      "What Transfers Directly from Medical Clinic Construction",
      "The Five Differences That Define a Vet Build",
      "Approvals: A Different Path Than a Human Clinic",
      "What This Means for Budget and Schedule",
      "Conclusion",
    ],
  },
  {
    slug: "build-or-renovate-clinic-2026",
    title: "Should You Build or Renovate Your Clinic in 2026? Cost & Financing Factors",
    description:
      "Build or renovate your clinic in 2026? The current rate picture — 2.25% policy rate, 4.45% prime — against 3.5% construction cost escalation, and how to run the decision on fundamentals.",
    published: "2026-08-21",
    service: "commercial-construction",
    topic: "Leases & Planning",
    cardTitle: "Build or renovate your clinic in 2026",
    minutes: 9,
    childOf: "commercial-renovation-vs-new-construction",
    sections: [
      "The 2026 Numbers That Frame the Decision",
      "What Lower Rates Change — and What They Don't",
      "The Cost Side in 2026",
      "The Waiting Math, Run Honestly",
      "Financing Factors, Route by Route",
      "When 2026 Favors Each Answer",
      "Conclusion",
    ],
  },
  {
    slug: "telehealth-clinic-design",
    title: "Designing a Clinic for Telehealth: Construction Considerations for Hybrid Care",
    description:
      "Telehealth clinic design for hybrid care — the acoustic walls, camera-first lighting, cabling and room sizing that turn video visits into planned capacity instead of an improvised corner.",
    published: "2026-08-20",
    service: "medical-clinic-construction",
    topic: "Design & Materials",
    cardTitle: "Telehealth clinic design",
    minutes: 9,
    sections: [
      "Why Telehealth Changes the Floor Plan at All",
      "The Four Construction Requirements That Matter",
      "Dedicated Room, Dual-Purpose Room, or Cart?",
      "Retrofitting Telehealth Into an Existing Clinic",
      "Conclusion",
    ],
  },
  {
    slug: "pharmacy-build-timeline-bc",
    title: "Pharmacy Build-Out Timeline in BC: From Lease to Licensed Dispensary",
    description:
      "A realistic pharmacy construction timeline for BC, phase by phase from lease to a licensed dispensary, including where College of Pharmacists of BC approval sits in the sequence.",
    published: "2026-08-22",
    service: "pharmacy-construction",
    topic: "Timelines",
    cardTitle: "Pharmacy build-out timeline",
    minutes: 9,
    sections: [
      "The Pharmacy Build Timeline at a Glance",
      "Phase 1 — Site Selection and Lease Review",
      "Phase 2 — Design and Construction Drawings",
      "Phase 3 — Permits and Approvals",
      "Phase 4 — Construction",
      "Phase 5 — Licensing and the Pre-Opening Inspection",
      "Phase 6 — Fixturing, Inventory and Systems",
      "The Four Things That Actually Cause Delay",
      "What Can Run in Parallel",
      "Conclusion",
    ],
  },
  {
    slug: "clinic-renovation-vs-relocation-bc",
    title: "Clinic Renovation vs. Relocation: Which Costs Less in BC?",
    description:
      "Renovating the clinic you have against moving to a new one in BC — the construction cost of each, the costs that only appear when you move, and the case each way.",
    published: "2026-08-23",
    service: "clinic-renovation-contractor",
    topic: "Cost",
    cardTitle: "Clinic renovation vs relocation",
    minutes: 10,
    sections: [
      "The Construction Cost, Side by Side",
      "The Costs That Only Appear If You Move",
      "The Costs That Only Appear If You Stay",
      "Production Is the Number Nobody Models",
      "When Renovation Wins",
      "When Relocation Wins",
      "How to Run the Decision",
      "Related Reading",
      "Conclusion",
    ],
  },
  {
    slug: "commercial-renovation-permits-bc",
    title: "What Permits Do You Need for a Commercial Renovation in BC?",
    description:
      "The permits a commercial renovation needs in BC — building, trade, and the approvals that come before them — plus which Lower Mainland cities publish a review window and which do not.",
    published: "2026-08-23",
    service: "commercial-renovation",
    topic: "Permits & Compliance",
    cardTitle: "Commercial renovation permits in BC",
    minutes: 10,
    sections: [
      "The Permits, in the Order They Are Needed",
      "Which Code Applies Depends on Where You Are",
      "What Each Municipality Publishes",
      "Surrey's Numbers, and What They Actually Mean",
      "Nobody Else Publishes One — Plan Accordingly",
      "Change of Use Is Where Budgets Break",
      "Use the Review Period",
      "Conclusion",
    ],
  },
  {
    slug: "design-build-vs-general-contracting",
    title: "Design-Build vs. General Contracting: Which Model Fits Your Clinic or Commercial Space?",
    description:
      "Design-build against design-bid-build for a clinic or commercial fit-out — who carries the coordination risk in each, what changes about the price you are quoted, and how to choose.",
    published: "2026-08-24",
    service: "commercial-construction",
    topic: "Choosing a Contractor",
    cardTitle: "Design-build vs general contracting",
    minutes: 10,
    sections: [
      "The Two Models, Defined",
      "Who Carries the Risk When Drawings and Reality Disagree",
      "What Changes About the Price",
      "Schedule",
      "Where Design-Bid-Build Genuinely Wins",
      "Where Design-Build Genuinely Wins",
      "What This Means for a Clinic Specifically",
      "How to Choose",
      "Conclusion",
    ],
  },
  {
    slug: "best-construction-company-vancouver-comparison",
    title:
      "Oberizon vs. Gibraltar, Seasons Contracting & Medico Construction: Which Vancouver Contractor Should You Choose in 2026?",
    description:
      "Four Vancouver healthcare and commercial contractors compared on what each one publishes about itself, with sources — plus how to vet any contractor before you sign.",
    published: "2026-08-24",
    service: "healthcare-construction",
    topic: "Choosing a Contractor",
    cardTitle: "Vancouver contractors compared",
    minutes: 11,
    sections: [
      "How to Read This Comparison",
      "The Four, Side by Side",
      "Gibraltar Construction",
      "Seasons Contracting Ltd",
      "Medico Construction & Design",
      "Oberizon Construction",
      "Which Profile Fits Which Project",
      "How to Vet Any Contractor Before You Sign",
      "Comparing the Quotes, Not the Companies",
      "Conclusion",
    ],
  },
  {
    slug: "luxury-home-construction-cost-vancouver",
    title: "Luxury Home Construction Cost in Vancouver, BC (2026 Price Guide)",
    description:
      "What a luxury home costs to build in Vancouver and the Lower Mainland in 2026 — per square foot, by house size, and the finish decisions that move the number most.",
    published: "2026-08-25",
    service: "luxury-residential-construction",
    topic: "Cost",
    cardTitle: "Luxury home construction cost",
    minutes: 10,
    sections: [
      "Luxury Home Construction Cost by Size",
      "Where the Money Actually Goes",
      "The Five Decisions That Move the Number Most",
      "What the Band Does Not Include",
      "What BC Requires of a New Home Build",
      "How the Timeline Runs",
      "Building New Against Renovating a High-End Home",
      "Choosing Who Builds It",
      "Conclusion",
    ],
  },
  {
    slug: "commercial-tenant-improvement-cost-per-square-foot",
    title: "Commercial Tenant Improvement Cost Per Square Foot in Vancouver (2026)",
    description:
      "Commercial tenant improvement cost per square foot in Vancouver for 2026, every build type in one table — office, retail, medical, dental, pharmacy — and what the landlord's allowance covers.",
    published: "2026-08-25",
    service: "commercial-renovation",
    topic: "Cost",
    cardTitle: "Commercial TI cost per square foot",
    minutes: 11,
    featured: true,
    sections: [
      "Tenant Improvement Cost Per Square Foot, by Build Type",
      "Why the Same Square Foot Costs So Differently",
      "Where a Tenant Improvement Budget Actually Goes",
      "What the Base Building Gives You, and What It Does Not",
      "The Landlord's Allowance",
      "How to Compare Two Quotes That Do Not Match",
      "Cost Guides for Specific Build Types",
      "Conclusion",
    ],
  },
];

export const blogIndexPath = "/blog";

export function postPath(slug: string) {
  return `${blogIndexPath}/${slug}`;
}

export function getPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

/** Posts feeding a given service page, newest first. */
export function postsForService(serviceSlug: string) {
  return blogPosts
    .filter((post) => post.service === serviceSlug)
    .sort((a, b) => b.published.localeCompare(a.published));
}

/** Posts answering a given question type, newest first. */
export function postsForTopic(topic: BlogTopic) {
  return blogPosts
    .filter((post) => post.topic === topic)
    .sort((a, b) => b.published.localeCompare(a.published));
}

/** Every post, newest first — the order the index renders in. */
export function postsByDate() {
  return [...blogPosts].sort((a, b) => b.published.localeCompare(a.published));
}

/** The lead card on the index. Falls back to the newest post. */
export function featuredPost() {
  return blogPosts.find((post) => post.featured) ?? postsByDate()[0];
}

/**
 * The id an H2 gets, and the anchor the table of contents points at.
 *
 * Shared deliberately: mdx-components.tsx stamps the id and BlogArticle builds
 * the href, and if the two ever computed it separately every link in every
 * contents list would silently scroll nowhere.
 */
export function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * The photograph a post opens on, and the one it shares as.
 *
 * The seed is the post's position among the posts of its own vertical, not its
 * position in the registry. Seeding on the registry index looks equivalent and
 * is not: the Residential pool holds two photographs and the two residential
 * posts sit at registry positions 10 and 30, so both landed on image 0 and the
 * cost guide and the comparison opened on the same frame. Counting within the
 * vertical makes the assignment a round robin, which is the most even spread
 * the available photography allows.
 */
export function postImage(post: BlogPost) {
  if (post.image) return post.image;

  const verticalOf = (slug: string) =>
    constructionServices.find((service) => service.slug === slug)?.vertical;
  const vertical = verticalOf(post.service);
  const peers = blogPosts.filter((item) => verticalOf(item.service) === vertical);

  return postHeroImage(post.service, Math.max(0, peers.indexOf(post)));
}

/**
 * Metadata for a post, through the same builder every other page uses, so
 * canonical, Open Graph, robots and metadataBase cannot drift from the site.
 *
 * The image argument has existed since this was written and no post ever passed
 * one, so every article shared as the same commercial hero — thirty-two links
 * that looked like the same link. Defaulting it to the post's own photograph
 * fixes all of them without touching a single .mdx file.
 */
export function blogMetadata(slug: string, image?: string): Metadata {
  const post = getPost(slug);
  if (!post) return {};

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: postPath(post.slug),
    image: image ?? postImage(post),
  });
}
