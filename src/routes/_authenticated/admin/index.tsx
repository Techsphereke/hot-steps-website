import { useMemo, useState } from "react";
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
  Search,
  RefreshCw,
  CheckCircle2,
  PencilLine,
  MapPin,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { adminList } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

type Row = {
  id: string;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
  title?: string;
  name?: string;
  heading?: string;
  location?: string;
  status?: string;
  slug?: string;
  page?: string;
  image?: string | null;
};

type Collection = {
  table: string;
  label: string;
  to: string;
  icon: typeof Home;
  hint: string;
};

const collections: Collection[] = [
  {
    table: "properties",
    label: "Properties",
    to: "/admin/properties",
    icon: Home,
    hint: "Plots & projects",
  },
  {
    table: "hero_slides",
    label: "Hero slides",
    to: "/admin/hero",
    icon: Images,
    hint: "Homepage banners",
  },
  {
    table: "posts",
    label: "Blogs & news",
    to: "/admin/posts",
    icon: Newspaper,
    hint: "Information centre",
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
    label: "Team",
    to: "/admin/team",
    icon: Users2,
    hint: "Staff profiles",
  },
  {
    table: "page_blocks",
    label: "Page sections",
    to: "/admin/pages",
    icon: FileText,
    hint: "Live page text",
  },
];

const quickLinks = [
  { to: "/admin/properties", label: "Add a property", icon: Plus },
  { to: "/admin/posts", label: "Write an article", icon: Newspaper },
  { to: "/admin/hero", label: "Swap a banner", icon: Images },
  { to: "/admin/users", label: "Manage users", icon: UserCog },
  { to: "/admin/settings", label: "Site settings", icon: Settings },
];

function rowLabel(r: Row) {
  return r.title || r.name || r.heading || r.slug || "Untitled";
}

