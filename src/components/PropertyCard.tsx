import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import type { Property } from "@/data/site";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link
        to="/properties/$slug"
        params={{ slug: property.slug }}
        className="relative block overflow-hidden"
      >
        <img
          src={property.image}
          alt={`${property.title} — plots for sale in ${property.location}`}
          className="aspect-[8/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          width={800}
          height={500}
        />

        {/* Hover-only summary popup (no click needed) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-foreground/80 backdrop-blur-sm p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
        >
          <div className="translate-y-3 transition-transform duration-300 group-hover:translate-y-0 motion-reduce:transform-none">
            <p className="text-sm font-bold uppercase tracking-wide text-primary-foreground">
              {property.title}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-primary-foreground/90">
              <MapPin className="h-3.5 w-3.5 text-accent" />
              {property.location} · {property.status}
            </p>
            <p className="mt-2 line-clamp-3 text-xs/5 text-primary-foreground/85">
              {property.description}
            </p>
            {property.features.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {property.features.slice(0, 3).map((f) => (
                  <li
                    key={f}
                    className="rounded-full bg-background/20 px-2 py-0.5 text-[10px] font-semibold text-primary-foreground"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            )}
            {property.price && (
              <p className="mt-2 text-sm font-bold text-primary-foreground">{property.price}</p>
            )}
          </div>
        </div>
      </Link>
      <div className="space-y-3 p-5">
        <h3 className="text-lg font-bold text-primary-dark">
          <Link to="/properties/$slug" params={{ slug: property.slug }}>
            {property.title}
          </Link>
        </h3>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-accent" aria-hidden="true" />
          LOCATION: {property.location}
        </p>
        {property.price && <p className="price-tag">Price: {property.price}</p>}
        <div>
          <Link
            to="/properties/$slug"
            params={{ slug: property.slug }}
            className="btn-brand transition-transform hover:-translate-y-0.5 hover:bg-primary-dark"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
