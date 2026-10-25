"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTable } from "@/components/general/data-table";
import { getDeviceTypeColumns } from "./device-type-columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, RefreshCw, X } from "lucide-react";
import { DeviceTypeDialog } from "../../../../components/dialogs/device-type-dialog";
import { Manufacturer, Prisma } from "@/prisma/generated/client";

import DynamicSelector from "@/components/general/dynamic-selector";
import { getManufacturersAction } from "@/actions/manufacturers/getManufacturers";
interface DeviceTypesClientProps {
  initialData: Prisma.DeviceTypeGetPayload<{
    include: {
      manufacturer: true;
    };
  }>[];
  totalCount: number;
  selectedManufacturer?: Manufacturer;
}

export default function DeviceTypesClient({
  initialData,
  selectedManufacturer: sManufacturer,
}: DeviceTypesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const q = searchParams.get("q") || "";
  const [selectedManufacturer, setManufacturer] = useState<
    Manufacturer | undefined
  >(sManufacturer);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const columns = getDeviceTypeColumns();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <form className="flex flex-1 flex-col gap-2 lg:flex-row lg:items-center">
          <Input
            name="q"
            placeholder="Search device types by name..."
            defaultValue={q}
            className="flex-1"
          />

          <DynamicSelector<Manufacturer>
            title="Select Manufacturer"
            placeholder="Manufacturer"
            id="get-manufacturers"
            name="manufacturerId"
            selectedItem={selectedManufacturer}
            onChooseItem={(item) => setManufacturer(item)}
            dataExtractor={(item) => ({
              key: item.id,
              value: item.name,
            })}
            onFetchData={async (search, page) => {
              const res = await getManufacturersAction({ search, page });
              if (res.success) return res.data;
              return [];
            }}
            allOption={{
              key: "all",
              value: "All Manufacturers",
            }}
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
            title="Refresh Data"
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>

          <Button onClick={() => setIsAddOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Device Type
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

      <DeviceTypeDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
    </div>
  );
}
