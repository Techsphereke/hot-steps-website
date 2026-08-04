import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Home, Images, Newspaper, Trophy, Users2, FileText } from "lucide-react";

import { adminList } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

const cards = [
  { table: "properties", label: "Properties", to: "/admin/properties", icon: Home },
  { table: "hero_slides", label: "Hero slides", to: "/admin/hero", icon: Images },
  { table: "posts", label: "Blogs & news", to: "/admin/posts", icon: Newspaper },
  { table: "awards", label: "Awards", to: "/admin/awards", icon: Trophy },
  { table: "team_members", label: "Team members", to: "/admin/team", icon: Users2 },
  { table: "page_blocks", label: "Page sections", to: "/admin/pages", icon: FileText },
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

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-sm text-muted-foreground">
        Everything you publish here appears on the live website immediately.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.table}
            to={c.to}
            className="rounded-xl border border-border bg-card p-5 shadow-card transition-transform hover:-translate-y-0.5 hover:border-primary"
          >
            <c.icon className="h-5 w-5 text-primary" />
            <p className="mt-3 text-2xl font-semibold">
              {counts.data ? (counts.data[c.table] ?? 0) : "—"}
            </p>
            <p className="text-sm text-muted-foreground">{c.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
