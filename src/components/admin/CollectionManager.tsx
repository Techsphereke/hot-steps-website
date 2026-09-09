import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

import { browserAdminDelete, browserAdminList, browserAdminSave } from "@/lib/admin-data";
import { MediaUploader } from "./MediaUploader";
import { RichTextEditor } from "./RichTextEditor";

export type Field = {
  name: string;
  label: string;
  kind: "text" | "textarea" | "number" | "boolean" | "image" | "rich" | "list" | "select";
  options?: string[];
  help?: string;
  required?: boolean;
};

type Row = Record<string, unknown>;

type Props = {
  table: string;
  title: string;
  description: string;
  fields: Field[];
  titleKey?: string;
  subtitleKey?: string;
  imageKey?: string;
};

function blankRow(fields: Field[], count: number): Row {
  const row: Row = { published: true, sort_order: count + 1 };
  for (const f of fields) {
    row[f.name] =
      f.kind === "boolean" ? true : f.kind === "number" ? 0 : f.kind === "list" ? [] : "";
  }
  row["published"] = true;
  row["sort_order"] = count + 1;
  return row;
}

export function CollectionManager({
  table,
  title,
  description,
  fields,
  titleKey = "title",
  subtitleKey,
  imageKey = "image",
}: Props) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Row | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin", table],
    queryFn: () => browserAdminList(table),
  });

  const saveMutation = useMutation({
    mutationFn: (row: Row) => browserAdminSave(table, row),
    onSuccess: async () => {
      setDraft(null);
      setError(null);
      await queryClient.invalidateQueries({ queryKey: ["admin", table] });
      await queryClient.invalidateQueries({ queryKey: ["site-content"] });
    },
    onError: (e: Error) => setError(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => browserAdminDelete(table, id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", table] });
      await queryClient.invalidateQueries({ queryKey: ["site-content"] });
    },
    onError: (e: Error) => setError(e.message),
  });

  function update(name: string, value: unknown) {
    setDraft((current) => (current ? { ...current, [name]: value } : current));
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <button
          type="button"
          onClick={() => setDraft(blankRow(fields, rows.length))}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> Add new
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {draft && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate(draft);
          }}
          className="mb-8 space-y-4 rounded-xl border border-border bg-card p-5 shadow-card"
        >
          <h2 className="text-lg font-semibold">
            {draft["id"] ? "Edit item" : "New item"}
          </h2>

          {fields.map((field) => {
            const value = draft[field.name];
            if (field.kind === "image") {
              return (
                <MediaUploader
                  key={field.name}
                  label={field.label}
                  value={typeof value === "string" ? value : ""}
                  onChange={(url) => update(field.name, url)}
                />
              );
            }
            if (field.kind === "rich") {
              return (
                <RichTextEditor
                  key={field.name}
                  label={field.label}
                  value={typeof value === "string" ? value : ""}
                  onChange={(html) => update(field.name, html)}
                />
              );
            }
            if (field.kind === "boolean") {
              return (
                <label key={field.name} className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked=      {Boolean(value)}
                    onChange={(e) => update(field.name, e.target.checked)}
                    className="h-4 w-4"
                  />
                  {field.label}
                </label>
              );
            }
            if (field.kind === "select") {
              return (
                <div key={field.name}>
                  <label htmlFor={field.name} className="mb-1 block text-sm font-medium">
                    {field.label}
                  </label>
                  <select
                    id={field.name}
                    value={typeof value === "string" ? value : ""}
                    onChange={(e) => update(field.name, e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  >
                    {(field.options ?? []).map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }
            if (field.kind === "list") {
              const text = Array.isArray(value) ? (value as string[]).join("\n") : "";
              return (
                <div key={field.name}>
                  <label htmlFor={field.name} className="mb-1 block text-sm font-medium">
                    {field.label}
                  </label>
                  <textarea
                    id={field.name}
                    rows={5}
                    value={text}
                    onChange={(e) =>
                      update(
                        field.name,
                        e.target.value.split("\n").map((line) => line.trim()).filter(Boolean),
                      )
                    }
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">One item per line.</p>
                </div>
              );
            }
            if (field.kind === "textarea") {
              return (
                <div key={field.name}>
                  <label htmlFor={field.name} className="mb-1 block text-sm font-medium">
                    {field.label}
                  </label>
                  <textarea
                    id={field.name}
                    rows={4}
                    required={field.required}
                    value={typeof value === "string" ? value : ""}
                    onChange={(e) => update(field.name, e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
              );
            }
            return (
              <div key={field.name}>
                <label htmlFor={field.name} className="mb-1 block text-sm font-medium">
                  {field.label}
                </label>
                <input
                  id={field.name}
                  type={field.kind === "number" ? "number" : "text"}
                  required={field.required}
                  value={
                    field.kind === "number"
                      ? typeof value === "number"
                        ? value
                        : 0
                      : typeof value === "string"
                        ? value
                        : ""
                  }
                  onChange={(e) =>
                    update(
                      field.name,
                      field.kind === "number" ? Number(e.target.value) : e.target.value,
                    )
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
                {field.help && <p className="mt-1 text-xs text-muted-foreground">{field.help}</p>}
              </div>
            );
          })}

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {saveMutation.isPending ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setDraft(null)}
              className="rounded-md border border-border px-4 py-2 text-sm font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => {
            const id = String(row["id"]);
            const image = imageKey ? row[imageKey] : null;
            return (
              <li
                key={id}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-3 shadow-card"
              >
                {typeof image === "string" && image ? (
                  <img src={image} alt="" className="h-16 w-24 rounded-md object-cover" />
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{String(row[titleKey] ?? "—")}</p>
                  {subtitleKey && (
                    <p className="truncate text-xs text-muted-foreground">
                      {String(row[subtitleKey] ?? "")}
                    </p>
                  )}
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    {row["published"] ? (
                      <Eye className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5" />
                    )}
                    {row["published"] ? "Live" : "Hidden"} · position {String(row["sort_order"])}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    aria-label="Edit"
                    onClick={() => {
                      setDraft({ ...row });
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="rounded-md border border-border p-2 hover:border-primary"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Delete"
                    onClick={() => {
                      if (window.confirm("Delete this item permanently?")) {
                        deleteMutation.mutate(id);
                      }
                    }}
                    className="rounded-md border border-border p-2 text-destructive hover:border-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
