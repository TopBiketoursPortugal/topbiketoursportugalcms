import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { glob } from 'astro/loaders';
import type { Loader } from 'astro/loaders';

/**
 * The glob loader, minus entries whose frontmatter carries `draft: false`.
 *
 * A draft here is a translation stub: tools/mdx-clone.mjs drops one into each
 * sibling language folder (`pt/`, `de/`, …) whenever an English entry is
 * added, so an editor has
 * somewhere to write the translation instead of having to remember to create
 * the file. Until that happens the stub still holds English prose, and
 * publishing it would put English text on a translated URL and — since pages
 * and sitemap pair translations by filename — declare it the translation of
 * its own original.
 *
 * Dropping the entry here is what prevents that: it is then absent from every
 * getCollection call in the project, so it produces no route, appears in no
 * listing, and reaches neither the sitemap nor any hreflang set. Deleting the
 * `draft` line publishes it.
 *
 * The flag is read from the file rather than from `entry.data` because no
 * collection schema declares it — zod strips unknown keys, so by the time an
 * entry reaches the store the flag is gone. Keeping it out of the schemas also
 * keeps it uniform: it works the same for `pages`, whose schema is a union and
 * could not simply be extended. tools/seo/lib/routes.mjs applies the same rule
 * to the content tree it reads for the sitemap and redirect tooling.
 */
export function publishedGlob(options: Parameters<typeof glob>[0]): Loader {
  const source = glob(options);

  return {
    ...source,
    load: async (context) => {
      await source.load(context);

      for (const [id, entry] of context.store.entries()) {
        if (entry.filePath && isDraft(entry.filePath)) {
          context.store.delete(id);
          context.logger.info(`skipping draft ${entry.filePath}`);
        }
      }
    }
  };
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;
const DRAFT_LINE = /^draft:\s*true\s*$/m;

function isDraft(filePath: string): boolean {
  try {
    const source = readFileSync(join(process.cwd(), filePath), 'utf8');
    const frontmatter = FRONTMATTER.exec(source)?.[1];
    return frontmatter ? DRAFT_LINE.test(frontmatter) : false;
  } catch {
    // An unreadable file is the glob loader's problem to report, not ours;
    // treat it as published so nothing disappears silently.
    return false;
  }
}
