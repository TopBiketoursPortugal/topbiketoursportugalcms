const images = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/**/*.{jpeg,jpg,png,gif,avif,svg,webp}'
);

const imageCache = new Map<string, Promise<{ default: ImageMetadata }>>();

export function getImageByPath(imageSrc: string): Promise<{
  default: ImageMetadata;
}> {
  const image = images[imageSrc];
  if (!image)
    throw new Error(
      `"${imageSrc}" does not exist in glob: "/src/assets/**/*.{jpeg,jpg,png,gif,avif,svg,webp}"`
    );

  if (imageCache.has(imageSrc)) {
    return imageCache.get(imageSrc)!;
  }

  const promise = image();
  imageCache.set(imageSrc, promise);
  return promise;
}

/**
 * Resolves a `/src/assets/...` path to its optimized `ImageMetadata` via the
 * shared dynamic glob above, falling back to the raw string when the path is
 * not a local asset at all (an external URL, a `public/` path) or is empty.
 *
 * Prefer this over a component-local `import.meta.glob(..., { eager: true })`
 * — an eager glob statically bundles every image under `src/assets` into
 * that component's chunk, and doing it in several components at once made
 * Vite unable to split the same images out of the dynamic glob above
 * (INEFFECTIVE_DYNAMIC_IMPORT).
 *
 * The membership test is deliberately separate from the import: a path the
 * glob does not know is a caller passing a non-asset, which the raw string
 * handles correctly, but a path it *does* know that then fails to load is a
 * broken build. Catching both alike returned the source path to `<Image>`,
 * which treats a string as a remote image and fails with the far less
 * obvious `MissingImageDimension` several frames away from the real cause.
 */
export async function resolveImageSrc(
  imageSrc: string | null | undefined
): Promise<ImageMetadata | string | undefined> {
  if (!imageSrc) return imageSrc ?? undefined;
  if (!images[imageSrc]) return imageSrc;

  return (await getImageByPath(imageSrc)).default;
}
