import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { properties, posts, locations } from "@/data/site";

// TODO: replace with your project URL once a project name or custom domain is set.
const BASE_URL = "";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/properties", changefreq: "weekly", priority: "0.9" },
          { path: "/about-us", changefreq: "monthly", priority: "0.7" },
          { path: "/diaspora", changefreq: "monthly", priority: "0.7" },
          { path: "/blogs", changefreq: "weekly", priority: "0.8" },
          { path: "/awards-titles", changefreq: "monthly", priority: "0.6" },
          { path: "/careers", changefreq: "monthly", priority: "0.5" },
          { path: "/contact-us", changefreq: "monthly", priority: "0.7" },
          ...Array.from(
            { length: Math.ceil(properties.length / 9) },
            (_, i) => i + 1,
          )
            .filter((n) => n > 1)
            .map((n) => ({
              path: `/properties?page=${n}`,
              changefreq: "weekly" as const,
              priority: "0.6",
            })),
          ...locations.map((l) => ({
            path: `/properties?location=${l.slug}`,
            changefreq: "weekly" as const,
            priority: "0.6",
          })),
          ...properties.map((p) => ({
            path: `/properties/${p.slug}`,
            changefreq: "weekly" as const,
            priority: "0.8",
          })),
          ...posts.map((p) => ({
            path: `/blogs/${p.slug}`,
            changefreq: "monthly" as const,
            priority: "0.6",
          })),
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path.replace(/&/g, "&amp;")}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
