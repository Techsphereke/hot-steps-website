import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { MapPin, Navigation } from "lucide-react";
import { properties, propertyCoords } from "@/data/site";

const points = properties
  .filter((p) => propertyCoords[p.slug])
  .map((p) => ({ ...p, ...propertyCoords[p.slug]! }));

const W = 620;
const H = 460;

/** Hand-placed positions so every pin stays legible (geo order preserved). */
const layout: Record<string, { x: number; y: number }> = {
  "goshen-gardens": { x: 120, y: 95 },
  "ushindi-gardens": { x: 155, y: 265 },
  "sunrise-gardens-phase-2": { x: 250, y: 355 },
  "eden-ridge": { x: 350, y: 300 },
  "summit-gardens-phase-2": { x: 400, y: 390 },
  "thogoto-gardens": { x: 505, y: 320 },
};

const project = (slug: string) => layout[slug] ?? { x: W / 2, y: H / 2 };

export function PropertyMapExplorer() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);


  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((p) => (p + 1) % points.length), 4200);
    return () => clearInterval(t);
  }, [paused]);

  const current = points[active]!;
  

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
          {/* Map */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="h-full w-full"
              role="img"
              aria-label={`Map highlighting ${current.title} in ${current.location}`}
            >
              <defs>
                <linearGradient id="land" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--muted)" />
                  <stop offset="100%" stopColor="var(--secondary)" />
                </linearGradient>
                <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
                  <path
                    d="M28 0H0V28"
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="0.8"
                  />
                </pattern>
              </defs>

              <rect width={W} height={H} fill="url(#land)" />
              <rect width={W} height={H} fill="url(#grid)" opacity="0.7" />

              {/* stylised roads linking the projects */}
              <path
                d={points
                  .map((p, i) => {
                    const { x, y } = project(p.slug);
                    return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2"
                strokeDasharray="6 8"
                opacity="0.45"
              />

              {points.map((p, idx) => {
                const { x, y } = project(p.slug);
                const isActive = idx === active;
                return (
                  <g
                    key={p.slug}
                    transform={`translate(${x} ${y})`}
                    onMouseEnter={() => setActive(idx)}
                    onClick={() => setActive(idx)}
                    className="cursor-pointer"
                  >
                    {isActive && (
                      <circle r="22" fill="var(--accent)" opacity="0.25" className="pulse" />
                    )}
                    <circle
                      r={isActive ? 9 : 6}
                      fill={isActive ? "var(--accent)" : "var(--primary)"}
                      stroke="var(--background)"
                      strokeWidth="2.5"
                      className="transition-all duration-300"
                    />
                    {isActive && (
                      <text
                        y={-20}
                        textAnchor="middle"
                        fontSize={13}
                        fontWeight={700}
                        fill="var(--foreground)"
                      >
                        {p.location.split(",")[0]}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            <div
              className="pointer-events-none absolute left-4 bottom-4 max-w-[70%] rounded-lg border border-border bg-card/95 px-4 py-3 shadow-lift backdrop-blur"
            >
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-accent">
                <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
                {current.location}
              </p>
              <p className="mt-1 text-sm font-bold text-primary-dark">{current.title}</p>
            </div>
          </div>

          {/* Rotating property panel */}
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
