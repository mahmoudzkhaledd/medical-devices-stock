import { siteConstants } from "@/constants/site-constants";
import { getPage } from "@/lib/utils";
import prisma from "@/prisma";

import DeviceTypesClient from "./_components/device-types-client";
import { Tags } from "lucide-react";
import { StatCard } from "@/components/general/stat-card";

export default async function DeviceTypesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; manufacturerId?: string }>;
}) {
  const resolvedParams = await searchParams;
  const pg = getPage(resolvedParams.page);
  const searchQuery = resolvedParams.q || "";
  const manufacturerId = resolvedParams.manufacturerId || "";

  // Build filter criteria
  const whereClause: any = {};
  if (searchQuery) {
    whereClause.name = {
      contains: searchQuery,
      mode: "insensitive" as const,
    };
  }
  if (manufacturerId && manufacturerId !== "all") {
    whereClause.manufacturerId = `${manufacturerId}`;
  }

  const [deviceTypes, totalCount, selectedManufacturer] = await Promise.all([
    prisma.deviceType.findMany({
      where: whereClause,
      include: {
        manufacturer: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (siteConstants.maxItemsPerPage ?? 10) * pg,
      take: siteConstants.maxItemsPerPage ?? 10,
    }),
    prisma.deviceType.count({ where: whereClause }),
    ...(manufacturerId
      ? [prisma.manufacturer.findUnique({ where: { id: manufacturerId } })]
      : []),
  ]);

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <div className="text-muted-foreground text-sm">
          Dashboard / Device Types
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Device Types</h1>
            <p className="text-muted-foreground text-sm">
              Organize hospital equipment by type to simplify inventory
              management and reporting.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Device Types" value={totalCount} icon={Tags} />
      </div>

      <DeviceTypesClient
        selectedManufacturer={selectedManufacturer ?? undefined}
        initialData={deviceTypes}
        totalCount={totalCount}
      />
    </div>
  );
}
