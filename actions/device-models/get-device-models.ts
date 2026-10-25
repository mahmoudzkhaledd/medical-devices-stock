"use server";

import { siteConstants } from "@/constants/site-constants";
import { withAuth } from "@/lib/with-auth";
import prisma from "@/prisma";
import z from "zod";

const schema = z.object({
  manufacturerId: z.string().optional(),
  typeId: z.string().optional(),
  search: z.string().optional(),
  page: z.number().int().optional().default(0),
});
// .refine((data) => !!data.manufacturerId?.trim() || !!data.typeId?.trim(), {
//   message: "Either manufacturer or device type is required.",
//   path: ["manufacturerId"],
// });

export const getDeviceModelsAction = withAuth(
  schema,
  async ({ session, input }) => {
    const whereClause: any = {
      typeId: undefined,
      manufacturerId: undefined,
    };
    if (input.manufacturerId && input.manufacturerId != "all") {
      whereClause.manufacturerId = input.manufacturerId;
    }
    if (input.typeId && input.typeId != "all") {
      whereClause.typeId = input.typeId;
    }
    if (input.search) {
      whereClause.name = {
        contains: input.search,
        mode: "insensitive",
      };
    }
    console.log(whereClause);
    const models = await prisma.deviceModel.findMany({
      where: whereClause,
      skip: input.page * siteConstants.maxItemsPerPage,
      take: siteConstants.maxItemsPerPage,
      include: {
        manufacturer: true,
        type: true,
      },
    });
    return models;
  },
);
