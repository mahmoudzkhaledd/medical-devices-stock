import { siteConstants } from "@/constants/site-constants";
import { getPage } from "@/lib/utils";
import prisma from "@/prisma";
import React from "react";
import DevicesClient from "./_components/devices-client";

import { Package, Layers, Building2 } from "lucide-react";
import { buildDeviceWhereClause } from "./_utils/build-device-where-clause";
import { StatCard } from "@/components/general/stat-card";

export const dynamic = "force-dynamic";

export default async function DevicesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    serialNumber?: string;
    manufacturerId?: string;
    modelId?: string;
    typeId?: string;
    departmentId?: string;
    supplierId?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const pg = getPage(resolvedParams.page);

  const serialNumber = resolvedParams.serialNumber;
  const manufacturerId = resolvedParams.manufacturerId;
  const modelId = resolvedParams.modelId;
  const typeId = resolvedParams.typeId;
  const departmentId = resolvedParams.departmentId;
  const supplierId = resolvedParams.supplierId;

  const where = buildDeviceWhereClause({
    serialNumber,
    manufacturerId,
    modelId,
    typeId,
    departmentId,
    supplierId,
  });

  const [
    totalDevicesCount,
    totalModelsCount,
    totalDepartmentsCount,
    devices,
    selectedManufacturer,
    selectedType,
    selectedDepartment,
    selectedModel,
    selectedSupplier,
  ] = await Promise.all([
    prisma.device.count(),
    prisma.deviceModel.count(),
    prisma.department.count(),
    /////////////////////////////
    prisma.device.findMany({
      where,
      include: {
        model: {
          include: {
            manufacturer: true,
            type: true,
          },
        },
        department: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (siteConstants.maxItemsPerPage ?? 10) * pg,
      take: siteConstants.maxItemsPerPage ?? 10,
    }),

    prisma.manufacturer.findUnique({
      where: { id: manufacturerId ?? "any" },
    }),
    prisma.deviceType.findUnique({
      where: { id: typeId ?? "any" },
    }),
    prisma.department.findUnique({
      where: { id: departmentId ?? "any" },
    }),
    prisma.deviceModel.findUnique({
      where: { id: modelId ?? "any" },
    }),
    prisma.supplier.findUnique({
      where: { id: supplierId ?? "any" },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <div className="text-muted-foreground text-sm">Dashboard / Devices</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Devices</h1>
            <p className="text-muted-foreground text-sm">
              Manage medical equipment, track device assignments, and find
              equipment across hospital departments.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards (Independent of filters) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Devices"
          value={totalDevicesCount}
          icon={Package}
        />
        <StatCard
          title="Device Models"
          value={totalModelsCount}
          icon={Layers}
        />
        <StatCard
          title="Departments"
          value={totalDepartmentsCount}
          icon={Building2}
        />
      </div>

      {/* Client Filter Toolbar & DataTable */}
      <DevicesClient
        initialData={devices}
        selectedDepartment={selectedDepartment ?? undefined}
        selectedManufacturer={selectedManufacturer ?? undefined}
        selectedModel={selectedModel ?? undefined}
        selectedType={selectedType ?? undefined}
        selectedSupplier={selectedSupplier ?? undefined}
      />
    </div>
  );
}
