"use client";

import { Dot, type LucideIcon } from "lucide-react";

import { Collapsible } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMain({
  items,
  title,
}: {
  title: string;
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
  }[];
}) {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu className="space-y-2">
        {items.map((item) => {
          const isSelected = pathname.startsWith(item.url);
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <Link href={item.url} className="cursor-pointer">
                  <SidebarMenuButton
                    tooltip={item.title}
                    variant={isSelected ? "outline" : undefined}
                    className="hover:bg-sidebar-border cursor-pointer transition-colors"
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    {isSelected && <Dot className="ml-auto" />}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
