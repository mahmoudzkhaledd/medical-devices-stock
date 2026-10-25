"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Layers,
  Package,
  Building2,
  Factory,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ManufacturerDialog } from "../../../../components/dialogs/manufacturer-dialog";
import { Manufacturer } from "@/prisma/generated/client";

export const getManufacturerColumns = (): ColumnDef<Manufacturer>[] => [
  {
    accessorKey: "name",
    header: "Manufacturer",
    cell: ({ row }) => {
      const item = row.original;
      const initials = item.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

      return (
        <div className="flex items-center gap-3 font-medium">
          <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold">
            {initials}
          </div>
          <span className="truncate">{item.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "modelsCount",
    header: "Equipment Models",
    cell: ({ row }) => (
      <Badge variant="outline" className="gap-1 font-normal">
        <Layers className="text-muted-foreground h-3 w-3" />
        {row.original.modelsCount} models
      </Badge>
    ),
  },
  {
    accessorKey: "unitsCount",
    header: "Equipment Units",
    cell: ({ row }) => (
      <span className="text-foreground font-semibold">
        {row.original.unitsCount} units
      </span>
    ),
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const manufacturer = row.original;
      const router = useRouter();
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

          <ManufacturerDialog
            manufacturer={manufacturer}
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
          />
        </>
      );
    },
  },
];
