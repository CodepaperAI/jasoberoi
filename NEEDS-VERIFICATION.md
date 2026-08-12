# Needs verification

Facts the city pages want but the site will not assert until someone confirms them.

Every item here is a field currently set to `null` in `src/lib/site.ts`. Null renders nothing — no placeholder, no hedge, no "typically around". This is a licensed contractor's site, so a wrong permit timeline is a liability before it is an SEO problem.

**Last checked: 2026-08-12.**

---

## 0. ⚠️ The site now runs two standards on permit timelines

**Accepted deliberately by Jenish on 2026-08-12. Recorded here so it does not disappear.**

The blog publishes specific permit timelines:

- `/blog/medical-clinic-construction-permits-bc/` — "3–6 months from permit application to occupancy", plus a permit-by-authority table (municipal 4–12 weeks, health authority 2–8 weeks, Technical Safety BC 1–3 weeks)
- `/blog/dental-clinic-build-timeline/` — "permit submission & approval 4–10 weeks"
- `/blog/dental-office-renovation-timeline/` — "some municipalities 4–6 weeks, others 10–12 weeks"

The **city pages state no timeline at all**, because none could be sourced from a municipal website (see item 1 below).

So the same site asserts review windows in one place and declines to in another. Nobody has verified the blog's figures — they arrived in the consultant's content package without citations.

**To resolve, pick one:**

1. **Jas confirms the blog's numbers from his own jobs.** Best outcome: they stay in the blog *and* fill the null `permitTimeline` fields in `src/lib/site.ts`, clearing item 1 below. One standard, one source of truth.
2. **Jas cannot stand behind them.** Then they come out of the blog, because a licensed contractor's site should not publish a review window it will not defend.

---

## 1. Commercial permit review timelines — every city

**None of the fourteen municipalities publishes a commercial permit review window on its public pages.** They publish what an application must *contain*, not how long it takes. This was checked directly, not assumed.

`permitTimeline` is therefore `null` for all fourteen cities, including the three whose permit authority and pathway *are* sourced.

**Jas needs to supply, from actual jobs:** a realistic commercial/tenant-improvement review window per city, ideally as a range with a "as of" date. Even "6–10 weeks in Surrey, faster in Abbotsford" is publishable if he'll stand behind it — and it is the single most valuable thing that could go on these pages, because no competitor publishes it either.

---

## 2. Permit authority and pathway — 5 of the 8 indexed cities

| City | Status | Blocker |
|---|---|---|
| White Rock | ✅ sourced | — |
| Richmond | ✅ sourced | — |
| Abbotsford | ✅ sourced | — |
| **Surrey** | ❌ null | surrey.ca returns HTTP 403 to automated requests |
| **Vancouver** | ❌ null | vancouver.ca returns HTTP 403 |
| **Burnaby** | ❌ null | permit page URL not discoverable without web search |
| **Langley** | ❌ null | City vs Township split — need to know which applies per address |
| **North Vancouver** | ❌ null | City vs District split — same problem |

Sourced entries carry their citation URLs in the `permits.sources` array beside the data.

**Note on Langley and North Vancouver:** each is *two* municipalities with separate building departments. The page currently treats each as one place. Before publishing permit specifics, decide whether to split the pages or to state plainly that the route depends on which jurisdiction the address falls in.

**To resolve:** these pages are readable by a person in a browser. Someone needs to open each city's building-permit page and record: department name, commercial/TI pathway, and whether a development permit precedes the building permit.

---

## 3. The unattributed delivered clinic

`kanwarveer-family-dentist` in `src/lib/site.ts` is marked **Delivered**, has **4 photographs**, and has `citySlug: ""` — so it renders on no city page at all.

**Question for Jas: which city was the Kanwarveer clinic in?**

This matters more than it looks. If it was Richmond, Richmond has a delivered project with photography and becomes **Tier A** instead of the Tier B it currently sits at on the strength of a review alone. There is also a `Dr. Kanwar` review in the reviews array with no city recorded, which is likely the same job.

---

## 4. Per-city cost ranges

Step 2 of the brief asked for cost ranges varied by city. **Not done, deliberately.**

`ratesConfirmedByClient` in `src/lib/pricing.ts` is still `false` — Jas has not signed off on the *base* $120–220/sq ft band. Varying an unconfirmed number city by city would invent the one figure an owner actually acts on.

What ships instead: one site-wide range, plus a written `costRationale` per city explaining why that city sits where it does within it (trade travel, access restrictions, base-building age). That is defensible without a source.

**To resolve:** Jas confirms the base ranges → flip `ratesConfirmedByClient` to `true`. Per-city numeric variance is a separate decision after that.

---

## 5. Missing project photography

| Project | City | Status | Photos |
|---|---|---|---|
| `pharmacy-156-st-surrey` | Surrey | In progress | **0** |
| `dental-clinic-whalley-blvd-surrey` | Surrey | In progress | **0** |
| `dental-clinic-b115-272-st-langley` | Langley | In progress | **0** |
| `dental-clinic-e100-272-st-langley` | Langley | In progress | **0** |

Surrey and Langley are both Tier A on real in-progress projects, but neither can show one. Even progress photos would lift both cities materially — they are the only Tier A cities with nothing to display.

---

## 6. Project detail — all ten projects

Every project has `scope`, `timeline` and `challenge` undefined. The type documents why: *"We built a dental clinic" ranks for nothing — the challenge is what a practice owner searches for and remembers.*

**For each project, Jas needs to supply:** what the job actually involved, how long it took, and the one problem that had to be solved.

---

## 7. Review metadata

- **All 3 reviews are undated.** Dated reviews naming a person and a place convert materially better. (`check-trust` warns on this.)
- **2 of 3 have no city.** Only Dr. Bradley (Richmond) does — which is the sole reason Richmond is indexed at all. If Dr. Kanwar's and Dr. Satpreet's cities were recorded, those cities gain real local evidence.

---

## 8. Contractor credentials

`TODO(client)` in `src/lib/site.ts`: BC contractor licence number and WorkSafeBC number are still placeholders. These are trust signals a commercial client checks.

---

## How to clear an item

Fill the field in `src/lib/site.ts`, add the source URL to `permits.sources` where it is a permit fact, delete the row here, and run `npm run build` — `scripts/check-trust.mjs` will reject anything that claims more than it can back.
