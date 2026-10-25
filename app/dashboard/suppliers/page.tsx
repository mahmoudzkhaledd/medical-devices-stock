import { siteConstants } from "@/constants/site-constants";
import { getPage } from "@/lib/utils";
import prisma from "@/prisma";
import { Truck, Stethoscope, Search } from "lucide-react";
import SuppliersClient from "./_components/suppliers-client";
import AppPagination from "@/components/general/app-pagination";
import { StatCard } from "@/components/general/stat-card";

export default async function SupplierPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const pg = getPage(resolvedParams.page);
  const searchQuery = resolvedParams.q || "";

  const whereClause: any = searchQuery
    ? {
        name: {
          contains: searchQuery,
          mode: "insensitive" as const,
        },
        deletedAt: null,
      }
    : { deletedAt: null };

  const [suppliers, totalCount] = await Promise.all([
    prisma.supplier.findMany({
      where: whereClause,

      orderBy: { createdAt: "desc" },
      skip: (siteConstants.maxItemsPerPage ?? 10) * pg,
      take: siteConstants.maxItemsPerPage ?? 10,
    }),
    prisma.supplier.count(),
  ]);

  return (
    <div className="flex flex-col gap-6" dir="ltr">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <div className="text-muted-foreground text-sm">
          Dashboard / Suppliers
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Supplier Management
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage medical equipment suppliers and monitor registered hospital
              devices.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Suppliers" value={totalCount} icon={Truck} />
      </div>
      {/* Main Content & Table Client Wrapper */}
      <SuppliersClient initialData={suppliers} totalCount={totalCount} />
    </div>
  );
}
