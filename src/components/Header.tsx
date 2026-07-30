import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { navigation } from "@/lib/site";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-orange-100 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Oberizon Construction home">
          <Image
            src="/oberizon/optimized/oberizon-logo.png"
            alt="Oberizon Construction"
            width={220}
            height={74}
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
                  className="inline-flex items-center gap-1 text-sm font-semibold tracking-wide text-zinc-800 transition hover:text-orange-600"
                >
                  {item.label}
                  <ChevronDown size={15} aria-hidden="true" />
                </button>
                <div className="invisible absolute left-0 top-full w-72 translate-y-2 rounded-2xl border border-orange-100 bg-white p-2 opacity-0 shadow-2xl shadow-orange-950/10 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {item.items.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-xl px-3 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-orange-50 hover:text-orange-600"
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
                className="text-sm font-semibold tracking-wide text-zinc-800 transition hover:text-orange-600"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden lg:block">
          <ButtonLink href="/contact" className="min-h-10 px-6 py-2.5 text-sm shadow-orange-600/25">
            Schedule Consultation
          </ButtonLink>
        </div>

        <details className="relative lg:hidden">
          <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-xl border border-zinc-200 text-zinc-900">
            <span className="sr-only">Open navigation</span>
            <Menu aria-hidden="true" size={21} />
          </summary>
          <div className="absolute right-0 top-14 w-80 rounded-2xl border border-orange-100 bg-white p-3 shadow-2xl shadow-orange-950/10">
            {navigation.map((item) =>
              item.items ? (
                <div key={item.label} className="border-b border-zinc-100 py-2 last:border-b-0">
                  <p className="px-2 pb-1 text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
                    {item.label}
                  </p>
                  {item.items.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-xl px-2 py-2 text-base font-semibold text-zinc-800 hover:bg-orange-50 hover:text-orange-600"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href ?? "/"}
                  className="block rounded-xl px-2 py-2 text-base font-semibold text-zinc-800 hover:bg-orange-50 hover:text-orange-600"
                >
                  {item.label}
                </Link>
              ),
            )}
          </div>
        </details>
      </div>
    </header>
  );
}
