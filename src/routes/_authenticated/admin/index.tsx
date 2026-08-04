import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Home,
  Images,
  Newspaper,
  Trophy,
  Users2,
  FileText,
  Settings,
  UserCog,
  ExternalLink,
  ArrowUpRight,
  Plus,
} from "lucide-react";

import { adminList } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

type Card = {
  table: string;
  label: string;
  to: string;
  icon: typeof Home;
  span?: string;
  hint: string;
};

const cards: Card[] = [
  {
    table: "properties",
    label: "Properties",
    to: "/admin/properties",
    icon: Home,
    span: "sm:col-span-2 lg:col-span-2 lg:row-span-2",
    hint: "Plots and projects on the live site",
  },
  {
    table: "hero_slides",
    label: "Hero slides",
    to: "/admin/hero",
    icon: Images,
    hint: "Homepage banner rotation",
  },
  {
    table: "posts",
    label: "Blogs & news",
    to: "/admin/posts",
    icon: Newspaper,
    hint: "Information centre articles",
  },
  {
    table: "awards",
    label: "Awards",
    to: "/admin/awards",
    icon: Trophy,
    hint: "Recognition & titles",
  },
  {
    table: "team_members",
    label: "Team members",
    to: "/admin/team",
    icon: Users2,
    hint: "Meet the team profiles",
  },
  {
    table: "page_blocks",
    label: "Page sections",
    to: "/admin/pages",
    icon: FileText,
    span: "sm:col-span-2",
    hint: "Live text on static pages",
  },
];

const quickLinks = [
  { to: "/admin/properties", label: "Add a property", icon: Plus },
  { to: "/admin/posts", label: "Write an article", icon: Newspaper },
  { to: "/admin/hero", label: "Swap a banner", icon: Images },
  { to: "/admin/users", label: "Manage users", icon: UserCog },
  { to: "/admin/settings", label: "Site settings", icon: Settings },
];

function AdminDashboard() {
  const list = useServerFn(adminList);

  const counts = useQuery({
    queryKey: ["admin", "counts"],
    queryFn: async () => {
      const entries = await Promise.all(
        cards.map(async (c) => {
          const rows = (await list({ data: { table: c.table } })) as unknown[];
          return [c.table, rows.length] as const;
        }),
      );
      return Object.fromEntries(entries) as Record<string, number>;
    },
  });

  const total = counts.data
    ? Object.values(counts.data).reduce((a, b) => a + b, 0)
    : null;

  return (
    <div className="space-y-6">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Management panel
          </p>
          <h1 className="mt-1 truncate text-2xl font-semibold sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Everything you publish here appears on the live website immediately.
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <ExternalLink className="h-4 w-4" /> <span className="hidden sm:inline">View website</span>
        </a>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
        <div className="grid auto-rows-[minmax(9rem,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <Link
              key={c.table}
              to={c.to}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary ${c.span ?? ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <c.icon className="h-5 w-5" />
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div className="min-w-0">
                <p className="text-3xl font-semibold tabular-nums">
                  {counts.data ? (counts.data[c.table] ?? 0) : "—"}
                </p>
                <p className="truncate text-sm font-medium">{c.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{c.hint}</p>
              </div>
            </Link>
          ))}
        </div>

        <aside className="grid content-start gap-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Live content items
            </p>
            <p className="mt-2 text-4xl font-semibold tabular-nums">{total ?? "—"}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Across properties, banners, articles, awards, team and page sections.
            </p>
          </div>

          <nav className="rounded-2xl border border-border bg-card p-3 shadow-card" aria-label="Quick actions">
            <p className="px-2 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Quick actions
            </p>
            <div className="mt-1 grid gap-1">
              {quickLinks.map((q) => (
                <Link
                  key={q.label}
                  to={q.to}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium hover:bg-surface"
                >
                  <q.icon className="h-4 w-4 shrink-0 text-primary" />
                  <span className="truncate">{q.label}</span>
                </Link>
              ))}
            </div>
          </nav>
        </aside>
      </div>
    </div>
  );
}
