#!/usr/bin/env node
/**
 * check-trust — the anti-bluff gate.
 *
 * The site's whole thesis is that Oberizon can put things on a page that no
 * competitor can put on theirs: real projects, real municipal knowledge, real
 * clinical detail, real numbers. A page with none of those may rank briefly in
 * an empty market and will produce nothing. This script makes that rule
 * mechanical, so it survives the next content edit and the next contractor.
 *
 * The line it draws:
 *
 *   ERROR — the site ASSERTS something it cannot back. Placeholder copy shipped
 *           to visitors, a cost answer with no cost in it, a fabricated licence
 *           number, two different prices for the same build, raw keyword lists
 *           rendered as if they were content. These fail the build.
 *
 *   WARN  — something is ABSENT that would make a page stronger. Missing project
 *           photographs, unconfirmed review dates, city pages held back for lack
 *           of evidence. Absence is not a bluff, so it reports without blocking.
 *
 * Run: node scripts/check-trust.mjs   (also runs automatically via `prebuild`)
 */

import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { registerHooks } from "node:module";
import { join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SRC = join(ROOT, "src");

/**
 * Teach Node the "@/" path alias from tsconfig.
 *
 * This gate reads the real modules rather than regex-parsing them, which is why
 * its findings are trustworthy. That worked only while src/lib/site.ts had no
 * imports of its own — the moment it imported "@/lib/pricing", Node could not
 * resolve it and the whole gate died.
 *
 * Rather than contort the application code to suit the checker, the checker
 * resolves the alias the way the bundler does, and fills in the file extension
 * that TypeScript lets source omit.
 */
const resolveWithExtension = (filePath) => {
  if (existsSync(filePath)) return filePath;
  for (const extension of [".ts", ".tsx", "/index.ts"]) {
    if (existsSync(filePath + extension)) return filePath + extension;
  }
  return filePath;
};

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      return {
        url: pathToFileURL(resolveWithExtension(join(SRC, specifier.slice(2)))).href,
        shortCircuit: true,
      };
    }
    return nextResolve(specifier, context);
  },
});

const errors = [];
const warnings = [];

const fail = (rule, detail, where) => errors.push({ rule, detail, where });
const warn = (rule, detail, where) => warnings.push({ rule, detail, where });

/** Every .ts/.tsx file under src, as { path, text }. */
async function readSource() {
  const files = [];
  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      // .mdx included deliberately. The blog is now the largest surface of
      // price and CTA claims on the site, and every gate below reads this list
      // — leaving posts out would mean the checks quietly stopped covering the
      // place they matter most.
      else if (/\.(tsx?|mdx)$/.test(entry.name)) files.push(full);
    }
  }
  await walk(SRC);
  return Promise.all(
    files.map(async (path) => ({
      path: relative(ROOT, path),
      text: await readFile(path, "utf8"),
    })),
  );
}

/**
 * Strip comments before scanning for banned copy, so that explaining a defect in
 * a code comment does not itself trip the rule that bans it.
 */
function stripComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Placeholder and copy drift
// ─────────────────────────────────────────────────────────────────────────────

const BANNED_COPY = [
  { pattern: /Trust Bar/i, why: "leftover template label, was visible to every visitor" },
  { pattern: /a system for brands/i, why: "template boilerplate from an unrelated product" },
  { pattern: /get template/i, why: "template boilerplate" },
  { pattern: /lorem ipsum/i, why: "placeholder text" },
  { pattern: /White Rock based/, why: "missing hyphen — should be 'White Rock-based'" },
  { pattern: /Oberizon construction\b/, why: "brand name must be capitalised" },
  { pattern: /Copyright \(c\)/i, why: "use the © character and a current year range" },
];

function checkCopy(sources) {
  for (const { path, text } of sources) {
    const body = stripComments(text);
    for (const { pattern, why } of BANNED_COPY) {
      const match = body.match(pattern);
      if (match) {
        fail("placeholder-copy", `"${match[0]}" — ${why}`, path);
      }
    }
  }
}

