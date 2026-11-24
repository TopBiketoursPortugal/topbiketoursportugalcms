import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { seoSchema } from './seo';
import { languageSchema } from './language';
import { publishedGlob } from 'src/schemas/published-glob';

const teamMemberSchema = z.object({
  id: z.string().uuid(),
  language: languageSchema,
  title: z.string(),
  memberType: z.string().optional(),
  path: z.string().optional().nullable(),
  content: z.string().optional(),
  image: z
    .object({
      src: z.string(),
      alt: z.string()
    })
    .optional(),
  order: z.number().optional(),
  enabled: z.boolean().optional(),
  template: z.string().optional().default('Layout.astro'),
  seo: seoSchema.optional()
});

export type TeamMemberSchema = z.infer<typeof teamMemberSchema>;

export const teamCollection = defineCollection({
  loader: publishedGlob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/team'
  }),
  schema: teamMemberSchema
});
