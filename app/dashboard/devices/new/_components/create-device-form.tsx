"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Check,
  AlertCircle,
  Info,
  Plus,
  ShieldCheck,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLoading } from "@/components/hooks/useLoading";
import {
  Department,
  DeviceType,
  Manufacturer,
  Supplier,
  Prisma,
} from "@/prisma/generated/client";
import DynamicSelector from "@/components/general/dynamic-selector";
import CustomFormField, {
  FormFieldType,
} from "@/components/general/custom-form-field";
import { getDepartmentsAction } from "@/actions/department/get-departments";
import { getManufacturersAction } from "@/actions/manufacturers/getManufacturers";
import { getDeviceTypesAction } from "@/actions/types/get-device-types";
import { getDeviceModelsAction } from "@/actions/device-models/get-device-models";
import { getSuppliersAction } from "@/actions/suppliers/get-suppliers";
import { toast } from "sonner";
import {
  createDeviceSchema,
  CreateDeviceFormValues,
} from "@/types/schema/create-device.schema";
type DeviceModel = Prisma.DeviceModelGetPayload<{
  include: {
    manufacturer: true;
    type: true;
  };
}>;
export default function CreateDeviceForm({
  deviceModel,
}: {
  deviceModel?: DeviceModel;
}) {
  const pathName = usePathname();
  const { loading, startLoading } = useLoading();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [selectedDeviceType, setSelectedDeviceType] = useState<
    DeviceType | undefined
  >(undefined);
  const [selectedManufacturer, setSelectedManufacturer] = useState<
    Manufacturer | undefined
  >(undefined);
  const [selectedModel, setSelectedModel] = useState<DeviceModel | undefined>(
    deviceModel,
  );
  const [selectedDepartment, setSelectedDepartment] = useState<
    Department | undefined
  >(undefined);
  const [selectedSupplier, setSelectedSupplier] = useState<
    Supplier | undefined
  >(undefined);

  const isSerializable = selectedModel?.trackingMode === "SERIALIZED";
  const prevIsSerializableRef = useRef<boolean | undefined>(
    deviceModel ? deviceModel.trackingMode === "SERIALIZED" : undefined,
  );

  const form = useForm<CreateDeviceFormValues>({
    resolver: zodResolver(createDeviceSchema),
    defaultValues: {
      supplierId: "all",
      departmentId: "all",
      manufacturerId: "all",
      typeId: "all",
      modelId: deviceModel?.id ?? "all",
      deviceCount: deviceModel?.trackingMode === "SERIALIZED" ? 1 : 1,
      isSerializable: deviceModel?.trackingMode === "SERIALIZED",
      devices:
        deviceModel?.trackingMode === "SERIALIZED"
          ? [{ id: "dev-1", serialNumber: "" }]
          : [],
    },
  });

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "devices",
  });

  // Handle tracking mode transitions
  useEffect(() => {
    const serialized = selectedModel?.trackingMode === "SERIALIZED";
    form.setValue("isSerializable", serialized, { shouldValidate: true });

    const prevSerialized = prevIsSerializableRef.current;

    // Check if switching specifically from Quantity-Based (false) to Serialized (true)
    if (prevSerialized === false && serialized === true) {
      form.setValue("deviceCount", 0, { shouldValidate: true });
      replace([]);
    } else if (
      prevSerialized === undefined &&
      serialized === true &&
      !deviceModel
    ) {
      // Initial state handling if needed
      const count = form.getValues("deviceCount") || 1;
      const initialDevices = Array.from({ length: count }, (_, i) => ({
        id: `dev-${i + 1}-${Date.now()}`,
        serialNumber: "",
      }));
      replace(initialDevices);
    } else if (!serialized) {
      replace([]);
    }

    prevIsSerializableRef.current = serialized;
  }, [selectedModel, form, replace, deviceModel]);

  const devicesValue = form.watch("devices");

  const trimmedSerials = devicesValue
    .map((d) => d.serialNumber.trim().toLowerCase())
    .filter((s) => s !== "");

  const duplicateSerials = trimmedSerials.filter(
    (item, index) => trimmedSerials.indexOf(item) !== index,
  );

  const isFormValid = isSerializable
    ? devicesValue.every((d) => d.serialNumber.trim() !== "") &&
      duplicateSerials.length === 0 &&
      devicesValue.length > 0 &&
      form.watch("deviceCount") > 0
    : true;

  function handleEnter(index: number) {
    if (index >= fields.length - 1) return;
    document.getElementById(`serial-${fields[index + 1]?.id}`)?.focus();
  }

  function handleChangeDevicesCount() {
    const devicesCount = form.getValues("deviceCount");

    if (!isSerializable) {
      replace([]);
      return;
    }

    const clampedNum = Math.min(devicesCount, 100);
    const currentDevices = form.getValues("devices");

    if (clampedNum > currentDevices.length) {
      const additions = Array.from(
        { length: clampedNum - currentDevices.length },
        (_, i) => ({
          id: `dev-${currentDevices.length + i + 1}-${Date.now()}`,
          serialNumber: "",
        }),
      );
      replace([...currentDevices, ...additions]);
    } else {
      replace(currentDevices.slice(0, clampedNum));
    }
  }

  const onSubmit = async (values: CreateDeviceFormValues) => {
    if (isSerializable && duplicateSerials.length > 0) {
      toast.error("Please fix duplicate serial numbers before submission.");
      return;
    }

    startLoading(async () => {
      // Handle API submission here with values
    });
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left Main Form Sections */}
      <div className="flex flex-col gap-6 lg:col-span-2">
        {/* Navigation Back */}
        <div className="flex items-center">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/devices">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Devices
            </Link>
          </Button>
        </div>

        {/* 1. Equipment Configuration Section */}
        <Card>
          <CardHeader>
            <CardTitle>1. Equipment Configuration</CardTitle>
            <CardDescription>
              Select the procurement source, department destination, and core
              device classification.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            <Link
              className="mt-auto w-full"
              href={`/dashboard/device-models/new?redirect=${pathName}`}
            >
              <Button type="button" variant={"outline"} className="w-full">
                <Plus />
                Create device model
              </Button>
            </Link>

            {/* Tracking Mode Notification Alert */}
            {selectedModel && (
              <div className="bg-muted/50 col-span-full mt-2 flex items-start gap-2 rounded-lg border p-3 text-xs">
                {isSerializable ? (
                  <>
                    <ShieldCheck className="h-4 w-4 shrink-0 text-blue-600" />
                    <div>
                      <strong className="font-semibold text-blue-700 dark:text-blue-400">
                        Serialized Tracking Mode:
                      </strong>{" "}
                      This model requires individual serial numbers for each
                      unit registered (Max 100 per batch).
                    </div>
                  </>
                ) : (
                  <>
                    <Layers className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <div>
                      <strong className="font-semibold text-emerald-700 dark:text-emerald-400">
                        Quantity-Based Tracking Mode:
                      </strong>{" "}
                      This model is tracked by quantity with no upper limit.
                      Individual serial numbers are not required.
                    </div>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 2. Registration Details Section */}
        <Card>
          <CardHeader>
            <CardTitle>2. Registration Details</CardTitle>
            <CardDescription>
              Specify how many units of this equipment you are registering.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="w-full">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  inputType="number"
                  control={form.control}
                  name="deviceCount"
                  label="Number of Devices *"
                  inputMin={isSerializable ? 1 : 1}
                  inputMax={isSerializable ? 100 : undefined}
                />
              </div>
              <p className="text-muted-foreground text-xs">
                {isSerializable
                  ? "Enter between 1 and 100 devices per batch submission."
                  : "Enter the quantity of units to register (no limit)."}
              </p>
            </div>
          </CardContent>
          {isSerializable && (
            <CardFooter className="flex justify-end">
              <Button type="button" onClick={handleChangeDevicesCount}>
                <Check className="h-4 w-4" />
                Apply
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* 3. Individual Device Entries Section (Conditional on isSerializable) */}
        {isSerializable && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">
                3. Individual Device Entries
              </h2>
              <Badge variant="outline" className="font-normal">
                {fields.length} {fields.length === 1 ? "Unit" : "Units"}{" "}
                Configured
              </Badge>
            </div>

            {fields.map((field, index) => {
              const currentSn = devicesValue[index]?.serialNumber || "";
              const isDuplicate =
                currentSn.trim() !== "" &&
                duplicateSerials.includes(currentSn.trim().toLowerCase());

              return (
                <Card
                  key={field.id}
                  className={isDuplicate ? "border-destructive" : ""}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-base font-semibold">
                      Device #{index + 1}
                    </CardTitle>
                    <span className="text-muted-foreground font-mono text-xs">
                      ID: {field.id.substring(0, 8)}
                    </span>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`serial-${field.id}`}>
                        Serial Number *
                      </Label>
                      <Input
                        id={`serial-${field.id}`}
                        placeholder="Enter unique serial number..."
                        value={currentSn}
                        onChange={(e) => {
                          form.setValue(
                            `devices.${index}.serialNumber`,
                            e.target.value,
                            {
                              shouldDirty: true,
                              shouldValidate: false,
                            },
                          );
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleEnter(index);
                          }
                        }}
                        className={
                          isDuplicate
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                        }
                      />
                      {isDuplicate && (
                        <p className="text-destructive mt-1 flex items-center gap-1 text-xs">
                          <AlertCircle className="h-3 w-3" />
                          This serial number is duplicated within the current
                          form submission.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Sticky Summary & Actions Panel */}
      <div className="lg:col-span-1">
        <div className="sticky top-6 flex flex-col gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Registration Summary</CardTitle>
              <CardDescription>
                Live verification of form contents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center justify-between border-b py-2">
                <span className="text-muted-foreground">Tracking Mode:</span>
                <Badge variant={isSerializable ? "default" : "secondary"}>
                  {isSerializable ? "Serialized" : "Quantity-Based"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Devices to Register:
                </span>
                <span className="font-semibold">
                  {form.watch("deviceCount")}
                </span>
              </div>

              {isSerializable && (
                <>
                  <div className="flex items-center justify-between border-b py-2">
                    <span className="text-muted-foreground">
                      Serial Numbers Entered:
                    </span>
                    <span className="font-semibold">
                      {
                        devicesValue.filter((d) => d.serialNumber.trim() !== "")
                          .length
                      }{" "}
                      / {fields.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-muted-foreground">
                      Validation Conflicts:
                    </span>
                    <span
                      className={`font-semibold ${duplicateSerials.length > 0 ? "text-destructive" : "text-emerald-600"}`}
                    >
                      {duplicateSerials.length > 0
                        ? `${duplicateSerials.length} duplicate SNs`
                        : "None"}
                    </span>
                  </div>
                </>
              )}

              {!isFormValid && (
                <div className="mt-2 flex items-start gap-2 rounded-lg bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-400">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    Please ensure Supplier, Department, and all required Serial
                    Numbers are properly filled without duplicates.
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Form Action Buttons */}
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              disabled={loading || !isFormValid}
              loading={loading}
              className="w-full gap-2"
            >
              <Check className="h-4 w-4" />
              Register Devices
            </Button>
            <Button
              type="button"
              variant="outline"
              asChild
              disabled={loading}
              className="w-full"
            >
              <Link href="/dashboard/devices">Cancel</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
