import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageShell, PageHero } from "@/components/PageShell";
import { site } from "@/data/site";

const title = "Contact Hotstep Holdings Ltd | Book a Site Visit in Kikuyu";
const description =
  "Talk to Hotstep Holdings Ltd. Call +254 720 48 48 48 or +254 742 777 444, email us, or book a site visit at our Gikambura office along Thogoto Mutarakwa road.";

export const Route = createFileRoute("/contact-us")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact-us" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contact-us" }],
  }),
});

function ContactPage() {
  return (
    <PageShell>
      <PageHero title="Enquiries and Contacts" subtitle={site.name} />

      <section className="py-16">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-primary-dark">TALK TO US.</h2>
            <ul className="mt-5 space-y-3 text-base">
              {site.phones.map((p) => (
                <li key={p}>
                  <a
                    href={`tel:${p.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-2 font-semibold text-primary-dark hover:underline"
                  >
                    <Phone className="h-4 w-4 text-accent" aria-hidden="true" />
                    {p}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-2 hover:underline"
                >
                  <Mail className="h-4 w-4 text-accent" aria-hidden="true" />
                  {site.email}
                </a>
              </li>
            </ul>

            <h2 className="mt-10 text-2xl font-bold text-primary-dark">OUR LOCATION.</h2>
            <p className="mt-3 flex gap-2 text-base/7 text-muted-foreground">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              <span>
                <strong className="text-foreground">Gikambura — </strong>
                {site.office}
              </span>
            </p>

            <div className="mt-6 overflow-hidden rounded-lg border border-border shadow-card">
              <iframe
                title="Hotstep Holdings office location map"
                src="https://www.google.com/maps?q=Thogoto+Mutarakwa+Road+Gikambura+Kikuyu&output=embed"
                className="h-72 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-8 shadow-card">
            <h2 className="text-xl font-bold text-primary-dark">Book a site visit</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Send us your details and our team will call you back to confirm.
            </p>
            <form
              className="mt-6 space-y-4"
              action={`mailto:${site.email}`}
              method="post"
              encType="text/plain"
            >
              {[
                { id: "name", label: "Name", type: "text" },
                { id: "phone", label: "Phone Number", type: "tel" },
                { id: "email", label: "Email", type: "email" },
                { id: "visit", label: "Visit Date", type: "date" },
              ].map((f) => (
                <div key={f.id}>
                  <label htmlFor={f.id} className="mb-1 block text-sm font-medium">
                    {f.label}
                  </label>
                  <input
                    id={f.id}
                    name={f.id}
                    type={f.type}
                    required={f.id !== "email"}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              ))}
              <button type="submit" className="btn-brand w-full hover:bg-primary-dark">
                Send
              </button>
            </form>

            <img
              src="https://hotstepsholdings.co.ke/wp-content/uploads/2026/05/cee.jpg"
              alt="Hotstep Holdings team ready to assist you"
              className="mt-8 w-full rounded-md object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
