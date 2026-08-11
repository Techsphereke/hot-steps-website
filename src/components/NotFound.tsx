import { Link } from "@tanstack/react-router";

import { site } from "@/data/site";

const links = [
  { to: "/", label: "Home" },
  { to: "/properties", label: "Plots on sale" },
  { to: "/blogs", label: "Information centre" },
  { to: "/about-us", label: "About us" },
  { to: "/contact-us", label: "Contact us" },
];

/** Branded 404 page — intentionally free of data dependencies so it always renders. */
export function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 py-16 text-center">
      <img
        src={site.logo}
        alt="Hotstep Holdings Ltd logo"
        className="h-16 w-auto"
        width={220}
        height={64}
      />

      <p className="mt-10 font-display text-6xl font-bold text-primary sm:text-7xl">404</p>
      <h1 className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">
        This plot of land doesn't exist
      </h1>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground">
        The page you are looking for may have been moved, renamed, or sold out. Our genuine,
        affordable plots in Kikuyu, Kamangu, Thigio and Gilgil are all a click away.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/properties"
          className="rounded-full bg-primary px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-primary-dark"
        >
          View plots on sale
        </Link>
        <Link
          to="/contact-us"
          className="rounded-full border border-border bg-card px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary-dark"
        >
          Talk to our team
        </Link>
      </div>

      <nav aria-label="Helpful links" className="mt-10 flex flex-wrap justify-center gap-x-5 gap-y-2">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-primary"
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <p className="mt-10 text-xs text-muted-foreground">
        Need help now? Call{" "}
        <a href={`tel:${site.phones[0]}`} className="font-semibold text-primary">
          {site.phones[0]}
        </a>
      </p>
    </main>
  );
}
