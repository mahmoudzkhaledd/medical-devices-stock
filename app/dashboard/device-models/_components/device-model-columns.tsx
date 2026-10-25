"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Prisma } from "@/prisma/generated/client";

type DeviceModelType = Prisma.DeviceModelGetPayload<{
  include: {
    manufacturer: true;
    type: true;
  };
}>;

export const getDeviceModelColumns = (): ColumnDef<DeviceModelType>[] => [
  {
    accessorKey: "name",
    header: "Model Name",
    cell: ({ row }) => {
      const model = row.original;
      return <div className="font-medium">{model.name}</div>;
    },
  },
  {
    accessorKey: "manufacturerName",
    header: "Manufacturer",
    cell: ({ row }) => {
      const model = row.original;
      const initials = model.manufacturer.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

      return (
        <div className="flex items-center gap-2.5">
          <div className="bg-primary/10 text-primary flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-semibold">
            {initials}
          </div>
          <span className="truncate text-sm">{model.manufacturer.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "typeName",
    header: "Device Type",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.type.name}
      </span>
    ),
  },
  {
    accessorKey: "trackingMode",
    header: "Tracking Mode",
    cell: ({ row }) => {
      const mode = row.original.trackingMode;
      return (
        <Badge variant="outline" className="font-normal">
          {mode === "SERIALIZED" ? "Serialized" : "Quantity-tracked"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "equipmentUnits",
    header: "Equipment Units",
    cell: ({ row }) => (
      <span className="font-semibold">{row.original.devicesCount} units</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
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
      return (
        <Link href={`/dashboard/device-models/new?modelId=${row.original.id}`}>
          <Button variant="outline" size="icon-sm">
            <Pencil />
          </Button>
        </Link>
      );
    },
  },
];
