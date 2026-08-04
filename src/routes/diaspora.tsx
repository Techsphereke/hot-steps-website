import { createFileRoute, Link } from "@tanstack/react-router";
import { Globe2, FileCheck2, Video, Handshake } from "lucide-react";
import { PageShell, PageHero } from "@/components/PageShell";
import { site } from "@/data/site";

const title = "Diaspora Land Buying in Kenya | Hotstep Holdings Ltd";
const description =
  "Kenyans in the diaspora can buy genuine plots in Kikuyu, Kamangu and Thigio with virtual site visits, verified documents and ready title deeds from Hotstep Holdings.";
const cover =
  "https://hotstepsholdings.co.ke/wp-content/uploads/2025/04/WHAT-KENYANS-IN-DIASPORA-SHOULD-CONSIDER-BEFORE-BUYING-LAND.jpg";

export const Route = createFileRoute("/diaspora")({
  component: DiasporaPage,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/diaspora" },
      { property: "og:image", content: cover },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: cover },
    ],
    links: [{ rel: "canonical", href: "/diaspora" }],
  }),
});

const steps = [
  {
    icon: Video,
    title: "Virtual site visits",
    text: "We walk the plot on a live video call and share drone footage so you see exactly what you are buying.",
  },
  {
    icon: FileCheck2,
    title: "Verified documents",
    text: "Title search results, approved subdivision schemes and sale agreements shared digitally before you pay.",
  },
  {
    icon: Handshake,
    title: "Trusted representation",
    text: "Buy directly or through a person you appoint locally. Our team coordinates every step with them.",
  },
  {
    icon: Globe2,
    title: "Flexible payments",
    text: "Pay by international transfer or in instalments, with clear receipts at every stage.",
  },
];

function DiasporaPage() {
  return (
    <PageShell>
      <PageHero
        title="Buying Land From the Diaspora"
        subtitle="Own genuine land back home without getting on a plane."
      />

      <section className="py-16">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <img
            src={cover}
            alt="What Kenyans in the diaspora should consider before buying land"
            className="w-full rounded-lg object-cover shadow-card"
            loading="lazy"
          />
          <div>
            <h2 className="text-2xl font-bold text-primary-dark sm:text-3xl">
              Distance should never cost you your investment
            </h2>
            <p className="mt-4 text-base/7 text-muted-foreground">
              Many Kenyans abroad want to invest at home but worry about fraud, absentee
              management and unclear paperwork. We built our diaspora process around removing
              exactly those risks: everything is documented, verified and shared with you in
              writing.
            </p>
            <p className="mt-4 text-base/7 text-muted-foreground">{site.mission}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/properties" className="btn-brand hover:bg-primary-dark">
                See available plots
              </Link>
              <Link to="/contact-us" className="btn-brand-outline hover:bg-secondary">
                Talk to our team
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="container-page">
          <h2 className="section-title text-2xl sm:text-3xl">How it works</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ icon: Icon, title: t, text }) => (
              <div key={t} className="rounded-lg border border-border bg-card p-6 shadow-card">
                <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
                <h3 className="mt-3 text-base font-bold text-primary-dark">{t}</h3>
                <p className="mt-2 text-sm/6 text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
