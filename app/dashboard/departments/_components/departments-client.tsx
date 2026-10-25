"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, RefreshCw, X, Building2 } from "lucide-react";
import { DepartmentDialog } from "../../../../components/dialogs/department-dialog";

import { Department } from "@/prisma/generated/client";
import { DepartmentCard } from "./department-card";

interface DepartmentsClientProps {
  initialData: Department[];
}

export default function DepartmentsClient({
  initialData,
}: DepartmentsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") || "";

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null,
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <form className="flex flex-1 flex-col gap-2 lg:flex-row lg:items-center">
          <Input
            name="q"
            placeholder="Search departments by name..."
            defaultValue={q}
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
            title="Refresh Departments"
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>

          <Button onClick={() => setIsAddOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Department
          </Button>
        </div>
      </div>

      {/* Department Cards Grid */}
      {initialData.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {initialData.map((dept) => (
            <DepartmentCard
              key={dept.id}
              department={dept}
              onEdit={setEditingDepartment}
            />
          ))}
        </div>
      ) : (
        <div className="bg-card flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
          <div className="bg-muted text-muted-foreground mb-3 rounded-full p-4">
            <Building2 className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold">No departments found</h3>
          <p className="text-muted-foreground mt-1 max-w-sm text-sm">
            {q
              ? `No departments match your search "${q}". Try clearing your filter.`
              : "Get started by adding your hospital departments to organize medical equipment."}
          </p>
          <Button onClick={() => setIsAddOpen(true)} className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            Add Department
          </Button>
        </div>
      )}

      <DepartmentDialog open={isAddOpen} onOpenChange={setIsAddOpen} />

      {editingDepartment && (
        <DepartmentDialog
          department={editingDepartment}
          open={!!editingDepartment}
          onOpenChange={(open) => !open && setEditingDepartment(null)}
        />
      )}
    </div>
  );
}
