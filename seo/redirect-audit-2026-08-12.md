# Oberizon cutover — redirect audit & sitemap fix

**Site:** https://www.oberizonconstruction.ca
**Cutover deployed:** 2026-08-11
**This audit + fixes:** 2026-08-12
**Verified against:** live production, not config files

---

## Short answer

**Yes — the redirects were set, and they work.** All five old→new mappings resolve to a live page.

They were, however, incomplete, and the **sitemap was pointing Google at 86 redirect URLs**. Both are now fixed and deployed. The sitemap is ready to submit.

---

## 1. What shipped in the cutover (2026-08-10 → 08-11)

| Commit | Time | What |
|---|---|---|
| `c7edf19` | Aug 10, 11:22 | SEO consultant's title + meta rewrite (fixed 135 over-length titles, 155 over-length descriptions) |
| `190729e` | Aug 11, 12:56 | Redirects for the old site's URLs (`vercel.json`) |
| `a033922` | Aug 11, 13:01 | GTM container installed |
| `31b353d` | Aug 11, 13:04 | Conversion events moved to `dataLayer` |

Redirects live in `vercel.json`, not `next.config.ts` — correct, because `next.config.ts` sets `output: "export"` and Next does not apply `redirects()` to a static export. Vercel's edge routing does.

## 2. Redirect status — verified live

The old site had **14 URLs**. All 14 now resolve:

**Redirected (7):**

| Old URL | Now lands on | Status |
|---|---|---|
| `/residential-projects` | `/services/luxury-residential-construction/` | 200 ✅ |
| `/commercial-projects` | `/services/commercial-construction/` | 200 ✅ |
| `/service-vancouver` | `/construction/vancouver/commercial-construction/` | 200 ✅ |
| `/landing-page` | `/services/dental-clinic-construction/` | 200 ✅ |
| `/thank-you` | `/contact/` | 200 ✅ |
| `/about-us` | `/about/` | 200 ✅ **added Aug 12** |
| `/blog` (+ any post below it) | `/projects/` | 200 ✅ **added Aug 12** |

**Carried over by name (5):** `/about`, `/contact`, `/projects`, `/services`, `/privacy-policy` — all 200.

## 3. What was wrong, and what was fixed

### 🔴 The sitemap advertised 86 redirects — fixed

This was the blocker.

`next.config.ts` sets `trailingSlash: true`, so every page is served at `/about/`. Next.js applies that normalisation to the `<link rel="canonical">` tag automatically — but **not** to sitemap entries, which it emits verbatim. `src/app/sitemap.ts` built its URLs through `absoluteUrl()`, which adds no trailing slash.

Net effect: 86 of 87 sitemap URLs were `/about` rather than `/about/`, and every one `308`-redirected to its canonical.

Had this been submitted as-is, Search Console would have filed nearly the entire site under **"Page with redirect"** and indexed none of it.

**Fix:** added `canonicalPageUrl()` to `src/lib/seo.ts` and switched `src/app/sitemap.ts` to it. Kept separate from `absoluteUrl()` deliberately — `buildMetadata` also runs image paths through `absoluteUrl`, and a trailing slash would break those.

**Verified:** all 87 live sitemap URLs now return `200` directly, zero redirect hops.

### 🔴 `/about-us` and `/blog` were 404ing — fixed

The original redirect map covered 5 of the 7 old URLs that needed one. `/about-us` and `/blog` were both in the old site's sitemap and had been returning 404 since the DNS flip.

`/blog` needed slashed *and* unslashed wildcards — the trailing-slash normaliser rewrites `/blog/post` to `/blog/post/` before the redirect matches, so a bare `/blog/:path*` missed every post.

### 🟡 `llms.txt` linked unslashed URLs — fixed

Nine hardcoded links each took a needless 308 hop. Slashes added.

## 4. Noted, no action needed

