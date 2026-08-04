import { supabaseAdmin } from "@/integrations/supabase/client.server";

const MAX_BYTES = 8 * 1024 * 1024;

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/svg+xml": "svg",
};

export type UploadedMedia = { url: string; path: string };

/**
 * Uploads an image to the private `media` bucket using the service role key.
 * Runs server-side only; callers MUST authorize the requester first.
 */
export async function uploadMedia(file: {
  name: string;
  type: string;
  bytes: ArrayBuffer;
}): Promise<UploadedMedia> {
  const extension = ALLOWED[file.type];
  if (!extension) throw new Error("Unsupported file type. Use JPG, PNG, WebP, GIF, AVIF or SVG.");
  if (file.bytes.byteLength === 0) throw new Error("The uploaded file is empty.");
  if (file.bytes.byteLength > MAX_BYTES) throw new Error("Please choose an image under 8 MB.");

  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabaseAdmin.storage
    .from("media")
    .upload(path, file.bytes, { contentType: file.type, upsert: false });

  if (error) throw new Error(error.message);

  return { url: `/api/public/media/${path}`, path };
}
