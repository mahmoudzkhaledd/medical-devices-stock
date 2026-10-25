"use server";

import { withAuth } from "@/lib/with-auth";
import prisma from "@/prisma";
import { deviceModelSchema } from "@/types/schema/device-model.schema";
import z from "zod";

export const createDeviceModelAction = withAuth(
  deviceModelSchema,
  async ({ session, input }) => {
    const { manufacturerId, name, trackingMode, typeId, id } = input;
    const tmpManu = await prisma.manufacturer.findUnique({
      where: { id: manufacturerId },
    });
    if (!tmpManu) {
      throw new Error("Selected manufacturer does not exist.");
    }

    const tmpType = await prisma.deviceType.findUnique({
      where: { id: typeId },
    });
    if (!tmpType) {
      throw new Error("Selected device type does not exist.");
    }
    const tmpModel = await prisma.deviceModel.findUnique({
      where: {
        manufacturerId_typeId_name: {
          manufacturerId,
          typeId,
          name,
        },
      },
    });
    if (tmpModel && tmpModel.id != input.id) {
      throw new Error(`Model with name ${tmpModel.name} already exists.`);
    }
    const model = await prisma.deviceModel.upsert({
      where: {
        id: id ?? "any",
      },
      create: {
        name,
        trackingMode,
        manufacturer: {
          connect: { id: manufacturerId },
        },
        type: {
          connect: { id: typeId },
        },
      },
      update: {
        name,
        trackingMode,
        manufacturer: {
          connect: { id: manufacturerId },
        },
        type: {
          connect: { id: typeId },
        },
      },
    });
    return model;
  },
);
