import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { awards, testimonials } from "@/data/site";

const title = "Awards & Titles | Hotstep Holdings Ltd Recognition & Testimonials";
const description =
  "Awards and recognition earned by Hotstep Holdings Ltd, including CEO of the Year and Starbrands honours, plus testimonials from our land buyers.";
const cover = awards[0]!.image;

export const Route = createFileRoute("/awards-titles")({
  component: AwardsPage,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/awards-titles" },
      { property: "og:image", content: cover },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: cover },
    ],
    links: [{ rel: "canonical", href: "/awards-titles" }],
  }),
});

function AwardsPage() {
  return (
    <PageShell>
      <PageHero
        title="Awards and Recognition"
        subtitle="Recognised for making land ownership accessible, affordable and rewarding."
      />

      <section className="py-16">
        <div className="container-page grid gap-6 sm:grid-cols-3">
          {awards.map((a) => (
            <figure key={a.title} className="overflow-hidden rounded-lg shadow-card">
              <img
                src={a.image}
                alt={a.title}
                className="aspect-[3/4] w-full object-cover"
                loading="lazy"
              />
              <figcaption className="bg-card p-3 text-center text-sm font-semibold">
                {a.title}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="container-page">
          <h2 className="section-title text-2xl sm:text-3xl">Testimonials</h2>
          <p className="mt-2 text-center text-muted-foreground">
            Hear what some of our clients had to say about Hotstepholdings
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote
                key={t.name}
                className="rounded-lg border border-border bg-card p-6 shadow-card"
              >
                <p className="text-sm/6 text-muted-foreground">&ldquo;{t.text}&rdquo;</p>
                <footer className="mt-4 text-sm font-semibold text-primary-dark">{t.name}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
