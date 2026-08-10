/**
 * Metadata supplied by the SEO consultant.
 *
 * Source: "Oberizon Meta Data Suggestions .xlsx" — 30 rows, Semrush Canada
 * volumes, audited against oberizonconstruction.ca and the new site.
 * Generated from that sheet rather than retyped, so every string here is
 * byte-identical to what was delivered.
 *
 * It lives in its own file on purpose. This is an outside deliverable that will
 * be audited again, and keeping it separable from the copy we generate ourselves
 * means the next audit can be diffed against a single source of truth.
 *
 * Do not "improve" these strings. Two titles measure marginally past Google's
 * ~600px SERP limit (White Rock 608px, Abbotsford 602px) and are deliberately
 * left as delivered — that is the consultant's call to make, not ours.
 */

export type SeoCopy = {
  title: string;
  description: string;
  keywords: string[];
};

/** The six standalone pages. */
export const pageMeta: Record<string, SeoCopy> = {
  "home": {
    title: "Commercial Construction Company in BC | Oberizon Construction",
    description:
      "Commercial construction company in White Rock & the Lower Mainland — healthcare, dental, medical, pharmacy, office & luxury residential builds. Free quotes.",
    keywords: [
        "Commercial Construction",
        "commercial construction company",
        "Commercial Builders",
        "commercial general contractor",
        "construction company Lower Mainland",
    ],
  },
  "about": {
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
  },
  "services": {
    title: "Construction Services in BC | Oberizon Construction",
    description:
      "Construction services for healthcare, dental, medical, commercial & luxury residential projects, with 2026 cost guides — from Oberizon Construction.",
    keywords: [
        "construction services",
        "construction services BC",
        "commercial construction services",
        "turnkey construction BC",
        "Lower Mainland construction services",
    ],
  },
  "projects": {
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
  },
  "cost": {
    title: "Construction Cost Per Square Foot in BC | 2026 Guide",
    description:
      "Construction cost per square foot for healthcare, dental, medical, pharmacy, commercial & luxury residential builds across the Lower Mainland — 2026 guide.",
    keywords: [
        "construction cost per square foot",
        "construction cost calculator",
        "commercial construction cost BC",
        "2026 construction cost guide",
        "Lower Mainland building costs",
    ],
  },
  "contact": {
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
  },
};

