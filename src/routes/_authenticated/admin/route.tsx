import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Home,
  Images,
  Newspaper,
  Trophy,
  Users2,
  FileText,
  Settings,
  UserCog,
  LogOut,
  ExternalLink,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { site } from "@/data/site";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
  head: () => ({
    meta: [
      { title: "Management Panel | Hotstep Holdings Ltd" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

const links: { to: string; label: string; icon: typeof Home; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/hero", label: "Hero slider", icon: Images },
  { to: "/admin/properties", label: "Properties", icon: Home },
  { to: "/admin/posts", label: "Blogs & news", icon: Newspaper },
  { to: "/admin/awards", label: "Awards", icon: Trophy },
  { to: "/admin/team", label: "Meet the team", icon: Users2 },
  { to: "/admin/pages", label: "Page sections", icon: FileText },
  { to: "/admin/settings", label: "Site settings", icon: Settings },
  { to: "/admin/users", label: "Users", icon: UserCog },
];

function AdminLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-access"],
    retry: false,
    queryFn: async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;
      if (!userId) {
        void navigate({ to: "/auth", replace: true });
        return null;
      }

      // Keep the access gate compatible with the static cPanel build. The
      // security-definer functions validate the signed-in user in the database,
      // so no TanStack server-function endpoint is required here.
      const [{ data: isAdmin, error: adminError }, { data: isSuperAdmin, error: superError }] =
        await Promise.all([
          supabase.rpc("is_admin", { _user_id: userId }),
          supabase.rpc("has_role", { _user_id: userId, _role: "super_admin" }),
        ]);

      if (adminError) throw adminError;
      if (superError) throw superError;

      return {
        userId,
        roles: isSuperAdmin ? ["super_admin"] : isAdmin ? ["admin"] : [],
        isAdmin: Boolean(isAdmin),
        isSuperAdmin: Boolean(isSuperAdmin),
      };
    },
  });


  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/auth", replace: true });
  }

  if (isLoading) {
    return <p className="p-10 text-sm text-muted-foreground">Loading your panel…</p>;
  }

  if (error || !data?.isAdmin) {
    return (
      <div className="mx-auto max-w-md p-10 text-center">
        <h1 className="text-xl font-semibold">No access</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This account is not allowed to manage the website. Ask a super admin for access.
        </p>
        <button
          type="button"
          onClick={() => void signOut()}
          className="mt-4 rounded-md border border-border px-4 py-2 text-sm font-semibold"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full grid-cols-1 bg-surface lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="hidden flex-col border-r border-border bg-card lg:sticky lg:top-0 lg:flex lg:h-screen">
        <div className="border-b border-border p-4">
          <img src={site.logo} alt="Hotstep Holdings Ltd" className="h-10 w-auto" />
          <p className="mt-2 text-xs text-muted-foreground">
            {data.isSuperAdmin ? "Super admin" : "Admin"}
          </p>
        </div>
        <nav className="flex-1 space-y-1 p-3" aria-label="Admin">
          {links.map((l) => {
            const active = l.exact ? pathname === l.to : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                  active ? "bg-primary text-primary-foreground" : "hover:bg-surface"
                }`}
              >
                <l.icon className="h-4 w-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-1 border-t border-border p-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-surface"
          >
            <ExternalLink className="h-4 w-4" /> View website
          </a>
          <button
            type="button"
            onClick={() => void signOut()}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-surface"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="flex gap-2 overflow-x-auto border-b border-border bg-card p-2 lg:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold hover:bg-surface"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <main className="mx-auto w-full max-w-[100rem] p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
