import { z } from "zod";

export const createDeviceSchema = z
  .object({
    supplierId: z.string().min(1, { message: "Supplier is required" }),
    departmentId: z.string().min(1, { message: "Department is required" }),
    manufacturerId: z.string().min(1, { message: "Manufacturer is required" }),
    typeId: z.string().min(1, { message: "Device type is required" }),
    modelId: z.string().min(1, { message: "Device model is required" }),
    deviceCount: z
      .number()
      .min(1, { message: "At least 1 device is required" }),
    isSerializable: z.boolean(),
    devices: z.array(
      z.object({
        id: z.string(),
        serialNumber: z.string(),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    if (data.isSerializable) {
      if (data.deviceCount > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Maximum 100 devices allowed per batch for serialized items.",
          path: ["deviceCount"],
        });
      }
      if (data.devices.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "At least one device entry is required for serialized models.",
          path: ["devices"],
        });
      }
      data.devices.forEach((device, index) => {
        if (!device.serialNumber || device.serialNumber.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Serial number is required",
            path: ["devices", index, "serialNumber"],
          });
        }
      });
    } else {
      if (data.devices.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Devices list must be empty for non-serialized models",
          path: ["devices"],
        });
      }
    }
  });

export type CreateDeviceFormValues = z.infer<typeof createDeviceSchema>;
