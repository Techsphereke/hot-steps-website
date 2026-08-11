import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { PropertyCard } from "@/components/PropertyCard";
import { siteContentQuery } from "@/lib/content.functions";
import { useLive } from "@/lib/live";
import { locations, heroImage } from "@/data/site";

const title = "Plots for Sale in Kikuyu, Kamangu, Thigio & Gilgil | Hotstep Holdings";
const description =
  "Browse all Hotstep Holdings properties on sale: Summit Gardens, Thogoto Gardens, Sunrise Gardens, Ushindi Gardens, Eden Ridge and Goshen Gardens. Ready title deeds.";

type Search = { location?: string | undefined; page?: number | undefined };

const PER_PAGE = 9;

function pageUrl(search: Search) {
  const params = new URLSearchParams();
  if (search.location) params.set("location", search.location);
  if (search.page && search.page > 1) params.set("page", String(search.page));
  const qs = params.toString();
  return qs ? `/properties?${qs}` : "/properties";
}

export const Route = createFileRoute("/properties/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteContentQuery),
  component: PropertiesPage,
  validateSearch: (search: Record<string, unknown>): Search => {
    const rawPage = Number(search["page"]);
    return {
      location: typeof search["location"] === "string" ? (search["location"] as string) : undefined,
      page: Number.isFinite(rawPage) && rawPage > 1 ? Math.floor(rawPage) : undefined,
    };
  },
  head: ({ search }) => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: pageUrl(search) },
      { property: "og:image", content: heroImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: heroImage },
    ],
    links: [{ rel: "canonical", href: pageUrl(search) }],
  }),
});

function PropertiesPage() {
  const { location, page } = Route.useSearch();
  const live = useLive();
  const filtered = location
    ? live.properties.filter((p) => p.location.toLowerCase().includes(location.toLowerCase()))
    : live.properties;
  const all = filtered.length > 0 ? filtered : live.properties;
  const totalPages = Math.max(1, Math.ceil(all.length / PER_PAGE));
  const current = Math.min(page ?? 1, totalPages);
  const shown = all.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const hrefFor = (n: number) => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (n > 1) params.set("page", String(n));
    const qs = params.toString();
    return qs ? `/properties?${qs}` : "/properties";
  };

  return (
    <PageShell>
      <PageHero
        title="Property Status: On Sale"
        subtitle="Affordable plots for sale in Kikuyu, Gikambura, Kamangu, Thigio, Nachu and Gilgil."
      />

      <section className="bg-surface py-14">
        <div className="container-page">
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {locations.map((l) => (
              <a
                key={l.slug}
                href={`/properties?location=${l.slug}`}
                className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-wide hover:border-primary hover:text-primary-dark"
              >
                {l.label}
              </a>
            ))}
            <a
              href="/properties"
              className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-wide hover:border-primary hover:text-primary-dark"
            >
              All properties
            </a>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p) => (
              <PropertyCard key={p.slug} property={p} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav aria-label="Properties pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
              {current > 1 && (
                <a href={hrefFor(current - 1)} rel="prev" className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-wide hover:border-primary hover:text-primary-dark">
                  Previous
                </a>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <a
                  key={n}
                  href={hrefFor(n)}
                  aria-current={n === current ? "page" : undefined}
                  className={
                    n === current
                      ? "rounded-full bg-primary px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white"
                      : "rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-wide hover:border-primary hover:text-primary-dark"
                  }
                >
                  {n}
                </a>
              ))}
              {current < totalPages && (
                <a href={hrefFor(current + 1)} rel="next" className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-wide hover:border-primary hover:text-primary-dark">
                  Next
                </a>
              )}
            </nav>
          )}
        </div>
      </section>
    </PageShell>
  );
}
