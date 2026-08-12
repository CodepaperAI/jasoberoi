import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

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
export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  /** Date the post was written. Drives sitemap lastmod and the byline. */
  published: string;
  /** Service slug this post exists to feed. */
  service: string;
  /** Short label for index cards and related-reading rails. */
  cardTitle: string;
  /** Reading time in minutes, rounded from the drafted word count. */
  minutes: number;
  /** Slug of the broader post this one is a long-tail child of. */
  childOf?: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "dental-clinic-construction-cost-bc",
    title: "How Much Does It Cost to Build a Dental Clinic in BC? (2026)",
    description:
      "What a dental clinic costs to build in BC in 2026, broken down by clinic size, with the line items that move the number most.",
    published: "2026-08-04",
    service: "dental-clinic-construction",
    cardTitle: "Dental clinic construction cost in BC",
    minutes: 8,
  },
  {
    slug: "5-operatory-dental-clinic-cost-bc",
    title: "5-Operatory Dental Clinic Cost in BC: A 2026 Line-Item Breakdown",
    description:
      "A real line-item cost breakdown for a 5-operatory dental clinic in BC: square footage, per-operatory costs, plumbing, electrical and equipment.",
    published: "2026-08-05",
    service: "dental-clinic-construction",
    cardTitle: "5-operatory dental clinic cost",
    minutes: 9,
    childOf: "dental-clinic-construction-cost-bc",
  },
  {
    slug: "dental-clinic-build-timeline",
    title: "Dental Clinic Build Timeline: From Lease Signing to First Patient",
    description:
      "A realistic dental clinic build timeline for BC, phase by phase from lease signing to opening day, plus the delays that push it back.",
    published: "2026-08-06",
    service: "dental-clinic-construction",
    cardTitle: "Dental clinic build timeline",
    minutes: 8,
  },
  {
    slug: "commercial-lease-for-a-clinic-checklist",
    title: "12 Things to Check Before You Sign a Commercial Lease for a Clinic",
    description:
      "A 12-point clinic lease checklist covering the buildout issues that cost the most when they surface after signing rather than before.",
    published: "2026-08-07",
    service: "healthcare-construction",
    cardTitle: "Clinic lease checklist",
    minutes: 9,
  },
  {
    slug: "tenant-improvement-allowance-explained",
    title: "Tenant Improvement Allowance Explained: What It Covers",
    description:
      "What a tenant improvement allowance actually covers, what it rarely does, and how to price your buildout against it before signing.",
    published: "2026-08-08",
    service: "office-renovation-contractor",
    cardTitle: "Tenant improvement allowance",
    minutes: 7,
  },
  {
    slug: "base-building-vs-tenant-improvement",
    title: "Base Building vs. Tenant Improvement: What Your Landlord Is Responsible For",
    description:
      "Where the landlord's base building scope ends and your tenant improvement begins — and why the boundary decides your budget.",
    published: "2026-08-09",
    service: "commercial-renovation",
    cardTitle: "Base building vs tenant improvement",
    minutes: 7,
  },
  {
    slug: "dental-office-renovation-timeline",
    title: "How Long Does It Take to Renovate a Dental Office?",
    description:
      "A realistic dental office renovation timeline for BC practices, including how to keep seeing patients while the work runs.",
    published: "2026-08-10",
    service: "dental-office-renovation",
    cardTitle: "Dental office renovation timeline",
    minutes: 7,
  },
  {
    slug: "dental-office-renovation-checklist",
    title: "Dental Office Renovation Checklist: 12 Steps",
    description:
      "A 12-step dental office renovation checklist for BC practices, ordered the way the work actually has to happen.",
    published: "2026-08-11",
    service: "dental-office-renovation",
    cardTitle: "Dental office renovation checklist",
    minutes: 8,
  },
  {
    slug: "medical-clinic-construction-permits-bc",
    title: "Medical Clinic Construction Permits in BC: A Step-by-Step Guide",
    description:
      "The permits a medical clinic build needs in BC — municipal, health authority, Technical Safety BC — and the order to pursue them in.",
    published: "2026-08-12",
    service: "medical-clinic-construction",
    cardTitle: "Medical clinic permits in BC",
    minutes: 9,
  },
  {
    slug: "commercial-renovation-vs-new-construction",
    title: "Commercial Renovation vs. New Construction: Which Is Right for You?",
    description:
      "How to decide between renovating an existing commercial space and building new, on cost, timeline and risk.",
    published: "2026-08-13",
    service: "commercial-construction",
    cardTitle: "Renovation vs new construction",
    minutes: 8,
  },
  {
    slug: "luxury-home-builder-vs-general-contractor",
    title: "Luxury Home Builder vs. General Contractor: What's the Real Difference?",
    description:
      "What separates a luxury home builder from a general contractor, and which one a high-finish BC build actually needs.",
    published: "2026-08-14",
    service: "luxury-residential-construction",
    cardTitle: "Luxury builder vs general contractor",
    minutes: 7,
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

/** Every post, newest first — the order the index renders in. */
export function postsByDate() {
  return [...blogPosts].sort((a, b) => b.published.localeCompare(a.published));
}

/**
 * Metadata for a post, through the same builder every other page uses, so
 * canonical, Open Graph, robots and metadataBase cannot drift from the site.
 */
export function blogMetadata(slug: string, image?: string): Metadata {
  const post = getPost(slug);
  if (!post) return {};

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: postPath(post.slug),
    ...(image ? { image } : {}),
  });
}
