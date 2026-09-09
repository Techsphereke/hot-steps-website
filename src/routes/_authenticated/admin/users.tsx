import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Trash2, KeyRound, Mail } from "lucide-react";

import {
  adminCreateUser,
  adminDeleteUser,
  adminListUsers,
  adminSendPasswordReset,
  adminSetUserPassword,
  adminSetUserRole,
} from "@/lib/admin.functions";
import { getBrowserAdminAccess } from "@/lib/admin-data";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: UsersPage,
});

const roles = ["super_admin", "admin", "editor"] as const;
type Role = (typeof roles)[number];

const roleLabels: Record<Role, string> = {
  super_admin: "Super admin",
  admin: "Admin",
  editor: "Editor",
};

function UsersPage() {
  const queryClient = useQueryClient();
  const listUsers = useServerFn(adminListUsers);
  const createUser = useServerFn(adminCreateUser);
  const setRole = useServerFn(adminSetUserRole);
  const setPassword = useServerFn(adminSetUserPassword);
  const sendReset = useServerFn(adminSendPasswordReset);
  const deleteUser = useServerFn(adminDeleteUser);

  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "editor" as Role,
  });

  const staticExport = import.meta.env.VITE_STATIC_EXPORT === "true";
  const me = useQuery({ queryKey: ["my-access"], queryFn: getBrowserAdminAccess });
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => listUsers(),
    enabled: !staticExport,
  });

  async function refresh() {
    await queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
  }

  function handle(promise: Promise<unknown>, message: string) {
    setError(null);
    setNotice(null);
    void promise
      .then(async () => {
        setNotice(message);
        await refresh();
      })
      .catch((e: Error) => setError(e.message));
  }

  const create = useMutation({
    mutationFn: () => createUser({ data: form }),
    onSuccess: async () => {
      setForm({ email: "", password: "", full_name: "", role: "editor" });
      setNotice("User created.");
      setError(null);
      await refresh();
    },
    onError: (e: Error) => setError(e.message),
  });

  const isSuper = me.data?.isSuperAdmin ?? false;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Users</h1>
      <p className="text-sm text-muted-foreground">
        Add team members, change what they can do, reset passwords or remove access.
      </p>

      {error && (
        <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      {notice && <p className="mt-4 text-sm text-primary-dark">{notice}</p>}

      {staticExport ? (
        <div className="mt-6 rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="text-lg font-semibold">Manage user accounts securely</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Content editing works here. Creating users, changing passwords and removing accounts
            require the secure hosted panel.
          </p>
          <a
            href="https://clone-master-seo.lovable.app/admin/users"
            className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Open secure user management
          </a>
        </div>
      ) : null}

      {!staticExport && isSuper && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            create.mutate();
          }}
          className="mt-6 grid gap-4 rounded-xl border border-border bg-card p-5 shadow-card sm:grid-cols-2"
        >
          <h2 className="text-lg font-semibold sm:col-span-2">Add a user</h2>
          <div>
            <label htmlFor="new-email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="new-email"
              type="email"
              required
              maxLength={255}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="new-name" className="mb-1 block text-sm font-medium">
              Full name
            </label>
            <input
              id="new-name"
              type="text"
              maxLength={120}
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="new-password" className="mb-1 block text-sm font-medium">
              Temporary password
            </label>
            <input
              id="new-password"
              type="text"
              required
              minLength={8}
              maxLength={72}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="new-role" className="mb-1 block text-sm font-medium">
              Role
            </label>
            <select
              id="new-role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {roleLabels[r]}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={create.isPending}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {create.isPending ? "Creating…" : "Create user"}
            </button>
          </div>
        </form>
      )}

      {!staticExport ? <div className="mt-8 space-y-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading users…</p>
        ) : (
          users.map((u) => (
            <div
              key={u.id}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{u.full_name || u.email}</p>
                <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {u.roles.length
                    ? u.roles.map((r) => roleLabels[r as Role] ?? r).join(", ")
                    : "No role yet"}
                  {u.last_sign_in_at
                    ? ` · last signed in ${new Date(u.last_sign_in_at).toLocaleDateString()}`
                    : " · never signed in"}
                </p>
              </div>

              {isSuper && (
                <select
                  aria-label={`Role for ${u.email}`}
                  value={u.roles[0] ?? "editor"}
                  onChange={(e) =>
                    handle(
                      setRole({ data: { userId: u.id, role: e.target.value as Role } }),
                      "Role updated.",
                    )
                  }
                  className="rounded-md border border-border bg-background px-2 py-1.5 text-xs"
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {roleLabels[r]}
                    </option>
                  ))}
                </select>
              )}

              <button
                type="button"
                onClick={() =>
                  handle(
                    sendReset({
                      data: {
                        email: u.email,
                        redirectTo: `${window.location.origin}/reset-password`,
                      },
                    }),
                    "Password reset email sent.",
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold hover:border-primary"
              >
                <Mail className="h-3.5 w-3.5" /> Reset email
              </button>

              {isSuper && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const password = window.prompt(
                        `New password for ${u.email} (at least 8 characters)`,
                      );
                      if (password) {
                        handle(
                          setPassword({ data: { userId: u.id, password } }),
                          "Password changed.",
                        );
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold hover:border-primary"
                  >
                    <KeyRound className="h-3.5 w-3.5" /> Set password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Remove ${u.email} permanently?`)) {
                        handle(deleteUser({ data: { userId: u.id } }), "User removed.");
                      }
                    }}
                    aria-label={`Delete ${u.email}`}
                    className="rounded-md border border-border p-2 text-destructive hover:border-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div> : null}
    </div>
  );
}