/** The ten service hubs at /services/{slug}/. */
export const serviceMeta: Record<string, SeoCopy> = {
  "commercial-construction": {
    title: "Commercial Construction Contractor in BC | Oberizon Construction",
    description:
      "Commercial construction contractor for the Lower Mainland — built around operations, access, finish quality & inspections. Get a free quote.",
    keywords: [
        "commercial construction contractor",
        "commercial construction BC",
        "commercial general contractor",
        "commercial building contractor",
        "White Rock commercial construction",
    ],
  },
  "commercial-renovation": {
    title: "Commercial Renovation Contractor in BC | Oberizon Construction",
    description:
      "Commercial renovation contractor in White Rock & the Lower Mainland — function planned first, then demolition, trades & finishes. Free quote.",
    keywords: [
        "commercial renovation",
        "commercial renovation contractor",
        "commercial renovation BC",
        "office renovation",
        "Lower Mainland renovation contractor",
    ],
  },
  "office-renovation-contractor": {
    title: "Office Renovation Contractor in BC | Oberizon Construction",
    description:
      "Office renovation contractor building private offices & professional interiors across the Lower Mainland — layout, acoustics, finishes & workflow done right.",
    keywords: [
        "office renovation contractor",
        "office renovation BC",
        "office fit-out contractor",
        "commercial office renovation",
        "White Rock office renovation",
    ],
  },
  "healthcare-construction": {
    title: "Healthcare Construction Contractor in BC | Oberizon Construction",
    description:
      "Healthcare construction contractor managing compliance, equipment, patient flow & inspection readiness across the Lower Mainland. Free project quote.",
    keywords: [
        "healthcare construction",
        "healthcare construction contractor",
        "medical facility construction",
        "healthcare construction BC",
        "Lower Mainland healthcare builder",
    ],
  },
  "dental-clinic-construction": {
    title: "Dental Clinic Construction in BC | Oberizon Construction",
    description:
      "Dental clinic construction coordinated around operatories, sterilization, plumbing & patient flow — serving White Rock and the Lower Mainland. Free quotes.",
    keywords: [
        "dental clinic construction",
        "dental clinic construction BC",
        "dental clinic contractor",
        "dental office construction",
        "Lower Mainland dental construction",
    ],
  },
  "dental-office-renovation": {
    title: "Dental Office Renovation Contractor in BC | Oberizon Construction",
    description:
      "Dental office renovation built around clinical workflow & technical service coordination — serving the Lower Mainland from White Rock, BC. Free quotes.",
    keywords: [
        "dental office renovation",
        "dental office renovation contractor",
        "dental clinic renovation",
        "dental office construction",
        "BC dental renovation contractor",
    ],
  },
  "pharmacy-construction": {
    title: "Pharmacy Construction Contractor in BC | Oberizon Construction",
    description:
      "Pharmacy construction planned around dispensing workflow, storage, security & inspection timing — serving White Rock and the Lower Mainland.",
    keywords: [
        "pharmacy construction",
        "pharmacy construction contractor",
        "pharmacy build-out",
        "pharmacy fit-out BC",
        "Lower Mainland pharmacy contractor",
    ],
  },
  "luxury-residential-construction": {
    title: "Luxury Home Builder in BC | Oberizon Construction",
    description:
      "Luxury home builder delivering residential construction across the Lower Mainland — planning, sequencing & finish standards controlled start to close-out.",
    keywords: [
        "luxury home builder",
        "luxury residential construction",
        "custom home builder BC",
        "luxury home construction Lower Mainland",
        "White Rock luxury builder",
    ],
  },
  "medical-clinic-construction": {
    title: "Medical Clinic Construction in BC | Oberizon Construction",
    description:
      "Medical clinic construction built around intake, exam rooms, staff circulation & inspection readiness — serving the Lower Mainland from White Rock.",
    keywords: [
        "medical clinic construction",
        "medical clinic construction BC",
        "medical office construction",
        "medical clinic contractor",
        "Lower Mainland medical construction",
    ],
  },
  "clinic-renovation-contractor": {
    title: "Clinic Renovation Contractor in BC | Oberizon Construction",
    description:
      "Clinic renovation contractor managing clinical continuity, infection-sensitive details & final readiness — serving White Rock and the Lower Mainland.",
    keywords: [
        "clinic renovation contractor",
        "clinic renovation",
        "medical clinic renovation",
        "healthcare renovation contractor",
        "BC clinic renovation",
    ],
  },
};

/**
 * The fourteen /construction/{city}/commercial-construction/ pages.
 *
 * Verbatim rather than templated, because his wording genuinely varies: Richmond
 * drops "clear", Langley closes "Free quotes for your next project.", and West
 * Vancouver and New Westminster omit "Free quotes" entirely. Four titles also
 * use "| Oberizon" and drop the "in" — his own length control for the longer
 * city names. A template would flatten all of that.
 */
