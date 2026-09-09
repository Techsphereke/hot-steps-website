import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { browserAdminUploadMedia } from "@/lib/admin-data";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
};

export function MediaUploader({ value, onChange, label = "Image" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    if (file.size > 8 * 1024 * 1024) {
      setError("Please choose an image under 8 MB.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const result = await browserAdminUploadMedia(file);
      onChange(result.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }


  return (
    <div>
      <span className="mb-1 block text-sm font-medium">{label}</span>

      {value ? (
        <div className="relative mb-2 overflow-hidden rounded-md border border-border">
          <img src={value} alt="" className="h-36 w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Remove image"
            className="absolute right-2 top-2 rounded-full bg-background/90 p-1 shadow"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs font-semibold disabled:opacity-60"
        >
          <Upload className="h-3.5 w-3.5" />
          {busy ? "Uploading…" : "Upload image"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
            e.target.value = "";
          }}
        />
        <input
          type="text"
          value={value}
          placeholder="…or paste an image URL"
          onChange={(e) => onChange(e.target.value)}
          className="min-w-[200px] flex-1 rounded-md border border-border bg-background px-3 py-2 text-xs"
        />
      </div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
