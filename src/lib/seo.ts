/** Build an absolute URL for social preview tags (crawlers reject relative og:image). */
export function absoluteUrl(origin: string | undefined, path: string | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  if (!origin) return null;
  return `${origin.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

/** og:image + twitter:image meta entries, omitted entirely when no absolute URL is available. */
export function previewImageMeta(origin: string | undefined, path: string | undefined) {
  const url = absoluteUrl(origin, path);
  if (!url) return [];
  return [
    { property: "og:image", content: url },
    { name: "twitter:image", content: url },
  ];
}
