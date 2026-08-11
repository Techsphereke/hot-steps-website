import { queryOptions } from "@tanstack/react-query";

import { getSiteContent, type SiteContentPayload } from "./content.functions";

const isStaticExport = import.meta.env["VITE_STATIC_EXPORT"] === "true";
const staticContent: SiteContentPayload = {
  properties: [],
  slides: [],
  posts: [],
  awards: [],
  team: [],
  blocks: [],
  settings: {},
  origin: null,
};

/**
 * Public content query.
 *
 * A cPanel export has no application server after upload, so it must never
 * refetch a server function in the browser. Returning an empty payload selects
 * the bundled content in `toLive`, making the static build standalone.
 */
export const siteContentQuery = queryOptions<SiteContentPayload>({
  queryKey: ["site-content"],
  queryFn: () => (isStaticExport ? Promise.resolve(staticContent) : getSiteContent()),
  staleTime: isStaticExport ? Infinity : 30_000,
  gcTime: isStaticExport ? Infinity : 30 * 60_000,
  refetchOnMount: !isStaticExport,
  refetchOnReconnect: !isStaticExport,
  refetchOnWindowFocus: false,
});