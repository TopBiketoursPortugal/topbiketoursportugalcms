import { z } from 'astro:content';

const addressSchema = z.object({
  street: z.string(),
  number: z.string().optional(),
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
  phone: z.string().optional(),
  cellPhone: z.string().optional(),

  // phone: z.string().regex(phoneRegex, "Invalid Number!").optional(),
  // cellPhone: z.string().regex(phoneRegex, "Invalid Number!").optional(),
  email: z.string().email().optional()
});

export type ContactSchema = z.infer<typeof contactSchema>;
export type AddressSchema = z.infer<typeof addressSchema>;
