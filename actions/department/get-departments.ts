"use server";

import { siteConstants } from "@/constants/site-constants";
import { withAuth } from "@/lib/with-auth";
import prisma from "@/prisma";
import z from "zod";

const schema = z.object({
  search: z.string().optional(),
  page: z.number().int().optional().default(0),
});

export const getDepartmentsAction = withAuth(
  schema,
  async ({ session, input }) => {
    console.log(input);
    const deps = await prisma.department.findMany({
      where: {
        name: {
          contains: input.search,
          mode: "insensitive",
        },
      },
      skip: input.page * siteConstants.maxItemsPerPage,
      take: siteConstants.maxItemsPerPage,
    });
    return deps;
  },
);
