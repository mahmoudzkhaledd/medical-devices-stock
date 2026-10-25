"use server";

import { withAuth } from "@/lib/with-auth";
import prisma from "@/prisma";
import { deviceTypeSchema } from "@/types/schema/deviceType.schema";
import { revalidatePath } from "next/cache";

export const addDeviceTypeAction = withAuth(
  deviceTypeSchema,
  async ({ session, input }) => {
    const tmpType = await prisma.deviceType.findUnique({
      where: {
        name: input.name,
      },
    });
    if (tmpType && tmpType.id != input.id) {
      throw new Error("Another device type with the same name already exists.");
    }
    const tmpManu = await prisma.manufacturer.findUnique({
      where: {
        id: input.manufacturerId,
      },
    });
    if (!tmpManu) {
      throw new Error("Manufacturer not exist, please select another one.");
    }
    const type = await prisma.deviceType.upsert({
      where: {
        id: input.id ?? "any",
      },
      create: {
        name: input.name,
        manufacturer: {
          connect: { id: tmpManu.id },
        },
      },
      update: {
        name: input.name,
        manufacturer: {
          connect: { id: tmpManu.id },
        },
      },
    });
    revalidatePath("/dashboard/device-types");
    return type;
  },
);
