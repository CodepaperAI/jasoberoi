import type { Metadata } from "next";
import { Archivo_Black, Barlow } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { ConversionTracking } from "@/components/ConversionTracking";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { RouteTransition } from "@/components/RouteTransition";
import { organizationJsonLd } from "@/lib/schema";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { homePage } from "@/lib/site";
import "./globals.css";

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = buildMetadata({
  title: homePage.title,
  description: homePage.description,
  path: homePage.canonicalPath,
  keywords: homePage.keywords,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-CA"
      // `scroll-smooth` is wanted for in-page anchor links, but without this
      // attribute Next runs its post-navigation scroll reset as-is, so the
      // browser smooth-scrolls all the way from wherever you were up to the top
      // — an animated glide rather than a jump. The attribute lets Next switch
      // to `auto` for that one reset and restore smooth afterwards.
      data-scroll-behavior="smooth"
      className={`${archivoBlack.variable} ${barlow.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <JsonLd data={organizationJsonLd(absoluteUrl("/"))} />
        <Analytics />
        <ConversionTracking />
        <RouteTransition />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
