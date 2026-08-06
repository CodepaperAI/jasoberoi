import type { Metadata } from "next";
import { Barlow, Instrument_Serif } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { ConversionTracking } from "@/components/ConversionTracking";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ContactDock } from "@/components/ContactDock";
import { JsonLd } from "@/components/JsonLd";
import { RouteTransition } from "@/components/RouteTransition";
import { organizationJsonLd } from "@/lib/schema";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { homePage } from "@/lib/site";
import "./globals.css";

/**
 * The display face.
 *
 * Every heading on this site used to be Georgia — not a choice, a fallback. No
 * display webfont was loaded at all, so on Android and most Linux, where Georgia
 * does not exist, the site rendered in whatever generic serif was to hand. The
 * headline type was the one thing never art-directed.
 *
 * Instrument Serif is a display face: high contrast, tight fit, made to be set
 * large. It ships one weight, which is correct here — display type wants a size
 * ramp, not a weight ramp, and the previous `font-bold` on Georgia was rendering
 * as synthetic faux-bold anyway. The italic is loaded because the orange accent
 * inside headlines depends on it.
 *
 * Archivo Black used to be imported here and referenced nowhere — a font
 * downloaded on every page load for nothing. Removed.
 */
const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
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
      className={`${instrumentSerif.variable} ${barlow.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <JsonLd data={organizationJsonLd(absoluteUrl("/"))} />
        <Analytics />
        <ConversionTracking />
        <RouteTransition />
        {/* Reachable from every page, and it never opens itself. */}
        <ContactDock />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
