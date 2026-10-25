"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Prisma } from "@/prisma/generated/client";

export const getDeviceColumns = (): ColumnDef<
  Prisma.DeviceGetPayload<{
    include: {
      department: true;
      model: {
        include: {
          manufacturer: true;
          type: true;
        };
      };
      supplier: true;
    };
  }>
>[] => [
  {
    accessorKey: "serialNumber",
    header: "Serial Number",
    cell: ({ row }) => {
      const sn = row.original.serialNumber;
      return sn ? (
        <span className="font-mono text-xs font-semibold">{sn}</span>
      ) : (
        <span className="text-muted-foreground text-xs italic">
          Not serialized
        </span>
      );
    },
  },
  {
    accessorKey: "modelName",
    header: "Device Model",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.model.name}</span>
    ),
  },
  {
    accessorKey: "manufacturerName",
    header: "Manufacturer",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.model.manufacturer.name}
      </span>
    ),
  },
  {
    accessorKey: "typeName",
    header: "Device Type",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.model.type.name}
      </span>
    ),
  },
  {
    accessorKey: "departmentName",
    header: "Department",
    cell: ({ row }) => <span>{row.original.department.name}</span>,
  },
  {
    accessorKey: "trackingMode",
    header: "Tracking Mode",
    cell: ({ row }) => {
      const mode = row.original.model.trackingMode;
      return (
        <Badge variant="outline" className="font-normal">
          {mode === "SERIALIZED" ? "Serialized" : "Quantity-tracked"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let variant: "default" | "secondary" | "destructive" | "outline" =
        "default";
      if (status === "ACTIVE") variant = "default";
      else if (status === "OUT_OF_SERVICE") variant = "secondary";
      else if (status === "DISPOSED") variant = "destructive";

      return (
        <Badge variant={variant} className="text-xs font-normal">
          {status.replace(/_/g, " ")}
        </Badge>
      );
    },
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
          })}
        </span>
      );
    },
  },
];
