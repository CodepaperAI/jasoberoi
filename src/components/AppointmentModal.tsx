"use client";

import { useEffect, useState } from "react";
import { Send, X } from "lucide-react";

export function AppointmentModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(true), 650);
    return () => window.clearTimeout(timer);
  }, []);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center bg-black/70 px-4 pb-8 pt-28 backdrop-blur-sm sm:items-center sm:pt-8">
      <div className="relative w-full max-w-2xl rounded-[2rem] bg-white p-6 shadow-2xl shadow-black/30 sm:p-8">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition hover:bg-orange-50 hover:text-orange-600"
          aria-label="Close appointment form"
        >
          <X size={17} aria-hidden="true" />
        </button>

        <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-orange-600">
          Quick Inquiry
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-950">
          Book an <span className="text-orange-600">Appointment</span>
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Fill out the form below and we will get back to you shortly.
        </p>

        <form className="mt-7 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
            Full Name
            <input className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium normal-case text-zinc-900 outline-none placeholder:text-slate-400 focus:border-orange-400 focus:bg-white" placeholder="John Doe" />
          </label>
          <label className="grid gap-2 text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
            Email Address
            <input className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium normal-case text-zinc-900 outline-none placeholder:text-slate-400 focus:border-orange-400 focus:bg-white" placeholder="john@example.com" />
          </label>
          <label className="grid gap-2 text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
            Phone Number
            <input className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium normal-case text-zinc-900 outline-none placeholder:text-slate-400 focus:border-orange-400 focus:bg-white" placeholder="+1 (555) 000-0000" />
          </label>
          <label className="grid gap-2 text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
            Project Location
            <input className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium normal-case text-zinc-900 outline-none placeholder:text-slate-400 focus:border-orange-400 focus:bg-white" placeholder="Vancouver, BC" />
          </label>
          <label className="grid gap-2 text-[11px] font-extrabold uppercase tracking-wide text-slate-500 sm:col-span-2">
            Project Type
            <select className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium normal-case text-zinc-900 outline-none focus:border-orange-400 focus:bg-white">
              <option>Select an option</option>
              <option>Dental Clinic Construction</option>
              <option>Medical Clinic Construction</option>
              <option>Commercial Interior</option>
              <option>Luxury Residential</option>
            </select>
          </label>
          <label className="grid gap-2 text-[11px] font-extrabold uppercase tracking-wide text-slate-500 sm:col-span-2">
            Additional Details
            <textarea className="min-h-24 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium normal-case text-zinc-900 outline-none placeholder:text-slate-400 focus:border-orange-400 focus:bg-white" placeholder="Tell us more about your project..." />
          </label>
          <div className="sm:col-span-2">
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-4 text-xs font-extrabold uppercase tracking-[0.18em] text-white shadow-xl shadow-orange-600/25 transition hover:bg-orange-500"
            >
              <Send size={15} aria-hidden="true" />
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
