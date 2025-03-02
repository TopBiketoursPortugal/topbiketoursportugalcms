import { defineCollection, z } from 'astro:content';
import { seoSchema } from './seo';

const teamMemberSchema = z.object({
  id: z.string().uuid(),
  language: z.enum(['en', 'pt']),
  title: z.string(),
  subTitle: z.string().optional(),
  slug: z.string().optional().nullable(),
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
  schema: teamMemberSchema
});