function timeAgo(iso?: string) {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

function AdminDashboard() {
  const list = useServerFn(adminList);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [focus, setFocus] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const query = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const entries = await Promise.all(
        collections.map(async (c) => {
          const rows = (await list({ data: { table: c.table } })) as Row[];
          return [c.table, rows] as const;
        }),
      );
      return Object.fromEntries(entries) as Record<string, Row[]>;
    },
  });

  const data = query.data;

  const stats = useMemo(() => {
    if (!data) return null;
    return collections.map((c) => {
      const rows = data[c.table] ?? [];
      const published = rows.filter((r) => r.published !== false).length;
      return {
        ...c,
        total: rows.length,
        published,
        draft: rows.length - published,
      };
    });
  }, [data]);

  const totals = useMemo(() => {
    if (!stats) return null;
    return stats.reduce(
      (acc, s) => ({
        total: acc.total + s.total,
        published: acc.published + s.published,
        draft: acc.draft + s.draft,
      }),
      { total: 0, published: 0, draft: 0 },
    );
  }, [stats]);

  const activity = useMemo(() => {
    if (!data) return [];
    const all = collections.flatMap((c) =>
      (data[c.table] ?? []).map((r) => ({ ...r, collection: c })),
    );
    return all
      .filter((r) => (focus ? r.collection.table === focus : true))
      .filter((r) =>
        filter === "all"
          ? true
          : filter === "published"
            ? r.published !== false
            : r.published === false,
      )
      .filter((r) =>
        search.trim()
          ? `${rowLabel(r)} ${r.location ?? ""} ${r.page ?? ""}`
              .toLowerCase()
              .includes(search.trim().toLowerCase())
          : true,
      )
      .sort(
        (a, b) =>
          new Date(b.updated_at ?? b.created_at ?? 0).getTime() -
          new Date(a.updated_at ?? a.created_at ?? 0).getTime(),
      )
      .slice(0, 12);
  }, [data, focus, filter, search]);

  const trend = useMemo(() => {
    if (!data) return [];
    const all = collections.flatMap((c) => data[c.table] ?? []);
    const weeks = Array.from({ length: 8 }, (_, i) => {
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      end.setDate(end.getDate() - (7 - i) * 7);
      const start = new Date(end);
      start.setDate(start.getDate() - 6);
      return {
        label: `${start.getDate()}/${start.getMonth() + 1}`,
        start: start.getTime(),
        end: end.getTime(),
      };
    });
    return weeks.map((w) => ({
      label: w.label,
      items: all.filter((r) => {
        const t = new Date(r.updated_at ?? r.created_at ?? 0).getTime();
        return t >= w.start && t <= w.end;
      }).length,
    }));
  }, [data]);

  const mixData = useMemo(
    () =>
      stats
        ? stats.filter((s) => s.total > 0).map((s) => ({ name: s.label, value: s.total }))
        : [],
    [stats],
  );

  const pieColors = [
    "var(--color-primary)",
    "var(--color-accent)",
    "color-mix(in oklab, var(--color-primary) 55%, white)",
    "color-mix(in oklab, var(--color-accent) 55%, white)",
    "color-mix(in oklab, var(--color-primary) 30%, white)",
    "color-mix(in oklab, var(--color-accent) 30%, white)",
  ];

  const propertyStatuses = useMemo(() => {
    const rows = data?.["properties"] ?? [];
    const map = new Map<string, number>();
    rows.forEach((r) => {
      const key = r.status?.trim() || "Unspecified";
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return [...map.entries()].map(([status, count]) => ({ status, count }));
  }, [data]);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
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
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => void query.refetch()}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-surface"
          >
            <RefreshCw
              className={`h-4 w-4 ${query.isFetching ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">View website</span>
          </a>
        </div>
      </header>

      {/* Filter bar */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-card sm:flex sm:justify-between">
        <div className="flex min-w-0 items-center gap-2 rounded-lg bg-surface px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search content…"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </div>
        <div className="flex shrink-0 gap-1 rounded-lg bg-surface p-1">
          {(["all", "published", "draft"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stat grid */}
      <div className="grid auto-rows-fr grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {(stats ?? collections.map((c) => ({ ...c, total: 0, published: 0, draft: 0 }))).map(
          (s) => {
            const active = focus === s.table;
            const shown =
              filter === "published" ? s.published : filter === "draft" ? s.draft : s.total;
            const pct = s.total ? Math.round((s.published / s.total) * 100) : 0;
            return (
              <button
                key={s.table}
                type="button"
                onClick={() => setFocus(active ? null : s.table)}
                className={`group flex flex-col justify-between rounded-2xl border p-4 text-left shadow-card transition-all hover:-translate-y-0.5 ${
                  active
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border bg-card hover:border-primary"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <s.icon className="h-4 w-4" />
                  </span>
                  <Link
                    to={s.to}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:text-primary group-hover:opacity-100"
                    aria-label={`Open ${s.label}`}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="mt-3 min-w-0">
                  <p className="text-2xl font-semibold tabular-nums">
                    {data ? shown : "—"}
                  </p>
                  <p className="truncate text-sm font-medium">{s.label}</p>
                  <p className="truncate text-xs text-muted-foreground">{s.hint}</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {s.published} live · {s.draft} draft
                  </p>
                </div>
              </button>
            );
          },
        )}
      </div>

      {/* Charts */}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold">Publishing activity</h2>
              <p className="text-xs text-muted-foreground">
                Items created or edited each week (last 8 weeks)
              </p>
            </div>
            <p className="shrink-0 text-2xl font-semibold tabular-nums text-primary">
              {trend.reduce((a, b) => a + b.items, 0)}
            </p>
          </div>
          <div className="mt-4 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="dashArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={11} width={28} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--color-border)",
                    background: "var(--color-card)",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="items"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  fill="url(#dashArea)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h2 className="text-base font-semibold">Content mix</h2>
          <p className="text-xs text-muted-foreground">Share of items per collection</p>
          <div className="mt-2 h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mixData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={42}
                  outerRadius={68}
                  paddingAngle={2}
                  stroke="var(--color-card)"
                >
                  {mixData.map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--color-border)",
                    background: "var(--color-card)",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <dl className="grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">All</dt>
              <dd className="text-lg font-semibold tabular-nums">{totals?.total ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">Live</dt>
              <dd className="text-lg font-semibold tabular-nums text-primary">
                {totals?.published ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">Draft</dt>
              <dd className="text-lg font-semibold tabular-nums text-muted-foreground">
                {totals?.draft ?? "—"}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      {/* Activity + property status + quick actions */}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section className="rounded-2xl border border-border bg-card shadow-card">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border p-4">
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold">Recent updates</h2>
              <p className="text-xs text-muted-foreground">
                {focus
                  ? `Filtered to ${collections.find((c) => c.table === focus)?.label}`
                  : "Across every collection"}
              </p>
            </div>
            {focus ? (
              <button
                type="button"
                onClick={() => setFocus(null)}
                className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface"
              >
                Clear filter
              </button>
            ) : null}
          </div>
          <ul className="divide-y divide-border">
            {query.isLoading ? (
              <li className="p-4 text-sm text-muted-foreground">Loading content…</li>
            ) : activity.length === 0 ? (
              <li className="p-4 text-sm text-muted-foreground">Nothing matches this view.</li>
            ) : (
              activity.map((r) => (
                <li key={`${r.collection.table}-${r.id}`}>
                  <Link
                    to={r.collection.to}
                    className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-3 transition-colors hover:bg-surface"
                  >
                    {r.image ? (
                      <img
                        src={r.image}
                        alt=""
                        className="h-11 w-16 shrink-0 rounded-lg object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="grid h-11 w-16 shrink-0 place-items-center rounded-lg bg-surface text-muted-foreground">
                        <r.collection.icon className="h-4 w-4" />
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{rowLabel(r)}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {r.collection.label}
                        {r.location ? ` · ${r.location}` : ""}
                        {r.page ? ` · ${r.page}` : ""} · {timeAgo(r.updated_at ?? r.created_at)}
                      </p>
                    </div>
                    <span
                      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        r.published === false
                          ? "bg-surface text-muted-foreground"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {r.published === false ? (
                        <>
                          <PencilLine className="h-3 w-3" /> Draft
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3 w-3" /> Live
                        </>
                      )}
                    </span>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </section>

        <div className="grid content-start gap-4">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <MapPin className="h-4 w-4 text-primary" /> Properties by status
            </h2>
            <div className="mt-3 h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={propertyStatuses} layout="vertical" margin={{ left: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis
                    type="category"
                    dataKey="status"
                    width={92}
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid var(--color-border)",
                      background: "var(--color-card)",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" fill="var(--color-primary)" radius={[0, 6, 6, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <nav className="rounded-2xl border border-border bg-card p-3 shadow-card" aria-label="Quick actions">
            <p className="px-2 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Quick actions
            </p>
            <div className="mt-1 grid gap-1">
              {quickLinks.map((q) => (
                <Link
                  key={q.label}
                  to={q.to}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors hover:bg-surface"
                >
                  <q.icon className="h-4 w-4 shrink-0 text-primary" />
                  <span className="truncate">{q.label}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
