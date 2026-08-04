import { useSuspenseQuery } from "@tanstack/react-query";

import { siteContentQuery } from "@/lib/content.functions";
import type { SiteContent } from "@/lib/content.server";
import {
  properties as fallbackProperties,
  posts as fallbackPosts,
  awards as fallbackAwards,
  team as fallbackTeam,
  heroSlides as fallbackSlides,
  site as fallbackSite,
  type Property,
} from "@/data/site";

export type LiveSlide = {
  title: string;
  subtitle: string;
  image: string;
  to: string;
  banner: boolean;
};

export type LivePost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  html: string;
};

export type LiveProperty = Property & { lat?: number; lng?: number };

export type LiveContent = {
  properties: LiveProperty[];
  slides: LiveSlide[];
  posts: LivePost[];
  awards: { title: string; image: string }[];
  team: { name: string; role: string; image: string }[];
  blocks: SiteContent["blocks"];
  settings: {
    name: string;
    tagline: string;
    email: string;
    phones: string[];
    office: string;
    vision: string;
    mission: string;
  };
};

function paragraphsToHtml(paragraphs: string[]) {
  return paragraphs.map((p) => `<p>${p}</p>`).join("");
}

export function toLive(content: SiteContent | undefined): LiveContent {
  const s = content?.settings ?? {};
  const phones = s["phones"]
    ? s["phones"]
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean)
    : fallbackSite.phones;

  return {
    properties: content?.properties.length
      ? content.properties.map((p) => ({
          slug: p.slug,
          title: p.title,
          location: p.location,
          ...(p.price ? { price: p.price } : {}),
          image: p.image,
          status: (p.status === "Sold Out" ? "Sold Out" : "On Sale") as Property["status"],
          description: p.description,
          features: p.features ?? [],
          ...(typeof p.lat === "number" ? { lat: p.lat } : {}),
          ...(typeof p.lng === "number" ? { lng: p.lng } : {}),
        }))
      : fallbackProperties,
    slides: content?.slides.length
      ? content.slides.map((sl) => ({
          title: sl.title,
          subtitle: sl.subtitle,
          image: sl.image,
          to: sl.link ?? "/properties",
          banner: sl.banner,
        }))
      : fallbackSlides.map((sl) => ({ ...sl, banner: Boolean(sl.banner) })),
    posts: content?.posts.length
      ? content.posts.map((p) => ({
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          image: p.image,
          html: p.body_html,
        }))
      : fallbackPosts.map((p) => ({
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          image: p.image,
          html: paragraphsToHtml(p.body),
        })),
    awards: content?.awards.length ? content.awards : fallbackAwards,
    team: content?.team.length ? content.team : fallbackTeam,
    blocks: content?.blocks ?? [],
    settings: {
      name: s["name"] ?? fallbackSite.name,
      tagline: s["tagline"] ?? fallbackSite.tagline,
      email: s["email"] ?? fallbackSite.email,
      phones,
      office: s["office"] ?? fallbackSite.office,
      vision: s["vision"] ?? fallbackSite.vision,
      mission: s["mission"] ?? fallbackSite.mission,
    },
  };
}

/** Live, admin-editable content for the public website. */
export function useLive(): LiveContent {
  const { data } = useSuspenseQuery(siteContentQuery);
  return toLive(data);
}

export function findBlock(blocks: SiteContent["blocks"], page: string, sectionKey: string) {
  return blocks.find((b) => b.page === page && b.section_key === sectionKey);
}
