import { z } from 'astro/zod';

const addressSchema = z.object({
  street: z.string(),
  number: z.number().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  complement: z.string().optional(),
  map: z.string().optional()
});

// Define the schema for the overall structure
export const contactSchema = z.object({
  address: addressSchema.optional().nullable(),
  phone: z.string().optional().nullable(),
  cellPhone: z.string().optional().nullable(),

  // phone: z.string().regex(phoneRegex, "Invalid Number!").optional(),
  // cellPhone: z.string().regex(phoneRegex, "Invalid Number!").optional(),
  email: z.string().email().optional()
});

export type ContactSchema = z.infer<typeof contactSchema>;
export type AddressSchema = z.infer<typeof addressSchema>;
