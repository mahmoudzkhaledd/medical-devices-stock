import { siteConstants } from "@/constants/site-constants";
import { getPage } from "@/lib/utils";
import prisma from "@/prisma";
import React from "react";
import DeviceModelsClient from "./_components/device-models-client";
import { StatCard } from "@/components/general/stat-card";
import { Layers, Factory, Tags } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DeviceModelsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    typeId?: string;
    manufacturerId?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const pg = getPage(resolvedParams.page);
  const searchQuery = resolvedParams.q || "";
  const selectedTypeId = resolvedParams.typeId || "all";
  const selectedManufacturerId = resolvedParams.manufacturerId || "all";

  // Build filter criteria for Prisma query
  const whereClause: any = {};
  if (searchQuery) {
    whereClause.name = {
      contains: searchQuery,
      mode: "insensitive" as const,
    };
  }
  if (selectedTypeId && selectedTypeId !== "all") {
    whereClause.typeId = selectedTypeId;
  }
  if (selectedManufacturerId && selectedManufacturerId !== "all") {
    whereClause.manufacturerId = selectedManufacturerId;
  }

  const [models, totalCount, selectedManufacturer, selectedType] =
    await Promise.all([
      prisma.deviceModel.findMany({
        where: whereClause,
        include: {
          manufacturer: true,
          type: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (siteConstants.maxItemsPerPage ?? 10) * pg,
        take: siteConstants.maxItemsPerPage ?? 10,
      }),
      prisma.deviceModel.count(),

      prisma.manufacturer.findUnique({
        where: { id: selectedManufacturerId },
      }),
      prisma.deviceType.findUnique({
        where: { id: selectedTypeId },
      }),
    ]);

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <div className="text-muted-foreground text-sm">
          Dashboard / Device Models
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Device Models</h1>
            <p className="text-muted-foreground text-sm">
              Manage equipment models, manufacturers, and device types across
              your hospital.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Models" value={totalCount} icon={Layers} />
      </div>

      <DeviceModelsClient
        initialData={models}
        selectedManufacturer={selectedManufacturer ?? undefined}
        selectedType={selectedType ?? undefined}
      />
    </div>
  );
}
