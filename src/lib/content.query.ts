import { queryOptions } from "@tanstack/react-query";

import { getSiteContent, type SiteContentPayload } from "./content.functions";

const isStaticExport = import.meta.env["VITE_STATIC_EXPORT"] === "true";

/**
 * Public content query.
 *
 * A cPanel export has no application server after upload, so it must never
 * refetch a server function in the browser. Returning undefined selects the
 * bundled content in `toLive`, making the static build completely standalone.
 */
export const siteContentQuery = queryOptions<SiteContentPayload | undefined>({
  queryKey: ["site-content"],
  queryFn: () => (isStaticExport ? Promise.resolve(undefined) : getSiteContent()),
  staleTime: isStaticExport ? Infinity : 30_000,
  gcTime: isStaticExport ? Infinity : 30 * 60_000,
  refetchOnMount: !isStaticExport,
  refetchOnReconnect: !isStaticExport,
  refetchOnWindowFocus: false,
});