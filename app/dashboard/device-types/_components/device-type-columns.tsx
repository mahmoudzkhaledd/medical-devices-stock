"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Tags, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useState } from "react";
import { DeviceTypeDialog } from "../../../../components/dialogs/device-type-dialog";
import { Prisma } from "@/prisma/generated/client";

export const getDeviceTypeColumns = (): ColumnDef<
  Prisma.DeviceTypeGetPayload<{
    include: {
      manufacturer: true;
    };
  }>
>[] => [
  {
    accessorKey: "name",
    header: "Device Type",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex items-center gap-3 font-medium">
          <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
            <Tags className="h-4 w-4" />
          </div>
          <div>
            <span className="block truncate font-semibold">{item.name}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "manufacturer.name",
    header: "Manufacturer",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="text-muted-foreground flex items-center gap-2">
          <Building2 className="text-muted-foreground/70 h-4 w-4" />
          <span className="text-foreground font-medium">
            {item.manufacturer?.name ?? "—"}
          </span>
        </div>
      );
    },
  },
  {
    id: "edit",
    header: "Edit",
    cell: ({ row }) => {
      const deviceType = row.original;
      const [showEditDialog, setShowEditDialog] = useState(false);

      return (
        <>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setShowEditDialog(true)}
          >
            <Pencil />
          </Button>

          <DeviceTypeDialog
            deviceType={deviceType}
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
          />
        </>
      );
    },
  },
];
