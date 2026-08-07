"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { navigation } from "@/lib/site";

/**
 * The under-lg navigation, split out of Header so Header stays a server
 * component. Only this panel needs client JS; rendering the whole header on the
 * client to close a menu would be the wrong trade.
 *
 * Two defects this exists to fix, both found on the deployed site:
 *
 * 1. It never closed. A bare <details> is not tied to the router, and the header
 *    lives in the layout so it does not remount between routes — tapping a link
 *    navigated underneath the open panel and left it covering the new page.
 *    Closing on pathname change is the whole reason for "use client" here.
 *
 * 2. The panel was a fixed w-80 (320px) anchored right-0 inside px-4 gutters, so
 *    on a 320px phone its left edge sat at -16px: the border was cut off and the
 *    labels ran flush to the screen edge. It now yields to the viewport.
 */
export function MobileNav() {
  const pathname = usePathname();
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);

  return (
    <details ref={ref} className="relative lg:hidden">
      <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-xl border border-zinc-200 text-zinc-900">
        <span className="sr-only">Open navigation</span>
        <Menu aria-hidden="true" size={21} />
      </summary>
      <div className="absolute right-0 top-14 max-h-[calc(100svh-7rem)] w-80 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border border-orange-100 bg-white p-3 shadow-2xl shadow-orange-950/10">
        {navigation.map((item) =>
          item.items ? (
            <div key={item.label} className="border-b border-zinc-100 py-2 last:border-b-0">
              <p className="ui-font px-2 pb-1 text-xs font-bold uppercase tracking-[0.18em] text-accent">
                {item.label}
              </p>
              {item.items.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="block rounded-xl px-2 py-2 text-base font-semibold text-zinc-800 hover:bg-orange-50 hover:text-accent"
                >
                  {child.label}
                </Link>
              ))}
            </div>
          ) : (
            <Link
              key={item.href}
              href={item.href ?? "/"}
              className="block rounded-xl px-2 py-2 text-base font-semibold text-zinc-800 hover:bg-orange-50 hover:text-accent"
            >
              {item.label}
            </Link>
          ),
        )}
      </div>
    </details>
  );
}
