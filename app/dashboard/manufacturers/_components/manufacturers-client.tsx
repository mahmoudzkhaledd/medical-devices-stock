"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTable } from "@/components/general/data-table";
import { getManufacturerColumns } from "./manufacturer-columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, RefreshCw, X } from "lucide-react";
import { ManufacturerDialog } from "../../../../components/dialogs/manufacturer-dialog";

interface ManufacturersClientProps {
  initialData: any[];
  totalCount: number;
}

export default function ManufacturersClient({
  initialData,
}: ManufacturersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery({ q: search });
  };

  const updateQuery = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.set("page", "0");
    router.push(`?${params.toString()}`);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const columns = getManufacturerColumns();

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col items-stretch justify-between gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-1 flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <form
            onSubmit={handleSearch}
            className="flex flex-1 flex-col gap-2 lg:flex-row lg:items-center"
          >
            <Input
              placeholder="Search manufacturer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit" variant="secondary">
              Search
            </Button>
          </form>
        </div>

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

          <Button onClick={() => setIsAddOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Manufacturer
          </Button>
        </div>
      </div>

      {/* DataTable Container */}
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

      {/* Add Manufacturer Dialog */}
      <ManufacturerDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
    </div>
  );
}
