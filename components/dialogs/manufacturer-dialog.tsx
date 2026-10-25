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
import {
  ManufacturerFormValues,
  manufacturerSchema,
} from "@/types/schema/manufacturer.schema";
import CustomFormField, {
  FormFieldType,
} from "@/components/general/custom-form-field";
import { useLoading } from "@/components/hooks/useLoading";
import { createManufacturerAction } from "@/actions/manufacturers/create-manufacturer";
import { Manufacturer } from "@/prisma/generated/client";

interface ManufacturerDialogProps {
  manufacturer?: Manufacturer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate?: (supplier: Manufacturer) => void;
}

export function ManufacturerDialog({
  manufacturer,
  open,
  onOpenChange,
  onCreate,
}: ManufacturerDialogProps) {
  const isEditing = !!manufacturer;
  const { loading, startLoading } = useLoading();
  const form = useForm<ManufacturerFormValues>({
    resolver: zodResolver(manufacturerSchema),
    defaultValues: {
      name: manufacturer?.name ?? "",
      notes: manufacturer?.notes ?? "",
      id: manufacturer?.id,
    },
  });

  const onSubmit = async (values: ManufacturerFormValues) => {
    startLoading(async () => {
      const res = await createManufacturerAction(values);
      if (!res.success) {
        toast.error(res.error);
        return;
      }
      form.reset({ name: "", id: undefined, notes: "" });
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
            {isEditing ? "Edit Manufacturer" : "Add Manufacturer"}
          </DialogTitle>
          <DialogDescription>
            {isEditing && manufacturer
              ? `Update details for ${manufacturer.name}`
              : "Register a new medical equipment manufacturer in the system."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="Manufacturer Name *"
            placeholder="e.g. Dräger, General Electric, Philips"
            disabled={loading}
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="notes"
            label="Description / Notes (Optional)"
            placeholder="Enter optional notes about the manufacturer..."
            disabled={loading}
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
              {isEditing ? "Save Changes" : "Create Manufacturer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
