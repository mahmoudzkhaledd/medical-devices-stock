"use server";

import { withAuth } from "@/lib/with-auth";
import prisma from "@/prisma";
import { supplierSchema } from "@/types/schema/supplier.schema";
import { revalidatePath } from "next/cache";
import z from "zod";

export const createSupplierAction = withAuth(
  supplierSchema,
  async ({ session, input }) => {
    const tmpSupplier = await prisma.supplier.findUnique({
      where: {
        name: input.name,
      },
    });
    if (tmpSupplier && tmpSupplier.id != input.id) {
      throw new Error("Another supplier with the same name already exists.");
    }
    const supplier = await prisma.supplier.upsert({
      where: {
        id: input.id ?? "anything",
      },
      create: {
        name: input.name,
      },
      update: {
        name: input.name,
      },
    });
    revalidatePath("/dashboard/suppliers");
    return supplier;
  },
);
