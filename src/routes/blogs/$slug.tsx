import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { siteContentQuery } from "@/lib/content.functions";
import { toLive, useLive } from "@/lib/live";
import { site } from "@/data/site";
import { previewImageMeta } from "@/lib/seo";

export const Route = createFileRoute("/blogs/$slug")({
  loader: async ({ context, params }) => {
    const content = await context.queryClient.ensureQueryData(siteContentQuery);
    const live = toLive(content);
    const post = live.posts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post, origin: live.origin };
  },
  component: PostPage,
  head: ({ params, loaderData }) => {
    const p = loaderData?.post;
    const title = p ? `${p.title} | Hotstep Holdings` : "Article";
    const description = p?.excerpt ?? "Land buying insights from Hotstep Holdings Ltd.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/blogs/${params.slug}` },
        ...previewImageMeta(loaderData?.origin ?? undefined, p?.image),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/blogs/${params.slug}` }],
      scripts: p
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: p.title,
                image: p.image,
                description: p.excerpt,
                publisher: { "@type": "Organization", name: site.name, logo: site.logo },
              }),
            },
          ]
        : [],
    };
  },
});

function PostPage() {
  const { post } = Route.useLoaderData();
  const live = useLive();
  const more = live.posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <PageShell>
      <article className="py-12">
        <div className="container-page max-w-3xl">
          <h1 className="text-3xl font-bold text-primary-dark sm:text-4xl">{post.title}</h1>
          <img
            src={post.image}
            alt={`${post.title} — Hotstep Holdings Ltd article cover image`}
            className="mt-6 w-full rounded-lg object-cover shadow-card"
          />
          <div
            className="prose-site mt-8 space-y-5 text-base/7 text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
          <div className="mt-10 rounded-lg border border-border bg-card p-6 shadow-card">
            <h2 className="text-lg font-bold text-primary-dark">Ready to own your plot?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Browse our current projects or talk to our sales team today.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link to="/properties" className="btn-brand hover:bg-primary-dark">
                View properties
              </Link>
              <Link to="/contact-us" className="btn-brand-outline hover:bg-secondary">
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </article>

      <section className="bg-surface py-14">
        <div className="container-page">
          <h2 className="section-title text-2xl">More from the Information Center</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {more.map((p) => (
              <article
                key={p.slug}
                className="overflow-hidden rounded-lg border border-border bg-card shadow-card"
              >
                <Link to="/blogs/$slug" params={{ slug: p.slug }}>
                  <img
                    src={p.image}
                    alt={`${p.title} — related Hotstep Holdings article`}
                    className="aspect-[16/10] w-full object-cover"
                    loading="lazy"
                  />
                </Link>
                <h3 className="p-4 text-sm font-bold text-primary-dark">
                  <Link to="/blogs/$slug" params={{ slug: p.slug }}>
                    {p.title}
                  </Link>
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
