import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import type { Property } from "@/data/site";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-border bg-card shadow-card transition-shadow hover:shadow-lift">
      <Link to="/properties/$slug" params={{ slug: property.slug }} className="block">
        <img
          src={property.image}
          alt={`${property.title} — plots for sale in ${property.location}`}
          className="aspect-[8/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          width={800}
          height={500}
        />
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
            className="btn-brand hover:bg-primary-dark"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
