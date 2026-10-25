"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Loader2 } from "lucide-react";
import {
  SupplierFormValues,
  supplierSchema,
} from "@/types/schema/supplier.schema";
import CustomFormField, {
  FormFieldType,
} from "@/components/general/custom-form-field";
import { useLoading } from "@/components/hooks/useLoading";
import { createSupplierAction } from "@/actions/suppliers/create-supplier";
import { Supplier } from "@/prisma/generated/client";

interface AddSupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier?: { id: string; name: string };
  onCreate?: (supplier: Supplier) => void;
}

export function AddSupplierDialog({
  open,
  onOpenChange,
  supplier,
  onCreate,
}: AddSupplierDialogProps) {
  const { loading, startLoading } = useLoading();
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      id: supplier?.id,
      name: supplier?.name ?? "",
    },
  });

  const onSubmit = async (values: SupplierFormValues) => {
    startLoading(async () => {
      const res = await createSupplierAction(values);

      if (!res.success) {
        toast.error(res.error);
        return;
      }
      form.reset({ name: "", id: undefined });
      form.setFocus("name");
      if (onCreate) {
        onCreate(res.data);
        onOpenChange(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" dir="ltr">
        <DialogHeader>
          <DialogTitle>
            {supplier ? "Edit Supplier" : "Add New Supplier"}
          </DialogTitle>
          <DialogDescription>
            Enter the name of the new medical equipment supplier or vendor
            company.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="Supplier Name"
            placeholder="e.g.: Nile Medical Equipment Company"
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
              Save Supplier
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
