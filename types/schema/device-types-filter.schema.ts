import { z } from "zod";

export const deviceTypesFilterSchema = z.object({
  search: z.string().optional(),
  manufacturerId: z.string().default("all"),
});

export type DeviceTypesFilterFormValues = z.infer<
  typeof deviceTypesFilterSchema
>;
