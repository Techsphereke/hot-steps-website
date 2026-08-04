import type { ReactNode } from "react";

import type { SiteContent } from "@/lib/content.server";
import { findBlock } from "@/lib/live";

type Props = {
  blocks: SiteContent["blocks"];
  page: string;
  section: string;
  className?: string;
  headingClassName?: string;
  children: ReactNode;
};

/**
 * Renders an admin-edited page section when one exists, otherwise the
 * original built-in copy passed as children.
 */
export function Block({
  blocks,
  page,
  section,
  className = "space-y-4 text-base/7 text-muted-foreground",
  headingClassName,
  children,
}: Props) {
  const block = findBlock(blocks, page, section);
  if (!block) return <>{children}</>;

  return (
    <>
      {block.heading && headingClassName ? (
        <h2 className={headingClassName}>{block.heading}</h2>
      ) : null}
      <div
        className={`prose-site ${className}`}
        dangerouslySetInnerHTML={{ __html: block.body_html }}
      />
    </>
  );
}
