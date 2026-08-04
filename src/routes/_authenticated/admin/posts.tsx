import { createFileRoute } from "@tanstack/react-router";
import { CollectionManager } from "@/components/admin/CollectionManager";

export const Route = createFileRoute("/_authenticated/admin/posts")({
  component: () => (
    <CollectionManager
      table="posts"
      title="Blogs & news"
      description="Articles shown in the Information Center."
      titleKey="title"
      subtitleKey="excerpt"
      fields={[
        { name: "title", label: "Headline", kind: "text", required: true },
        { name: "slug", label: "URL slug", kind: "text", required: true },
        { name: "excerpt", label: "Short summary", kind: "textarea" },
        { name: "image", label: "Cover image", kind: "image" },
        { name: "body_html", label: "Article", kind: "rich" },
        { name: "sort_order", label: "Position", kind: "number" },
        { name: "published", label: "Show on the website", kind: "boolean" },
      ]}
    />
  ),
});
