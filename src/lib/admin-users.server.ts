import type { Db } from "./admin.server";

type Role = "super_admin" | "admin" | "editor";

export type AdminUser = {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  last_sign_in_at: string | null;
  confirmed: boolean;
  roles: Role[];
};

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export async function listUsers(): Promise<AdminUser[]> {
  const db = await admin();
  const { data, error } = await db.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) throw new Error(error.message);

  const { data: roles } = await db.from("user_roles").select("user_id, role");
  const { data: profiles } = await db.from("profiles").select("id, full_name");

  return data.users.map((u) => ({
    id: u.id,
    email: u.email ?? "",
    full_name: profiles?.find((p) => p.id === u.id)?.full_name ?? "",
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at ?? null,
    confirmed: Boolean(u.email_confirmed_at),
    roles: (roles ?? []).filter((r) => r.user_id === u.id).map((r) => r.role as Role),
  }));
}

export async function createUser(input: {
  email: string;
  password: string;
  full_name: string;
  role: Role;
}) {
  const db = await admin();
  const { data, error } = await db.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: { full_name: input.full_name },
  });
  if (error || !data.user) throw new Error(error?.message ?? "Could not create the user");

  await db
    .from("profiles")
    .upsert({ id: data.user.id, email: input.email, full_name: input.full_name });
  const { error: roleError } = await db
    .from("user_roles")
    .upsert({ user_id: data.user.id, role: input.role }, { onConflict: "user_id,role" });
  if (roleError) throw new Error(roleError.message);

  return { id: data.user.id };
}

export async function setUserRole(userId: string, role: Role) {
  const db = await admin();
  const { error: del } = await db.from("user_roles").delete().eq("user_id", userId);
  if (del) throw new Error(del.message);
  const { error } = await db.from("user_roles").insert({ user_id: userId, role });
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function setUserPassword(userId: string, password: string) {
  const db = await admin();
  const { error } = await db.auth.admin.updateUserById(userId, { password });
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function sendPasswordResetEmail(email: string, redirectTo: string) {
  const db = await admin();
  const { error } = await db.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function deleteUser(userId: string) {
  const db = await admin();
  const { error } = await db.auth.admin.deleteUser(userId);
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function guardLastSuperAdmin(db: Db, userId: string) {
  const { data } = await db.from("user_roles").select("user_id").eq("role", "super_admin");
  const supers = (data ?? []).map((r) => r.user_id);
  if (supers.length <= 1 && supers.includes(userId)) {
    throw new Error("You cannot remove the last super admin");
  }
}
