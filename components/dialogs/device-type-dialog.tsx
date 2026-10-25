"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import CustomFormField, {
  FormFieldType,
} from "@/components/general/custom-form-field"; // Adjust import path as needed
import {
  deviceTypeSchema,
  DeviceTypeFormValues,
} from "@/types/schema/deviceType.schema";
import { useLoading } from "@/components/hooks/useLoading";
import { addDeviceTypeAction } from "@/actions/types/add-device-type";
import { DeviceType, Manufacturer, Prisma } from "@/prisma/generated/client";

import DynamicSelector from "../general/dynamic-selector";
import { getManufacturersAction } from "@/actions/manufacturers/getManufacturers";
import { useState } from "react";

interface DeviceTypeDialogProps {
  deviceType?: Prisma.DeviceTypeGetPayload<{
    include: {
      manufacturer: true;
    };
  }>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate?: (supplier: DeviceType) => void;
}

export function DeviceTypeDialog({
  deviceType,
  open,
  onOpenChange,
  onCreate,
}: DeviceTypeDialogProps) {
  const isEditing = !!deviceType;
  const { loading, startLoading } = useLoading();
  const [selectedManufacturer, setSelectedManufacturer] = useState<
    Manufacturer | undefined
  >(deviceType?.manufacturer);
  const form = useForm<DeviceTypeFormValues>({
    resolver: zodResolver(deviceTypeSchema),
    defaultValues: {
      id: deviceType?.id,
      name: deviceType?.name ?? "",
      manufacturerId: deviceType?.manufacturerId ?? "",
    },
  });

  const onSubmit = async (values: DeviceTypeFormValues) => {
    startLoading(async () => {
      const res = await addDeviceTypeAction(values);
      if (!res.success) {
        toast.error(res.error);
        return;
      }
      form.reset({ name: "", id: undefined });
      setSelectedManufacturer(undefined);
      form.setFocus("name");
      if (onCreate) {
        onCreate(res.data);
        onOpenChange(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]" dir="ltr">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Device Type" : "Add Device Type"}
          </DialogTitle>
          <DialogDescription>
            {isEditing && deviceType
              ? `Update details for device type "${deviceType.name}"`
              : "Register a new medical equipment classification category."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="Type Name *"
            placeholder="e.g. Ventilator, Patient Monitor, Infusion Pump"
            disabled={loading}
          />
          <DynamicSelector<Manufacturer>
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
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {isEditing ? "Save Changes" : "Create Device Type"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
