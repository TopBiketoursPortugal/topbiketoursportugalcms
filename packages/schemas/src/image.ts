import { z } from 'astro/zod';

/** `{ src, alt }` — the shape every image field in the content uses. */
export const imageSchema = z.object({
  src: z.string(),
  alt: z.string()
});

export type ImageSchema = z.infer<typeof imageSchema>;
