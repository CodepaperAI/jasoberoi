"use client";

import { ConsultationForm } from "@/components/ConsultationForm";

/**
 * The homepage consultation form.
 *
 * A wrapper now rather than a form. It used to be a second hand-written copy of
 * the dock's form that had already drifted from it — four project types against
 * the dock's six, different labels on the fields they shared — so the same
 * enquiry reached us described differently depending on which one the visitor
 * found. There is one form on this site now, and this is where it renders on the
 * homepage's dark band.
 */
export function HomeConsultationForm() {
  return (
    <ConsultationForm
      formSource="home-hero"
      tone="dark"
      submitLabel="Book a Consultation"
    />
  );
}
