import { Link } from "@tanstack/react-router";
import { MapPin, Phone } from "lucide-react";
import { site, locations } from "@/data/site";

const quickLinks = [
  { label: "About Us", to: "/about-us" },
  { label: "Testimonials", to: "/awards-titles" },
  { label: "Blog", to: "/blogs" },
  { label: "Careers", to: "/careers" },
];

export function Footer() {
  return (
    <footer className="bg-primary-dark text-primary-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/">
            <img
              src={site.logo}
              alt="Hotstep Holdings Ltd logo"
              className="h-16 w-auto rounded-md bg-background p-2 transition-transform duration-300 hover:scale-105"
              width={220}
              height={68}
            />
          </Link>
          <p className="mt-4 text-sm/6 opacity-90">Our Vision Is {site.vision}</p>
        </div>

        <div>
          <h2 className="text-lg font-bold uppercase tracking-wide">Plots for sale</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {locations.map((l) => (
              <li key={l.slug}>
                <Link
                  to="/properties"
                  search={{ location: l.slug }}
                  className="opacity-90 hover:opacity-100 hover:underline"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="opacity-90">Prime plots for sale in Kikuyu</li>
            <li className="opacity-90">Affordable plots for sale in Kikuyu</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold uppercase tracking-wide">Quick links</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {quickLinks.map((q) => (
              <li key={q.to}>
                <Link to={q.to} className="opacity-90 hover:opacity-100 hover:underline">
                  {q.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold uppercase tracking-wide">Office locations</h2>
          <p className="mt-4 flex gap-2 text-sm/6 opacity-90">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {site.office}
          </p>
          <a
            href="tel:+254720484848"
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold hover:underline"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Tel: +254 720 48 48 48
          </a>
        </div>
      </div>

      <div className="border-t border-primary-foreground/20 py-5 text-center text-xs opacity-80">
        &copy; {new Date().getFullYear()} {site.name}. {site.tagline}.
      </div>
    </footer>
  );
}
