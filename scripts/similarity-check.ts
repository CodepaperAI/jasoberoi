/**
 * Fails the build when two city pages for the same service read the same.
 *
 * The programmatic city × service pages were ~85% identical: only the city
 * name, the neighbourhood list, one "shaped by" clause and the project cards
 * changed. Google's own report for that is "Crawled — currently not indexed",
 * and it is not a bug you can see by opening one page. This measures it.
 *
 * Chrome is deliberately stripped before comparing. Nav, header and footer are
 * identical by design — leaving them in inflates every pair toward 100% and
 * hides the thing being measured.
 *
 * Similarity is Jaccard over 5-word shingles rather than over the word set. A
 * word-set overlap reports ~91% for pages that share only vocabulary, because
 * English shares vocabulary; shingles compare phrasing, which is what a reader
 * and a crawler actually experience as "the same page".
 *
 * Usage:
 *   npx tsx scripts/similarity-check.ts            # reads ./out (run a build first)
 *   npx tsx scripts/similarity-check.ts --threshold 0.5
 *   npx tsx scripts/similarity-check.ts --url https://www.oberizonconstruction.ca
 */

import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const DEFAULT_THRESHOLD = 0.6;
const SHINGLE = 5;

/** Blocks that are identical on every page by design and would mask the signal. */
const CHROME_SELECTORS = [
  /<header\b[^>]*>[\s\S]*?<\/header>/gi,
  /<nav\b[^>]*>[\s\S]*?<\/nav>/gi,
  /<footer\b[^>]*>[\s\S]*?<\/footer>/gi,
  /<script\b[^>]*>[\s\S]*?<\/script>/gi,
  /<style\b[^>]*>[\s\S]*?<\/style>/gi,
  /<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi,
  /<svg\b[^>]*>[\s\S]*?<\/svg>/gi,
];

type Page = { city: string; service: string; text: string; indexed: boolean };

/**
 * Tier C pages are the sanctioned outcome for a city with nothing of its own to
 * say: noindex, follow, kept as navigation. They still share the fallback copy,
 * so they still score high — and holding them to the threshold would mean
 * either inventing local detail or deleting a working page. Both are worse than
 * a noindex tag. So the gate enforces on pages that can rank and reports the
 * rest, rather than quietly dropping them from the comparison.
 */
function isIndexed(html: string): boolean {
  return !/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
}

function visibleText(html: string): string {
  let out = html;
  for (const re of CHROME_SELECTORS) out = out.replace(re, " ");
  return out
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;|&#\d+;/gi, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
}

function shingles(text: string, n = SHINGLE): Set<string> {
  const words = text.split(" ").filter(Boolean);
  const set = new Set<string>();
  for (let i = 0; i + n <= words.length; i++) set.add(words.slice(i, i + n).join(" "));
  return set;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let shared = 0;
  for (const s of a) if (b.has(s)) shared++;
  return shared / (a.size + b.size - shared);
}

async function loadFromExport(root: string): Promise<Page[]> {
  const base = join(root, "construction");
  const pages: Page[] = [];
  for (const city of await readdir(base, { withFileTypes: true })) {
    // iCloud writes "surrey 2" copies onto the synced Desktop; they are not routes.
    if (!city.isDirectory() || /\s\d+$/.test(city.name)) continue;
    const cityDir = join(base, city.name);
    for (const service of await readdir(cityDir, { withFileTypes: true })) {
      if (!service.isDirectory() || /\s\d+$/.test(service.name)) continue;
      const file = join(cityDir, service.name, "index.html");
      try {
        const html = await readFile(file, "utf8");
        pages.push({
          city: city.name,
          service: service.name,
          text: visibleText(html),
          indexed: isIndexed(html),
        });
      } catch {
        // A city/service directory without an index.html is not a rendered page.
      }
    }
  }
  return pages;
}

/**
 * The route list comes from the build output rather than from importing
 * site.ts. Importing the data module would make this script part of the app's
 * type graph — and `next build` typechecks scripts/, so a `.ts`-extension
 * import fails the production build. The directory walk needs no import and
 * cannot drift from what actually shipped.
 */
