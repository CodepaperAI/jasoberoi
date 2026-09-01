"use client";

import { useEffect, useRef } from "react";

/** The hidden field carrying when the form was rendered. */
export const TIMESTAMP_FIELD = "obz_t";

/**
 * Records when the form appeared, so the server can see how long it took to
 * fill in.
 *
 * A person filling five fields takes fifteen seconds at the very least. A
 * script posting the form takes under one. That gap is the cheapest spam signal
 * there is: it needs no third-party script, no key, no challenge for the
 * visitor to solve, and it costs nothing in completions — which a CAPTCHA
 * measurably does.
 *
 * Written in an effect rather than as a defaultValue because the value differs
 * between the server render and the client, and a hydration mismatch on the
 * lead form is not a trade worth making for one attribute.
 */
export function FormTimestamp() {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.value = String(Date.now());
  }, []);

  return <input ref={ref} type="hidden" name={TIMESTAMP_FIELD} defaultValue="" />;
}
