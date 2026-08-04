import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

import {
  assertAdmin,
  assertContentTable,
  assertSuperAdmin,
  deleteRow,
  listRows,
  listSettings,
  saveRow,
  saveSettings,
} from "./admin.server";

const roleSchema = z.enum(["super_admin", "admin", "editor"]);

export const getMyAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const roles = (data ?? []).map((r) => r.role as string);
    return {
      userId: context.userId,
      roles,
      isAdmin: roles.includes("admin") || roles.includes("super_admin"),
      isSuperAdmin: roles.includes("super_admin"),
    };
  });

export const adminList = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { table: string }) => z.object({ table: z.string() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    return listRows(context.supabase, assertContentTable(data.table));
  });

export const adminSave = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { table: string; row: Record<string, unknown> }) =>
    z.object({ table: z.string(), row: z.record(z.unknown()) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    return saveRow(context.supabase, assertContentTable(data.table), data.row);
  });

export const adminDelete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { table: string; id: string }) =>
    z.object({ table: z.string(), id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    return deleteRow(context.supabase, assertContentTable(data.table), data.id);
  });

export const adminGetSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    return listSettings(context.supabase);
  });

export const adminSaveSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { values: { key: string; value: string }[] }) =>
    z
      .object({
        values: z.array(z.object({ key: z.string(), value: z.string().max(4000) })).max(100),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    return saveSettings(context.supabase, data.values);
  });

export const adminListUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { listUsers } = await import("./admin-users.server");
    return listUsers();
  });

export const adminCreateUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        email: z.string().trim().email().max(255),
        password: z.string().min(8).max(72),
        full_name: z.string().trim().max(120).default(""),
        role: roleSchema,
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertSuperAdmin(context.supabase, context.userId);
    const { createUser } = await import("./admin-users.server");
    return createUser(data);
  });

export const adminSetUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ userId: z.string().uuid(), role: roleSchema }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertSuperAdmin(context.supabase, context.userId);
    const { setUserRole, guardLastSuperAdmin } = await import("./admin-users.server");
    if (data.role !== "super_admin") await guardLastSuperAdmin(context.supabase, data.userId);
    return setUserRole(data.userId, data.role);
  });

export const adminSetUserPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ userId: z.string().uuid(), password: z.string().min(8).max(72) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertSuperAdmin(context.supabase, context.userId);
    const { setUserPassword } = await import("./admin-users.server");
    return setUserPassword(data.userId, data.password);
  });

export const adminSendPasswordReset = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({ email: z.string().trim().email(), redirectTo: z.string().url() })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { sendPasswordResetEmail } = await import("./admin-users.server");
    return sendPasswordResetEmail(data.email, data.redirectTo);
  });

export const adminDeleteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ userId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertSuperAdmin(context.supabase, context.userId);
    if (data.userId === context.userId) throw new Error("You cannot delete your own account");
    const { deleteUser, guardLastSuperAdmin } = await import("./admin-users.server");
    await guardLastSuperAdmin(context.supabase, data.userId);
    return deleteUser(data.userId);
  });

export const adminUploadMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    if (!(input instanceof FormData)) throw new Error("Expected a file upload");
    const file = input.get("file");
    if (!(file instanceof File)) throw new Error("No file provided");
    return { file };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { uploadMedia } = await import("./media.server");
    return uploadMedia({
      name: data.file.name,
      type: data.file.type,
      bytes: await data.file.arrayBuffer(),
    });
  });
