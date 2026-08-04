import { createFileRoute } from "@tanstack/react-router";
import { CollectionManager } from "@/components/admin/CollectionManager";

export const Route = createFileRoute("/_authenticated/admin/team")({
  component: () => (
    <CollectionManager
      table="team_members"
      title="Meet the team"
      description="Directors and staff shown on the About us page."
      titleKey="name"
      subtitleKey="role"
      fields={[
        { name: "name", label: "Full name", kind: "text", required: true },
        { name: "role", label: "Role / title", kind: "text", required: true },
        { name: "image", label: "Photo", kind: "image" },
        { name: "sort_order", label: "Position", kind: "number" },
        { name: "published", label: "Show on the website", kind: "boolean" },
      ]}
    />
  ),
});
