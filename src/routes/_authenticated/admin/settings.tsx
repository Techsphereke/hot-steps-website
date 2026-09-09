import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { browserAdminGetSettings, browserAdminSaveSettings } from "@/lib/admin-data";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: browserAdminGetSettings,
  });
  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) {
      const next: Record<string, string> = {};
      for (const row of data) next[row.key] = row.value;
      setValues(next);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: () =>
      browserAdminSaveSettings(Object.entries(values).map(([key, value]) => ({ key, value }))),
    onSuccess: async () => {
      setSaved(true);
      await queryClient.invalidateQueries({ queryKey: ["site-content"] });
    },
  });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold">Site settings</h1>
      <p className="text-sm text-muted-foreground">
        Contact details, taglines and SEO wording used across the website.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSaved(false);
          mutation.mutate();
        }}
        className="mt-6 space-y-4"
      >
        {(data ?? []).map((row) => {
          const long = row.value.length > 80;
          return (
            <div key={row.key}>
              <label htmlFor={row.key} className="mb-1 block text-sm font-medium">
                {row.label || row.key}
              </label>
              {long ? (
                <textarea
                  id={row.key}
                  rows={3}
                  value={values[row.key] ?? ""}
                  onChange={(e) => setValues({ ...values, [row.key]: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
              ) : (
                <input
                  id={row.key}
                  type="text"
                  value={values[row.key] ?? ""}
                  onChange={(e) => setValues({ ...values, [row.key]: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
              )}
            </div>
          );
        })}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {mutation.isPending ? "Saving…" : "Save settings"}
          </button>
          {saved && <span className="text-sm text-primary-dark">Saved.</span>}
          {mutation.error && (
            <span className="text-sm text-destructive">{(mutation.error as Error).message}</span>
          )}
        </div>
      </form>
    </div>
  );
}
