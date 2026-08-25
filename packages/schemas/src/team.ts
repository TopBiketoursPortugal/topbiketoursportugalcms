import { z } from 'astro/zod';
import { imageSchema } from './image';
import type { LanguageSchemaLike } from './language';
import { publishedGlob } from './published-glob';
import { seoSchema } from './seo';

export function createTeamMemberSchema<L extends LanguageSchemaLike>(
  languageSchema: L
) {
  return z.object({
    id: z.string().uuid(),
    language: languageSchema,
    title: z.string(),
    memberType: z.string().optional(),
    path: z.string().optional().nullable(),
    content: z.string().optional(),
    image: imageSchema.optional(),
    order: z.number().optional(),
    enabled: z.boolean().optional(),
    template: z.string().optional().default('Layout.astro'),
    seo: seoSchema.optional()
  });
}

export function teamCollection<L extends LanguageSchemaLike>(options: {
  languageSchema: L;
  base?: string;
}) {
  return {
    loader: publishedGlob({
      pattern: '**/*.{md,mdx}',
      base: options.base ?? './src/content/team'
    }),
    schema: createTeamMemberSchema(options.languageSchema)
  };
}
