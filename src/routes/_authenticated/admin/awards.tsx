import { createFileRoute } from "@tanstack/react-router";
import { CollectionManager } from "@/components/admin/CollectionManager";

export const Route = createFileRoute("/_authenticated/admin/awards")({
  component: () => (
    <CollectionManager
      table="awards"
      title="Awards & recognition"
      description="Certificates and awards shown on the Awards & Titles page."
      fields={[
        { name: "title", label: "Award title", kind: "text", required: true },
        { name: "image", label: "Award image", kind: "image" },
        { name: "sort_order", label: "Position", kind: "number" },
        { name: "published", label: "Show on the website", kind: "boolean" },
      ]}
    />
  ),
});
