import { z } from "zod";

export const manufacturerSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1, { message: "Manufacturer name is required" })
    .max(100, {
      message: "Manufacturer name must be less than 100 characters",
    }),

  notes: z
    .string()
    .max(500, { message: "Description must be less than 500 characters" })
    .optional()
    .or(z.literal("")),
});

export type ManufacturerFormValues = z.infer<typeof manufacturerSchema>;
