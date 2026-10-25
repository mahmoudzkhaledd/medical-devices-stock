"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ManufacturerDialog } from "@/components/dialogs/manufacturer-dialog";
import { DeviceTypeDialog } from "@/components/dialogs/device-type-dialog";
import CustomFormField, {
  FormFieldType,
} from "@/components/general/custom-form-field";
import {
  deviceModelSchema,
  DeviceModelFormValues,
} from "@/types/schema/device-model.schema";
import { useLoading } from "@/components/hooks/useLoading";
import {
  DeviceModel,
  DeviceType,
  Manufacturer,
  Prisma,
} from "@/prisma/generated/client";
import { createDeviceModelAction } from "@/actions/device-models/create-device-model";
import DynamicSelector from "@/components/general/dynamic-selector";
import { getManufacturersAction } from "@/actions/manufacturers/getManufacturers";
import { getDeviceTypesAction } from "@/actions/types/get-device-types";

interface AddDeviceModelFormProps {
  deviceModel?: Prisma.DeviceModelGetPayload<{
    include: {
      manufacturer: true;
      type: true;
    };
  }>;
}

export default function AddDeviceModelForm({
  deviceModel,
}: AddDeviceModelFormProps) {
  const { loading, startLoading } = useLoading();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [selectedManufacturer, setSelectedManufacturer] = useState<
    Manufacturer | undefined
  >(deviceModel?.manufacturer);
  const [selectedDeviceType, setSelectedDeviceType] = useState<
    DeviceType | undefined
  >(deviceModel?.type);
  const form = useForm<DeviceModelFormValues>({
    resolver: zodResolver(deviceModelSchema),
    defaultValues: {
      id: deviceModel?.id,
      name: deviceModel?.name ?? "",
      manufacturerId: deviceModel?.manufacturerId,
      typeId: deviceModel?.typeId,
      trackingMode: deviceModel?.trackingMode ?? "SERIALIZED",
    },
  });

  const onSubmit = async (values: DeviceModelFormValues) => {
    startLoading(async () => {
      const res = await createDeviceModelAction(values);
      if (!res.success) {
        toast.error(res.error);
        return;
      }

      if (redirect) {
        window.location.href = `${redirect}?modelId=${res.data.id}`;
      } else {
        toast.success(
          deviceModel
            ? "Device model updated successfully."
            : "Device model created successfully.",
        );
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={redirect ?? "/dashboard/device-models"}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Device Models
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {deviceModel ? "Edit Device Model" : "Model Specifications"}
          </CardTitle>
          <CardDescription>
            {deviceModel
              ? "Modify the technical identifiers and classification for this equipment model."
              : "Enter the technical identifiers and classification for the equipment model."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Model Name */}
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="name"
              label="Model Name *"
              placeholder="e.g. Servo-i, Infinity C300, BeneView T5"
              disabled={loading}
            />

            <DynamicSelector<Manufacturer>
              label="Manufacturer"
              title="Select Manufacturer"
              placeholder="Manufacturer"
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
              label="Device Type"
              title="Select Device Type"
              placeholder="Device Type"
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

            {/* Tracking Mode */}
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="trackingMode"
              label="Tracking Mode *"
              placeholder="Select tracking mode"
              disabled={loading}
            >
              <SelectItem value="SERIALIZED">
                Serialized (Individual physical serial numbers)
              </SelectItem>
              <SelectItem value="QUANTITY">
                Quantity-tracked (Stock counts per department)
              </SelectItem>
            </CustomFormField>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                asChild
                disabled={loading}
              >
                <Link href={redirect ?? "/dashboard/device-models"}>
                  Cancel
                </Link>
              </Button>
              <Button type="submit" loading={loading}>
                {deviceModel ? "Edit Device Model" : "Save Device Model"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