/** A hardcoded year range like 2014-2025 goes stale silently; derive it instead. */
function checkCopyrightYear(sources) {
  const year = new Date().getFullYear();
  for (const { path, text } of sources) {
    for (const match of stripComments(text).matchAll(/\b(20\d{2})\s*[-–]\s*(20\d{2})\b/g)) {
      if (Number(match[2]) < year) {
        fail(
          "stale-year",
          `hardcoded range "${match[0]}" is already out of date (now ${year}) — derive it from siteConfig.foundedYear and the current year`,
          path,
        );
      }
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. CTA consistency
// ─────────────────────────────────────────────────────────────────────────────

const CTA_ALLOWED = "Book a Consultation";
const CTA_BANNED = [
  "Book an Appointment",
  "Book a Project Review",
  "Book a Review",
  "Schedule Consultation",
  "Request Consultation",
  "Start The Conversation",
  "Start With The Review",
  "View Our Work",
];

function checkCta(sources) {
  for (const { path, text } of sources) {
    const body = stripComments(text);
    for (const banned of CTA_BANNED) {
      if (new RegExp(banned.replace(/ /g, "\\s+"), "i").test(body)) {
        fail(
          "cta-drift",
          `"${banned}" — every call to action must read "${CTA_ALLOWED}" so the same intent is measurable as one event`,
          path,
        );
      }
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Unbacked claims
// ─────────────────────────────────────────────────────────────────────────────

/** Questions that promise a specific answer must contain one. */
const SPECIFIC_QUESTION = /\bcost|how much|price|per sq|how long|timeline|permits?\b/i;
const HAS_NUMBER = /\d/;
const NAMED_AUTHORITY =
  /BC Building Code|CSA Z\d+|IPAC|USP 7\d\d|WorkSafeBC|Fraser Health|building permit/i;

function checkFaqSpecificity(label, faqs, where) {
  for (const faq of faqs) {
    if (!SPECIFIC_QUESTION.test(faq.question)) continue;
    if (HAS_NUMBER.test(faq.answer) || NAMED_AUTHORITY.test(faq.answer)) continue;
    fail(
      "unbacked-claim",
      `${label} "${faq.question}" answers a specific question with no number and no named code. ` +
        `AI answers cite pages that give a figure; "it depends on scope" is cited by nobody.`,
      where,
    );
  }
}

/**
 * The same build type must not be published at two different prices. This is the
 * defect that shipped when the approved brief said $180–$250/sq ft for a pharmacy
 * while the pricing table still said $140–$230.
 */
function checkPriceConsistency(site) {
  const RANGE = /\$\s?([\d,]+)\s*[-–]\s*\$?\s?([\d,]+)\s*(?:per sq ft|\/sq ft)/gi;
  const seen = new Map();

  const record = (label, source, text) => {
    for (const match of text.matchAll(RANGE)) {
      const range = `$${match[1]}–$${match[2]}/sq ft`;
      const key = label.toLowerCase();
      if (!seen.has(key)) seen.set(key, new Map());
      if (!seen.get(key).has(range)) seen.get(key).set(range, source);
    }
  };

  for (const service of site.constructionServices) {
    const page = site.getConstructionPage("white-rock", service.slug);
    if (page) record(service.name, `pricing table (${service.slug})`, page.pricingBrief);
  }

  for (const faq of site.aiFaqs) {
    const subject = site.constructionServices.find((service) =>
      new RegExp(service.vertical === "Healthcare" ? service.name.split(" ")[0] : service.name, "i").test(
        faq.question,
      ),
    );
    if (subject) record(subject.name, "homepage FAQ", faq.answer);
  }

  for (const [label, ranges] of seen) {
    if (ranges.size > 1) {
      const detail = [...ranges].map(([range, source]) => `${range} (${source})`).join(" vs ");
      fail(
        "contradictory-price",
        `${label} is published at two different rates — ${detail}. Pick one and use it everywhere.`,
        "src/lib/site.ts",
      );
    }
  }
}

/**
 * Structured data must not assert a credential the business has not confirmed.
 * Non-numeric status text is fine — inventing a licence number is not.
 */
function checkCredentials(site, sources) {
  const siteFile = sources.find((file) => file.path === "src/lib/site.ts");
  const unconfirmed = /TODO\(client\):\s*confirm BC contractor licence/i.test(siteFile?.text ?? "");
  if (!unconfirmed) return;

  for (const field of ["licenceStatus", "insuranceStatus"]) {
    if (/\d/.test(site.siteConfig[field])) {
      fail(
        "unverified-credential",
        `siteConfig.${field} publishes a number while the licence is still marked TODO(client). ` +
          `A licence number in schema is a citable claim — confirm it or keep the text non-numeric.`,
        "src/lib/site.ts",
      );
    }
  }

  warn(
    "unverified-credential",
    "BC contractor licence and WorkSafeBC numbers are still unconfirmed, so the trust strip shows " +
      "non-numeric status text. Trade-specific badges carrying a real licence number convert " +
      "materially better — worth chasing the client for.",
    "src/lib/site.ts",
  );
}

/** A page asking to rank must have a reason to exist beyond the template. */
function checkEvidence(site) {
  const heldBack = site.serviceAreas.filter((area) => area.evidence === "none");
  const claiming = site.serviceAreas.filter((area) => area.evidence === "measured-demand");

  for (const area of claiming) {
    if (!area.evidenceNote) {
      fail(
        "unbacked-claim",
        `${area.city} is indexed on measured demand alone but carries no evidenceNote. ` +
          `An adjacent market must say so on the page rather than implying local delivery.`,
        "src/lib/site.ts",
      );
    }
  }

  for (const area of site.serviceAreas) {
    if (area.evidence !== "project") continue;
    const has = site.projects.some((project) => project.citySlug === area.slug);
    if (!has) {
      fail(
        "unbacked-claim",
        `${area.city} is marked evidence: "project" but no project in the projects array records that city.`,
        "src/lib/site.ts",
      );
    }
  }

  if (heldBack.length) {
    warn(
      "held-back",
      `${heldBack.length} of ${site.serviceAreas.length} cities are noindex and out of the sitemap ` +
        `(${heldBack.map((area) => area.city).join(", ")}). They have no delivered project and no ` +
        `measured search demand. Add either and they index automatically.`,
      "src/lib/site.ts",
    );
  }
}

/**
 * The portfolio tally is the one figure on the site that is asserted rather than
 * derived — Oberizon has built far more than the handful of jobs documented in
 * `projects`, and the stats band publishes the client's own count.
 *
 * That makes it the one number a person can quietly break. Two rules keep it
 * honest in opposite directions: it may never fall below the evidence already
 * on the page (a visitor counting the project list must never out-count the
 * headline), and the gap between claim and evidence is reported every build so
 * the missing case studies stay visible rather than becoming permanent.
 */
function checkPortfolioTally(site) {
  const { portfolioTally: tally, projects } = site;
  const documented = {
    delivered: projects.filter((project) => project.status === "Delivered").length,
    inProgress: projects.filter((project) => project.status === "In progress").length,
  };

  for (const [key, label] of [["delivered", "delivered"], ["inProgress", "in progress"]]) {
    if (tally[key] < documented[key]) {
      fail(
        "portfolio-tally",
        `portfolioTally.${key} claims ${tally[key]} ${label} projects but the projects array ` +
          `already documents ${documented[key]}. The headline figure cannot be lower than the ` +
          `work the visitor can count on the page.`,
        "src/lib/site.ts",
      );
    }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(tally.confirmedOn ?? "")) {
    fail(
      "portfolio-tally",
      "portfolioTally carries no confirmedOn date. This is the site's only asserted number — " +
        "it stands on the client having said it, on a day, so that has to be recorded.",
      "src/lib/site.ts",
    );
  }

  const undocumented =
    tally.delivered + tally.inProgress - documented.delivered - documented.inProgress;
  if (undocumented > 0) {
    warn(
      "content-gap",
      `${tally.delivered + tally.inProgress} projects are claimed (confirmed ${tally.confirmedOn}) ` +
        `but only ${documented.delivered + documented.inProgress} are documented — ${undocumented} ` +
        `have no address, city or photograph on the site. The claim is the client's to make; the ` +
        `case studies are what actually rank.`,
      "src/lib/site.ts",
    );
  }
}

/** Report the content the client still owes, without blocking on it. */
/**
 * Every registered post must have a page, and every page must be registered.
 *
 * The registry drives the sitemap, so an entry without an .mdx file submits a
 * URL to Google that returns 404 — and the build would not otherwise complain,
 * because nothing imports the missing file. The reverse is quieter but also
 * wrong: a post that exists and is not registered is never linked from the
 * index, never submitted, and never found.
 */
async function checkBlogRegistry(blog) {
  const dir = join(SRC, "app", "blog");
  const onDisk = new Set();

  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || /\s\d+$/.test(entry.name)) continue;
    try {
      await readFile(join(dir, entry.name, "page.mdx"), "utf8");
      onDisk.add(entry.name);
    } catch {
      // A directory without a page.mdx is not a post.
    }
  }

  for (const post of blog.blogPosts) {
    if (!onDisk.has(post.slug)) {
      fail(
        "blog-registry",
        `"${post.slug}" is in blogPosts and therefore in the sitemap, but ` +
          `src/app/blog/${post.slug}/page.mdx does not exist — the sitemap would submit a 404.`,
        "src/lib/blog.ts",
      );
    }
  }

  for (const slug of onDisk) {
    if (!blog.blogPosts.some((post) => post.slug === slug)) {
      fail(
        "blog-registry",
        `src/app/blog/${slug}/page.mdx exists but is not in blogPosts — ` +
          `it renders but is never linked from the index or submitted in the sitemap.`,
        "src/lib/blog.ts",
      );
    }
  }
}

function checkContentGaps(site) {
  const missingChallenge = site.projects.filter((project) => !project.challenge);
  const missingImages = site.projects.filter((project) => !project.images?.length);
  const missingCity = site.projects.filter((project) => !project.citySlug);
  const undatedReviews = site.reviews.filter((review) => !review.date);

  if (missingChallenge.length) {
    warn(
      "content-gap",
      `${missingChallenge.length} of ${site.projects.length} projects have no named challenge. ` +
        `"We built a dental clinic" ranks for nothing; the problem solved is what gets remembered.`,
      "src/lib/site.ts",
    );
  }
  if (missingImages.length) {
    warn("content-gap", `${missingImages.length} projects have no photographs.`, "src/lib/site.ts");
  }
  if (missingCity.length) {
    warn(
      "content-gap",
      `${missingCity.length} project(s) have no recorded city (${missingCity
        .map((project) => project.name)
        .join(", ")}) and are withheld from local proof until confirmed.`,
      "src/lib/site.ts",
    );
  }
  if (undatedReviews.length) {
    warn(
      "content-gap",
      `${undatedReviews.length} of ${site.reviews.length} reviews carry no date. Dated reviews naming ` +
        `a person and a place convert far better than undated quotes.`,
      "src/lib/site.ts",
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Consistency and schema
// ─────────────────────────────────────────────────────────────────────────────

function checkFooter(sources) {
  const footer = sources.find((file) => file.path.endsWith("components/Footer.tsx"));
  if (!footer) {
    fail("footer", "Footer.tsx not found", "src/components");
    return;
  }
  const body = stripComments(footer.text);

  if (/constructionServices\s*\.\s*slice\s*\(/.test(body)) {
    fail(
      "hidden-service",
      "Footer slices constructionServices. A slice silently drops services — this is how " +
        "Commercial Construction and Commercial Renovation, the two largest measured " +
        "opportunities, disappeared from the site.",
      footer.path,
    );
  }

  if (!/serviceAreas\s*\.\s*map/.test(body)) {
    fail(
      "city-drift",
      "Footer does not render its city list from serviceAreas. A hardcoded list drifts from the " +
        "Service Areas page, and a city that appears on one page only does not register as a signal.",
      footer.path,
    );
  }
}

/**
 * Every published per-square-foot rate must match src/lib/pricing.ts.
 *
 * The previous price check only compared `pricingBrief` against `aiFaqs`, which
 * is why it never noticed that app/cost/page.tsx published a pharmacy at
 * $140–$230 while the rest of the site said $180–$250. This scans the source for
 * any "$N–$M per sq ft" claim and holds it against the config, so the numbers
 * cannot drift apart again no matter which file someone edits.
 */
function checkRatesAgainstConfig(pricing, sources) {
  const known = new Set(pricing.serviceRates.map((rate) => `${rate.low}-${rate.high}`));

  // Deliberately no tolerance for finish-adjusted bands. The calculator applies
  // its multipliers at runtime from the config, so a *literal* rate in source is
  // always a base rate. An earlier version allowed a window around each rate and
  // it silently accepted the very contradiction this rule exists to catch:
  // $140–$230 passed as a "finish-adjusted" $120–$220.
  for (const { path, text } of sources) {
    if (path.endsWith("lib/pricing.ts")) continue;
    const body = stripComments(text);

    for (const match of body.matchAll(/\$\s?([\d,]+)\s*[-–—]\s*\$?\s?([\d,]+)\s*(?:per sq ft|\/ ?sq ft|per square foot)/gi)) {
      const low = Number(match[1].replace(/,/g, ""));
      const high = Number(match[2].replace(/,/g, ""));
      if (known.has(`${low}-${high}`)) continue;


      fail(
        "price-consistency",
        `"$${low}–$${high} per sq ft" is published here but matches no rate in src/lib/pricing.ts. ` +
          `Every published figure must come from that config — this is exactly how the pharmacy ` +
          `rate ended up as $140–$230 on the cost page and $180–$250 everywhere else.`,
        path,
      );
    }
  }
}

/**
 * Every published dollar *total* must equal rate × area from the config.
 *
 * checkRatesAgainstConfig covers the per-square-foot bands, which is why they
 * cannot drift. It does nothing about the totals written beside them, and the
 * cost page carried "$450,000–$800,000 for a 2,500 sq ft space" — a figure that
 * was correct against the old dental rate and silently wrong the moment the
 * client revised it. The band and the total sat in the same sentence.
 *
 * Both orderings occur in the copy ("$X–$Y for a N sq ft space" and "A N sq ft
 * pharmacy runs $X–$Y"), and one FAQ prices a *range* of areas, so this works on
 * whole sentences rather than a fixed shape: take every dollar total and every
 * square-foot figure in a sentence, and pass if any rate in the config explains
 * the pair. Under $10,000 is treated as a per-sq-ft rate, not a total.
 */
function checkPriceTotals(pricing, sources) {
  const MONEY_RANGE = /\$\s?([\d,]{4,})\s*[-–—]\s*\$?\s?([\d,]{4,})/g;
  // The area itself is sometimes a range — "A 2,000–2,500 sq ft office fit-out
  // is usually $240,000–$550,000" prices the low end at the small area and the
  // high end at the large one. Capture both or that sentence reads as a defect.
  const SQ_FT = /([\d,]+)(?:\s*[-–—]\s*([\d,]+))?\s*(?:sq ft|square (?:foot|feet))/gi;
  const num = (text) => Number(text.replace(/,/g, ""));

  for (const { path, text } of sources) {
    if (path.endsWith("lib/pricing.ts")) continue;

    // Split on line breaks as well as sentence ends. A markdown table contains
    // no full stops, so the whole thing arrived here as one "sentence" and
    // every figure in it got checked against every square footage in it —
    // pricing dental chairs against a construction rate, and reporting six
    // failures for one honest table. Row by row, each claim is checked against
    // the area on its own row, which is the comparison a reader actually makes.
    for (const sentence of stripComments(text).split(/(?<=[.!?])\s+|\n/)) {
      const totals = [...sentence.matchAll(MONEY_RANGE)]
        .map((match) => [num(match[1]), num(match[2])])
        .filter(([low, high]) => low >= 10_000 && high >= 10_000);
      if (!totals.length) continue;

      const areas = [...sentence.matchAll(SQ_FT)]
        .flatMap((match) => [match[1], match[2]])
        .filter(Boolean)
        .map(num);
      if (!areas.length) continue;

      for (const [low, high] of totals) {
        const explained = pricing.serviceRates.some((rate) =>
          areas.some((lowArea) =>
            areas.some(
              (highArea) =>
                pricing.roundEstimate(rate.low * lowArea) === low &&
                pricing.roundEstimate(rate.high * highArea) === high,
            ),
          ),
        );
        if (explained) continue;

        fail(
          "price-consistency",
          `"$${low.toLocaleString("en-CA")}–$${high.toLocaleString("en-CA")}" is published against ` +
            `${areas.map((area) => `${area.toLocaleString("en-CA")} sq ft`).join(" / ")} but equals ` +
            `no rate in src/lib/pricing.ts at that area. A total is as citable as a band — derive ` +
            `it, or update it in the same edit as the rate.`,
          path,
        );
      }
    }
  }
}

/**
 * The calculator must not reach a public surface on rates the client has not
 * agreed to be held to.
 */
function checkRatesSignedOff(pricing, site) {
  if (pricing.ratesConfirmedByClient) return;

  if (site.allStaticPaths.includes("/cost")) {
    fail(
      "unconfirmed-rates",
      "/cost is in the sitemap while ratesConfirmedByClient is false. The page carries a cost " +
        "calculator, which invites a visitor to generate a figure and hold Oberizon to it.",
      "src/lib/site.ts",
    );
  }

  // Inspect the resolved values, not the source text. A regex over source cannot
  // tell a live link from one already guarded by this same flag, and reported a
  // false positive the moment the nav entry was written as a conditional.
  const inNav = site.navigation
    .flatMap((item) => [item.href, ...(item.items ?? []).map((sub) => sub.href)])
    .filter((href) => href?.startsWith("/cost"));

  if (inNav.length > 0) {
    fail(
      "unconfirmed-rates",
      "/cost is in the main navigation while its rates are unconfirmed. The footer link is a " +
        "deliberate exception; promoting it to the nav is not.",
      "src/lib/site.ts",
    );
  }

  // The footer link is live at the client's request. That is their call to make,
  // but it stops being invisible — a visitor can now reach the calculator and
  // generate a figure nobody has agreed to honour.
  if (site.resourceLinks.some((link) => link.href.startsWith("/cost"))) {
    warn(
      "unconfirmed-rates",
      "The footer links to /cost while ratesConfirmedByClient is false, so visitors can reach the " +
        "calculator and generate figures from unconfirmed rates. Indexing and the sitemap are " +
        "still gated. Get the ranges signed off.",
      "src/lib/site.ts",
    );
  }

  warn(
    "unconfirmed-rates",
    "Cost calculator is noindex, out of the sitemap and out of the main navigation because " +
      "ratesConfirmedByClient is false. Confirm the ten ranges with the client, then flip the flag " +
      "in src/lib/pricing.ts to index it and add the nav entry.",
    "src/lib/pricing.ts",
  );
}

/**
 * Copy density.
 *
 * The generated pages once averaged 3.4 commas per sentence, because every field
 * was built from the same list-of-nouns template. That is what made them read as
 * padded even at a modest word count, and it is the kind of thing that creeps
 * back one template edit at a time.
 *
 * Comma density blocks: the measure is unambiguous and the current worst page
 * sits at 0.83 against a limit of 2.0, so there is real headroom.
 *
 * Word repetition only warns. Some legitimate pages repeat a term unavoidably —
 * Tri-Cities' own regionNote is "Coquitlam, Port Coquitlam and Port Moody", and
 * White Rock is both a service area and the head office. A hard count would fail
 * on honest content, so this reports the outlier and leaves the judgement to a
 * person, which is the same line the rest of this file draws.
 */
const MAX_COMMAS_PER_SENTENCE = 2;
const REPETITION_WARN_PER_100_WORDS = 3;

/** Each field is measured on its own — a page average dilutes one bad field into nothing. */
function pageFields(page) {
  return [
    ["intro", page.intro],
    ["localProof", page.localProof],
    ["marketContext", page.marketContext],
    ...page.quickFacts.map((text, i) => [`quickFacts[${i}]`, text]),
    ...page.serviceFocus.map((item) => [`serviceFocus:${item.title}`, item.text]),
    ...page.faqs.map((faq) => [`faq:${faq.question.slice(0, 34)}`, faq.answer]),
  ];
}

function pageBody(page) {
  return pageFields(page)
    .map(([, text]) => text)
    .join(" ");
}

const DENSITY_STOP_WORDS = new Set(
  ("the and a to of in for is on with that before it as by are be or so how what from can you your " +
    "not this they their we our one all after than into more most has have its").split(" "),
);

function checkCopyDensity(site) {
  let worstComma = { value: 0, path: "", field: "" };
  let worstWord = { value: 0, term: "", path: "" };

  for (const page of site.getAllConstructionPages()) {
    for (const [field, text] of pageFields(page)) {
      const sentences = (text.match(/\./g) || []).length || 1;
      const commas = (text.match(/,/g) || []).length;
      const density = commas / sentences;
      if (density > worstComma.value) worstComma = { value: density, path: page.path, field };
    }

    const body = pageBody(page);
    const words = body.toLowerCase().replace(/[^a-z ]/g, " ").split(/\s+/).filter(Boolean);
    const counts = new Map();
    for (const word of words) {
      if (word.length <= 3 || DENSITY_STOP_WORDS.has(word)) continue;
      counts.set(word, (counts.get(word) ?? 0) + 1);
    }
    for (const [term, count] of counts) {
      const per100 = (count / words.length) * 100;
      if (per100 > worstWord.value) worstWord = { value: per100, term, path: page.path };
    }
  }

  if (worstComma.value > MAX_COMMAS_PER_SENTENCE) {
    fail(
      "comma-density",
      `${worstComma.field} on ${worstComma.path} averages ${worstComma.value.toFixed(2)} commas ` +
        `per sentence, over the limit of ${MAX_COMMAS_PER_SENTENCE}. Break the noun-string into ` +
        `sentences — this is what made the pages read as padded at only ~390 words.`,
      "src/lib/site.ts",
    );
  }

  if (worstWord.value > REPETITION_WARN_PER_100_WORDS) {
    warn(
      "keyword-repetition",
      `"${worstWord.term}" appears ${worstWord.value.toFixed(1)} times per 100 words on ` +
        `${worstWord.path}. Check it reads naturally rather than as stuffing.`,
      "src/lib/site.ts",
    );
  }
}

/** Raw keyword lists rendered to visitors are the clearest tell of a page written for a crawler. */
function checkKeywordChips(sources) {
  for (const { path, text } of sources) {
    if (!path.includes("app/") && !path.includes("components/")) continue;
    const body = stripComments(text);
    if (/Keyword Coverage/i.test(body)) {
      fail("keyword-stuffing", '"Keyword Coverage" block renders raw keywords to visitors', path);
    }
    if (/\{\s*(?:page\.)?keywords\s*\.\s*map\s*\(/.test(body)) {
      fail(
        "keyword-stuffing",
        "renders the keyword array into the page body — keywords belong in metadata and in prose",
        path,
      );
    }
  }
}

function checkSchema(site, sources) {
  const layout = sources.find((file) => file.path.endsWith("app/layout.tsx"));
  if (!/organizationJsonLd/.test(layout?.text ?? "")) {
    fail(
      "missing-schema",
      "layout.tsx does not emit organizationJsonLd — the business schema must sit on every page, " +
        "not on an empty one.",
      "src/app/layout.tsx",
    );
  }

  const schema = sources.find((file) => file.path.endsWith("lib/schema.ts"));
  if (!/"@type":\s*\[\s*"LocalBusiness"/.test(schema?.text ?? "")) {
    fail("missing-schema", "organizationJsonLd is not typed as LocalBusiness", "src/lib/schema.ts");
  }

  const page = sources.find((file) => file.path.includes("construction/[city]/[service]"));
  for (const required of ["breadcrumbJsonLd", "constructionServiceJsonLd", "faqJsonLd"]) {
    if (!new RegExp(required).test(page?.text ?? "")) {
      fail("missing-schema", `landing template does not emit ${required}`, page?.path ?? "?");
    }
  }

  const cities = new Set(site.serviceAreas.map((area) => area.city));
  const inSchema = site.serviceAreas.length;
  if (cities.size !== inSchema) {
    fail("city-drift", "serviceAreas contains duplicate city names", "src/lib/site.ts");
  }
}

/**
 * A hub without spokes is not a hub.
 *
 * These pages exist for one structural reason: to consolidate a topic and link
 * down to all fourteen cities. Drop the city block and you are back to ten
 * orphaned pages competing with the very city pages they were meant to gather,
 * which is the defect this whole layer was built to fix. The FAQ matters too —
 * it is what carries the FAQPage schema.
 */
function checkHubStructure(hubs, sources) {
  const page = sources.find((file) => file.path.includes("services/[service]"));
  if (!page) {
    fail("hub-structure", "service hub template not found", "src/app/services");
    return;
  }

  if (!/hub\.cities\.map/.test(page.text)) {
    fail(
      "hub-structure",
      "The hub template no longer renders hub.cities. That link set is the entire reason these " +
        "pages exist — without it they are ten more orphans competing with the city pages.",
      page.path,
    );
  }

  if (!/FaqAccordion/.test(page.text)) {
    fail("hub-structure", "The hub template is missing its FAQ accordion.", page.path);
  }

  for (const hub of hubs.getAllServiceHubs()) {
    if (hub.cities.length !== site.serviceAreas.length) {
      fail(
        "hub-structure",
        `${hub.path} links ${hub.cities.length} cities but there are ${site.serviceAreas.length}. ` +
          `A hub must link every city it serves.`,
        "src/lib/hubs.ts",
      );
    }
    if (hub.faqs.length < 3) {
      fail("hub-structure", `${hub.path} has only ${hub.faqs.length} FAQs.`, "src/lib/hubs.ts");
    }
  }
}

/**
 * A city hub has to earn its URL.
 *
 * These five pages are the highest-risk thing on the site. A set of city pages
 * that differ only by a swapped place name is the exact pattern Google's
 * scaled-content policy names, and the penalty lands on the domain rather than
 * on the page. What separates a hub from a doorway is that it carries facts
 * about that municipality which a competitor cannot copy without doing the same
 * work — so this gate makes those facts mandatory rather than aspirational.
 *
 * Everything here is an ERROR, not a warning. A thin hub is not an absence, it
 * is an assertion that the page is worth ranking, and that is a bluff.
 *
 * If a city trips this, delete the hub or go and read the municipality's permit
 * pages. Do not relax the rule — the whole defence is that it cannot be argued
 * with.
 */
function checkCityHubStructure(cityHubs, sources) {
  const hubs = cityHubs.getAllCityHubs();
  const where = "src/lib/cityHubs.ts";

  const template = sources.find(
    (file) => file.path.includes("construction/[city]/page") && !file.path.includes("[service]"),
  );

  if (!template) {
    fail("city-hub-structure", "city hub template not found", "src/app/construction/[city]");
  } else {
    // The link set down to the services is the entire structural reason these
    // pages exist. Without it a hub is an eleventh page competing with the ten
    // it was built to gather.
    if (!/hub\.services/.test(template.text)) {
      fail(
        "city-hub-structure",
        "The hub template no longer passes hub.services. That link set is why these pages exist — " +
          "without it each hub is an orphan competing with the ten city-service pages beneath it.",
        template.path,
      );
    }
    // The permit block is the differentiated content. A hub without it is a
    // city page with a rewritten intro, which is the thing being defended
    // against.
    // `<CityPermitBlock`, not `CityPermitBlock` — matching the bare name also
    // matches the import statement, so deleting the element while leaving the
    // import behind passed a gate that exists to stop exactly that.
    if (!template.text.includes("<CityPermitBlock")) {
      fail(
        "city-hub-structure",
        "The hub template no longer renders CityPermitBlock. The sourced municipal facts are the " +
          "only thing on these pages a competitor cannot copy.",
        template.path,
      );
    }
    // Same reasoning: check the call, not the identifier.
    for (const required of ["breadcrumbJsonLd", "cityHubJsonLd", "faqJsonLd"]) {
      if (!template.text.includes(`${required}(`)) {
        fail("missing-schema", `city hub template does not emit ${required}`, template.path);
      }
    }
  }

  // Uniqueness is measured on the fields that are supposed to be written per
  // city. Two hubs sharing one of these means the page was templated, which is
  // the defect rather than a symptom of it.
  const written = new Map();

  for (const hub of hubs) {
    const permits = hub.city.permits;

    if (!permits.authority) {
      fail(
        "city-hub-evidence",
        `${hub.path} has no permit authority. A hub without sourced municipal facts is a doorway ` +
          `page — read the municipality's own permit pages or drop the hub.`,
        where,
      );
    }

    if (permits.sources.length === 0) {
      fail(
        "city-hub-evidence",
        `${hub.path} states permit facts with no citation. Every populated permit field has to be ` +
          `traceable to the municipality's own page — this is a licensed contractor's site, and a ` +
          `wrong permit fact is a liability before it is an SEO problem.`,
        where,
      );
    }

    for (const source of permits.sources) {
      if (!/^https:\/\//.test(source)) {
        fail("city-hub-evidence", `${hub.path} cites a non-https source: ${source}`, where);
      }
    }

    if (hub.services.length !== site.constructionServices.length) {
      fail(
        "city-hub-structure",
        `${hub.path} links ${hub.services.length} services but there are ` +
          `${site.constructionServices.length}. A hub must link every service it offers.`,
        where,
      );
    }

    if (hub.faqs.length < 4) {
      fail("city-hub-structure", `${hub.path} has only ${hub.faqs.length} FAQs.`, where);
    }

    checkFaqSpecificity(`city hub FAQ (${hub.city.city})`, hub.faqs, where);

    for (const [field, text] of [
      ["lead", hub.lead],
      ["angle", hub.angle],
      ["constraint", hub.constraint],
      ["costRationale", hub.costRationale],
    ]) {
      if (!text || text.trim().length < 80) {
        fail(
          "city-hub-structure",
          `${hub.path} has no written ${field}. This is the per-city substance the page is ` +
            `allowed to rank on; a generated sentence would be the doorway pattern.`,
          where,
        );
        continue;
      }

      const sentences = (text.match(/\./g) || []).length || 1;
      const commas = (text.match(/,/g) || []).length;
      if (commas / sentences > MAX_COMMAS_PER_SENTENCE) {
        fail(
          "comma-density",
          `${field} on ${hub.path} averages ${(commas / sentences).toFixed(2)} commas per ` +
            `sentence, over the limit of ${MAX_COMMAS_PER_SENTENCE}.`,
          where,
        );
      }

      const seen = written.get(text);
      if (seen) {
        fail(
          "city-hub-duplication",
          `${hub.path} and ${seen} publish an identical ${field}. Two city pages carrying the same ` +
            `sentence is precisely the scaled-content pattern these pages have to avoid.`,
          where,
        );
      } else {
        written.set(text, hub.path);
      }
    }

    // A hub asserting delivered work has to have it in the project records,
    // with a city recorded. getProjectsForCity already filters on that, so a
    // mismatch here means the copy is claiming something the data does not.
    for (const project of hub.projects) {
      if (project.citySlug !== hub.city.slug) {
        fail(
          "city-hub-evidence",
          `${hub.path} shows ${project.name}, which is recorded in ${project.citySlug || "no city"}.`,
          where,
        );
      }
    }
  }
}

/** The landing template must keep all seven trust sections, in order. */
function checkLandingStructure(sources) {
  const page = sources.find((file) => file.path.includes("construction/[city]/[service]"));
  if (!page) {
    fail("landing-structure", "landing template not found", "src/app");
    return;
  }
  const order = [
    "LandingHero",
    "ExperienceBlock",
    "ProjectProof",
    "ReviewsBlock",
    "WhyTheseServices",
    "LandingFaqs",
    "LandingCta",
  ];
  let cursor = -1;
  for (const section of order) {
    const at = page.text.indexOf(`<${section}`);
    if (at === -1) {
      fail("landing-structure", `landing page is missing the ${section} section`, page.path);
      continue;
    }
    if (at < cursor) {
      fail(
        "landing-structure",
        `${section} appears out of order — trust is built keyword → experience → work → reviews → ` +
          `services → FAQs → CTA, and the CTA comes last because it has to be earned.`,
        page.path,
      );
    }
    cursor = at;
  }
}

// ─────────────────────────────────────────────────────────────────────────────

function report() {
  const line = "─".repeat(72);

  if (warnings.length) {
    console.log(`\n${line}\n  ${warnings.length} warning(s) — not blocking\n${line}`);
    for (const { rule, detail, where } of warnings) {
      console.log(`\n  ⚠ [${rule}] ${where}\n    ${detail}`);
    }
  }

  if (errors.length) {
    console.log(`\n${line}\n  ${errors.length} error(s) — build blocked\n${line}`);
    for (const { rule, detail, where } of errors) {
      console.log(`\n  ✖ [${rule}] ${where}\n    ${detail}`);
    }
    console.log(
      `\n${line}\n  Each of these publishes a claim the site cannot back.\n` +
        `  Fix the content — do not relax the rule.\n${line}\n`,
    );
    process.exit(1);
  }

  console.log(`\n  ✓ check-trust passed — ${warnings.length} warning(s), 0 errors\n`);
}

const sources = await readSource();
const site = await import("../src/lib/site.ts");
const pricing = await import("../src/lib/pricing.ts");
const hubs = await import("../src/lib/hubs.ts");
const cityHubs = await import("../src/lib/cityHubs.ts");
const blog = await import("../src/lib/blog.ts");

checkCopy(sources);
checkCopyrightYear(sources);
checkCta(sources);
checkFaqSpecificity("homepage FAQ", site.aiFaqs, "src/lib/site.ts");
checkFaqSpecificity(
  "landing FAQ",
  site.getConstructionPage("abbotsford", "pharmacy-construction")?.faqs ?? [],
  "src/lib/site.ts",
);
checkPriceConsistency(site);
checkRatesAgainstConfig(pricing, sources);
checkPriceTotals(pricing, sources);
checkRatesSignedOff(pricing, site);
checkCopyDensity(site);
checkCredentials(site, sources);
checkEvidence(site);
checkPortfolioTally(site);
checkContentGaps(site);
await checkBlogRegistry(blog);
checkFooter(sources);
checkKeywordChips(sources);
checkSchema(site, sources);
checkHubStructure(hubs, sources);
checkCityHubStructure(cityHubs, sources);
checkLandingStructure(sources);
report();
