"use server";

import { withAuth } from "@/lib/with-auth";
import prisma from "@/prisma";
import { departmentSchema } from "@/types/schema/department.schema";
import { revalidatePath } from "next/cache";

export const createDepartmentAction = withAuth(
  departmentSchema,
  async ({ session, input }) => {
    const tmpDepartment = await prisma.department.findUnique({
      where: {
        name: input.name,
      },
    });
    if (tmpDepartment) {
      throw new Error(
        "Another department with the same name already exists, please change the department name and try again.",
      );
    }
    const department = await prisma.department.upsert({
      where: {
        id: input.id ?? "",
      },
      create: {
        name: input.name,
      },

      update: {
        name: input.name,
      },
    });
    revalidatePath("/dashboard/departments");
    return department;
  },
);
