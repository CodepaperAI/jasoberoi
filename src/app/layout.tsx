import type { Metadata } from "next";
import { Oswald, Rajdhani } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { organizationJsonLd } from "@/lib/schema";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = buildMetadata({
  title: "The Oberoi Group | White Rock & Lower Mainland Real Estate Advisors",
  description:
    "The Oberoi Group is a RE/MAX real estate team advising clients across White Rock, South Surrey, Surrey, Vancouver, and the Lower Mainland.",
  path: "/",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${oswald.variable} ${rajdhani.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <JsonLd data={organizationJsonLd(absoluteUrl("/"))} />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
