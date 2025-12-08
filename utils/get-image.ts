const images = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/**/*.{jpeg,jpg,png,gif,webp}'
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
