import { createFileRoute } from "@tanstack/react-router";

import { NotFound } from "@/components/NotFound";

const title = "Page Not Found (404) | Hotstep Holdings Ltd";
const description =
  "The page you requested could not be found. Browse Hotstep Holdings plots for sale in Kikuyu, Kamangu, Thigio and Gilgil, or talk to our team.";

export const Route = createFileRoute("/404")({
  component: NotFound,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
});