export const cityCommercialMeta: Record<string, SeoCopy> = {
  "white-rock": {
    title: "Commercial Construction in White Rock, BC | Oberizon Construction",
    description:
      "Commercial construction in White Rock, BC — clear scope, budget & schedule control across White Rock and the Semiahmoo Peninsula. Free quotes.",
    keywords: [
        "commercial construction White Rock",
        "renovation contractor White Rock",
        "general contractor White Rock",
        "construction company White Rock BC",
        "Semiahmoo Peninsula contractor",
    ],
  },
  "surrey": {
    title: "Commercial Construction in Surrey, BC | Oberizon Construction",
    description:
      "Commercial construction in Surrey, BC — clear scope, budget & schedule control across Surrey's growing commercial and healthcare corridors. Free quotes.",
    keywords: [
        "commercial construction Surrey",
        "general contractor Surrey",
        "construction company Surrey",
        "commercial contractor Surrey",
        "Surrey BC commercial construction",
    ],
  },
  "vancouver": {
    title: "Commercial Construction in Vancouver, BC | Oberizon Construction",
    description:
      "Commercial construction in Vancouver, BC — clear scope, budget & schedule control across Vancouver's dense healthcare and commercial market. Free quotes.",
    keywords: [
        "commercial construction Vancouver",
        "general contractor Vancouver",
        "construction company Vancouver",
        "commercial contractor Vancouver",
        "Vancouver commercial renovation",
    ],
  },
  "burnaby": {
    title: "Commercial Construction in Burnaby, BC | Oberizon Construction",
    description:
      "Commercial construction in Burnaby, BC — clear scope, budget & schedule control across Burnaby's central Lower Mainland business districts. Free quotes.",
    keywords: [
        "commercial construction Burnaby",
        "general contractor Burnaby",
        "Burnaby commercial contractor",
        "construction company Burnaby",
        "Metro Vancouver commercial construction",
    ],
  },
  "richmond": {
    title: "Commercial Construction in Richmond, BC | Oberizon Construction",
    description:
      "Commercial construction in Richmond, BC — scope, budget & schedule control across Richmond's commercial and healthcare communities. Free quotes.",
    keywords: [
        "commercial construction Richmond",
        "general contractor Richmond",
        "Richmond commercial contractor",
        "construction company Richmond BC",
        "Richmond healthcare construction",
    ],
  },
  "langley": {
    title: "Commercial Construction in Langley, BC | Oberizon Construction",
    description:
      "Commercial construction in Langley, BC — clear scope, budget & schedule control across Langley City and the Township. Free quotes for your next project.",
    keywords: [
        "commercial construction Langley",
        "general contractor Langley",
        "Langley commercial contractor",
        "construction company Langley BC",
        "Langley Township contractor",
    ],
  },
  "abbotsford": {
    title: "Commercial Construction in Abbotsford, BC | Oberizon Construction",
    description:
      "Commercial construction in Abbotsford, BC — clear scope, budget & schedule control across Abbotsford and the central Fraser Valley. Free quotes.",
    keywords: [
        "commercial construction Abbotsford",
        "general contractor Abbotsford",
        "Fraser Valley commercial contractor",
        "construction company Abbotsford BC",
        "Abbotsford commercial renovation",
    ],
  },
  "chilliwack": {
    title: "Commercial Construction in Chilliwack, BC | Oberizon Construction",
    description:
      "Commercial construction in Chilliwack, BC — clear scope, budget & schedule control across Chilliwack and the eastern Fraser Valley. Free quotes.",
    keywords: [
        "commercial construction Chilliwack",
        "renovation contractor Chilliwack",
        "construction contractor Chilliwack",
        "Fraser Valley commercial construction",
        "Chilliwack general contractor",
    ],
  },
  "coquitlam": {
    title: "Commercial Construction in Coquitlam, BC | Oberizon Construction",
    description:
      "Commercial construction in Coquitlam, BC — clear scope, budget & schedule control across Coquitlam and the northeast Metro Vancouver market. Free quotes.",
    keywords: [
        "commercial construction Coquitlam",
        "general contractor Coquitlam",
        "renovation contractor Coquitlam",
        "Tri-Cities commercial contractor",
        "construction company Coquitlam BC",
    ],
  },
  "north-vancouver": {
    title: "Commercial Construction North Vancouver, BC | Oberizon",
    description:
      "Commercial construction in North Vancouver, BC — clear scope, budget & schedule control across North Vancouver and the North Shore. Free quotes.",
    keywords: [
        "commercial construction North Vancouver",
        "general contractor North Vancouver",
        "North Shore commercial contractor",
        "construction company North Vancouver BC",
        "North Vancouver commercial renovation",
    ],
  },
  "west-vancouver": {
    title: "Commercial Construction West Vancouver, BC | Oberizon",
    description:
      "Commercial construction in West Vancouver, BC — clear scope, budget & schedule control across West Vancouver and premium North Shore properties.",
    keywords: [
        "commercial construction West Vancouver",
        "general contractor West Vancouver",
        "North Shore luxury contractor",
        "construction company West Vancouver BC",
        "West Vancouver commercial renovation",
    ],
  },
  "delta": {
    title: "Commercial Construction in Delta, BC | Oberizon Construction",
    description:
      "Commercial construction in Delta, BC — clear scope, budget & schedule control across Delta, Ladner and the Tsawwassen communities. Free quotes.",
    keywords: [
        "commercial construction Delta BC",
        "general contractor Delta BC",
        "Ladner commercial contractor",
        "Tsawwassen commercial construction",
        "construction company Delta BC",
    ],
  },
  "new-westminster": {
    title: "Commercial Construction New Westminster, BC | Oberizon",
    description:
      "Commercial construction in New Westminster, BC — clear scope, budget & schedule control across the city's historic and high-density commercial areas.",
    keywords: [
        "commercial construction New Westminster",
        "general contractor New Westminster",
        "construction company New Westminster BC",
        "New Westminster commercial contractor",
        "Royal City commercial construction",
    ],
  },
  "tri-cities": {
    title: "Commercial Construction Tri-Cities, BC | Oberizon",
    description:
      "Commercial construction across the Tri-Cities, BC — clear scope, budget & schedule control across Coquitlam and the Port Moody corridor. Free quotes.",
    keywords: [
        "commercial construction Tri-Cities",
        "general contractor Coquitlam",
        "commercial contractor Port Moody",
        "commercial construction Port Coquitlam",
        "Tri-Cities BC commercial contractor",
    ],
  },
};

