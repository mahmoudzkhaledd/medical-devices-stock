import { z } from "zod";

export const deviceTypeSchema = z.object({
  id: z.string().optional(),
  manufacturerId: z
    .string("Please enter the manufacturer.")
    .min(1, "Please enter the manufacturer."),
  name: z
    .string()
    .min(1, { message: "Device type name is required" })
    .max(100, { message: "Device type name must be less than 100 characters" }),
});

export type DeviceTypeFormValues = z.infer<typeof deviceTypeSchema>;
