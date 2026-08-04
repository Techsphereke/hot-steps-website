import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { MapPin, Navigation } from "lucide-react";
import { propertyCoords, type Property } from "@/data/site";

const LeafletMap = lazy(() => import("./LeafletMap"));

export function PropertyMapExplorer({ properties }: { properties: Property[] }) {
  const points = properties
    .filter((p) => propertyCoords[p.slug])
    .map((p) => ({ ...p, ...propertyCoords[p.slug]! }));

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || points.length < 2) return;
    const t = setInterval(() => setActive((p) => (p + 1) % points.length), 5000);
    return () => clearInterval(t);
  }, [paused, points.length]);

  const current = points[active % Math.max(points.length, 1)];
  if (!current) return null;

  const selectSlug = (slug: string) => {
    const idx = points.findIndex((p) => p.slug === slug);
    if (idx >= 0) setActive(idx);
  };

  return (
    <section
      className="bg-background py-16"
      aria-label="Property locations map"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container-page">
        <h2 className="section-title text-2xl sm:text-3xl">Where our properties are</h2>
        <p className="mt-2 text-center text-muted-foreground">
          Kikuyu, Kamangu, Thigio, Thogoto and Gilgil — explore each project on the map.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
            <ClientOnly
              fallback={
                <div className="flex h-[420px] items-center justify-center text-sm text-muted-foreground">
                  Loading map…
                </div>
              }
            >
              <Suspense
                fallback={
                  <div className="flex h-[420px] items-center justify-center text-sm text-muted-foreground">
                    Loading map…
                  </div>
                }
              >
                <LeafletMap points={points} activeSlug={current.slug} onSelect={selectSlug} />
              </Suspense>
            </ClientOnly>

            <div className="pointer-events-none absolute left-4 bottom-6 z-[500] max-w-[70%] rounded-lg border border-border bg-card/95 px-4 py-3 shadow-lift backdrop-blur">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-accent">
                <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
                {current.location}
              </p>
              <p className="mt-1 text-sm font-bold text-primary-dark">{current.title}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <article
              key={current.slug}
              className="animate-enter overflow-hidden rounded-2xl border border-border bg-card shadow-card"
            >
              <Link to="/properties/$slug" params={{ slug: current.slug }}>
                <img
                  src={current.image}
                  alt={`${current.title} in ${current.location}`}
                  width={800}
                  height={500}
                  className="aspect-[8/5] w-full object-cover"
                  loading="lazy"
                />
              </Link>
              <div className="p-5">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                  {current.location}
                </p>
                <h3 className="mt-1 text-lg font-bold text-primary-dark">{current.title}</h3>
                {current.price && (
                  <p className="mt-1 text-sm font-bold text-accent">{current.price}</p>
                )}
                <p className="mt-2 line-clamp-3 text-sm/6 text-muted-foreground">
                  {current.description}
                </p>
                <Link
                  to="/properties/$slug"
                  params={{ slug: current.slug }}
                  className="mt-4 inline-block text-sm font-semibold text-accent hover:underline"
                >
                  View property details
                </Link>
              </div>
            </article>

            <div className="flex flex-wrap gap-2">
              {points.map((p, idx) => (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => setActive(idx)}
                  onMouseEnter={() => setActive(idx)}
                  aria-current={idx === active}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors duration-200 ${
                    idx === active
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border bg-card text-foreground hover:border-primary hover:text-primary-dark"
                  }`}
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
