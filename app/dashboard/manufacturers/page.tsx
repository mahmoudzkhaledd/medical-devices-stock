import { siteConstants } from "@/constants/site-constants";
import { getPage } from "@/lib/utils";
import prisma from "@/prisma";
import React from "react";
import ManufacturersClient from "./_components/manufacturers-client";
import { Factory, Layers, Package, Building2, Search } from "lucide-react";
import { StatCard } from "@/components/general/stat-card";

export const dynamic = "force-dynamic";

export default async function ManufacturersPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    type?: string;
    mode?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const pg = getPage(resolvedParams.page);
  const searchQuery = resolvedParams.q || "";

  const whereClause: any = {};
  if (searchQuery) {
    whereClause.name = {
      contains: searchQuery,
      mode: "insensitive" as const,
    };
  }

  const [manufacturers, totalCount] = await Promise.all([
    prisma.manufacturer.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip: (siteConstants.maxItemsPerPage ?? 10) * pg,
      take: siteConstants.maxItemsPerPage ?? 10,
    }),
    prisma.manufacturer.count(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <div className="text-muted-foreground text-sm">
          Dashboard / Manufacturers
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Manufacturers</h1>
            <p className="text-muted-foreground text-sm">
              Manage medical equipment manufacturers and explore their equipment
              models across your hospital.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Manufacturers"
          value={totalCount}
          icon={Factory}
        />
      </div>

      {/* Client Table and Toolbar */}
      <ManufacturersClient
        initialData={manufacturers}
        totalCount={totalCount}
      />
    </div>
  );
}
