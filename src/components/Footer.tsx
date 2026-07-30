import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { quickLinks, siteConfig, socialLinks } from "@/lib/site";

const socialMarks: Record<string, string> = {
  Instagram: "IG",
  TikTok: "TT",
  YouTube: "YT",
  LinkedIn: "in",
  Facebook: "f",
};

export function Footer() {
  return (
    <footer className="grain-surface border-t border-white/10">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_1fr_1fr] lg:px-8">
        <div>
          <Image
            src="/assets/images/footer-logo2.png"
            alt="Oberoi Group"
            width={250}
            height={113}
            className="h-auto w-40 invert"
          />
          <p className="mt-6 max-w-sm text-lg font-medium leading-6 text-white/[0.78]">
            Fueled by precision, driven by passion and powered by a network of top professionals.
            The Oberoi Group keeps you ahead in the real estate race.
          </p>
        </div>

        <div>
          <h2 className="display-font text-xl font-bold uppercase">Quick Links</h2>
          <ul className="mt-5 space-y-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-base font-semibold uppercase text-white/75 transition hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="display-font text-xl font-bold uppercase">Contact Us</h2>
          <ul className="mt-5 space-y-3 text-base font-semibold text-white/[0.82]">
            <li>
              <a className="flex items-center gap-3 transition hover:text-white" href={`tel:${siteConfig.phone}`}>
                <Phone size={20} aria-hidden="true" />
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3 uppercase transition hover:text-white" href={`mailto:${siteConfig.email}`}>
                <Mail size={20} aria-hidden="true" />
                {siteConfig.email}
              </a>
            </li>
            <li>
              <a className="flex items-start gap-3 uppercase transition hover:text-white" href={siteConfig.mapsUrl}>
                <MapPin size={20} aria-hidden="true" className="mt-1 shrink-0" />
                <span>{siteConfig.address}</span>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="display-font text-xl font-bold uppercase">Follow Us On:</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {socialLinks.map((link) => {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded border border-white/[0.18] bg-white/5 text-white transition hover:-translate-y-0.5 hover:border-red-500 hover:bg-red-600"
                  aria-label={link.label}
                >
                  <span aria-hidden="true" className="display-font text-lg font-bold">
                    {socialMarks[link.label] ?? link.label.slice(0, 2)}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center text-sm font-bold text-white/[0.68] sm:flex-row sm:text-left">
          <p>Copyright © 2013-2026 Oberoi Group*. All Rights Reserved Managed by HexBytes</p>
          <Image
            src="/assets/images/remax-footer.png"
            alt="RE/MAX Performance Realty"
            width={150}
            height={40}
            className="h-9 w-auto"
          />
        </div>
      </div>
    </footer>
  );
}
