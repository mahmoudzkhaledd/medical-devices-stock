"use server";

import { withAuth } from "@/lib/with-auth";
import prisma from "@/prisma";
import { revalidatePath } from "next/cache";
import z from "zod";

const schema = z.object({
  id: z.string(),
});

export const deleteSupplierAction = withAuth(
  schema,
  async ({ session, input }) => {
    const supplier = await prisma.supplier.findUnique({
      where: {
        id: input.id,
      },
    });
    if (!supplier) {
      throw new Error("Supplier not found");
    }
    await prisma.supplier.update({
      where: {
        id: input.id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    revalidatePath("/dashboard/suppliers");
  },
);
