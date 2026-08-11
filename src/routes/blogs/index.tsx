import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { siteContentQuery } from "@/lib/content.functions";
import { toLive, useLive } from "@/lib/live";
import { previewImageMeta } from "@/lib/seo";
import { posts } from "@/data/site";

const title = "Information Center | Land Buying Guides & News — Hotstep Holdings";
const description =
  "Guides and news on buying land in Kenya: zoning laws, why Kamangu is the new Karen, residential plots in Kikuyu and why land is the smartest 2025 investment.";
const cover = posts[0]!.image;

export const Route = createFileRoute("/blogs/")({
  loader: async ({ context }) => {
    const live = toLive(await context.queryClient.ensureQueryData(siteContentQuery));
    return { origin: live.origin, cover: live.posts[0]?.image ?? cover };
  },
  component: BlogsPage,
  head: ({ loaderData }) => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/blogs" },
      ...previewImageMeta(loaderData?.origin ?? undefined, loaderData?.cover ?? cover),
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/blogs" }],
  }),
});

function BlogsPage() {
  const live = useLive();

  return (
    <PageShell>
      <PageHero title="News & Blogs" subtitle="Keep yourself up to date" />
      <section className="bg-surface py-14">
        <div className="container-page grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {live.posts.map((p) => (
            <article
              key={p.slug}
              className="overflow-hidden rounded-lg border border-border bg-card shadow-card"
            >
              <Link to="/blogs/$slug" params={{ slug: p.slug }}>
                <img
                  src={p.image}
                  alt={`${p.title} — Hotstep Holdings land buying guide`}
                  className="aspect-[16/10] w-full object-cover"
                  loading="lazy"
                />
              </Link>
              <div className="p-5">
                <h2 className="text-base font-bold text-primary-dark">
                  <Link to="/blogs/$slug" params={{ slug: p.slug }}>
                    {p.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm/6 text-muted-foreground">{p.excerpt}</p>
                <Link
                  to="/blogs/$slug"
                  params={{ slug: p.slug }}
                  className="mt-4 inline-block text-sm font-semibold text-accent hover:underline"
                >
                  Continue Reading ...
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
