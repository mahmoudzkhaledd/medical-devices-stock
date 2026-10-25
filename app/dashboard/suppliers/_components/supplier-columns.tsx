"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Trash2, Building2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useLoading } from "@/components/hooks/useLoading";
import { deleteSupplierAction } from "@/actions/suppliers/delete-supplier";
import { AddSupplierDialog } from "../../../../components/dialogs/add-supplier-dialog";

export type SupplierRow = {
  id: string;
  name: string;
  createdAt: Date | string;
  _count?: {
    devices: number;
  };
};

export const getSupplierColumns = (): ColumnDef<SupplierRow>[] => [
  {
    accessorKey: "name",
    header: "Supplier Name",
    cell: ({ row }) => {
      const supplier = row.original;
      return (
        <div className="flex items-center gap-3 font-medium">
          <div className="bg-primary/15 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
            <Building2 className="h-4 w-4" />
          </div>
          <span className="truncate">{supplier.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Creation Date",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <span className="text-muted-foreground text-sm">
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const supplier = row.original;
      const router = useRouter();
      const { loading, startLoading } = useLoading();
      const [showEditDialog, setShowEditDialog] = useState(false);

      const handleDelete = async () => {
        if (
          !confirm(
            `Are you sure you want to delete the supplier "${supplier.name}"?`,
          )
        )
          return;
        startLoading(async () => {
          const res = await deleteSupplierAction({
            id: row.original.id,
          });
          if (!res.success) {
            toast.error(res.error);
            return;
          }
          toast.success("Supplier deleted successfully");
          router.refresh();
        });
      };

      return (
        <>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => setShowEditDialog(true)}
              title="Edit Supplier"
            >
              <Pencil className="text-muted-foreground hover:text-foreground h-4 w-4" />
            </Button>

            {/* <Button
              size="sm"
              variant="ghost"
              className="text-destructive hover:text-destructive h-8 w-8 p-0"
              onClick={handleDelete}
              loading={loading}
              title="Delete Supplier"
            >
              <Trash2 className="h-4 w-4" />
            </Button> */}
          </div>

          {/* Edit Dialog instantiated per row context */}
          <AddSupplierDialog
            supplier={supplier}
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
          />
        </>
      );
    },
  },
];
