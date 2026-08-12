import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  devIndicators: false,
  images: {
    unoptimized: true,
  },
  // Blog posts are .mdx pages under app/blog. Everything else stays .tsx.
  pageExtensions: ["ts", "tsx", "mdx"],
};

// Without remark-gfm, a pipe table renders as literal pipes. Every cost and
// timeline table in these posts is a GFM table, and those tables are the reason
// the posts can be quoted by an AI answer at all.
//
// Named as a string, not imported: the loader options cross into Turbopack's
// Rust side, which cannot take a JavaScript function. Importing remark-gfm and
// passing the function fails the build with "does not have serializable
// options".
const withMDX = createMDX({
  options: { remarkPlugins: ["remark-gfm"] },
});

export default withMDX(nextConfig);
