import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { MobileNav } from "@/components/MobileNav";
import { navigation, siteConfig } from "@/lib/site";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-orange-100 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Oberizon Construction home">
          <Image
            src="/oberizon/optimized/oberizon-logo.png"
            alt="Oberizon Construction"
            // The file's true intrinsic size. It was declared 220x74 (2.97:1)
            // for a 192x88 (2.18:1) image, so the reserved box was the wrong
            // shape and the header shifted as the logo loaded.
            width={192}
            height={88}
            className="h-auto w-32 sm:w-[180px]"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
          {navigation.map((item) =>
            item.items ? (
              <div key={item.label} className="group relative py-6">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-sm font-semibold tracking-wide text-zinc-800 transition hover:text-accent"
                >
                  {item.label}
                  <ChevronDown size={15} aria-hidden="true" />
                </button>
                <div className="invisible absolute left-0 top-full w-72 translate-y-2 rounded-2xl border border-orange-100 bg-white p-2 opacity-0 shadow-2xl shadow-orange-950/10 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {item.items.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-xl px-3 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-orange-50 hover:text-accent"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href ?? "/"}
                className="text-sm font-semibold tracking-wide text-zinc-800 transition hover:text-accent"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2 lg:gap-3">
          <a
            href={siteConfig.phoneHref}
            aria-label={`Call Oberizon Construction at ${siteConfig.phone}`}
            data-analytics="header-call"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-orange-600 px-3 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-orange-500 lg:hidden"
          >
            <Phone size={16} aria-hidden="true" strokeWidth={2.4} />
            <span className="hidden sm:inline">{siteConfig.phone}</span>
            <span className="sr-only sm:hidden">Call {siteConfig.phone}</span>
          </a>
          <a
            href={siteConfig.phoneHref}
            aria-label={`Call Oberizon Construction at ${siteConfig.phone}`}
            data-analytics="header-call"
            className="hidden items-center gap-2 rounded-full border border-orange-200 px-3 py-2 text-sm font-bold text-orange-700 transition hover:bg-orange-50 lg:inline-flex"
          >
            <Phone size={15} aria-hidden="true" strokeWidth={2.4} />
            {siteConfig.phone}
          </a>
          <div className="hidden lg:block">
            <ButtonLink href="/contact" className="min-h-10 px-6 py-2.5 text-sm shadow-orange-600/25">
              Book a Consultation
            </ButtonLink>
          </div>

          <MobileNav />
        </div>
      </div>
    </header>
  );
}
