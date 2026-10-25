import { z } from "zod";

export const supplierSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1, { message: "Supplier name is required" })
    .max(100, { message: "Supplier name must be less than 100 characters" }),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;