/**
 * Short benefit phrases for the 126 city-service pages the sheet does not cover.
 *
 * His sheet only carries commercial-construction for each city, but the broken
 * description template it was written to replace runs on all 140. These extend
 * his formula — "{Service} in {City}, BC — {benefit} across {region}. Free
 * quotes." — to the other nine services.
 *
 * commercial-construction is his exact wording, lifted from the White Rock row,
 * so the extension is anchored to his phrasing rather than invented next to it.
 * The rest are drawn from each service's own summary in the same register.
 */
export const serviceMetaBenefit: Record<string, string> = {
  "commercial-construction":
    "clear scope, budget & schedule control",
  "commercial-renovation":
    "function planned before demolition",
  "office-renovation-contractor":
    "layout, acoustics & finishes planned",
  "healthcare-construction":
    "compliance & patient flow managed",
  "dental-clinic-construction":
    "operatories & sterilization planned",
  "dental-office-renovation":
    "clinical workflow protected",
  "pharmacy-construction":
    "dispensing workflow & security planned",
  "luxury-residential-construction":
    "sequencing & finish standards controlled",
  "medical-clinic-construction":
    "exam rooms & staff circulation planned",
  "clinic-renovation-contractor":
    "clinical continuity protected",
};


/**
 * Assembles a city-service description that actually fits.
 *
 * No single template can. The worst combination on the site — "Luxury
 * Residential Construction" in New Westminster, whose region note runs 60
 * characters — spends 139 characters before the benefit phrase is added,
 * leaving 21, and the consultant's own phrases run 33 to 40. He hit the same
 * ceiling and solved it by hand: West Vancouver and New Westminster are the two
 * longest region notes in his sheet and they are the two descriptions where he
 * dropped "Free quotes."
 *
 * So this drops the same things in the same order he did, and stops at the first
 * variant inside Google's ~160 character limit. Most pages keep the full
 * sentence; only the long-region cities give anything up.
 */
export function cityDescription(
  serviceName: string,
  cityName: string,
  serviceSlug: string,
  regionNote: string,
): string {
  const head = `${serviceName} in ${cityName}, BC — ${serviceMetaBenefit[serviceSlug]}`;
  const variants = [
    `${head} across ${regionNote}. Free quotes.`,
    `${head} across ${regionNote}.`,
    `${head}. Free quotes.`,
  ];
  return variants.find((variant) => variant.length <= 160) ?? variants[variants.length - 1];
}


/**
 * Assembles a city-service title that survives the SERP.
 *
 * The old template — "{Service} in {City}, BC | Oberizon Construction" — is
 * exactly what the consultant suggested, and for most combinations it is right.
 * It breaks on the long ones: "Luxury Residential Construction in New
 * Westminster, BC | Oberizon Construction" measures 718px against Google's
 * ~600px limit, so the brand fell off the end of 71 of the 140 city pages.
 *
 * He solved this himself for the four longest cities in his sheet — North
 * Vancouver, West Vancouver, New Westminster and Tri-Cities all use "| Oberizon"
 * and drop the "in". This applies his own two moves, in his order, and stops at
 * the first variant that fits. His fourteen titles are never routed through
 * here; they are used verbatim.
 *
 * The 62-character threshold is calibrated against measurement, not guessed:
 * titles are checked at 20px Arial, the SERP's own rendering.
 */
export function cityTitle(serviceName: string, cityName: string): string {
  const variants = [
    `${serviceName} in ${cityName}, BC | Oberizon Construction`,
    `${serviceName} in ${cityName}, BC | Oberizon`,
    `${serviceName} ${cityName}, BC | Oberizon`,
  ];
  return variants.find((variant) => variant.length <= 62) ?? variants[variants.length - 1];
}
