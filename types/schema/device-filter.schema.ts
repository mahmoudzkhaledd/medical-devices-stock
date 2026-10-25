import { z } from "zod";

export const deviceFilterSchema = z.object({
  serialNumber: z.string().optional(),
  manufacturerId: z.string().default("all"),
  modelId: z.string().default("all"),
  typeId: z.string().default("all"),
  departmentId: z.string().default("all"),
  supplierId: z.string().default("all"),
});

export type DeviceFilterFormValues = z.infer<typeof deviceFilterSchema>;
