import Script from "next/script";

/**
 * The container that carries the ad stack.
 *
 * GTM-NQNGGG6R is the same container the old oberizonconstruction.ca site
 * loads, so the tags configured inside it — GA4 G-YRH2XSG1Q4, Google Ads
 * conversion AW-16989825413 and the Facebook pixel 1683288065744579 — come
 * across with the domain instead of dying at the cutover. Google Ads campaigns
 * are live against this domain; a switch that dropped the container would have
 * kept spending while reporting nothing, and that gap is not backfillable.
 *
 * The container only, deliberately. Hardcoding GA4 and the Ads tag alongside it
 * would double-fire every event GTM is already firing, which corrupts
 * conversion counts in a way that is worse than missing them.
 *
 * The ID is inline rather than read from an env var. The pre-existing
 * Analytics component reads NEXT_PUBLIC_GA_ID and silently renders nothing when
 * it is unset — which is precisely why this site shipped with zero tracking and
 * nobody noticed. A container ID is public, appears in the page source of every
 * site that uses one, and is not a secret worth failing silently over.
 *
 * `afterInteractive` rather than `beforeInteractive`: the container should not
 * block first paint, and GTM's own snippet is written to be queued this way.
 */
const GTM_ID = "GTM-NQNGGG6R";

export function GoogleTagManager() {
  return (
    <Script id="gtm-init" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
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
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
