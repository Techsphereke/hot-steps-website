// Static build for shared hosting (cPanel / Apache).
// Usage: npm run build:cpanel  ->  fully static site in dist/client
//
// Every public page is pre-rendered to plain HTML at build time, so cPanel only
// has to serve files (no Node.js app, no Passenger, no restart).
// The admin panel needs a server runtime, so it is NOT part of this build —
// keep using the Lovable URL for content editing, then rebuild + re-upload.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const propertySlugs = [
  "summit-gardens-phase-2",
  "thogoto-gardens",
  "sunrise-gardens-phase-2",
  "ushindi-gardens",
  "eden-ridge",
  "goshen-gardens",
];

const locationSlugs = ["thigio", "kikuyu", "kamangu", "gikambura"];

const postSlugs = [
  "why-kamangu-is-becoming-the-new-karen",
  "residential-plots-for-sale-in-kikuyu",
  "trusted-when-it-counts-hotstep-homeowners",
  "reason-to-invest-with-us",
  "why-investing-in-land-is-the-smartest-move-in-2025",
  "understanding-zoning-laws-in-kenya-a-guide-for-land-buyers",
];

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
    prerender: {
      enabled: true,
      crawlLinks: true,
      failOnError: false,
    },
    pages: [
      { path: "/" },
      { path: "/404" },
      { path: "/about-us" },
      { path: "/diaspora" },
      { path: "/awards-titles" },
      { path: "/careers" },
      { path: "/contact-us" },
      { path: "/properties" },
      { path: "/blogs" },
      { path: "/sitemap.xml" },
      ...propertySlugs.map((slug) => ({ path: `/properties/${slug}` })),
      ...locationSlugs.map((slug) => ({ path: `/properties?location=${slug}` })),
      ...postSlugs.map((slug) => ({ path: `/blogs/${slug}` })),
    ],
  },
  // No server bundle: cPanel serves plain files from dist/client.
  nitro: false,
});
