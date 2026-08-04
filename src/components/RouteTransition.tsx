"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A brief branded overlay between page navigations.
 *
 * Every route here is statically exported and prefetched, so Next's own
 * mechanisms never get a chance to fire — `loading.js` and `useLinkStatus` are
 * both documented as skipped when the destination is static and already
 * prefetched. Navigation is effectively instant, which is the actual problem:
 * the page swaps and the scroll position snaps to the top in the same frame,
 * which reads as a jolt rather than as a page load.
 *
 * So the pause here is deliberate rather than a symptom of waiting on anything.
 * It covers the swap, holds just long enough to register as a transition, and
 * gets out of the way.
 *
 * Sequence: click an internal link -> overlay in -> route changes and scroll
 * resets underneath it -> overlay fades out on a fresh page already at the top.
 */

/** Long enough to read as intentional, short enough not to feel like waiting. */
const MIN_VISIBLE_MS = 420;
const FADE_MS = 220;
/** The overlay must never outlive a navigation that fails or never resolves. */
const SAFETY_MS = 2000;

type Phase = "idle" | "active" | "leaving";

export function RouteTransition() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");

  const shownAt = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  // The path we are navigating away from. Compared against pathname so the
  // overlay only clears once the route has actually changed.
  const leavingFrom = useRef<string | null>(null);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const dismiss = useCallback(() => {
    clearTimers();
    leavingFrom.current = null;
    setPhase("leaving");
    timers.current.push(setTimeout(() => setPhase("idle"), FADE_MS));
  }, [clearTimers]);

  // Show the overlay the moment an internal link is clicked, rather than after
  // the route resolves — by then the new page has already painted and covering
  // it would be worse than showing nothing.
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      // Same page, or a jump to an anchor within it — nothing is loading.
      const samePath = url.pathname.replace(/\/$/, "") === window.location.pathname.replace(/\/$/, "");
      if (samePath) return;

      clearTimers();
      shownAt.current = Date.now();
      leavingFrom.current = window.location.pathname;
      setPhase("active");
      timers.current.push(setTimeout(dismiss, SAFETY_MS));
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [clearTimers, dismiss]);

  // Once the route has actually changed, hold for whatever is left of the
  // minimum so a fast navigation still reads as a transition instead of a blink.
  useEffect(() => {
    if (phase !== "active" || leavingFrom.current === null) return;
    if (pathname === leavingFrom.current) return;

    const remaining = Math.max(0, MIN_VISIBLE_MS - (Date.now() - shownAt.current));
    clearTimers();
    timers.current.push(setTimeout(dismiss, remaining));
  }, [pathname, phase, clearTimers, dismiss]);

  useEffect(() => clearTimers, [clearTimers]);

  if (phase === "idle") return null;

  return (
    <div
      // Decorative: the incoming page is the real announcement, and a live
      // region here would talk over it on every navigation.
      aria-hidden="true"
      data-state={phase}
      // Swallows clicks while active, which also stops an impatient double-click
      // from queuing a second navigation. Released as soon as it starts fading,
      // so the incoming page is interactive before the overlay is fully gone.
      className={[
        "route-transition fixed inset-0 z-[200] flex items-center justify-center bg-[#0f1115]",
        phase === "leaving" ? "pointer-events-none" : "",
      ].join(" ")}
    >
      <div className="route-transition-mark">
        <svg viewBox="0 0 64 64" className="h-20 w-20" fill="none" aria-hidden="true">
          {/* The horizon line sweeps out from the centre, then the sun settles onto it. */}
          <line
            className="route-transition-horizon"
            x1="3.5"
            y1="29"
            x2="60.5"
            y2="29"
            stroke="var(--oberizon-orange)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle
            className="route-transition-sun"
            cx="32"
            cy="36.5"
            r="15"
            stroke="var(--oberizon-orange)"
            strokeWidth="5"
          />
        </svg>
      </div>
    </div>
  );
}
