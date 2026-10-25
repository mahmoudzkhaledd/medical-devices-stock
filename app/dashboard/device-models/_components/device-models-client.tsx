"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTable } from "@/components/general/data-table";
import { getDeviceModelColumns } from "./device-model-columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import { DeviceType, Manufacturer } from "@/prisma/generated/client";
import DynamicSelector from "@/components/general/dynamic-selector";
import { getManufacturersAction } from "@/actions/manufacturers/getManufacturers";
import { getDeviceTypesAction } from "@/actions/types/get-device-types";

interface DeviceModelsClientProps {
  initialData: any[];
  selectedManufacturer?: Manufacturer;
  selectedType?: DeviceType;
}

export default function DeviceModelsClient({
  initialData,
  selectedManufacturer: sManufacturer,
  selectedType: sType,
}: DeviceModelsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedDeviceType, setSelectedDeviceType] = useState<
    DeviceType | undefined
  >(sType);
  const [selectedManufacturer, setSelectedManufacturer] = useState<
    Manufacturer | undefined
  >(sManufacturer);

  const q = searchParams.get("q") || "";

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const columns = getDeviceModelColumns();

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col items-stretch justify-between gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-1 flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          {/* Model Name Search */}
          <form className="flex flex-1 flex-col gap-2 lg:flex-row lg:items-center">
            <Input
              name="q"
              placeholder="Search models by name..."
              defaultValue={q}
            />
            <DynamicSelector<Manufacturer>
              title="Select Manufacturer"
              placeholder="Manufacturer"
              id="get-manufacturers"
              name="manufacturerId"
              selectedItem={selectedManufacturer}
              onChooseItem={(item) => setSelectedManufacturer(item)}
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
            <DynamicSelector<DeviceType>
              title="Select Device Type"
              placeholder="Device Type"
              id="get-device-types"
              name="typeId"
              selectedItem={selectedDeviceType}
              onChooseItem={(item) => setSelectedDeviceType(item)}
              dataExtractor={(item) => ({
                key: item.id,
                value: item.name,
              })}
              onFetchData={async (search, page) => {
                const res = await getDeviceTypesAction({ search, page });
                if (res.success) return res.data;
                return [];
              }}
              allOption={{
                key: "all",
                value: "All Device Types",
              }}
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

          <Link href={"/dashboard/device-models/new"}>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Device Model
            </Button>
          </Link>
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
    </div>
  );
}
