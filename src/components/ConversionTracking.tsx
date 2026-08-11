"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Pushes to the dataLayer, not to gtag.
 *
 * This used to call `window.gtag?.("event", …)`, and the optional chaining is
 * what made the bug invisible: under Google Tag Manager `window.gtag` is not
 * defined, so every call here evaluated to undefined and did nothing. Verified
 * on the deployed site — clicking a tel: link pushed GTM's own `gtm.linkClick`
 * and no `call_click` at all.
 *
 * The dataLayer is the container's actual input, and it exists as soon as the
 * GTM snippet runs. Pushing here means these events are available as Custom
 * Event triggers in GTM, which is what the Google Ads conversion has to be
 * rebuilt on now that the old /thank-you page it fired on no longer exists.
 *
 * gtag is still called when something else has defined it, so a standalone GA4
 * install would not be broken by this. Under GTM alone that branch is inert, so
 * nothing double-counts.
 */
function send(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
  if (typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }
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
