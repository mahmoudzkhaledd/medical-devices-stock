"use server";

import { siteConstants } from "@/constants/site-constants";
import { withAuth } from "@/lib/with-auth";
import prisma from "@/prisma";
import z from "zod";

const schema = z.object({
  search: z.string().optional(),
  page: z.number().int().optional().default(0),
});

export const getDeviceTypesAction = withAuth(
  schema,
  async ({ session, input }) => {
    console.log(input);
    const devicTypes = await prisma.deviceType.findMany({
      where: {
        name: {
          contains: input.search,
          mode: "insensitive",
        },
      },
      skip: input.page * siteConstants.maxItemsPerPage,
      take: siteConstants.maxItemsPerPage,
    });
    return devicTypes;
  },
);