async function routePairs(root: string): Promise<Array<[string, string]>> {
  const base = join(root, "construction");
  const pairs: Array<[string, string]> = [];
  for (const city of await readdir(base, { withFileTypes: true })) {
    if (!city.isDirectory() || /\s\d+$/.test(city.name)) continue;
    for (const service of await readdir(join(base, city.name), { withFileTypes: true })) {
      if (!service.isDirectory() || /\s\d+$/.test(service.name)) continue;
      pairs.push([city.name, service.name]);
    }
  }
  return pairs;
}

async function loadFromUrl(origin: string, root: string): Promise<Page[]> {
  const pages: Page[] = [];
  for (const [city, service] of await routePairs(root)) {
    const res = await fetch(`${origin}/construction/${city}/${service}/`);
    if (!res.ok) continue;
    const html = await res.text();
    pages.push({ city, service, text: visibleText(html), indexed: isIndexed(html) });
  }
  return pages;
}


/**
 * The blog, as pages, for the same measurement.
 *
 * This gate was written for the 140 programmatic city pages, which were the
 * duplication risk at the time. The blog has since grown to the largest set of
 * indexable pages on the site and was never in the comparison — so the one
 * place a near-duplicate post could be added without anything noticing was the
 * blog. Adding a second cost guide for a build type that already has one is
 * exactly the mistake this script exists to catch.
 *
 * Posts are compared against every other post rather than grouped, because
 * unlike the city pages there is no dimension along which two of them are
 * *expected* to resemble each other.
 */
async function loadBlog(root: string): Promise<Array<{ slug: string; text: string; indexed: boolean }>> {
  const base = join(root, "blog");
  const posts: Array<{ slug: string; text: string; indexed: boolean }> = [];
  for (const entry of await readdir(base, { withFileTypes: true })) {
    if (!entry.isDirectory() || /\s\d+$/.test(entry.name)) continue;
    try {
      const html = await readFile(join(base, entry.name, "index.html"), "utf8");
      posts.push({ slug: entry.name, text: visibleText(html), indexed: isIndexed(html) });
    } catch {
      // A directory without an index.html is not a rendered post.
    }
  }
  return posts;
}

