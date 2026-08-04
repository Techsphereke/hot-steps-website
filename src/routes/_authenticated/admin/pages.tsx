import { createFileRoute } from "@tanstack/react-router";
import { CollectionManager } from "@/components/admin/CollectionManager";

export const Route = createFileRoute("/_authenticated/admin/pages")({
  component: () => (
    <CollectionManager
      table="page_blocks"
      title="Page sections"
      description="Live-edit the wording of every static page and section: About us, Diaspora, Careers, Contact and the home page blocks."
      titleKey="label"
      subtitleKey="page"
      imageKey="image"
      fields={[
        { name: "label", label: "Section name (for your reference)", kind: "text", required: true },
        {
          name: "page",
          label: "Page",
          kind: "select",
          options: ["home", "about-us", "diaspora", "properties", "blogs", "awards-titles", "careers", "contact-us"],
        },
        {
          name: "section_key",
          label: "Section key",
          kind: "text",
          required: true,
          help: "Identifier used by the page, e.g. vision or ceo-message. Change with care.",
        },
        { name: "heading", label: "Heading", kind: "text" },
        { name: "body_html", label: "Content", kind: "rich" },
        { name: "image", label: "Section image", kind: "image" },
        { name: "sort_order", label: "Position", kind: "number" },
        { name: "published", label: "Show on the website", kind: "boolean" },
      ]}
    />
  ),
});
