import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, MapPin, Phone } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { PropertyCard } from "@/components/PropertyCard";
import { properties, site } from "@/data/site";

export const Route = createFileRoute("/properties/$slug")({
  loader: ({ params }) => {
    const property = properties.find((p) => p.slug === params.slug);
    if (!property) throw notFound();
    return { property };
  },
  component: PropertyPage,
  head: ({ params, loaderData }) => {
    const p = loaderData?.property;
    const title = p ? `${p.title} — Plots for Sale in ${p.location} | Hotstep Holdings` : "Property";
    const description = p?.description ?? "Plots for sale from Hotstep Holdings Ltd.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/properties/${params.slug}` },
        ...(p?.image
          ? [
              { property: "og:image", content: p.image },
              { name: "twitter:image", content: p.image },
            ]
          : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/properties/${params.slug}` }],
      scripts: p
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                name: p.title,
                image: p.image,
                description: p.description,
                brand: { "@type": "Brand", name: site.name },
                offers: {
                  "@type": "Offer",
                  priceCurrency: "KES",
                  price: p.price?.replace(/[^0-9]/g, "") || undefined,
                  availability: "https://schema.org/InStock",
                },
              }),
            },
          ]
        : [],
    };
  },
});

function PropertyPage() {
  const { property } = Route.useLoaderData();
  const related = properties.filter((p) => p.slug !== property.slug).slice(0, 3);

  return (
    <PageShell>
      <section className="py-12">
        <div className="container-page grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <img
              src={property.image}
              alt={`${property.title} — plots for sale in ${property.location}`}
              className="w-full rounded-lg object-cover shadow-card"
            />
            <h1 className="mt-8 text-3xl font-bold text-primary-dark sm:text-4xl">
              {property.title}
            </h1>
            <p className="mt-3 flex items-center gap-2 text-base text-muted-foreground">
              <MapPin className="h-5 w-5 text-accent" aria-hidden="true" />
              LOCATION: {property.location}
            </p>
            {property.price && <p className="price-tag mt-4">Price: {property.price}</p>}
            <p className="mt-6 text-base/7 text-muted-foreground">{property.description}</p>

            <h2 className="mt-10 text-xl font-bold text-primary-dark">Features</h2>
            <ul className="mt-4 space-y-2">
              {property.features.map((f: string) => (
                <li key={f} className="flex items-start gap-2 text-sm/6">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <aside className="h-fit rounded-lg border border-border bg-card p-7 shadow-card">
            <h2 className="text-lg font-bold text-primary-dark">Book a site visit</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Call our sales team and we will arrange a viewing at your convenience.
            </p>
            <div className="mt-5 space-y-3">
              {site.phones.map((p) => (
                <a
                  key={p}
                  href={`tel:${p.replace(/\s/g, "")}`}
                  className="btn-brand w-full hover:bg-primary-dark"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {p}
                </a>
              ))}
              <Link to="/contact-us" className="btn-brand-outline w-full hover:bg-secondary">
                Send an enquiry
              </Link>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              Status: {property.status} &middot; Ready title deeds &middot; Flexible payment plans
            </p>
          </aside>
        </div>
      </section>

      <section className="bg-surface py-14">
        <div className="container-page">
          <h2 className="section-title text-2xl sm:text-3xl">Other properties on sale</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PropertyCard key={p.slug} property={p} />
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
