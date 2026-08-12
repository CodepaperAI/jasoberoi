import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/SectionPrimitives";
import { blogPosts, postPath, postsByDate } from "@/lib/blog";
import { breadcrumbJsonLd } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { constructionServices } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = buildMetadata({
  title: "Construction Guides for BC Clinic & Commercial Owners | Oberizon",
  description:
    "Cost breakdowns, build timelines and permit guides for dental, medical and commercial construction in BC — written from delivered projects.",
  path: "/blog",
  keywords: [
    "dental clinic construction cost BC",
    "medical clinic construction permits BC",
    "tenant improvement allowance",
    "commercial renovation vs new construction",
  ],
});

export default function BlogIndex() {
  const posts = postsByDate();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
        ])}
      />
      <PageHero
        eyebrow="Guides"
        heading="What it costs, how long it takes, and what the city will ask for."
        subheading={`${blogPosts.length} guides on building clinics and commercial space in British Columbia — written from the jobs we have delivered, with the numbers left in.`}
        image="/oberizon/optimized/project-healthcare-3.jpg"
      />

      <section className="mx-auto w-full max-w-5xl px-5 pb-24 sm:px-6">
        <ul className="flex flex-col gap-4">
          {posts.map((post) => {
            const service = constructionServices.find(
              (item) => item.slug === post.service,
            );

            return (
              <li key={post.slug}>
                <Link
                  href={postPath(post.slug)}
                  className="group block rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-zinc-300 hover:shadow-sm sm:p-8"
                >
                  <p className="eyebrow">
                    {service?.name ?? "Construction"}
                    <span aria-hidden="true"> · </span>
                    {post.minutes} min read
                  </p>
                  <h2 className="mt-3 text-2xl leading-tight text-zinc-950 group-hover:underline">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-lg leading-8 text-muted">
                    {post.description}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
