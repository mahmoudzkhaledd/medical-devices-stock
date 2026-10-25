import { siteConstants } from "@/constants/site-constants";
import { getPage } from "@/lib/utils";
import prisma from "@/prisma";
import React from "react";
import DepartmentsClient from "./_components/departments-client";

import { Building2, CheckCircle, FolderX } from "lucide-react";
import { StatCard } from "@/components/general/stat-card";
import AppPagination from "@/components/general/app-pagination";

export const dynamic = "force-dynamic";

export default async function DepartmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const pg = getPage(resolvedParams.page);
  const searchQuery = resolvedParams.q || "";

  // Build filter criteria
  const whereClause: any = {};
  if (searchQuery) {
    whereClause.name = {
      contains: searchQuery,
      mode: "insensitive" as const,
    };
  }

  const [departments, totalDepartmentsCount] = await Promise.all([
    prisma.department.findMany({
      where: whereClause,
      include: {
        devices: {
          where: { status: { not: "DISPOSED" } },
        },
        departmentStocks: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (siteConstants.maxItemsPerPage ?? 12) * pg,
      take: siteConstants.maxItemsPerPage ?? 12,
    }),
    prisma.department.count(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <div className="text-muted-foreground text-sm">
          Dashboard / Departments
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Departments</h1>
            <p className="text-muted-foreground text-sm">
              Manage hospital departments and organize medical equipment across
              your facility.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards (Department Counts Only) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Departments"
          value={totalDepartmentsCount}
          icon={Building2}
        />
      </div>

      {/* Client Component for Search Toolbar and Card Grid */}
      <DepartmentsClient initialData={departments} />
      <AppPagination
        length={departments.length}
        page={pg}
        totalItemsCount={totalDepartmentsCount}
      />
    </div>
  );
}
