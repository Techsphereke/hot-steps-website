import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { loadSiteContent, type SiteContent } from "./content.server";

export type SiteContentPayload = SiteContent & { origin: string | null };

export const getSiteContent = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteContentPayload> => {
    const content = await loadSiteContent();

    let origin: string | null = null;
    try {
      const req = getRequest();
      const host = req.headers.get("host");
      if (host) {
        const proto = req.headers.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
        origin = `${proto}://${host}`;
      }
    } catch {
      origin = null;
    }

    return { ...content, origin };
  },
);
