"use client";

import { useCallback, useEffect, useState } from "react";
import { Phone, Send, X } from "lucide-react";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { composeConsultationMailto } from "@/lib/contact";
import { siteConfig } from "@/lib/site";

/**
 * The site's contact affordance: a WhatsApp link and a form button, always
 * reachable, on every page.
 *
 * This replaces a modal that opened itself 650ms after load. That fired before
 * anyone had seen the hero, landed on top of the trust sequence the rest of the
 * page spends its length building, and had to be dismissed before the site could
 * be read at all. An interruption is not a call to action.
 *
 * Now nothing opens unless a visitor asks for it.
 */

const FIELD =
  "rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium normal-case text-zinc-900 outline-none placeholder:text-slate-400 focus:border-orange-400 focus:bg-white";
const LABEL =
  "grid gap-2 text-[11px] font-extrabold uppercase tracking-wide text-slate-500";

export function ContactDock() {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  // Escape closes, and the page behind does not scroll while the dialog is up.
  // The old modal had neither.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <>
      {/*
        Kept even though the header carries the same call to action, because the
        header's button is `hidden lg:block` — on a phone there is no book button
        anywhere until you reach the footer.
      */}
      <div className="fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
        {/*
          WhatsApp gets its own persistent button rather than living only inside
          the dialog. Buried one click deep behind "Book a Consultation" it was
          effectively invisible — you had to open a form to discover the option
          that exists precisely for people who do not want to fill in a form.

          In WhatsApp's own green, not the site's orange. A messaging channel is
          recognised by its colour before its label, and an outlined button on a
          page full of orange reads as secondary chrome. This is also the only
          non-brand colour on the site, which is the point: it is someone else's
          product and it should look like it.
        */}
        <WhatsAppLink
          analytics="dock-fab-whatsapp"
          label=""
          iconSize={22}
          className="flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-900/25 transition duration-300 hover:-translate-y-0.5 hover:bg-[#1eb457] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
        />
        {/*
          Icon-only below sm. At full width this pill is ~190x48 and permanently
          parked over the bottom-right of every page — on a 320px phone that is
          60% of the width, and it was sitting on the last ProofBar label, the
          bottom FAQ row and the footer copyright. A circular icon keeps the
          call to action reachable without covering the words.
        */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Book a Consultation"
          className="flex h-13 w-13 items-center justify-center gap-2.5 rounded-full bg-orange-600 font-bold text-white shadow-lg shadow-orange-900/25 transition duration-300 hover:-translate-y-0.5 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 sm:h-auto sm:w-auto sm:py-3 sm:pl-4 sm:pr-5"
        >
          <Send size={17} aria-hidden="true" />
          <span className="hidden text-sm sm:inline">Book a Consultation</span>
        </button>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-[95] flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-8 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="Book a consultation"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div className="relative w-full max-w-2xl rounded-[2rem] bg-white p-6 shadow-2xl shadow-black/30 sm:p-8">
            <button
              type="button"
              onClick={close}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-orange-50 hover:text-orange-600"
              aria-label="Close"
            >
              <X size={17} aria-hidden="true" />
            </button>

            <h2 className="serif-font pr-10 text-3xl text-zinc-950">
              Book a <span className="orange-italic">consultation.</span>
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Tell us the space and the timeline. We will come back with what has to be planned
              before construction starts.
            </p>

            <form
              className="mt-7 grid gap-4 sm:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault();
                window.location.href = composeConsultationMailto(event.currentTarget);
                close();
              }}
            >
              <label className={LABEL}>
                Full name
                <input name="name" required className={FIELD} placeholder="Jane Doe" />
              </label>
              <label className={LABEL}>
                Email address
                <input
                  name="email"
                  type="email"
                  required
                  className={FIELD}
                  placeholder="jane@clinic.ca"
                />
              </label>
              <label className={LABEL}>
                Phone number
                <input name="phone" type="tel" className={FIELD} placeholder="(604) 000-0000" />
              </label>
              <label className={LABEL}>
                Project location
                <input name="location" className={FIELD} placeholder="Abbotsford, BC" />
              </label>
              <label className={`${LABEL} sm:col-span-2`}>
                Project type
                <select name="projectType" className={FIELD} defaultValue="">
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option>Dental clinic construction</option>
                  <option>Dental office renovation</option>
                  <option>Medical clinic construction</option>
                  <option>Pharmacy construction</option>
                  <option>Commercial construction or renovation</option>
                  <option>Luxury residential</option>
                </select>
              </label>
              <label className={`${LABEL} sm:col-span-2`}>
                Anything else
                <textarea
                  name="details"
                  className={`${FIELD} min-h-24`}
                  placeholder="Square footage, target opening date, lease stage."
                />
              </label>

              {/* Three ways out of this dialog, because the primary one is the
                  least reliable: "Send request" composes a mailto, which does
                  nothing on a phone with no mail client. WhatsApp and the phone
                  number always work. */}
              <div className="grid gap-3 sm:col-span-2 sm:grid-cols-[1fr_auto_auto]">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-4 text-xs font-extrabold uppercase tracking-[0.18em] text-white shadow-xl shadow-orange-600/25 transition hover:bg-orange-500"
                >
                  <Send size={15} aria-hidden="true" />
                  Send request
                </button>
                <WhatsAppLink
                  analytics="dock-whatsapp"
                  iconSize={15}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-4 text-xs font-extrabold uppercase tracking-[0.18em] text-white shadow-lg shadow-emerald-900/15 transition hover:bg-[#1eb457]"
                />
                <a
                  href={siteConfig.phoneHref}
                  data-analytics="dock-call"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-4 text-xs font-extrabold uppercase tracking-[0.18em] text-zinc-900 transition hover:border-orange-300 hover:text-orange-600"
                >
                  <Phone size={15} aria-hidden="true" />
                  Call
                </a>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
