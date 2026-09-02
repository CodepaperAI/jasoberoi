"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { LandingLeadForm } from "@/components/LandingLeadForm";
import type { LandingContent } from "@/lib/landing";

/**
 * The lead form as a dialog, opened by any CTA on the page.
 *
 * Every call to action above the form used to be an anchor that scrolled the
 * visitor down to it. That works, but it spends the click: someone who taps
 * "Book a consultation" has already decided, and the reward for deciding is a
 * scroll past three sections to a form they have not seen yet. On a phone that
 * is most of a screen's worth of travel, and the sticky bar makes the same trip.
 * A dialog turns the click straight into the thing they clicked for.
 *
 * The inline form stays. Someone reading the whole page should meet the form
 * where the argument finishes, and a visitor who distrusts modals — or has JS
 * disabled — still has a real form to fill in. Both post through the same
 * submitLead() with the same campaign source, so the pipeline cannot tell them
 * apart and attribution is unaffected.
 *
 * Progressive enhancement rather than a click handler per button: the triggers
 * stay plain anchors pointing at #request, this listens for clicks on anything
 * marked data-open-lead-form, and without JS every one of them still scrolls to
 * the inline form exactly as before.
 */
export function LandingFormDialog({ content }: { content: LandingContent }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const trigger = target.closest("[data-open-lead-form]");
      if (!trigger) return;

      event.preventDefault();
      dialog.showModal();
    };

    // Clicking the backdrop closes it. A dialog's own rect is the panel, so a
    // click outside those bounds is a click on the backdrop.
    const onDialogClick = (event: MouseEvent) => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      const outside =
        event.clientX < box.left ||
        event.clientX > box.right ||
        event.clientY < box.top ||
        event.clientY > box.bottom;
      if (outside) dialog.close();
    };

    document.addEventListener("click", onClick);
    dialog.addEventListener("click", onDialogClick);
    return () => {
      document.removeEventListener("click", onClick);
      dialog.removeEventListener("click", onDialogClick);
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-label={content.formHeading}
      /*
        m-auto is load-bearing. A native dialog centres itself with margin:auto,
        and Tailwind's preflight sets margin:0 on everything — so without this it
        opens pinned to the top-left corner.
      */
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(34rem,calc(100vw-2rem))] overflow-y-auto rounded-[1.75rem] bg-white p-0 shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className="relative p-6 sm:p-9">
        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label="Close"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
        >
          <X size={18} aria-hidden="true" />
        </button>

        <h2 className="max-w-[18ch] text-[1.35rem] font-bold leading-tight text-stone-900">
          {content.formHeading}
        </h2>
        <p className="mt-2.5 text-sm leading-6 text-stone-500">{content.formNote}</p>

        <div className="mt-6">
          <LandingLeadForm content={content} />
        </div>
      </div>
    </dialog>
  );
}
