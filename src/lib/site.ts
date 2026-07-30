export type NavItem = {
  label: string;
  href?: string;
  items?: Array<{ label: string; href: string }>;
};

export type SitePage = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  subheading: string;
  heroImage: string;
  introTitle: string;
  intro: string;
  proof: string[];
  featureTitle: string;
  features: Array<{ title: string; text: string }>;
  cards?: Array<{ title: string; text: string; image?: string }>;
  ctaLabel?: string;
  canonicalPath: string;
};

export type ServiceArea = {
  city: string;
  slug: string;
  regionNote: string;
  neighborhoods: string[];
  marketSignals: string;
  localModifier: string;
};

export type SeoService = {
  name: string;
  slug: string;
  keyword: string;
  ctaAngle: string;
  searchIntent: string;
  relatedKeywords: string[];
};

export type PseoPage = {
  city: ServiceArea;
  service: SeoService;
  path: string;
  title: string;
  description: string;
  h1: string;
  primaryKeyword: string;
  keywordCluster: string[];
  intro: string;
  localProof: string;
  marketContext: string;
  serviceFocus: Array<{ title: string; text: string }>;
  serviceBullets: string[];
  faqs: Array<{ question: string; answer: string }>;
  internalLinks: Array<{ label: string; href: string }>;
};

export const siteConfig = {
  name: "The Oberoi Group",
  legalName: "Oberoi Group",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.theoberoigroup.ca",
  tagline: "One team, one track, every real estate need under one roof.",
  email: "jo@jasoberoi.ca",
  phone: "604.385.3770",
  address: "#306 - 1493 Foster Street, White Rock, BC",
  mapsUrl: "https://maps.app.goo.gl/15RXVyvtnzegGi839",
};

export const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/the_oberoi_group/" },
  { label: "TikTok", href: "https://www.tiktok.com/@the_oberoi_group" },
  { label: "YouTube", href: "https://www.youtube.com/@theoberoigroup" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/theoberoigroupofficial/posts/?feedView=all",
  },
  { label: "Facebook", href: "https://www.facebook.com/theoberoigroupofficial" },
];

export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Mission",
    items: [
      { label: "About Us", href: "/about" },
      { label: "Jas Oberoi", href: "/about-jas-oberoi" },
      { label: "Our Culture", href: "/our-culture" },
      { label: "Our Contributions", href: "/our-contributions" },
    ],
  },
  {
    label: "Properties",
    items: [
      { label: "Featured Listing", href: "/featured-listing" },
      { label: "MLS Search", href: "/mls-search" },
      { label: "Commercial Listing", href: "/commercial-listing" },
      { label: "Service Areas", href: "/real-estate" },
    ],
  },
  {
    label: "Market Insights",
    items: [
      { label: "Blog", href: "/blog" },
      { label: "Podcast", href: "/podcast" },
      { label: "Seller's Guide", href: "/sellers-guide" },
      { label: "Buyer's Guide", href: "/buyers-guide" },
    ],
  },
  { label: "Contact Us", href: "/contact" },
];

