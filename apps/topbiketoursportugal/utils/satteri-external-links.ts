import type { HastPluginDefinition } from 'satteri';

import { isInternalDomain } from './domains';

/**
 * `target="_blank"` + `rel` on outbound links, for the Sätteri pipeline.
 *
 * This replaces `rehype-external-links`, which only runs under the unified
 * processor — the reason this config used to opt out of Sätteri entirely.
 * Sätteri exposes the same hast the rehype plugin operated on, so the rule
 * ports directly; only the traversal API differs.
 *
 * Matching mirrors what rehype-external-links did, which is *not* simply
 * "not one of our domains": a bare `/tours/` has no host to compare, and
 * `isInternalDomain` returns false for anything `new URL()` cannot parse. Left
 * at that, every relative link on the site — nearly all of them — would have
 * been sent to a new tab and marked nofollow. So an href has to be absolute
 * before it is considered outbound at all.
 */

/** A scheme (`https:`, `mailto:`) or protocol-relative `//host`. */
const ABSOLUTE = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

export function satteriExternalLinks(): HastPluginDefinition {
  return {
    name: 'astro-external-links',
    element: {
      filter: ['a'],
      visit(node, ctx) {
        const href = node.properties?.href;

        if (typeof href !== 'string') return;
        if (!ABSOLUTE.test(href)) return;
        if (isInternalDomain(href)) return;

        ctx.setProperty(node, 'target', '_blank');
        ctx.setProperty(node, 'rel', ['nofollow', 'noopener', 'noreferrer']);
      }
    }
  };
}
