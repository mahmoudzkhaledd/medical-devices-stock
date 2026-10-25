"use client";

import React, { useState, useEffect } from "react";
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
import { Department } from "@/prisma/generated/client";
import CustomFormField, {
  FormFieldType,
} from "@/components/general/custom-form-field";
import {
  departmentSchema,
  DepartmentFormValues,
} from "@/types/schema/department.schema";
import { useLoading } from "../hooks/useLoading";
import { createDepartmentAction } from "@/actions/department/create-department";

interface DepartmentDialogProps {
  department?: { id: string; name: string };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate?: (supplier: Department) => void;
}

export function DepartmentDialog({
  department,
  open,
  onOpenChange,
  onCreate,
}: DepartmentDialogProps) {
  const isEditing = !!department;
  const { loading, startLoading } = useLoading();
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      id: department?.id,
      name: department?.name ?? "",
    },
  });

  const onSubmit = async (values: DepartmentFormValues) => {
    startLoading(async () => {
      const res = await createDepartmentAction(values);
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
            {isEditing ? "Edit Department" : "Add Department"}
          </DialogTitle>
          <DialogDescription>
            {isEditing && department
              ? `Update the name for department "${department.name}"`
              : "Register a new hospital department to categorize equipment locations."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="Department Name *"
            placeholder="e.g. Intensive Care Unit, Emergency, Radiology"
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
              {isEditing ? "Save Changes" : "Create Department"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
