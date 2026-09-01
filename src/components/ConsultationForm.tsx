"use client";

import { useState } from "react";
import { Phone, Send } from "lucide-react";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { HONEYPOT_FIELD, THANK_YOU_PATH, submitLead } from "@/lib/contact";
import { constructionServices, siteConfig } from "@/lib/site";

/**
 * The one consultation form.
 *
 * There were two, and they had already drifted: the dock offered six project
 * types and the homepage offered four, with different wording for the ones they
 * shared, so the same enquiry arrived described differently depending on which
 * form the visitor happened to find. Both are now this component, and the
 * options come from constructionServices — the ten services the site actually
 * sells — rather than from a hand-kept list that can fall behind them.
 *
 * `tone` exists because this renders on white in the dock and on the near-black
 * band on the homepage. It changes colours and nothing else; the fields, the
 * order and the submit path are identical, which is the point.
 */

const PROJECT_TYPES = constructionServices.map((service) => service.name);

type Tone = "light" | "dark";

const styles: Record<Tone, { field: string; label: string; call: string }> = {
  light: {
    field:
      "rounded-xl border border-slate-200 bg-raised px-4 py-3 text-sm font-medium normal-case text-zinc-900 outline-none placeholder:text-slate-400 focus:border-orange-400 focus:bg-white",
    label: "grid gap-2 text-[11px] font-extrabold uppercase tracking-wide text-slate-500",
    call: "border border-slate-200 text-zinc-900 hover:border-orange-300 hover:text-accent",
  },
  dark: {
    field:
      "rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-orange-500",
    label: "grid gap-2 text-xs font-bold text-white",
    call: "border border-white/25 text-white hover:border-orange-400 hover:text-orange-400",
  },
};

export function ConsultationForm({
  formSource,
  tone = "light",
  defaultProjectType = "",
  submitLabel = "Send request",
}: {
  /** Where this form sits, carried through to GHL so surfaces can be compared. */
  formSource: string;
  tone?: Tone;
  /** Preselected on a service page, because the visitor already told us by being there. */
  defaultProjectType?: string;
  submitLabel?: string;
}) {
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const [mailto, setMailto] = useState("");
  const style = styles[tone];

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;

    const form = event.currentTarget;
    setState("sending");

    const result = await submitLead(form, formSource);

    if (result.captured) {
      window.location.assign(THANK_YOU_PATH);
      return;
    }

    /*
      Nothing accepted the lead, so the visitor stays here.

      This used to open a mail draft and then navigate to /thank-you 600ms
      later, and the two raced: whichever won decided whether you saw the email
      or the thank-you page first, which differed between machines and between
      pages on the same machine. It also meant the Google Ads conversion fired
      on a submission that had captured nothing — a "conversion" with no lead
      behind it.

      Now neither happens automatically. The error explains itself and offers
      the email as something to click, so the timing belongs to the visitor.
    */
    setMailto(result.mailto ?? "");
    setState("error");
  }

  const sending = state === "sending";

  return (
    <form
      data-analytics={formSource}
      onSubmit={onSubmit}
      className={
        tone === "dark"
          ? "relative mt-12 grid gap-5 text-left sm:grid-cols-2"
          : "relative mt-7 grid gap-4 sm:grid-cols-2"
      }
    >
      {/* Honeypot: invisible to people, tempting to form bots.

          The name is deliberately meaningless. It was `companyWebsite`, sitting
          under a "Company website" label, and Chrome's autofill matched exactly
          that — so once a visitor had submitted the form once and the browser
          had learned it, every later submission arrived with the bot trap
          filled in. submitLead() then reported success and posted nothing, and
          the visitor was sent to /thank-you having lost their enquiry. Verified
          against the server log: the form was reaching /thank-you with no
          request to /api/lead at all.

          Autofill matches on the field name, id, label and placeholder, so all
          four are now either absent or meaningless. readOnly is the belt to
          that braces: Chrome will not autofill a readonly field, while a bot
          setting .value directly is unaffected — which is the only thing this
          field is here to catch.

          Hidden with position rather than type="hidden", because a hidden
          input is exactly what a bot skips. aria-hidden and tabIndex keep it
          away from screen readers and the keyboard. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <input name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" readOnly />
      </div>

      <label className={style.label}>
        Full name
        <input name="name" required className={style.field} placeholder="Jane Doe" />
      </label>
      <label className={style.label}>
        Email address
        <input
          name="email"
          type="email"
          required
          className={style.field}
          placeholder="jane@clinic.ca"
        />
      </label>
      <label className={style.label}>
        Phone number
        <input name="phone" type="tel" className={style.field} placeholder="(604) 000-0000" />
      </label>
      <label className={style.label}>
        Project location
        <input name="location" className={style.field} placeholder="Abbotsford, BC" />
      </label>
      <label className={`${style.label} sm:col-span-2`}>
        Project type
        <select name="projectType" className={style.field} defaultValue={defaultProjectType}>
          <option value="" disabled>
            Select an option
          </option>
          {PROJECT_TYPES.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </label>
      <label className={`${style.label} sm:col-span-2`}>
        Anything else
        <textarea
          name="details"
          className={`${style.field} min-h-24`}
          placeholder="Square footage, target opening date, lease stage."
        />
      </label>

      {/* Three ways out, because the form is the biggest ask of the three.
          Calling and WhatsApp work on every device without depending on
          anything being configured. */}
      <div className="grid gap-3 sm:col-span-2 sm:grid-cols-[1fr_auto_auto]">
        <button
          type="submit"
          disabled={sending}
          className="ui-font inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-4 text-xs font-extrabold uppercase tracking-[0.18em] text-white shadow-xl shadow-orange-600/25 transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Send size={15} aria-hidden="true" />
          {sending ? "Sending…" : submitLabel}
        </button>
        <WhatsAppLink
          analytics={`${formSource}-whatsapp`}
          iconSize={15}
          className="ui-font inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-4 text-xs font-extrabold uppercase tracking-[0.18em] text-white shadow-lg shadow-emerald-900/15 transition hover:bg-[#1eb457]"
        />
        <a
          href={siteConfig.phoneHref}
          data-analytics={`${formSource}-call`}
          className={`ui-font inline-flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-xs font-extrabold uppercase tracking-[0.18em] transition ${style.call}`}
        >
          <Phone size={15} aria-hidden="true" />
          Call
        </a>
      </div>

      {state === "error" && (
        <div
          role="status"
          className={`sm:col-span-2 rounded-xl px-4 py-3 text-sm leading-6 ${
            tone === "dark" ? "bg-white/10 text-white/80" : "bg-orange-50 text-ink-soft"
          }`}
        >
          That did not go through. Nothing was lost — send it as an email instead, or call{" "}
          <a href={siteConfig.phoneHref} className="font-semibold underline underline-offset-2">
            {siteConfig.phone}
          </a>
          .
          {mailto && (
            <a
              href={mailto}
              className="ui-font mt-3 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-xs font-extrabold uppercase tracking-[0.14em] text-white transition hover:bg-orange-500"
            >
              <Send size={14} aria-hidden="true" />
              Send as email
            </a>
          )}
        </div>
      )}
    </form>
  );
}
