import Script from "next/script";

/**
 * The containers that carry the ad stack.
 *
 * GTM-NQNGGG6R is the same container the old oberizonconstruction.ca site
 * loads, so the tags configured inside it — GA4 G-YRH2XSG1Q4, Google Ads
 * conversion AW-16989825413 and the Facebook pixel 1683288065744579 — come
 * across with the domain instead of dying at the cutover. Google Ads campaigns
 * are live against this domain; a switch that dropped the container would have
 * kept spending while reporting nothing, and that gap is not backfillable.
 *
 * GTM-N8B7RGLP was added on 2026-09-03 at the client's request, alongside the
 * original rather than in place of it. Both are listed here because removing
 * NQNGGG6R is the one change that could not be undone quietly: the live Ads
 * conversion lives inside it.
 *
 * ONE THING TO WATCH. Two containers share one dataLayer, which is fine on its
 * own — but if N8B7RGLP is ever given its own GA4, Google Ads or Meta tag,
 * every event will fire twice and conversion counts will silently double. Keep
 * the measurement tags in one container and use the other for whatever it was
 * added to do.
 *
 * The container only, deliberately. Hardcoding GA4 and the Ads tag alongside
 * these would double-fire every event GTM is already firing, which corrupts
 * conversion counts in a way that is worse than missing them.
 *
 * The IDs are inline rather than read from env vars. The pre-existing Analytics
 * component reads NEXT_PUBLIC_GA_ID and silently renders nothing when it is
 * unset — which is precisely why this site shipped with zero tracking and
 * nobody noticed. A container ID is public, appears in the page source of every
 * site that uses one, and is not a secret worth failing silently over.
 *
 * `afterInteractive` rather than `beforeInteractive`: the containers should not
 * block first paint, and GTM's own snippet is written to be queued this way.
 */
const GTM_IDS = ["GTM-NQNGGG6R", "GTM-N8B7RGLP"] as const;

export function GoogleTagManager() {
  return (
    <>
      {GTM_IDS.map((id) => (
        <Script id={`gtm-init-${id}`} key={id} strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');`}
        </Script>
      ))}
    </>
  );
}

/**
 * The no-JavaScript fallback, which belongs immediately after <body>.
 *
 * Kept as a separate export because its placement is not negotiable: GTM counts
 * on this iframe being the first thing in the body, and burying it inside the
 * script component would put it wherever that component happened to render.
 */
export function GoogleTagManagerNoScript() {
  return (
    <>
      {GTM_IDS.map((id) => (
        <noscript key={id}>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${id}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
      ))}
    </>
  );
}
