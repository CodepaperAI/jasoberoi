"use client";

import { useEffect, useRef } from "react";

/**
 * The hero video, which grows from a contained card to full-bleed as you scroll.
 *
 * Progress is written to a CSS custom property and every visual change is done
 * in CSS from that one value, so the scroll handler never touches layout
 * properties directly. Reads are batched into a rAF frame and the listener is
 * passive, which keeps this off the scrolling critical path.
 *
 * Deliberately not `animation-timeline: view()`: scroll-driven CSS animations
 * still are not available everywhere, and this is the first thing a visitor
 * sees, so it falls back to nothing rather than to a broken hero.
 */
export function ScrollExpandVideo({ poster, src }: { poster: string; src: string }) {
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    // Respect the OS setting: land straight on the expanded state and never animate.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      frame.style.setProperty("--expand", "1");
      return;
    }

    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = frame.getBoundingClientRect();
      // 0 while the top edge sits at the bottom of the viewport, 1 once it has
      // travelled a full viewport height upward.
      const travelled = window.innerHeight - rect.top;
      const progress = Math.min(1, Math.max(0, travelled / window.innerHeight));
      frame.style.setProperty("--expand", progress.toFixed(4));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={frameRef} className="scroll-expand-frame relative mt-20">
      <div className="scroll-expand-media relative overflow-hidden bg-zinc-900 shadow-2xl shadow-slate-900/20">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={poster}
        >
          <source src={src} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/25" />
      </div>
    </div>
  );
}
