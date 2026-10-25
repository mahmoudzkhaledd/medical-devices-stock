"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import CustomFormField, {
  FormFieldType,
} from "@/components/general/custom-form-field";
import {
  deviceFilterSchema,
  DeviceFilterFormValues,
} from "@/types/schema/device-filter.schema";
import { useRouter, useSearchParams } from "next/navigation";
import { useUpdateQuery } from "@/components/hooks/useUpdateQuery";

import { getDeviceModelsAction } from "@/actions/device-models/get-device-models";
import DynamicSelector from "@/components/general/dynamic-selector";
import {
  Department,
  DeviceModel as DM,
  DeviceType,
  Manufacturer,
  Supplier,
  Prisma,
} from "@/prisma/generated/client";
import { getManufacturersAction } from "@/actions/manufacturers/getManufacturers";
import { getDeviceTypesAction } from "@/actions/types/get-device-types";
import { getDepartmentsAction } from "@/actions/department/get-departments";
import { getSuppliersAction } from "@/actions/suppliers/get-suppliers";
type DeviceModel = Prisma.DeviceModelGetPayload<{
  include: {
    manufacturer: true;
    type: true;
  };
}>;
export function DeviceFilterSheet({
  selectedType: sType,
  selectedManufacturer: sManufacturer,
  selectedModel: sModel,
  selectedDepartment: sDepartment,
  selectedSupplier: sSupplier,
}: {
  selectedManufacturer?: Manufacturer;
  selectedType?: DeviceType;
  selectedModel?: DeviceModel;
  selectedDepartment?: Department;
  selectedSupplier?: Supplier;
}) {
  const [selectedDeviceType, setSelectedDeviceType] = useState<
    DeviceType | undefined
  >(sType);
  const [selectedManufacturer, setSelectedManufacturer] = useState<
    Manufacturer | undefined
  >(sManufacturer);
  const [selectedModel, setSelectedModel] = useState<DeviceModel | undefined>(
    sModel,
  );
  const [selectedDepartment, setSelectedDepartment] = useState<
    Department | undefined
  >(sDepartment);
  const [selectedSupplier, setSelectedSupplier] = useState<
    Supplier | undefined
  >(sSupplier);

  const searchParams = useSearchParams();
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const updateQuery = useUpdateQuery();
  const form = useForm<DeviceFilterFormValues>({
    resolver: zodResolver(deviceFilterSchema as any),
    defaultValues: {
      serialNumber: "",
      manufacturerId: "all",
      modelId: "all",
      typeId: "all",
      departmentId: "all",
      supplierId: "all",
    },
  });

  useEffect(() => {
    form.reset({
      serialNumber: searchParams.get("serialNumber") || "",
      manufacturerId: searchParams.get("manufacturerId") || "all",
      modelId: searchParams.get("modelId") || "all",
      typeId: searchParams.get("typeId") || "all",
      departmentId: searchParams.get("departmentId") || "all",
      supplierId: searchParams.get("supplierId") || "all",
    });
  }, [searchParams, isSheetOpen, form]);

  const watchedValues = useWatch({ control: form.control });

  const activeFiltersCount = [
    Boolean(watchedValues.serialNumber),
    watchedValues.manufacturerId && watchedValues.manufacturerId !== "all",
    watchedValues.modelId && watchedValues.modelId !== "all",
    watchedValues.typeId && watchedValues.typeId !== "all",
    watchedValues.departmentId && watchedValues.departmentId !== "all",
    watchedValues.supplierId && watchedValues.supplierId !== "all",
  ].filter(Boolean).length;

  const onSubmit = (values: DeviceFilterFormValues) => {
    updateQuery({
      serialNumber: values.serialNumber || "",
      manufacturerId: values.manufacturerId || "all",
      typeId: values.typeId || "all",
      modelId: values.modelId || "all",
      departmentId: values.departmentId || "all",
      supplierId: values.supplierId || "all",
    });
    setIsSheetOpen(false);
  };

  const handleReset = () => {
    form.reset({
      serialNumber: "",
      manufacturerId: "all",
      modelId: "all",
      typeId: "all",
      departmentId: "all",
      supplierId: "all",
    });
    setSelectedDepartment(undefined);
    setSelectedDeviceType(undefined);
    setSelectedManufacturer(undefined);
    setSelectedModel(undefined);
    setSelectedSupplier(undefined);
    router.push("?page=0");
    setIsSheetOpen(false);
  };
  const resetModel = () => {
    setSelectedModel(undefined);
    form.setValue("modelId", "all");
  };
  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <div className="flex items-center gap-2">
        <SheetTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 px-1.5 py-0.5 text-xs font-semibold"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-muted-foreground hover:text-foreground h-9"
          >
            <X className="mr-1 h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      <SheetContent side="right" className="flex w-full flex-col px-5">
        <SheetHeader className="px-0 pb-0">
          <SheetTitle>Filter Devices</SheetTitle>
          <SheetDescription>
            Apply filters to refine the list of devices shown below.
          </SheetDescription>
        </SheetHeader>
        <Separator />

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-1 flex-col overflow-hidden"
        >
          {/* Filter Form Controls */}
          <div className="w-full flex-1 space-y-5 overflow-y-auto py-2">
            {/* 1. Serial Number Search */}
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="serialNumber"
              label="Serial Number"
              placeholder="Search by serial number..."
            />

            <DynamicSelector<Supplier>
              title="Select Supplier"
              label="Supplier"
              placeholder="Supplier"
              key="get-suppliers"
              id="get-supplier"
              name="supplierId"
              selectedItem={selectedSupplier}
              onChooseItem={(item) => {
                form.setValue("supplierId", item?.id ?? "all");
                return setSelectedSupplier(item);
              }}
              dataExtractor={(item) => ({
                key: item.id,
                value: item.name,
              })}
              onFetchData={async (search, page) => {
                const res = await getSuppliersAction({ search, page });
                if (res.success) return res.data;
                return [];
              }}
              allOption={{
                key: "all",
                value: "All Suppliers",
              }}
            />
            <DynamicSelector<Department>
              title="Select Department"
              label="Department"
              placeholder="Department"
              key="get-departments"
              id="get-departments"
              name="departmentId"
              selectedItem={selectedDepartment}
              onChooseItem={(item) => {
                form.setValue("departmentId", item?.id ?? "all");
                return setSelectedDepartment(item);
              }}
              dataExtractor={(item) => ({
                key: item.id,
                value: item.name,
              })}
              onFetchData={async (search, page) => {
                const res = await getDepartmentsAction({ search, page });
                if (res.success) return res.data;
                return [];
              }}
              allOption={{
                key: "all",
                value: "All Departments",
              }}
            />
            <DynamicSelector<Manufacturer>
              title="Select Manufacturer"
              label="Manufacturer"
              placeholder="Manufacturer"
              key="get-manufacturers"
              id="get-manufacturers"
              name="manufacturerId"
              selectedItem={selectedManufacturer}
              onChooseItem={(item) => {
                resetModel();
                form.setValue("manufacturerId", item?.id ?? "all");
                return setSelectedManufacturer(item);
              }}
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
              label="Device Type"
              placeholder="Device Type"
              key="get-device-types"
              id="get-device-types"
              name="typeId"
              selectedItem={selectedDeviceType}
              onChooseItem={(item) => {
                resetModel();
                form.setValue("typeId", item?.id ?? "all");
                return setSelectedDeviceType(item);
              }}
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
            <DynamicSelector<DeviceModel>
              title="Select Device Model"
              label="Device Model"
              placeholder="Device Model"
              key="get-device-models"
              id="get-device-models"
              name="modelId"
              dependancies={[
                watchedValues.typeId,
                watchedValues.manufacturerId,
              ]}
              selectedItem={selectedModel}

              onChooseItem={(item) => {
                form.setValue("modelId", item?.id ?? "all");
                setSelectedModel(item);
                if (item) {
                  form.setValue("manufacturerId", item.manufacturer.id);
                  form.setValue("typeId", item.type.id);
                  setSelectedManufacturer(item.manufacturer);
                  setSelectedDeviceType(item.type);
                }
              }}
              dataExtractor={(item) => ({
                key: item.id,
                value: item.name,
              })}
              onFetchData={async (search, page) => {
                const res = await getDeviceModelsAction({
                  search,
                  page,
                  manufacturerId: selectedManufacturer?.id,
                  typeId: selectedDeviceType?.id,
                });
                if (res.success) return res.data;
                return [];
              }}
              allOption={{
                key: "all",
                value: "All Device Models",
              }}
            />
          </div>

          {/* Sheet Actions */}
          <SheetFooter className="flex-col gap-2 border-t pt-4 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={activeFiltersCount == 0}
              className="w-full sm:w-auto"
            >
              Reset
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              Apply Filters
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
