import { defineCollection } from 'astro:content';
import type { z } from 'astro/zod';
import { createTeamMemberSchema, teamCollection as shared } from '@ttp/schemas';

import { languageSchema } from './language';

export type TeamMemberSchema = z.infer<
  ReturnType<typeof createTeamMemberSchema<typeof languageSchema>>
>;

export const teamCollection = defineCollection(shared({ languageSchema }));
