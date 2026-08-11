import { createClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@/integrations/supabase/types";

export type PropertyRow = Tables<"properties">;
export type SlideRow = Tables<"hero_slides">;
export type PostRow = Tables<"posts">;
export type AwardRow = Tables<"awards">;
export type TeamRow = Tables<"team_members">;
export type BlockRow = Tables<"page_blocks">;

export type SiteContent = {
  properties: PropertyRow[];
  slides: SlideRow[];
  posts: PostRow[];
  awards: AwardRow[];
  team: TeamRow[];
  blocks: BlockRow[];
  settings: Record<string, string>;
};

function publicClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Backend is not configured");

  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

const EMPTY_CONTENT: SiteContent = {
  properties: [],
  slides: [],
  posts: [],
  awards: [],
  team: [],
  blocks: [],
  settings: {},
};

// Short-lived in-memory cache: content changes rarely, so repeat page views
// (and the many routes rendered per crawl) reuse one round trip.
const CACHE_TTL_MS = 60_000;
let cache: { content: SiteContent; at: number } | undefined;

export async function loadSiteContent(): Promise<SiteContent> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.content;

  try {
    const db = publicClient();

    const [properties, slides, posts, awards, team, blocks, settings] = await Promise.all([
      db.from("properties").select("*").eq("published", true).order("sort_order"),
      db.from("hero_slides").select("*").eq("published", true).order("sort_order"),
      db.from("posts").select("*").eq("published", true).order("sort_order"),
      db.from("awards").select("*").eq("published", true).order("sort_order"),
      db.from("team_members").select("*").eq("published", true).order("sort_order"),
      db.from("page_blocks").select("*").eq("published", true).order("sort_order"),
      db.from("site_settings").select("key, value"),
    ]);

    const settingsMap: Record<string, string> = {};
    for (const row of settings.data ?? []) settingsMap[row.key] = row.value;

    const content: SiteContent = {
      properties: properties.data ?? [],
      slides: slides.data ?? [],
      posts: posts.data ?? [],
      awards: awards.data ?? [],
      team: team.data ?? [],
      blocks: blocks.data ?? [],
      settings: settingsMap,
    };

    cache = { content, at: Date.now() };
    return content;
  } catch (error) {
    // A backend hiccup must never take the public site down: fall back to the
    // last good payload, or to the bundled static content downstream.
    console.error(error);
    return cache?.content ?? EMPTY_CONTENT;
  }
}

export function clearSiteContentCache() {
  cache = undefined;
}

