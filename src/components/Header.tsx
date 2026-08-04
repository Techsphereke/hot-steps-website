import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, Menu, X } from "lucide-react";
import { site, nav } from "@/data/site";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-primary text-primary-foreground text-xs sm:text-sm">
        <div className="container-page flex flex-wrap items-center justify-center gap-x-6 gap-y-1 py-2">
          <span className="inline-flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            {site.email}
          </span>
          {site.phones.map((p) => (
            <a
              key={p}
              href={`tel:${p.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-1.5 hover:underline"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {p}
            </a>
          ))}
        </div>
      </div>

      <div className="border-b border-border bg-background">
        <div className="container-page flex items-center justify-between gap-4 py-3">
          <Link to="/" className="shrink-0">
            <img
              src={site.logo}
              alt="Hotstep Holdings Ltd logo"
              className="h-14 w-auto sm:h-16"
              width={180}
              height={64}
            />
          </Link>

          <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{
                  className: "text-primary-dark border-b-2 border-accent",
                }}
                className="pb-1 text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            Menu
          </button>
        </div>

        {open && (
          <nav className="border-t border-border bg-background lg:hidden" aria-label="Mobile">
            <div className="container-page flex flex-col py-2">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="border-b border-border py-3 text-sm font-medium last:border-b-0"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
