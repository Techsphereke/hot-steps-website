import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { PropertyCard } from "@/components/PropertyCard";
import { siteContentQuery } from "@/lib/content.functions";
import { toLive, useLive } from "@/lib/live";
import { locations, heroImage } from "@/data/site";
import { previewImageMeta } from "@/lib/seo";

const title = "Plots for Sale in Kikuyu, Kamangu, Thigio & Gilgil | Hotstep Holdings";
const description =
  "Browse all Hotstep Holdings properties on sale: Summit Gardens, Thogoto Gardens, Sunrise Gardens, Ushindi Gardens, Eden Ridge and Goshen Gardens. Ready title deeds.";

type Search = { location?: string | undefined; page?: number | undefined };

const PER_PAGE = 9;

function buildMeta(search: Search) {
  const loc = locations.find((l) => l.slug === search.location);
  const place = loc ? loc.label.replace(/^Plots for sale in /i, "") : null;
  const page = search.page && search.page > 1 ? search.page : 1;

  const params = new URLSearchParams();
  if (loc) params.set("location", loc.slug);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  const url = qs ? `/properties?${qs}` : "/properties";

  let pageTitle = title;
  let pageDescription = description;

  if (place) {
    pageTitle = `Plots for Sale in ${place}, Kiambu | Hotstep Holdings Ltd`;
    pageDescription = `Affordable, genuine plots for sale in ${place} with ready title deeds and flexible payment plans from Hotstep Holdings Ltd. Book a free site visit today.`;
  }

  if (page > 1) {
    pageTitle = place
      ? `Plots for Sale in ${place} — Page ${page} | Hotstep Holdings Ltd`
      : `Plots for Sale in Kikuyu, Kamangu & Thigio — Page ${page} | Hotstep Holdings`;
    pageDescription = place
      ? `Page ${page} of available plots for sale in ${place}. Ready title deeds, flexible payment plans and free site visits with Hotstep Holdings Ltd.`
      : `Page ${page} of Hotstep Holdings plots on sale across Kikuyu, Gikambura, Kamangu, Thigio, Nachu and Gilgil. Ready title deeds and flexible payment plans.`;
  }

  return { pageTitle, pageDescription, url };
}

export const Route = createFileRoute("/properties/")({
  loaderDeps: ({ search }: { search: Search }) => ({
    location: search.location,
    page: search.page,
  }),
  loader: async ({ context, deps }) => {
    const content = await context.queryClient.ensureQueryData(siteContentQuery);
    const live = toLive(content);
    const loc = locations.find((l) => l.slug === deps.location);
    const place = loc ? loc.label.replace(/^Plots for sale in /i, "") : null;
    const first = place
      ? live.properties.find((p) => p.location.toLowerCase().includes(place.toLowerCase()))
      : live.properties[0];
    return { ...buildMeta(deps), origin: live.origin, cover: first?.image ?? heroImage };
  },
  component: PropertiesPage,
  validateSearch: (search: Record<string, unknown>): Search => {
    const rawPage = Number(search["page"]);
    return {
      location: typeof search["location"] === "string" ? (search["location"] as string) : undefined,
      page: Number.isFinite(rawPage) && rawPage > 1 ? Math.floor(rawPage) : undefined,
    };
  },
  head: ({ loaderData }) => {
    const m =
      loaderData ??
      ({ pageTitle: title, pageDescription: description, url: "/properties", origin: null, cover: heroImage } as const);
    return {
      meta: [
        { title: m.pageTitle },
        { name: "description", content: m.pageDescription },
        { property: "og:title", content: m.pageTitle },
        { property: "og:description", content: m.pageDescription },
        { property: "og:type", content: "website" },
        { property: "og:url", content: m.url },
        ...previewImageMeta(m.origin ?? undefined, m.cover),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: m.url }],
    };
  },
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
