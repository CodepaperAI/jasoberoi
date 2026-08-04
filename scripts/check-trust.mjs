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
      else if (/\.tsx?$/.test(entry.name)) files.push(full);
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

/** Report the content the client still owes, without blocking on it. */
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
 * The calculator must not reach a public surface on rates the client has not
 * agreed to be held to.
 */
function checkRatesSignedOff(pricing, site, sources) {
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
  const linksToCost = [
    ...site.navigation.flatMap((item) => [item.href, ...(item.items ?? []).map((sub) => sub.href)]),
    ...site.resourceLinks.map((link) => link.href),
  ].filter((href) => href?.startsWith("/cost"));

  if (linksToCost.length > 0) {
    fail(
      "unconfirmed-rates",
      `/cost is linked from the navigation or footer (${linksToCost.join(", ")}) while its rates ` +
        `are unconfirmed.`,
      "src/lib/site.ts",
    );
  }

  warn(
    "unconfirmed-rates",
    "Cost calculator is built and testable but noindex, out of the sitemap and unlinked, because " +
      "ratesConfirmedByClient is false. Get the ranges signed off, then flip the flag in " +
      "src/lib/pricing.ts.",
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
checkRatesSignedOff(pricing, site, sources);
checkCopyDensity(site);
checkCredentials(site, sources);
checkEvidence(site);
checkContentGaps(site);
checkFooter(sources);
checkKeywordChips(sources);
checkSchema(site, sources);
checkLandingStructure(sources);
report();
