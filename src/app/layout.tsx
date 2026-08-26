import type { Metadata } from "next";
import { Barlow, Gelasio } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import {
  GoogleTagManager,
  GoogleTagManagerNoScript,
} from "@/components/GoogleTagManager";
import { AttributionCapture } from "@/components/AttributionCapture";
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
 * This is Georgia, made safe to ship.
 *
 * oberizonconstruction.ca sets its hero in 72px Georgia and loads no display
 * webfont at all — which is where this site's Georgia came from, and it is the
 * look the client chose. The problem was never the typeface, it was that Georgia
 * is a system font: on Android and most Linux it does not exist, so those
 * visitors got whatever generic serif the device happened to have. The site
 * rendered differently depending on who opened it.
 *
 * Gelasio is a webfont drawn as a metric-compatible Georgia substitute.
 * Measured against Georgia on this site's own headline it comes out at exactly
 * 1.000x the width, and side by side the two are indistinguishable. Same look,
 * loaded properly, identical on every device.
 *
 * A short detour through Instrument Serif is worth recording so nobody repeats
 * it: it is a *condensed* display face, and Georgia is wide and open. Opposite
 * ends of the serif spectrum, which is why it read as wrong rather than as a
 * choice. If this ever needs replacing, match Georgia's proportions.
 *
 * 400 only. A 600 was loaded briefly for bolder heroes, but Georgia now leads
 * the stack and Georgia has no 600 cut — it resolves to Bold, which sets 16%
 * wider than Regular and is what read as stretched. Headings are 400 to match
 * the reference, so the extra Gelasio weight was a download nobody rendered.
 *
 * The italic is loaded because `.orange-italic` is the accent inside every
 * headline.
 *
 * Archivo Black used to be imported here and referenced nowhere — a font
 * downloaded on every page load for nothing. Removed.
 */
const gelasio = Gelasio({
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
      className={`${gelasio.variable} ${barlow.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        {/* First in the body, where GTM expects its fallback. */}
        <GoogleTagManagerNoScript />
        <JsonLd data={organizationJsonLd(absoluteUrl("/"))} />
        <GoogleTagManager />
        {/*
          Analytics stays, and stays second. It renders nothing unless
          NEXT_PUBLIC_GA_ID is set, which it is not — GA4 arrives through the
          container above. If a standalone GA4 property is ever wanted here,
          check first that the container is not already firing one.
        */}
        <Analytics />
        <ConversionTracking />
        {/* Must run on the landing page, not at submit time — see the component. */}
        <AttributionCapture />
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
