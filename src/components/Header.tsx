import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Phone } from "lucide-react";
import { HeaderBookButton } from "@/components/HeaderBookButton";
import { MobileNav } from "@/components/MobileNav";
import { navigation, siteConfig } from "@/lib/site";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-orange-100 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:h-24 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Oberizon Construction home">
          {/*
            Vector, and sized to fit inside the bar rather than fill it.

            At 180px wide this lockup rendered 83px tall in an 81px header — it
            overflowed, touching the top edge and the bottom border with no
            breathing room at all. It is a stacked lockup (mark over wordmark
            over "CONSTRUCTION"), so it needs vertical space to read as one
            thing; 140px gives it ~16px of air top and bottom in the 96px bar.
          */}
          <Image
            src="/oberizon/oberizon-logo.svg"
            alt="Oberizon Construction"
            // The artwork's own coordinate system, so the reserved box matches
            // the 192x88 (2.18:1) aspect and the header does not shift on load.
            width={192}
            height={88}
            className="h-auto w-[104px] sm:w-[140px]"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
          {navigation.map((item) =>
            item.items || item.groups ? (
              <div key={item.label} className="group relative py-6">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-sm font-semibold tracking-wide text-zinc-800 transition hover:text-accent"
                >
                  {item.label}
                  <ChevronDown size={15} aria-hidden="true" />
                </button>
                {/*
                  Two columns when the menu is grouped. Ten services stacked in
                  one 72-wide column ran past 600px tall, which is a scrolling
                  menu on a laptop; the groups sit side by side instead, and the
                  headings are what tell a visitor this contractor does
                  healthcare, commercial and residential work.
                */}
                <div
                  className={[
                    "invisible absolute left-0 top-full translate-y-2 rounded-2xl border border-orange-100 bg-white p-3 opacity-0 shadow-2xl shadow-orange-950/10 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100",
                    item.groups ? "w-[34rem]" : "w-72 p-2",
                  ].join(" ")}
                >
                  {/*
                    CSS columns rather than a grid, so the browser balances the
                    groups. On a two-column grid the row-major flow put
                    Healthcare's six links in column one, Commercial's three in
                    column two, and then wrapped Residential back under
                    Healthcare — leaving half the panel empty. Columns let
                    Commercial and Residential stack naturally beside
                    Healthcare, and it stays balanced if a group grows.
                  */}
                  {item.groups ? (
                    <div className="columns-2 gap-4">
                      {item.groups.map((group) => (
                        <div key={group.group} className="break-inside-avoid">
                          <p className="ui-font px-3 pb-1 pt-2 text-[0.6875rem] font-extrabold uppercase tracking-[0.16em] text-accent">
                            {group.group}
                          </p>
                          {group.items.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block rounded-xl px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-orange-50 hover:text-accent"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {item.items?.length ? (
                    <div className={item.groups ? "mt-2 border-t border-orange-100 pt-2" : ""}>
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
                  ) : null}
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
            <HeaderBookButton className="min-h-10 px-6 py-2.5 text-sm shadow-orange-600/25" />
          </div>

          <MobileNav />
        </div>
      </div>
    </header>
  );
}