export const quickLinks = [
  { label: "About Us", href: "/about" },
  { label: "Our Culture", href: "/our-culture" },
  { label: "Featured Listing", href: "/featured-listing" },
  { label: "Commercial Listing", href: "/commercial-listing" },
  { label: "Service Areas", href: "/real-estate" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];

export const stats = [
  { value: "$900M +", label: "Career Sales" },
  { value: "40 Awards", label: "Over 40+ Real Estate Awards" },
  { value: "10 Yrs", label: "Years of Experience" },
];

export const awards = [
  { src: "/assets/images/clients/asset%204.webp", alt: "RE/MAX Chairman's Club award" },
  { src: "/assets/images/clients/asset%205.webp", alt: "RE/MAX Platinum Club award" },
  { src: "/assets/images/clients/asset%206.webp", alt: "RE/MAX Executive Club award" },
  { src: "/assets/images/clients/asset%207.webp", alt: "Real Estate Board medallion award" },
  { src: "/assets/images/clients/asset%208.webp", alt: "MLS medallion club award" },
  { src: "/assets/images/clients/asset%209.webp", alt: "Fraser Valley award medallion" },
  { src: "/assets/images/clients/asset%2010.webp", alt: "Fraser Valley real estate award" },
  { src: "/assets/images/clients/asset%2011.webp", alt: "RE/MAX lifetime achievement award" },
  { src: "/assets/images/clients/asset%2012.webp", alt: "RE/MAX Hall of Fame award" },
  { src: "/assets/images/clients/asset%2013.webp", alt: "RE/MAX Pinnacle Club Team award" },
  { src: "/assets/images/clients/asset%2014.webp", alt: "RE/MAX Diamond Club Team award" },
  { src: "/assets/images/clients/asset%2015.webp", alt: "RE/MAX Chairman's Club award" },
];

export const homePage = {
  title: "The Oberoi Group | White Rock & Lower Mainland Real Estate Advisors",
  description:
    "Make the move with The Oberoi Group, a top RE/MAX commercial real estate team advising residential and commercial clients across the Lower Mainland.",
  canonicalPath: "/",
};

export const mainPages: SitePage[] = [
  {
    slug: "about",
    title: "About The Oberoi Group | White Rock Real Estate Team",
    description:
      "Meet The Oberoi Group, a White Rock-based RE/MAX real estate team built for residential, commercial, buying, selling, and investment advisory.",
    eyebrow: "About Us",
    heading: "WHO WE ARE",
    subheading:
      "A real estate team built like a pit crew: sharp roles, fast communication, and one standard for every move.",
    heroImage: "/assets/images/banner/about-page-banner.jpg",
    introTitle: "Fueled by precision, driven by passion.",
    intro:
      "The Oberoi Group combines advisory discipline, market intelligence, and a deep professional network to help clients move through residential and commercial real estate with confidence.",
    proof: ["White Rock office", "RE/MAX commercial recognition", "Residential and commercial advisory"],
    featureTitle: "How the team runs",
    features: [
      { title: "Advisory First", text: "Strategy comes before showings, offers, or listings, so every recommendation is anchored to the client's real goal." },
      { title: "Speed With Control", text: "The team keeps timelines tight while protecting negotiation leverage, due diligence, and decision quality." },
      { title: "One Roof", text: "Residential, commercial, buyer, seller, and investment needs are handled through one connected advisory lane." },
    ],
    cards: [
      { title: "Residential", text: "Buying, selling, relocation, and move-up guidance across the Lower Mainland.", image: "/assets/images/residential-2.png" },
      { title: "Commercial", text: "Commercial property search, positioning, investment review, and listing strategy.", image: "/assets/images/medical-vernon.png" },
      { title: "Network", text: "A trusted circle of lenders, inspectors, designers, legal partners, and local operators.", image: "/assets/images/collage-clear.png" },
    ],
    canonicalPath: "/about",
  },
  {
    slug: "about-jas-oberoi",
    title: "About Jas Oberoi | The Oberoi Group",
    description:
      "Learn about Jas Oberoi, a real estate advisor and private wealth strategist serving White Rock, South Surrey, and the Lower Mainland.",
    eyebrow: "Jas Oberoi",
    heading: "PRIVATE WEALTH STRATEGY MEETS REAL ESTATE",
    subheading:
      "Real estate decisions are financial decisions. Jas brings market judgment, negotiation discipline, and long-view strategy to the table.",
    heroImage: "/assets/images/banner/jas-dark-image.png",
    introTitle: "Built for clients who move deliberately.",
    intro:
      "Jas Oberoi advises clients through high-stakes property decisions with a focus on timing, risk, value, and the life plan behind the transaction.",
    proof: ["Commercial real estate leadership", "Private wealth perspective", "Lower Mainland market network"],
    featureTitle: "Advisory focus",
    features: [
      { title: "Portfolio Thinking", text: "A property is evaluated as part of a broader wealth and lifestyle picture." },
      { title: "Negotiation Readiness", text: "Offers, listings, and terms are prepared with clear leverage points before entering the market." },
      { title: "Quiet Confidence", text: "Clients get direct counsel, measured recommendations, and a team that stays close through the details." },
    ],
    cards: [
      { title: "Leadership", text: "A client-first approach shaped by commercial performance and residential trust.", image: "/assets/images/jas-about2.png" },
      { title: "Team Depth", text: "Jas and Maria bring a coordinated partner model to every major move.", image: "/assets/images/Partners-new.png" },
    ],
    canonicalPath: "/about-jas-oberoi",
  },
  {
    slug: "our-culture",
    title: "Our Culture | The Oberoi Group",
    description:
      "Explore the values and client standard behind The Oberoi Group's real estate advisory culture.",
    eyebrow: "Our Culture",
    heading: "OUR VALUES SET THE PACE",
    subheading:
      "The culture is direct, prepared, and deeply accountable. Every client deserves the same championship standard.",
    heroImage: "/assets/images/banner/culcure-banner.jpg",
    introTitle: "Integrity keeps the team ahead.",
    intro:
      "From first strategy call to closing day, The Oberoi Group works with candor, urgency, and a bias for making hard decisions clearer.",
    proof: ["Prepared advice", "Responsive communication", "Long-term client relationships"],
    featureTitle: "Values in motion",
    features: [
      { title: "Precision", text: "Details matter because details change outcomes in pricing, negotiation, financing, and closing." },
      { title: "Passion", text: "The team brings intensity to the work without turning the process into noise." },
      { title: "Accountability", text: "Every recommendation is made with the client's next chapter in mind." },
    ],
    cards: [
      { title: "Team Standard", text: "A collaborative, high-energy culture built around client outcomes.", image: "/assets/images/banner/culcure-banner2.jpg" },
      { title: "Production Mindset", text: "Every listing, search, and negotiation is treated like a performance.", image: "/assets/images/banner/jas-team-about-hd.png" },
    ],
    canonicalPath: "/our-culture",
  },
  {
    slug: "our-contributions",
    title: "Community Contributions | The Oberoi Group",
    description:
      "See community initiatives, events, and contribution highlights supported by The Oberoi Group.",
    eyebrow: "Our Contributions",
    heading: "THE BEST BANTING GALA",
    subheading:
      "A team that performs in the market should also show up for the communities that shape it.",
    heroImage: "/assets/images/optimized/gala-hero.jpg",
    introTitle: "Community is part of the work.",
    intro:
      "The Oberoi Group supports events and local initiatives that bring people together around health, generosity, and opportunity.",
    proof: ["Event sponsorship", "Community partnership", "Local leadership"],
    featureTitle: "Contributions",
    features: [
      { title: "Presence", text: "Showing up with time, attention, and resources for the causes clients and neighbors care about." },
      { title: "Partnership", text: "Working alongside community leaders and organizations to extend the impact of each initiative." },
      { title: "Momentum", text: "Treating contribution as a long-term commitment, not a one-night appearance." },
    ],
    cards: [
      { title: "Gallery", text: "Highlights from the night and the people behind it.", image: "/assets/images/gallery/1.jpg" },
      { title: "Sponsors", text: "Partners and speakers who helped bring the event to life.", image: "/assets/images/contributions/dr-brian.webp" },
      { title: "Team", text: "The Oberoi Group in motion beyond the transaction.", image: "/assets/images/gallery/4.jpg" },
    ],
    canonicalPath: "/our-contributions",
  },
  {
    slug: "featured-listing",
    title: "Featured Real Estate Listings | The Oberoi Group",
    description:
      "View featured real estate listing opportunities represented by The Oberoi Group across White Rock and the Lower Mainland.",
    eyebrow: "Featured Listing",
    heading: "FEATURED LISTING",
    subheading:
      "A polished showcase for high-attention properties. Live MLS data can be connected when feed credentials are available.",
    heroImage: "/assets/images/optimized/listing-hero.jpg",
    introTitle: "Listings deserve more than placement.",
    intro:
      "The Oberoi Group positions properties with visual discipline, market context, and a clear path from first impression to qualified offer.",
    proof: ["Property positioning", "Buyer qualification", "Listing strategy"],
    featureTitle: "Current showcase",
    features: [
      { title: "Presentation", text: "Hero imagery, concise property narrative, and clear next-step calls to action." },
      { title: "Context", text: "Neighborhood, use case, and buyer profile information designed for faster evaluation." },
      { title: "Conversion", text: "Every listing touchpoint points toward a direct conversation with the team." },
    ],
    cards: [
      { title: "Commercial Opportunity", text: "A visual slot for featured commercial inventory once feed data is connected.", image: "/assets/images/landmark.png" },
      { title: "Residential Feature", text: "A ready-to-fill card for a residential hero listing.", image: "/assets/images/residential-3.png" },
      { title: "Investment Review", text: "A property card for buyers comparing income, zoning, location, and risk.", image: "/assets/images/scotia-kamloops.png" },
    ],
    canonicalPath: "/featured-listing",
  },
  {
    slug: "commercial-listing",
    title: "Commercial Real Estate Listings | The Oberoi Group",
    description:
      "Explore commercial real estate listing support and commercial property opportunities with The Oberoi Group in the Lower Mainland.",
    eyebrow: "Commercial Listing",
    heading: "COMMERCIAL LISTING",
    subheading:
      "Commercial property moves faster when positioning, financial context, and buyer qualification are aligned.",
    heroImage: "/assets/images/optimized/market-hero.jpg",
    introTitle: "Commercial real estate with a sharper line.",
    intro:
      "For owner-users, investors, and operators, The Oberoi Group helps evaluate location, function, deal structure, and exit strategy before the market decides for you.",
    proof: ["Top 3 commercial team at RE/MAX", "Investor and operator advisory", "Lower Mainland market reach"],
    featureTitle: "Commercial lanes",
    features: [
      { title: "Acquisition", text: "Search support for owner-users and investors comparing sites, assets, and business fit." },
      { title: "Disposition", text: "Listing strategy that clarifies value, buyer profile, and proof before launch." },
      { title: "Due Diligence", text: "A coordinated process for zoning, financials, access, condition, and local market context." },
    ],
    cards: [
      { title: "Medical & Office", text: "Clinic, dental, professional office, and mixed-use opportunities.", image: "/assets/images/medical-vernon.png" },
      { title: "Retail & Service", text: "Streetfront and service-based locations with visibility and access considerations.", image: "/assets/images/scotia-kamloops.png" },
      { title: "Investment Assets", text: "Income property evaluation with practical operator insight.", image: "/assets/images/landmark.png" },
    ],
    canonicalPath: "/commercial-listing",
  },
  {
    slug: "mls-search",
    title: "MLS Search | The Oberoi Group",
    description:
      "Search-ready MLS experience for The Oberoi Group clients, with IDX integration slots prepared for future live listing data.",
    eyebrow: "MLS Search",
    heading: "MLS SEARCH",
    subheading:
      "A fast, branded search surface prepared for live MLS/IDX once credentials and feed terms are available.",
    heroImage: "/assets/images/banner/about-banner.png",
    introTitle: "Search is only the starting grid.",
    intro:
      "The public feed shows inventory. The advisory process clarifies fit, value, timing, and negotiation strategy before you commit.",
    proof: ["IDX-ready layout", "Search-to-consult CTA", "No invented listing data"],
    featureTitle: "Search support",
    features: [
      { title: "Saved Criteria", text: "Future integration can support saved searches by city, price, property type, and intent." },
      { title: "Advisor Review", text: "Shortlisted listings can be assessed against goals, risks, and resale logic." },
      { title: "Fast Contact", text: "Search pages keep the path to an Oberoi advisor visible and direct." },
    ],
    cards: [
      { title: "Residential Search", text: "A placeholder lane for homes, townhomes, condos, and luxury property.", image: "/assets/images/residential-1.png" },
      { title: "Commercial Search", text: "A placeholder lane for retail, office, investment, and owner-user assets.", image: "/assets/images/renovation-4.png" },
    ],
    canonicalPath: "/mls-search",
  },
  {
    slug: "buyers-guide",
    title: "Buyer's Guide | The Oberoi Group",
    description:
      "A practical buyer's guide for purchasing real estate with The Oberoi Group across White Rock and the Lower Mainland.",
    eyebrow: "Buy With Us",
    heading: "BUY WITH US",
    subheading:
      "Buying well means knowing what to chase, what to question, and when to accelerate.",
    heroImage: "/assets/images/banner/buys-guide.png",
    introTitle: "A calmer way to compete.",
    intro:
      "The Oberoi Group helps buyers move from curiosity to confident offer with strategy, preparation, and local market context.",
    proof: ["Needs assessment", "Offer strategy", "Closing coordination"],
    featureTitle: "Buyer process",
    features: [
      { title: "Define the Lane", text: "Clarify budget, neighborhoods, property type, timeline, and non-negotiables before the search widens." },
      { title: "Pressure Test Value", text: "Review comparables, condition, future resale, and local signals before writing." },
      { title: "Finish Cleanly", text: "Coordinate financing, inspections, subjects, documents, and closing details." },
    ],
    canonicalPath: "/buyers-guide",
  },
  {
    slug: "sellers-guide",
    title: "Seller's Guide | The Oberoi Group",
    description:
      "A seller's guide for pricing, preparing, marketing, and negotiating real estate with The Oberoi Group.",
    eyebrow: "List With Us",
    heading: "LIST WITH US",
    subheading:
      "A listing launch should feel engineered: pricing, preparation, media, market timing, and negotiation all moving together.",
    heroImage: "/assets/images/optimized/seller-guide.jpg",
    introTitle: "Position before promotion.",
    intro:
      "The Oberoi Group prepares listings with a focus on buyer psychology, local comparables, media quality, and negotiation leverage.",
    proof: ["Pricing strategy", "Launch planning", "Offer negotiation"],
    featureTitle: "Seller process",
    features: [
      { title: "Market Read", text: "Establish pricing range, competition, buyer pool, and likely objections before launch." },
      { title: "Presentation", text: "Prepare copy, visuals, and showing flow so the property lands with clarity." },
      { title: "Negotiation", text: "Review offers through price, certainty, subjects, timing, and buyer quality." },
    ],
    canonicalPath: "/sellers-guide",
  },
  {
    slug: "blog",
    title: "Real Estate Insights Blog | The Oberoi Group",
    description:
      "Read real estate market insights from The Oberoi Group for White Rock, South Surrey, Surrey, Vancouver, and the Lower Mainland.",
    eyebrow: "Real Estate Insights",
    heading: "MARKET INSIGHTS",
    subheading:
      "Short, useful market thinking for clients who want to understand the move before they make it.",
    heroImage: "/assets/images/optimized/market-hero.jpg",
    introTitle: "Insights with a point of view.",
    intro:
      "The blog is structured for local search growth, market education, and strong internal linking to buyer, seller, commercial, and pSEO pages.",
    proof: ["Local SEO-ready", "Market education", "Internal linking hub"],
    featureTitle: "Editorial lanes",
    features: [
      { title: "Local Markets", text: "City and neighborhood guides grounded in Lower Mainland buyer and seller behavior." },
      { title: "Commercial Moves", text: "Plain-English views on commercial property, owner-user needs, and investor evaluation." },
      { title: "Client Guides", text: "Evergreen advice for buying, selling, pricing, due diligence, and closing." },
    ],
    cards: [
      { title: "White Rock Market Notes", text: "What buyers and sellers should watch in coastal South Surrey and White Rock.", image: "/assets/images/banner/floor-bg.jpg" },
      { title: "Commercial Real Estate Signals", text: "How owner-users can compare location, access, zoning, and future exit.", image: "/assets/images/medical-vernon.png" },
      { title: "Selling With Timing", text: "Why launch timing and price discipline matter more than noise.", image: "/assets/images/residential-2.png" },
    ],
    canonicalPath: "/blog",
  },
  {
    slug: "podcast",
    title: "The Oberoi Group Podcast | Real Estate Conversations",
    description:
      "Listen to The Oberoi Group's real estate conversations and market perspectives from the Lower Mainland.",
    eyebrow: "Podcast",
    heading: "REAL ESTATE CONVERSATIONS",
    subheading:
      "A media lane for practical conversations with operators, advisors, community leaders, and market voices.",
    heroImage: "/assets/images/banner/podcast-image.png",
    introTitle: "The conversation behind the move.",
    intro:
      "The podcast page is prepared as a branded media hub for episodes, clips, guest profiles, and market insight content.",
    proof: ["Episode hub", "Guest profiles", "Market authority"],
    featureTitle: "Podcast format",
    features: [
      { title: "Market Talk", text: "Current conditions, buyer and seller psychology, and commercial real estate signals." },
      { title: "Community Voices", text: "Conversations with people shaping White Rock, South Surrey, and the Lower Mainland." },
      { title: "Advisor Notes", text: "Short episodes that turn common questions into useful real estate decisions." },
    ],
    cards: [
      { title: "Oberoi Group Podcast", text: "A polished show hub ready for embedded episodes.", image: "/assets/images/banner/podcast-logo.png" },
      { title: "Market Guests", text: "A guest feature slot for advisors, builders, lenders, and local leaders.", image: "/assets/images/banner/podcast-image.png" },
    ],
    canonicalPath: "/podcast",
  },
  {
    slug: "contact",
    title: "Contact The Oberoi Group | Make The Move",
    description:
      "Contact The Oberoi Group in White Rock, BC for residential real estate, commercial real estate, buying, selling, and advisory support.",
    eyebrow: "Contact Us",
    heading: "MAKE THE MOVE",
    subheading:
      "Start with a direct conversation. The team will help clarify the right lane for your next real estate decision.",
    heroImage: "/assets/images/banner/contact-banner.jpg",
    introTitle: "One call can set the pace.",
    intro:
      "Reach the White Rock office for buyer guidance, seller strategy, commercial property questions, or private advisory support.",
    proof: ["White Rock office", siteConfig.phone, siteConfig.email],
    featureTitle: "Contact lanes",
    features: [
      { title: "Buy", text: "Get clear on neighborhoods, property types, timelines, financing, and offer strategy." },
      { title: "Sell", text: "Review pricing, preparation, media, launch timing, and negotiation plan." },
      { title: "Commercial", text: "Discuss acquisition, listing, owner-user, investment, or leasing considerations." },
    ],
    canonicalPath: "/contact",
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy | The Oberoi Group",
    description:
      "Read The Oberoi Group privacy policy for website use, contact information, and client inquiry handling.",
    eyebrow: "Privacy Policy",
    heading: "PRIVACY POLICY",
    subheading:
      "A clear privacy page for visitors who contact The Oberoi Group through the website.",
    heroImage: "/assets/images/optimized/effect2-bg.jpg",
    introTitle: "Information handling",
    intro:
      "Information submitted through this site is used to respond to inquiries, provide requested real estate guidance, and maintain client communication.",
    proof: ["Contact data", "Inquiry response", "Website analytics"],
    featureTitle: "Policy summary",
    features: [
      { title: "Collection", text: "The site may collect contact details, inquiry details, and standard analytics data." },
      { title: "Use", text: "Information is used to respond to requests and improve the website experience." },
      { title: "Choice", text: "Visitors can contact the team to request updates or removal of submitted details." },
    ],
    canonicalPath: "/privacy-policy",
  },
];

export const serviceAreas: ServiceArea[] = [
  {
    city: "White Rock",
    slug: "white-rock",
    regionNote: "coastal South Surrey and White Rock",
    neighborhoods: ["Uptown White Rock", "East Beach", "West Beach", "Five Corners", "Marine Drive"],
    marketSignals: "view premiums, downsizer demand, walkable village pockets, and limited coastal inventory",
    localModifier: "coastal South Surrey and White Rock",
  },
  {
    city: "South Surrey",
    slug: "south-surrey",
    regionNote: "South Surrey neighborhoods and nearby White Rock",
    neighborhoods: ["Morgan Creek", "Grandview Heights", "Crescent Beach", "Ocean Park", "Sunnyside"],
    marketSignals: "school catchments, newer construction, townhome supply, luxury homes, and beach-adjacent demand",
    localModifier: "South Surrey and Semiahmoo Peninsula",
  },
  {
    city: "Surrey",
    slug: "surrey",
    regionNote: "Surrey's urban centres and growing residential corridors",
    neighborhoods: ["City Centre", "Guildford", "Fleetwood", "Newton", "Cloverdale"],
    marketSignals: "rapid population growth, transit expansion, town centre density, and a broad property mix",
    localModifier: "Surrey and the Fraser Valley gateway",
  },
  {
    city: "Vancouver",
    slug: "vancouver",
    regionNote: "Vancouver's residential and commercial property markets",
    neighborhoods: ["Kitsilano", "Mount Pleasant", "Kerrisdale", "Yaletown", "Cambie"],
    marketSignals: "tight supply, strata complexity, mixed-use corridors, land value pressure, and buyer competition",
    localModifier: "Vancouver west side, east side, and downtown markets",
  },
  {
    city: "Burnaby",
    slug: "burnaby",
    regionNote: "Burnaby's central locations, transit nodes, and mixed-use areas",
    neighborhoods: ["Metrotown", "Brentwood", "Edmonds", "Lougheed", "Burnaby Heights"],
    marketSignals: "transit-oriented growth, high-rise nodes, retail corridors, and central Lower Mainland access",
    localModifier: "Burnaby's transit-linked real estate corridors",
  },
  {
    city: "Richmond",
    slug: "richmond",
    regionNote: "Richmond's residential communities and commercial corridors",
    neighborhoods: ["Brighouse", "Steveston", "Oval Village", "Cambie", "Ironwood"],
    marketSignals: "airport access, industrial corridors, strata communities, retail hubs, and family neighborhoods",
    localModifier: "Richmond residential and business districts",
  },
  {
    city: "Delta",
    slug: "delta",
    regionNote: "Delta, Tsawwassen, Ladner, and surrounding communities",
    neighborhoods: ["Tsawwassen", "Ladner", "North Delta", "Sunshine Hills", "Annieville"],
    marketSignals: "family neighborhoods, port and logistics access, waterfront pockets, and suburban move-up demand",
    localModifier: "Delta, Ladner, Tsawwassen, and North Delta",
  },
  {
    city: "Langley",
    slug: "langley",
    regionNote: "Langley City, Township, and growth-area neighborhoods",
    neighborhoods: ["Willoughby", "Walnut Grove", "Murrayville", "Brookswood", "Fort Langley"],
    marketSignals: "growth corridors, new construction, acreage pockets, family demand, and expanding transit plans",
    localModifier: "Langley City and Langley Township",
  },
  {
    city: "Abbotsford",
    slug: "abbotsford",
    regionNote: "Abbotsford's Fraser Valley housing and business districts",
    neighborhoods: ["McMillan", "Auguston", "Clearbrook", "Sumas Prairie", "Historic Downtown"],
    marketSignals: "Fraser Valley affordability, agricultural land context, industrial activity, and commuter demand",
    localModifier: "Abbotsford and central Fraser Valley",
  },
];

export const seoServices: SeoService[] = [
  {
    name: "Commercial Real Estate",
    slug: "commercial-real-estate",
    keyword: "commercial real estate",
    ctaAngle: "commercial acquisition, disposition, and investment strategy",
    searchIntent: "compare commercial property, listing, and investment advisory options",
    relatedKeywords: [
      "commercial real estate agent",
      "commercial realtor",
      "commercial property for sale",
      "investment property advisor",
    ],
  },
  {
    name: "Residential Real Estate",
    slug: "residential-real-estate",
    keyword: "residential real estate",
    ctaAngle: "home buying, selling, and move-up strategy",
    searchIntent: "find a residential realtor for homes, condos, townhomes, and move-up decisions",
    relatedKeywords: [
      "real estate agent",
      "residential realtor",
      "homes for sale",
      "local real estate market",
    ],
  },
  {
    name: "Buying a Home",
    slug: "buying-a-home",
    keyword: "buying a home",
    ctaAngle: "buyer preparation, search strategy, and offer execution",
    searchIntent: "get buyer representation before touring, shortlisting, and writing an offer",
    relatedKeywords: [
      "buyer agent",
      "home buying advisor",
      "buy a house",
      "first time home buyer",
    ],
  },
  {
    name: "Selling a Property",
    slug: "selling-a-property",
    keyword: "selling a property",
    ctaAngle: "pricing, preparation, launch, and negotiation planning",
    searchIntent: "choose a listing advisor for pricing, preparation, launch, and offer review",
    relatedKeywords: [
      "listing agent",
      "sell my house",
      "home valuation",
      "property selling strategy",
    ],
  },
];

export function getMainPage(slug: string) {
  return mainPages.find((page) => page.slug === slug);
}

export function getPseoPage(citySlug: string, serviceSlug: string): PseoPage | undefined {
  return getAllPseoPages().find(
    (page) => page.city.slug === citySlug && page.service.slug === serviceSlug,
  );
}

export function getAllPseoPages(): PseoPage[] {
  return serviceAreas.flatMap((city) =>
    seoServices.map((service) => {
      const path = `/real-estate/${city.slug}/${service.slug}`;
      const primaryKeyword = `${service.keyword} in ${city.city}, BC`;
      const keywordCluster = buildKeywordCluster(service, city);
      const serviceBullets = buildServiceBullets(service, city);
      const serviceFocus = buildServiceFocus(service, city);

      return {
        city,
        service,
        path,
        title: `${service.name} in ${city.city}, BC | The Oberoi Group`,
        description: `Need ${primaryKeyword}? The Oberoi Group provides ${service.ctaAngle} with local guidance across ${city.regionNote}.`,
        h1: `${service.name} in ${city.city}, BC`,
        primaryKeyword,
        keywordCluster,
        intro: `For clients searching for ${primaryKeyword}, The Oberoi Group brings a precise, advisory-first process. The team helps clients ${service.searchIntent}, adding local context, negotiation discipline, and a trusted professional network across ${city.regionNote}.`,
        localProof: `Based from White Rock and active across the Lower Mainland, the team helps ${city.city} clients compare timing, value, property fit, and next-step risk before making a real estate move.`,
        marketContext: `${city.city} real estate decisions are shaped by ${city.marketSignals}. The Oberoi Group uses those signals to frame ${service.keyword} conversations around pricing, timing, property quality, and negotiation leverage.`,
        serviceFocus,
        serviceBullets,
        faqs: [
          {
            question: `Who helps with ${primaryKeyword}?`,
            answer: `The Oberoi Group supports ${service.ctaAngle} for clients evaluating ${city.city} and nearby Lower Mainland opportunities.`,
          },
          {
            question: `Which ${city.city} areas does the team discuss?`,
            answer: `Common local conversations include ${formatList(city.neighborhoods)} along with nearby markets when they fit the client goal.`,
          },
          {
            question: `What should I know before starting ${service.name.toLowerCase()} in ${city.city}?`,
            answer: `Start with your goal, timing, budget or property profile, and decision constraints. The team will translate that into a practical next step for ${service.keyword} in ${city.city}.`,
          },
          {
            question: `Can The Oberoi Group compare ${city.city} with nearby markets?`,
            answer: `Yes. The advisory process can compare ${city.city} with other Lower Mainland and Fraser Valley markets so you can weigh value, timing, lifestyle, and investment fit.`,
          },
        ],
        internalLinks: [
          ...seoServices
            .filter((item) => item.slug !== service.slug)
            .map((item) => ({
              label: `${item.name} in ${city.city}`,
              href: `/real-estate/${city.slug}/${item.slug}`,
            })),
          { label: "All Service Areas", href: "/real-estate" },
          { label: "Contact The Team", href: "/contact" },
        ],
      };
    }),
  );
}

function buildKeywordCluster(service: SeoService, city: ServiceArea) {
  return [
    `${service.keyword} in ${city.city}, BC`,
    `${city.city} ${service.keyword}`,
    ...service.relatedKeywords.map((keyword) => `${keyword} ${city.city}`),
    `${service.name.toLowerCase()} ${city.localModifier}`,
  ];
}

function buildServiceFocus(service: SeoService, city: ServiceArea) {
  if (service.slug === "commercial-real-estate") {
    return [
      {
        title: "Commercial fit",
        text: `Evaluate location, access, use, zoning, and operator fit before committing to a ${city.city} commercial property.`,
      },
      {
        title: "Investor lens",
        text: `Review income potential, tenant profile, resale logic, and risk in relation to ${city.marketSignals}.`,
      },
      {
        title: "Listing strategy",
        text: `Position commercial real estate in ${city.city} with buyer qualification, proof points, and disciplined negotiation terms.`,
      },
    ];
  }

  if (service.slug === "residential-real-estate") {
    return [
      {
        title: "Property match",
        text: `Compare homes, condos, and townhomes across ${formatList(city.neighborhoods)} with lifestyle and resale in mind.`,
      },
      {
        title: "Market read",
        text: `Use ${city.city} pricing signals, condition, buyer pool, and timing to shape the residential real estate plan.`,
      },
      {
        title: "Move strategy",
        text: `Coordinate buying, selling, financing, subjects, and closing steps through one advisory team.`,
      },
    ];
  }

  if (service.slug === "buying-a-home") {
    return [
      {
        title: "Buyer preparation",
        text: `Clarify budget, must-haves, property type, and target areas in ${city.city} before the search widens.`,
      },
      {
        title: "Offer discipline",
        text: `Assess comparable sales, condition, competition, and negotiation leverage before writing on a home.`,
      },
      {
        title: "Local confidence",
        text: `Compare ${formatList(city.neighborhoods)} against nearby options when value, commute, or lifestyle tradeoffs matter.`,
      },
    ];
  }

  return [
    {
      title: "Pricing strategy",
      text: `Establish the ${city.city} pricing range, likely buyer pool, and key objections before the property launches.`,
    },
    {
      title: "Presentation plan",
      text: `Prepare visuals, copy, showing flow, and launch timing around the strongest parts of the property.`,
    },
    {
      title: "Offer control",
      text: `Review price, terms, subjects, buyer quality, and closing timing before accepting an offer.`,
    },
  ];
}

function formatList(items: string[]) {
  if (items.length <= 1) {
    return items.join("");
  }

  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

function buildServiceBullets(service: SeoService, city: ServiceArea) {
  if (service.slug === "commercial-real-estate") {
    return [
      `Commercial property search and listing strategy across ${city.city}.`,
      "Owner-user and investor evaluation with attention to zoning, access, use, and exit options.",
      "Deal preparation that aligns pricing, diligence, buyer qualification, and negotiation terms.",
    ];
  }

  if (service.slug === "residential-real-estate") {
    return [
      `Residential buying and selling guidance for ${city.city} homes, condos, and townhomes.`,
      "Market comparisons that weigh lifestyle, resale, condition, and negotiation leverage.",
      "A single team coordinating search, listing, offer, subject removal, and closing steps.",
    ];
  }

  if (service.slug === "buying-a-home") {
    return [
      `Buyer strategy for finding and securing the right property in ${city.city}.`,
      "Shortlist review, comparable sales analysis, and offer planning before competition begins.",
      "Clear support through financing, inspections, documents, and closing logistics.",
    ];
  }

  return [
    `Seller strategy for positioning a ${city.city} property before it reaches the market.`,
    "Pricing, preparation, visual presentation, launch timing, and buyer targeting.",
    "Offer review that weighs price, terms, certainty, subjects, and closing timing.",
  ];
}

export const allStaticPaths = [
  "/",
  "/real-estate",
  ...mainPages.map((page) => page.canonicalPath),
  ...getAllPseoPages().map((page) => page.path),
];
