"use client";

import React from "react";
import Link from "next/link";
import { Hospital, Edit, Eye, MoreHorizontal, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Department } from "@/prisma/generated/client";

interface DepartmentCardProps {
  department: Department;
  onEdit: (department: Department) => void;
}

export function DepartmentCard({ department, onEdit }: DepartmentCardProps) {
  // Format the createdAt date cleanly (e.g., Oct 24, 2026)
  const formattedDate = department.createdAt
    ? new Date(department.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="group bg-card text-card-foreground relative flex flex-col justify-between gap-5 rounded-lg border p-5 shadow-sm transition-all">
      {/* Top Section: Icon, Title, and Actions */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="bg-primary/10 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
            <Hospital className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="max-w-[190px] truncate text-base font-semibold tracking-tight sm:max-w-[220px]">
              {department.name}
            </h3>
            <p className="text-muted-foreground text-xs font-medium">
              {department.devicesCount} active equipment units
            </p>
          </div>
        </div>

        {/* Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground h-8 w-8 shrink-0"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={`/departments/${department.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Department
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(department)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Department
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Bottom Section: Metadata (Created Date) */}
      {formattedDate && (
        <div className="text-muted-foreground flex items-center gap-1.5 border-t pt-3 text-xs">
          <Calendar className="h-3.5 w-3.5" />
          <span>Created on {formattedDate}</span>
        </div>
      )}
    </div>
  );
}
