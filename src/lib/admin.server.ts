import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type Db = SupabaseClient<Database>;

export const CONTENT_TABLES = [
  "properties",
  "hero_slides",
  "posts",
  "awards",
  "team_members",
  "page_blocks",
] as const;

export type ContentTable = (typeof CONTENT_TABLES)[number];

export function assertContentTable(table: string): ContentTable {
  if (!(CONTENT_TABLES as readonly string[]).includes(table)) {
    throw new Error(`Unknown content type: ${table}`);
  }
  return table as ContentTable;
}

export async function assertAdmin(db: Db, userId: string) {
  const { data, error } = await db.rpc("is_admin", { _user_id: userId });
  if (error || !data) throw new Error("Forbidden: admin access required");
}

export async function assertSuperAdmin(db: Db, userId: string) {
  const { data, error } = await db.rpc("has_role", {
    _user_id: userId,
    _role: "super_admin",
  });
  if (error || !data) throw new Error("Forbidden: super admin access required");
}

export async function listRows(db: Db, table: ContentTable) {
  const { data, error } = await db.from(table).select("*").order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function saveRow(db: Db, table: ContentTable, row: Record<string, unknown>) {
  const id = typeof row["id"] === "string" && row["id"] ? (row["id"] as string) : null;
  const payload = { ...row };
  delete payload["id"];
  delete payload["created_at"];
  delete payload["updated_at"];

  // The table is validated against CONTENT_TABLES before we get here; the row
  // shape is validated by the caller, so relax the generated union typing.
  const writer = db.from(table) as unknown as {
    update: (v: unknown) => { eq: (c: string, v: string) => Promise<{ error: { message: string } | null }> };
    insert: (v: unknown) => {
      select: (c: string) => {
        single: () => Promise<{ data: { id: string } | null; error: { message: string } | null }>;
      };
    };
  };

  if (id) {
    const { error } = await writer.update(payload).eq("id", id);
    if (error) throw new Error(error.message);
    return { id };
  }
  const { data, error } = await writer.insert(payload).select("id").single();
  if (error || !data) throw new Error(error?.message ?? "Could not save");
  return { id: data.id };
}

export async function deleteRow(db: Db, table: ContentTable, id: string) {
  const { error } = await db.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function listSettings(db: Db) {
  const { data, error } = await db.from("site_settings").select("*").order("key");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function saveSettings(db: Db, values: { key: string; value: string }[]) {
  for (const item of values) {
    const { error } = await db
      .from("site_settings")
      .update({ value: item.value })
      .eq("key", item.key);
    if (error) throw new Error(error.message);
  }
  return { ok: true };
}
