import type { MarkdownHeading } from 'astro';
import { slugifyLabel } from 'src/components/utils/slugify';
import type { TocHeading } from 'src/types';

// Content blocks come from the `content_blocks` schema field (`z.array(z.any())`
// in content.config.ts), so their shape is only known at the few properties
// this function actually reads.
type ContentBlock = {
  _component?: string;
  sectionLabel?: string;
  heading?: string;
  title?: string;
};

/**
 * Table-of-contents entries for a page's content blocks.
 *
 * A block is listed when it has something to link to: CustomSection derives
 * the wrapper's `id` from `sectionLabel`, so a block with both a `heading`
 * and a `sectionLabel` has a visible title and a stable anchor. The route
 * profile block names itself with `title` and gives its h3 the slugified
 * title as id (see RouteProfile.astro), so it is listed from that instead.
 */
export function blockHeadings(
  blocks: ReadonlyArray<unknown> = []
): TocHeading[] {
  const out: TocHeading[] = [];
  for (const raw of blocks) {
    if (!raw || typeof raw !== 'object') continue;
    const block = raw as ContentBlock;
    if (block._component === 'page-sections/guide/table-of-contents') continue;
    const label = String(block.sectionLabel ?? '').trim();
    const heading = String(block.heading ?? '').trim();
    if (heading && label) {
      out.push({ depth: 2, slug: slugifyLabel(label), text: heading });
      continue;
    }
    const title = String(block.title ?? '').trim();
    if (title && block._component === 'page-sections/guide/route-profile') {
      out.push({ depth: 2, slug: slugifyLabel(title), text: title });
    }
  }
  return out;
}

/** Markdown headings of depth 2–3, in the TocHeading shape. */
export function markdownHeadings(
  headings: ReadonlyArray<MarkdownHeading> = []
): TocHeading[] {
  return headings
    .filter((h) => h.depth >= 2 && h.depth <= 3)
    .map(({ depth, slug, text }) => ({ depth, slug, text }));
}
