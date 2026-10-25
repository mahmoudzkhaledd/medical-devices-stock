"use client";

import * as React from "react";
import {
  Home,
  Boxes,
  Cpu,
  Layers,
  Tags,
  Building2,
  Factory,
  Truck,
  ArrowLeftRight,
  Command,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { useAuth } from "@/components/providers/auth-provider";
import { Skeleton } from "@/components/ui/skeleton";
const sidebarItems = [
  {
    title: "Overview",
    url: "/dashboard/home",
    icon: Home,
    isActive: true,
  },

  {
    title: "Devices",
    url: "/dashboard/devices",
    icon: Cpu,
  },

  {
    title: "Transactions",
    url: "/dashboard/transactions",
    icon: ArrowLeftRight,
  },
];
const complementaryItems = [
  {
    title: "Departments",
    url: "/dashboard/departments",
    icon: Building2,
  },
  {
    title: "Device Models",
    url: "/dashboard/device-models",
    icon: Layers,
  },
  {
    title: "Device Types",
    url: "/dashboard/device-types",
    icon: Tags,
  },

  {
    title: "Manufacturers",
    url: "/dashboard/manufacturers",
    icon: Factory,
  },
  {
    title: "Suppliers",
    url: "/dashboard/suppliers",
    icon: Truck,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data, isPending } = useAuth();
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard/home">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">MedTrack</span>
                  <span className="text-muted-foreground truncate text-xs">
                    Admin Dashboard
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarItems} title="Platform" />
        <NavMain
          items={complementaryItems.sort((a, b) =>
            a.title.localeCompare(b.title),
          )}
          title="Complementary"
        />
      </SidebarContent>
      <SidebarFooter>
        {isPending || !data?.user ? (
          <Skeleton className="h-[50px] w-full rounded-lg border" />
        ) : (
          <NavUser
            user={{
              name: data.user.name,
              email: data.user.email,
              avatar: data.user.image ?? "/user.png",
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