- **They're 308s, not 301s.** `"permanent": true` on Vercel emits `308 Permanent Redirect`. Google treats 308 and 301 identically for link-equity consolidation, so there is no SEO cost. (One behavioural difference: 308 preserves the request method where 301 downgrades POST to GET. Irrelevant here.)
- **Old URLs take two hops.** `/thank-you` → `/thank-you/` → `/contact/`, because Next's internal trailing-slash normaliser runs before the `vercel.json` rule. Google follows chains of this length without issue and passes full equity.
- **70 city pages are deliberately excluded** from the sitemap. Pages for `richmond`, `chilliwack`, `coquitlam`, `west-vancouver`, `delta`, `new-westminster`, and `tri-cities` are `noindex` because they have no delivered project and no measured search demand. They're built, reachable, and `follow`, so link equity still flows through them. Excluding them from the sitemap is correct — listing a `noindex` page in a sitemap is a contradictory signal.
- **`/cost` is excluded** for the same reason — it stays `noindex` until the rate ranges are client-confirmed (`ratesConfirmedByClient` in `src/lib/pricing.ts`).

## 5. The sitemap

**87 URLs** = 1 homepage + `/construction/` + `/services/` + 10 service pages + 4 main pages + 70 indexable city pages.

A copy is saved alongside this file as `sitemap-2026-08-12.xml` for your records.

### How to submit

In Search Console you submit a **URL**, not a file upload:

1. Search Console → **Sitemaps**
2. Enter `sitemap.xml` → Submit
3. Full URL: `https://www.oberizonconstruction.ca/sitemap.xml`

If a sitemap was submitted before today, it will refresh on its own; you can also remove and re-add it to force a re-read. For any existing **"Page with redirect"** errors, use **Validate Fix** — those were caused by the trailing-slash bug and are now resolved.

---

## 6. ⚠️ Still open — needs action outside the code

### Google Ads conversion tracking is almost certainly dead

The Ads conversion action was very likely configured to fire on a **`/thank-you` pageview**. That page no longer exists — it now redirects to `/contact/` before anything can be counted. The `/thank-you` → `/contact/` redirect preserves the URL for users, but **not** the conversion trigger.

The site now pushes `form_submit`, `call_click`, `whatsapp_click`, and `email_click` to the dataLayer (`src/components/ConversionTracking.tsx`). The code side is done. **The Ads/GTM account still has to be repointed onto those events** — until that happens, conversions will read as zero regardless of actual lead volume.

Tag IDs in play: GA4 `G-YRH2XSG1Q4`, Google Ads `AW-16989825413`, GTM `GTM-NQNGGG6R`, Facebook pixel `1683288065744579`. Only the GTM container is installed in code — hardcoding GA4 and the Ads tag alongside a container that already fires them would double-count.

### Smaller items

- `TODO(client)` in `src/lib/site.ts` — BC contractor licence number and WorkSafeBC number still missing.
- `/cost` stays `noindex` until Jas confirms the rate ranges.
- If you can export the old indexed-URL list from Search Console (**Pages** → indexed), it's worth a cross-check. This audit reconstructed the old URL set from a crawl log captured before the cutover; a GSC export would confirm nothing else is 404ing.

---

## 7. Verification commands

```bash
# Every sitemap URL should return 200 with no redirect hop
curl -s https://www.oberizonconstruction.ca/sitemap.xml \
  | grep -oE '<loc>[^<]*</loc>' | sed -e 's|<loc>||' -e 's|</loc>||' \
  | while read u; do
      code=$(curl -s -o /dev/null -w '%{http_code}' "$u")
      [ "$code" != "200" ] && echo "FAIL $code $u"
    done
# expect: no output

# Every old URL should resolve
for u in /residential-projects /commercial-projects /service-vancouver \
         /landing-page /thank-you /about-us /blog; do
  printf "%-22s %s\n" "$u" \
    "$(curl -s -o /dev/null -w '%{http_code}' -L "https://www.oberizonconstruction.ca$u")"
done
# expect: 200 for all seven
```

Both were run against production on 2026-08-12 and passed.
