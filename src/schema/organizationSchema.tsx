import { z } from "zod";

export const organizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Organization name must be at least 3 characters.")
    .max(100, "Organization name cannot exceed 100 characters."),

  primaryColor: z
    .string()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Enter a valid hex color."
    ),

  secondaryColor: z
    .string()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Enter a valid hex color."
    ),
});

export type OrganizationForm = z.infer<
  typeof organizationSchema
>;