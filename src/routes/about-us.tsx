import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { site, team, ceoImage } from "@/data/site";

const title = "About Hotstep Holdings Ltd | Genuine Land & Ready Title Deeds";
const description =
  "Our story, vision, mission and team. Hotstep Holdings Ltd helps buyers own genuine, affordable land in Kikuyu and beyond with ready title deeds.";

export const Route = createFileRoute("/about-us")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/about-us" },
      { property: "og:image", content: ceoImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: ceoImage },
    ],
    links: [{ rel: "canonical", href: "/about-us" }],
  }),
});

function AboutPage() {
  return (
    <PageShell>
      <PageHero title="Our Story" subtitle={site.tagline} />

      <section className="py-16">
        <div className="container-page grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold text-primary-dark sm:text-3xl">
              From the C.E.O &amp; Founder
            </h2>
            <div className="mt-5 space-y-4 text-base/7 text-muted-foreground">
              <p>
                At Hotstep Holdings Ltd., we believe that buying land is more than just a
                transaction — it&apos;s a milestone that shapes your future. Whether you&apos;re
                searching for the perfect place to build your dream home, investing in a promising
                opportunity, or selling property to begin a new chapter, we are here to guide you
                with expertise, integrity and personalised service.
              </p>
              <p>
                Real estate is deeply personal, and we treat it as such. We take the time to
                understand your vision, your goals and your unique needs. Our approach goes beyond
                just selling land — we focus on helping you make informed decisions that bring
                long-term value, security and peace of mind.
              </p>
              <p>
                With a deep understanding of the market, a commitment to transparency and a passion
                for helping our clients succeed, we ensure that every step of your journey is
                seamless and rewarding.
              </p>
            </div>
          </div>
          <figure className="overflow-hidden rounded-lg shadow-card">
            <img
              src={ceoImage}
              alt="Director Stephen Kigathi, C.E.O and Founder of Hotstep Holdings Ltd"
              className="w-full object-cover"
              loading="lazy"
            />
            <figcaption className="bg-card p-3 text-center text-sm font-semibold">
              Director - Stephen Kigathi
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="container-page grid gap-8 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-8 shadow-card">
            <h2 className="text-xl font-bold text-primary-dark">Our Vision</h2>
            <p className="mt-3 text-base/7 text-muted-foreground">{site.vision}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-8 shadow-card">
            <h2 className="text-xl font-bold text-primary-dark">Our Mission</h2>
            <p className="mt-3 text-base/7 text-muted-foreground">{site.mission}</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <h2 className="section-title text-2xl sm:text-3xl">MEET THE TEAM.</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <figure
                key={m.name}
                className="overflow-hidden rounded-lg border border-border bg-card shadow-card"
              >
                <img
                  src={m.image}
                  alt={`${m.name} — ${m.role} at Hotstep Holdings`}
                  className="aspect-square w-full object-cover"
                  loading="lazy"
                />
                <figcaption className="p-4 text-center">
                  <span className="block text-sm font-bold text-primary-dark">{m.name}</span>
                  <span className="text-xs text-muted-foreground">{m.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <figure className="mt-10 overflow-hidden rounded-lg shadow-card">
            <img
              src="https://hotstepsholdings.co.ke/wp-content/uploads/2025/03/MG_0368-1-min-scaled-e1742496913866-1024x497.jpg"
              alt="The Hotstep Holdings sales team"
              className="w-full object-cover"
              loading="lazy"
            />
            <figcaption className="bg-card p-3 text-center text-sm font-semibold">
              The Sales Team
            </figcaption>
          </figure>
        </div>
      </section>
    </PageShell>
  );
}
