import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";
import { site } from "@/data/site";

const title = "Careers at Hotstep Holdings Ltd | Real Estate Jobs in Kenya";
const description =
  "Join the Hotstep Holdings team. We are always looking for driven property sales consultants and support staff across Kikuyu and Nairobi.";

export const Route = createFileRoute("/careers")({
  component: CareersPage,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/careers" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/careers" }],
  }),
});

const roles = [
  {
    title: "Property Sales Consultant",
    location: "Kikuyu / Nairobi",
    text: "Guide clients through site visits and closings. Commission-based with strong earning potential.",
  },
  {
    title: "Digital Marketing Associate",
    location: "Gikambura office",
    text: "Run our social campaigns, content and lead generation across all projects.",
  },
  {
    title: "Client Relations Officer",
    location: "Gikambura office",
    text: "Support buyers from deposit to title transfer, keeping every client fully informed.",
  },
];

function CareersPage() {
  return (
    <PageShell>
      <PageHero
        title="Careers"
        subtitle="Build a career helping Kenyans own land they can trust."
      />

      <section className="py-16">
        <div className="container-page grid gap-6 md:grid-cols-3">
          {roles.map((r) => (
            <article key={r.title} className="rounded-lg border border-border bg-card p-6 shadow-card">
              <h2 className="text-lg font-bold text-primary-dark">{r.title}</h2>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-accent">
                {r.location}
              </p>
              <p className="mt-3 text-sm/6 text-muted-foreground">{r.text}</p>
            </article>
          ))}
        </div>

        <div className="container-page mt-12 rounded-lg border border-border bg-surface p-8 text-center">
          <h2 className="text-xl font-bold text-primary-dark">How to apply</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm/6 text-muted-foreground">
            Send your CV and a short cover note to {site.email} with the role in the subject line,
            or call {site.phones[0]} to speak with our team.
          </p>
          <a href={`mailto:${site.email}`} className="btn-brand mt-6 hover:bg-primary-dark">
            Email your CV
          </a>
        </div>
      </section>
    </PageShell>
  );
}
