"use client";

import { Phone, Send } from "lucide-react";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { composeConsultationMailto } from "@/lib/contact";
import { siteConfig } from "@/lib/site";

/**
 * The homepage consultation form.
 *
 * Extracted from HomeExperience so it can carry a submit handler — the parent is
 * a server component. Its submit was previously `type="button"` with no handler,
 * so the form silently discarded every enquiry.
 */
export function HomeConsultationForm() {
  return (
<form className="mt-12 grid gap-5 text-left sm:grid-cols-2" onSubmit={(event) => {
        event.preventDefault();
        window.location.href = composeConsultationMailto(event.currentTarget);
      }}>
  <label className="grid gap-2 text-xs font-bold text-white">
    Full Name
    <input name="name" required className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-orange-500" placeholder="Enter your full name" />
  </label>
  <label className="grid gap-2 text-xs font-bold text-white">
    Email *
    <input name="email" type="email" required className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-orange-500" placeholder="your@email.com" />
  </label>
  <label className="grid gap-2 text-xs font-bold text-white">
    Phone *
    <input name="phone" type="tel" className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-orange-500" placeholder="+1 (555) 000-0000" />
  </label>
  <label className="grid gap-2 text-xs font-bold text-white">
    Project Location
    <input name="location" className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-orange-500" placeholder="White Rock" />
  </label>
  <label className="grid gap-2 text-xs font-bold text-white sm:col-span-2">
    Type of Project
    <select name="projectType" className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-sm text-white outline-none focus:border-orange-500">
      <option>Select an option</option>
      <option>Dental Clinic Construction</option>
      <option>Medical Clinic Construction</option>
      <option>Commercial Interior</option>
      <option>Luxury Residential</option>
    </select>
  </label>
  <label className="grid gap-2 text-xs font-bold text-white sm:col-span-2">
    Tell us more about your project
    <textarea name="details" className="min-h-32 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-orange-500" placeholder="City, target open date, budget range, and scope. Anything else we should know - say it here." />
  </label>
  {/* Calling and WhatsApp sit beside the submit, not instead of it: filling six
      fields is a bigger ask than dialling or sending a message, and most
      contractor leads arrive as calls. WhatsApp also covers the visitor this
      form cannot reach at all — the submit composes a mailto, which does nothing
      on a phone with no mail client configured. */}
  <div className="flex flex-wrap justify-center gap-4 sm:col-span-2">
    <button
      type="submit"
      className="ui-font inline-flex items-center justify-center gap-3 rounded-2xl bg-orange-600 px-12 py-5 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-xl shadow-orange-600/20 transition hover:bg-orange-500"
    >
      <Send size={15} aria-hidden="true" />
      Book a Consultation
    </button>
    {/* Filled in WhatsApp's green, not outlined. Against a near-black section
        an outlined button is the quietest thing on screen, and this option
        exists for the visitor least likely to hunt for it. */}
    <WhatsAppLink
      analytics="home-form-whatsapp"
      iconSize={15}
      className="ui-font inline-flex items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-xl shadow-emerald-900/20 transition hover:bg-[#1eb457]"
    />
    <a
      href={siteConfig.phoneHref}
      data-analytics="home-form-call"
      className="ui-font inline-flex items-center justify-center gap-3 rounded-2xl border border-white/25 px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:border-orange-400 hover:text-orange-400"
    >
      <Phone size={15} aria-hidden="true" />
      {siteConfig.phone}
    </a>
  </div>
</form>
  );
}
