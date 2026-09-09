import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export const CONTENT_TABLES = [
  "properties",
  "hero_slides",
  "posts",
  "awards",
  "team_members",
  "page_blocks",
] as const;

export type ContentTable = (typeof CONTENT_TABLES)[number];
type ContentRow = Record<string, unknown>;

function contentTable(table: string): ContentTable {
  if (!(CONTENT_TABLES as readonly string[]).includes(table)) {
    throw new Error(`Unknown content type: ${table}`);
  }
  return table as ContentTable;
}

export async function getBrowserAdminAccess() {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) throw new Error("Please sign in again.");

  const userId = userData.user.id;
  const [{ data: isAdmin, error: adminError }, { data: isSuperAdmin, error: superError }] =
    await Promise.all([
      supabase.rpc("is_admin", { _user_id: userId }),
      supabase.rpc("has_role", { _user_id: userId, _role: "super_admin" }),
    ]);

  if (adminError) throw new Error(adminError.message);
  if (superError) throw new Error(superError.message);

  return {
    userId,
    roles: isSuperAdmin ? ["super_admin"] : isAdmin ? ["admin"] : [],
    isAdmin: Boolean(isAdmin),
    isSuperAdmin: Boolean(isSuperAdmin),
  };
}

export async function browserAdminList(table: string): Promise<ContentRow[]> {
  const target = contentTable(table);
  const { data, error } = await supabase.from(target).select("*").order("sort_order");
  if (error) throw new Error(error.message);
  return (data ?? []) as ContentRow[];
}

export async function browserAdminSave(table: string, row: ContentRow) {
  const target = contentTable(table);
  const id = typeof row["id"] === "string" && row["id"] ? row["id"] : null;
  const payload = { ...row };
  delete payload["id"];
  delete payload["created_at"];
  delete payload["updated_at"];

  const writer = supabase.from(target) as unknown as {
    update: (value: ContentRow) => {
      eq: (column: string, value: string) => Promise<{ error: { message: string } | null }>;
    };
    insert: (value: ContentRow) => {
      select: (column: string) => {
        single: () => Promise<{
          data: { id: string } | null;
          error: { message: string } | null;
        }>;
      };
    };
  };

  if (id) {
    const { error } = await writer.update(payload).eq("id", id);
    if (error) throw new Error(error.message);
    return { id };
  }

  const { data, error } = await writer.insert(payload).select("id").single();
  if (error || !data) throw new Error(error?.message ?? "Could not save this item.");
  return { id: data.id };
}

export async function browserAdminDelete(table: string, id: string) {
  const target = contentTable(table);
  const { error } = await supabase.from(target).delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function browserAdminGetSettings() {
  const { data, error } = await supabase.from("site_settings").select("*").order("key");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function browserAdminSaveSettings(values: { key: string; value: string }[]) {
  const results = await Promise.all(
    values.map((item) =>
      supabase.from("site_settings").update({ value: item.value }).eq("key", item.key),
    ),
  );
  const failure = results.find((result) => result.error)?.error;
  if (failure) throw new Error(failure.message);
  return { ok: true };
}

const allowedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
]);

export async function browserAdminUploadMedia(file: File) {
  if (!allowedImageTypes.has(file.type)) {
    throw new Error("Unsupported image type. Use JPG, PNG, WebP, GIF, AVIF or SVG.");
  }
  if (file.size === 0) throw new Error("The uploaded file is empty.");
  if (file.size > 8 * 1024 * 1024) throw new Error("Please choose an image under 8 MB.");

  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(error.message);

  const { data, error: signedError } = await supabase.storage
    .from("media")
    .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (signedError || !data?.signedUrl) {
    throw new Error(signedError?.message ?? "The image was uploaded but its link could not be created.");
  }
  return { url: data.signedUrl, path };
}

export type SiteSetting = Database["public"]["Tables"]["site_settings"]["Row"];