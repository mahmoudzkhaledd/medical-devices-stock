"use server";

import { withAuth } from "@/lib/with-auth";
import prisma from "@/prisma";
import { manufacturerSchema } from "@/types/schema/manufacturer.schema";
import { revalidatePath } from "next/cache";

export const createManufacturerAction = withAuth(
  manufacturerSchema,
  async ({ session, input }) => {
    const tmp = await prisma.manufacturer.findUnique({
      where: { name: input.name },
    });
    if (tmp) {
      throw new Error(
        "Manufacturer with the same name exist, plesae change the name and try again.",
      );
    }
    const manufacturer = await prisma.manufacturer.upsert({
      where: {
        id: input.id ?? "anything",
      },
      create: {
        name: input.name,
        notes: input.notes,
      },
      update: {
        name: input.name,
        notes: input.notes,
      },
    });
    revalidatePath("/dashboard/manufacturers");
    return manufacturer;
  },
);
