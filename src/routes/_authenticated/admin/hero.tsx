import { createFileRoute } from "@tanstack/react-router";
import { CollectionManager } from "@/components/admin/CollectionManager";

export const Route = createFileRoute("/_authenticated/admin/hero")({
  component: () => (
    <CollectionManager
      table="hero_slides"
      title="Hero slider"
      description="Banners that rotate at the top of the home page."
      titleKey="title"
      subtitleKey="subtitle"
      fields={[
        { name: "title", label: "Title", kind: "text", required: true },
        { name: "subtitle", label: "Subtitle", kind: "text" },
        { name: "image", label: "Banner image", kind: "image" },
        { name: "link", label: "Links to (e.g. /properties/eden-ridge)", kind: "text" },
        { name: "banner", label: "Ready-made banner (text already on the image)", kind: "boolean" },
        { name: "sort_order", label: "Position", kind: "number" },
        { name: "published", label: "Show on the website", kind: "boolean" },
      ]}
    />
  ),
});
