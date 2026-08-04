import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ShieldCheck, FileCheck2, Wallet, MapPin } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyMapExplorer } from "@/components/PropertyMapExplorer";
import { site, properties, posts, awards, heroSlides, testimonials, heroImage } from "@/data/site";

const title = "Hotstep Holdings Ltd | Affordable Plots for Sale in Kikuyu, Kamangu & Thigio";
const description =
  "Buy affordable plots for sale in Kikuyu, Gikambura, Kamangu, Thigio and Nachu. Ready title deeds, genuine land and flexible payment plans from Hotstep Holdings Ltd.";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { property: "og:image", content: heroImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: heroImage },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          name: site.name,
          slogan: site.tagline,
          email: site.email,
          telephone: site.phones,
          image: site.logo,
          address: {
            "@type": "PostalAddress",
            streetAddress: site.office,
            addressLocality: "Gikambura, Kikuyu",
            addressRegion: "Kiambu",
            addressCountry: "KE",
          },
        }),
      },
    ],
  }),
});

function HeroSlider() {
  const [i, setI] = useState(0);
  const go = (n: number) => setI((prev) => (prev + n + heroSlides.length) % heroSlides.length);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % heroSlides.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative bg-surface" aria-label="Featured properties">
      <div className="relative h-[180px] overflow-hidden sm:h-[300px] lg:h-[430px]">
        {heroSlides.map((s, idx) => (
          <div
            key={s.title}
            className={`absolute inset-0 transition-opacity duration-700 ${
              idx === i ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={idx !== i}
          >
            <img
              src={s.image}
              alt={`${s.title} — ${s.subtitle}`}
              className="h-full w-full object-cover"
              loading={idx === 0 ? "eager" : "lazy"}
            />

            {s.banner ? (
              <Link
                to={s.to}
                aria-label={`View details for ${s.title}`}
                className="absolute inset-0"
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/30 to-transparent" />
                <div className="container-page absolute inset-0 flex flex-col items-start justify-center gap-4">
                  <h2 className="max-w-xl text-3xl font-bold text-primary-foreground drop-shadow sm:text-5xl">
                    {s.title}
                  </h2>
                  <p className="flex items-center gap-2 text-base font-medium text-primary-foreground/90 sm:text-lg">
                    <MapPin className="h-5 w-5 text-accent" aria-hidden="true" />
                    {s.subtitle}
                  </p>
                  <Link to={s.to} className="btn-brand hover:bg-primary-dark">
                    View Details
                  </Link>
                </div>
              </>
            )}
          </div>
        ))}


        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous slide"
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground shadow-card"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next slide"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground shadow-card"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {heroSlides.map((s, idx) => (
            <button
              key={s.title}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 w-2.5 rounded-full ${
                idx === i ? "bg-accent" : "bg-background/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Index() {
  return (
    <PageShell>
      <HeroSlider />

      <PropertyMapExplorer />



      <section className="bg-surface py-14">
        <div className="container-page">
          <Reveal>
            <h1 className="section-title text-3xl sm:text-5xl">AFFORDABLE PLOTS FOR SALE.</h1>
            <p className="mt-2 text-center text-lg text-primary-dark/80 sm:text-xl">
              In Kikuyu, Gikambura, Kamangu, Thigio, Nachu.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p, idx) => (
              <Reveal key={p.slug} delay={idx * 80}>
                <PropertyCard property={p} />
              </Reveal>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/properties" className="btn-brand hover:bg-primary-dark">
              View more properties
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <Reveal><img
            src="https://hotstepsholdings.co.ke/wp-content/uploads/2025/02/title-12-min-1024x683.jpg"
            alt="Hotstep Holdings clients receiving ready title deeds"
            className="w-full rounded-lg object-cover shadow-card"
            loading="lazy"
          /></Reveal>
          <Reveal delay={120}>
            <h2 className="text-2xl font-bold text-primary-dark sm:text-3xl">
              WHY CHOOSE HOTSTEPS HOLDINGS?
            </h2>
            <p className="mt-4 text-base/7 text-muted-foreground">
              At Hotstep Holdings, we understand that buying land and acquiring property isn&apos;t
              just a business transaction — it&apos;s a life-changing decision. We are committed to
              helping you through the journey by providing genuine and accessible land, with ready
              title deeds and flexible payment plans.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, label: "Genuine, vetted land" },
                { icon: FileCheck2, label: "Ready title deeds" },
                { icon: Wallet, label: "Flexible payment plans" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="rounded-lg border border-border bg-card p-4">
                  <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  <p className="mt-2 text-sm font-semibold">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link to="/about-us" className="btn-brand-outline hover:bg-secondary">
                More about Hotstepholdings
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="container-page">
          <h2 className="section-title text-2xl sm:text-3xl">Your genuine Property Solution</h2>
          <p className="mt-2 text-center text-muted-foreground">
            Hear what some of our clients had to say about Hotstepholdings
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, idx) => (
              <Reveal key={t.name} delay={idx * 100}>
              <blockquote
                className="h-full rounded-lg border border-border bg-card p-6 shadow-card transition-shadow duration-300 hover:shadow-lift"
              >
                <p className="text-sm/6 text-muted-foreground">&ldquo;{t.text}&rdquo;</p>
                <footer className="mt-4 text-sm font-semibold text-primary-dark">{t.name}</footer>
              </blockquote>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          <h2 className="section-title text-2xl sm:text-3xl">Awards and Recognition</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {awards.map((a, idx) => (
              <Reveal key={a.title} delay={idx * 100}>
              <figure className="group overflow-hidden rounded-lg shadow-card transition-shadow duration-300 hover:shadow-lift">
                <img
                  src={a.image}
                  alt={a.title}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <figcaption className="bg-card p-3 text-center text-sm font-semibold">
                  {a.title}
                </figcaption>
              </figure>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/awards-titles" className="btn-brand-outline hover:bg-secondary">
              Awards &amp; Titles
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="container-page">
          <h2 className="section-title text-2xl sm:text-3xl">News &amp; Blogs</h2>
          <p className="mt-2 text-center text-muted-foreground">Keep yourself up to date</p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, idx) => (
              <Reveal key={p.slug} delay={idx * 90}>
              <article
                className="group h-full overflow-hidden rounded-lg border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <Link to="/blogs/$slug" params={{ slug: p.slug }}>
                  <img
                    src={p.image}
                    alt={p.title}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </Link>
                <div className="p-5">
                  <h3 className="text-base font-bold text-primary-dark">
                    <Link to="/blogs/$slug" params={{ slug: p.slug }}>
                      {p.title}
                    </Link>
                  </h3>
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
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
