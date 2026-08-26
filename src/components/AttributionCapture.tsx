"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/**
 * Records the click identifiers on the first page of a session.
 *
 * Mounted in the layout rather than on the ad's landing page, because the
 * landing page is only where the session starts — a visitor who arrives on a
 * paid click and then reads two guides before enquiring has to still be
 * attributable at the point they submit, and by then the gclid is gone from the
 * URL. Running it everywhere and letting the first write win is what makes that
 * work.
 *
 * Renders nothing.
 */
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);

  return null;
}