async function main() {
  const args = process.argv.slice(2);
  const at = (flag: string) => {
    const i = args.indexOf(flag);
    return i === -1 ? undefined : args[i + 1];
  };
  const threshold = Number(at("--threshold") ?? DEFAULT_THRESHOLD);
  const origin = at("--url");

  const root = at("--dir") ?? "out";
  const pages = origin ? await loadFromUrl(origin, root) : await loadFromExport(root);
  if (!pages.length) {
    console.error("No pages found. Run `npm run build` first, or pass --url.");
    process.exit(2);
  }

  // Two groupings, because the first one alone missed the worse problem.
  // Grouping by service compares cities; grouping by city compares services.
  // Only the first existed, so a pair of pages in one city measuring 83%
  // identical went unmeasured while this gate reported passing.
  const byService = new Map<string, Page[]>();
  for (const page of pages) {
    if (!byService.has(page.service)) byService.set(page.service, []);
    byService.get(page.service)!.push(page);
  }

  const byCity = new Map<string, Page[]>();
  for (const page of pages) {
    if (!byCity.has(page.city)) byCity.set(page.city, []);
    byCity.get(page.city)!.push(page);
  }

  const cache = new Map<string, Set<string>>();
  const shingleFor = (p: Page) => {
    const key = `${p.city}/${p.service}`;
    if (!cache.has(key)) cache.set(key, shingles(p.text));
    return cache.get(key)!;
  };

  const failures: Array<{ service: string; a: string; b: string; score: number }> = [];
  const noindexOver: Array<{ service: string; a: string; b: string; score: number }> = [];
  let compared = 0;
  let worst = 0;
  let total = 0;

  const sweep = (
    groups: Map<string, Page[]>,
    label: (key: string, a: Page, b: Page) => { service: string; a: string; b: string },
  ) => {
    for (const [key, group] of groups) {
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          const score = jaccard(shingleFor(group[i]), shingleFor(group[j]));
          compared++;
          total += score;
          worst = Math.max(worst, score);
          if (score > threshold) {
            const bothIndexed = group[i].indexed && group[j].indexed;
            const row = { ...label(key, group[i], group[j]), score };
            (bothIndexed ? failures : noindexOver).push(row);
          }
        }
      }
    }
  };

  // Same service, different cities.
  sweep(byService, (service, a, b) => ({ service, a: a.city, b: b.city }));
  // Same city, different services — the comparison this gate used to skip.
  sweep(byCity, (city, a, b) => ({ service: city, a: a.service, b: b.service }));

  const pct = (n: number) => `${(n * 100).toFixed(1)}%`;
  const indexedPages = pages.filter((p) => p.indexed).length;
  console.log(`\nPages: ${pages.length} (${indexedPages} indexed)   Pairs compared: ${compared}   Threshold: ${pct(threshold)}`);
  console.log(`Mean similarity: ${pct(total / compared)}   Worst pair: ${pct(worst)}`);

  if (noindexOver.length) {
    const cities = [...new Set(noindexOver.flatMap((f) => [f.a, f.b]))].sort();
    console.log(
      `\n${noindexOver.length} pair(s) above threshold involve a noindex (tier C) page — reported, not enforced.` +
        `\n  cities: ${cities.join(", ")}`,
    );
  }

  const blogFailures = await sweepBlog(root, threshold, pct);

  if (!failures.length && !blogFailures) {
    console.log(`\n✓ No indexed city pair exceeds ${pct(threshold)} for the same service.\n`);
    return;
  }
  if (!failures.length) process.exit(1);

  failures.sort((x, y) => y.score - x.score);
  console.error(`\n✖ ${failures.length} INDEXED pair(s) above ${pct(threshold)}:\n`);
  for (const f of failures.slice(0, 25)) {
    console.error(`  ${pct(f.score).padStart(6)}  ${f.service}: ${f.a} vs ${f.b}`);
  }
  if (failures.length > 25) console.error(`  … and ${failures.length - 25} more`);
  console.error("\nDifferentiate these cities further, or move them to tier C.\n");
  process.exit(1);
}

/** Returns true when any blog pair is over threshold. */
async function sweepBlog(root: string, threshold: number, pct: (n: number) => string) {
  const posts = await loadBlog(root);
  if (posts.length < 2) return false;

  const grams = posts.map((post) => ({ slug: post.slug, s: shingles(post.text), indexed: post.indexed }));
  const over: Array<{ a: string; b: string; score: number }> = [];
  let worst = 0;
  let total = 0;
  let compared = 0;

  for (let i = 0; i < grams.length; i++) {
    for (let j = i + 1; j < grams.length; j++) {
      const score = jaccard(grams[i].s, grams[j].s);
      compared++;
      total += score;
      worst = Math.max(worst, score);
      if (score > threshold && grams[i].indexed && grams[j].indexed) {
        over.push({ a: grams[i].slug, b: grams[j].slug, score });
      }
    }
  }

  console.log(
    `\nBlog: ${posts.length} posts   Pairs compared: ${compared}   ` +
      `Mean: ${pct(total / compared)}   Worst pair: ${pct(worst)}`,
  );

  if (!over.length) {
    console.log(`✓ No blog pair exceeds ${pct(threshold)}.`);
    return false;
  }

  over.sort((x, y) => y.score - x.score);
  console.error(`\n✖ ${over.length} BLOG pair(s) above ${pct(threshold)}:\n`);
  for (const f of over.slice(0, 25)) {
    console.error(`  ${pct(f.score).padStart(6)}  ${f.a} vs ${f.b}`);
  }
  console.error(
    "\nTwo posts targeting one keyword split the ranking rather than doubling it. " +
      "Merge them, or give one a distinct question to answer.\n",
  );
  return true;
}

main().catch((error) => {
  console.error(error);
  process.exit(2);
});
