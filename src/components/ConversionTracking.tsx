"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function send(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, params);
}

export function ConversionTracking() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const call = target.closest<HTMLElement>('a[href^="tel:"]');
      if (call) {
        const label = call.getAttribute("data-analytics") ?? "generic-call";
        send("call_click", {
          call_source: label,
          call_href: call.getAttribute("href"),
        });
        return;
      }

      // Checked before mailto so the ordering reads with the funnel, and kept
      // separate from call_click: WhatsApp is a distinct channel and lumping it
      // in with tel: would hide whether it is the thing actually earning leads.
      const whatsapp = target.closest<HTMLElement>('a[href*="wa.me/"]');
      if (whatsapp) {
        send("whatsapp_click", {
          whatsapp_source: whatsapp.getAttribute("data-analytics") ?? "generic-whatsapp",
        });
        return;
      }

      const email = target.closest<HTMLElement>('a[href^="mailto:"]');
      if (email) {
        send("email_click", {
          email_source: email.getAttribute("data-analytics") ?? "generic-email",
        });
      }
    };

    const submitHandler = (event: SubmitEvent) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      const source = form.dataset.analytics ?? form.getAttribute("name") ?? "generic-form";
      send("form_submit", { form_source: source });
    };

    document.addEventListener("click", handler);
    document.addEventListener("submit", submitHandler);
    return () => {
      document.removeEventListener("click", handler);
      document.removeEventListener("submit", submitHandler);
    };
  }, []);

  return null;
}
