"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { getDeviceColumns } from "./device-columns";
import { DeviceFilterSheet } from "./device-filter-sheet"; // Import the separated component
import { Button } from "@/components/ui/button";
import { Plus, Download, RefreshCw, X } from "lucide-react";
import { DataTable } from "@/components/general/data-table";
import {
  Department,
  DeviceModel,
  DeviceType,
  Manufacturer,
  Supplier,
} from "@/prisma/generated/client";

interface DevicesClientProps {
  initialData: any[];
  selectedManufacturer?: Manufacturer;
  selectedType?: DeviceType;
  selectedModel?: DeviceModel;
  selectedDepartment?: Department;
  selectedSupplier?: Supplier;
}

export default function DevicesClient({
  initialData,
  selectedManufacturer,
  selectedType,
  selectedModel,
  selectedDepartment,
  selectedSupplier,
}: DevicesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleExportCsv = async () => {};

  const columns = getDeviceColumns();

  return (
    <div className="flex flex-col gap-4">
      {/* Top Action Toolbar */}
      <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        {/* Left Toolbar Group: Sheet Trigger & Clear Button */}
        <DeviceFilterSheet
          selectedType={selectedType}
          selectedModel={selectedModel}
          selectedManufacturer={selectedManufacturer}
          selectedDepartment={selectedDepartment}
          selectedSupplier={selectedSupplier}
        />
        {/* Right Actions: Refresh, Export CSV, Add New Device */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            title="Refresh Data"
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>

          <Button variant="outline" onClick={handleExportCsv} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>

          <Button asChild className="gap-2">
            <Link href="/dashboard/devices/new">
              <Plus className="h-4 w-4" />
              Add New Device
            </Link>
          </Button>
        </div>
      </div>
      <DataTable
        data={initialData}
        columns={columns}
        getRowId={(row) => row.id}
        onChangePage={(newPage) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("page", newPage.toString());
          router.push(`?${params.toString()}`);
        }}
      />
    </div>
  );
}
