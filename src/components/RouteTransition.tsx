"use client";

import Image from "next/image";
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

/**
 * Long enough for the mark to actually land.
 *
 * Nothing is loading here — the destination is static and already prefetched —
 * so this is a brand beat, not progress, and it should be no longer than it
 * needs to be. But 140ms was too short for a different reason than speed: the
 * logo's own entrance animation runs 260ms, so the overlay began fading before
 * the mark had finished arriving. You saw something move and leave without ever
 * resolving, which reads as a glitch rather than as a transition.
 *
 * 450ms clears the 260ms entrance with room to settle before the fade starts.
 * The floor for any change here is the entrance duration in globals.css — go
 * below it and the mark is mid-flight again.
 */
const MIN_VISIBLE_MS = 450;
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
        // Near-white, not near-black. The site is a light site, and a full-bleed
        // dark panel between two light pages was the most violent thing on it.
        // #f8faff is the same wash the cost page already uses.
        "route-transition fixed inset-0 z-[200] flex items-center justify-center bg-paper",
        phase === "leaving" ? "pointer-events-none" : "",
      ].join(" ")}
    >
      {/*
        The real wordmark, not a redrawn approximation of its mark. The previous
        overlay showed an 80px ring with a 5px stroke — the right shapes at more
        than twice the artwork's weight, which is what made it read as a cartoon
        rather than as the company's logo.
        140px wide is a deliberate size: large enough to be legible including the
        "CONSTRUCTION" line, small enough to sit as a mark rather than a splash.
      */}
      <Image
        src="/oberizon/optimized/oberizon-logo.png"
        alt=""
        width={192}
        height={88}
        className="route-transition-mark w-[140px]"
        priority
      />
    </div>
  );
}
