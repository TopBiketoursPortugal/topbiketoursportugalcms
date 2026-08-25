/**
 * Single shared lookup from a CMS image path (`/src/assets/images/x.jpg`) to
 * the `ImageMetadata` Astro needs to optimize it.
 *
 * The glob is **eager on purpose**, and it is the only one in the codebase.
 * Both halves of that matter:
 *
 * - *Only one.* Nine components each ran their own copy of this glob, which is
 *   what produced ~900 `INEFFECTIVE_DYNAMIC_IMPORT` warnings: the same images
 *   were pulled in statically there and dynamically here, so Vite could not
 *   split them either way. One shared module removes the duplication.
 *
 * - *Eager.* A lazy glob emits one JS chunk per image — ~940 of them here, on
 *   top of the ~3000 content chunks. Astro's `Rearranging server assets` step
 *   is still writing those when prerendering starts reading them, and the
 *   build dies with `ERR_MODULE_NOT_FOUND` on a random chunk (the file lands
 *   on disk seconds *after* the import that failed to find it). Fewer chunks,
 *   narrower window. It also sidesteps the warning by construction: nothing
 *   imports these dynamically any more, so there is no dynamic/static clash
 *   left to report.
 *
 * The cost is only metadata — `{ src, width, height, format }` per image, not
 * pixels — so this bundles cheaply.
 */
const images = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/**/*.{jpeg,jpg,png,gif,avif,svg,webp}',
  { eager: true }
);

/**
 * Kept `async` and returning the module shape so every existing
 * `await getImageByPath(x)` call site is unaffected by the eager switch.
 */
export async function getImageByPath(imageSrc: string): Promise<{
  default: ImageMetadata;
}> {
  const image = images[imageSrc];
  if (!image)
    throw new Error(
      `"${imageSrc}" does not exist in glob: "/src/assets/**/*.{jpeg,jpg,png,gif,avif,svg,webp}"`
    );

  return image;
}

/**
 * Resolves a `/src/assets/...` path to its `ImageMetadata`, falling back to the
 * raw string when the path is not a local asset at all (an external URL, a
 * `public/` path) or is empty.
 *
 * The membership test is deliberately separate from the lookup: a path the
 * glob does not know is a caller passing a non-asset, which the raw string
 * handles correctly, but a path it *does* know that fails to resolve is a
 * broken build. Treating both alike returned the source path to `<Image>`,
 * which reads a string as a remote image and fails with the far less obvious
 * `MissingImageDimension` several frames from the real cause.
 */
export function resolveImageSrc(
  imageSrc: string | null | undefined
): ImageMetadata | string | undefined {
  if (!imageSrc) return imageSrc ?? undefined;

  return images[imageSrc]?.default ?? imageSrc;
}
