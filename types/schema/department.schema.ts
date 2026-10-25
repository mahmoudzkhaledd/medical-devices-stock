import { z } from "zod";

export const departmentSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1, { message: "Department name cannot be empty" })
    .max(100, { message: "Department name must be less than 100 characters" }),
});

export type DepartmentFormValues = z.infer<typeof departmentSchema>;
