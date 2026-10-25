import { z } from "zod";

export const deviceModelSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1, { message: "Model name is required" })
    .max(100, { message: "Model name must be less than 100 characters" }),
  manufacturerId: z.string().min(1, { message: "Manufacturer is required" }),
  typeId: z.string().min(1, { message: "Device type is required" }),
  trackingMode: z.enum(["SERIALIZED", "QUANTITY"], {
    message: "Tracking mode is required",
  }),
});

export type DeviceModelFormValues = z.infer<typeof deviceModelSchema>;
