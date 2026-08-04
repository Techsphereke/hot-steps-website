import { createFileRoute } from "@tanstack/react-router";
import { CollectionManager } from "@/components/admin/CollectionManager";

export const Route = createFileRoute("/_authenticated/admin/properties")({
  component: () => (
    <CollectionManager
      table="properties"
      title="Properties"
      description="Land and plots shown on the properties pages and the map explorer."
      titleKey="title"
      subtitleKey="location"
      fields={[
        { name: "title", label: "Property name", kind: "text", required: true },
        {
          name: "slug",
          label: "URL slug",
          kind: "text",
          required: true,
          help: "Lowercase words separated by hyphens, e.g. eden-ridge.",
        },
        { name: "location", label: "Location", kind: "text", required: true },
        { name: "price", label: "Price", kind: "text" },
        { name: "status", label: "Status", kind: "select", options: ["On Sale", "Sold Out"] },
        { name: "image", label: "Property image", kind: "image" },
        { name: "description", label: "Description", kind: "textarea" },
        { name: "features", label: "Features", kind: "list" },
        { name: "lat", label: "Map latitude", kind: "number" },
        { name: "lng", label: "Map longitude", kind: "number" },
        { name: "sort_order", label: "Position", kind: "number" },
        { name: "published", label: "Show on the website", kind: "boolean" },
      ]}
    />
  ),
});
