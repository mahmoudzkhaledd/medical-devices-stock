"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, RefreshCw } from "lucide-react";

import { DataTable } from "@/components/general/data-table";
import { getSupplierColumns } from "./supplier-columns";
import { AddSupplierDialog } from "../../../../components/dialogs/add-supplier-dialog";

interface SuppliersClientProps {
  initialData: any[];
  totalCount: number;
}

export default function SuppliersClient({
  initialData,
  totalCount,
}: SuppliersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search) {
      params.set("q", search);
    } else {
      params.delete("q");
    }
    params.set("page", "0");
    router.push(`?${params.toString()}`);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const columns = getSupplierColumns();

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <form
          onSubmit={handleSearch}
          className="flex flex-1 flex-col gap-2 lg:flex-row lg:items-center"
        >
          <Input
            placeholder="Search by supplier name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            title="Refresh data"
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>

          <Button onClick={() => setIsAddOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add new supplier
          </Button>
        </div>
      </div>

      {/* DataTable */}
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

      {/* Add Supplier Dialog */}
      <AddSupplierDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
    </div>
  );
}
