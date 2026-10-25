import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";
import { ReactNode } from "react";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookiesStore = await cookies();
  const isSidebarOpen = cookiesStore.get("sidebar_state")?.value == "true";

  return (
    <SidebarProvider defaultOpen={isSidebarOpen}>
      <AppSidebar />
      <SidebarInset>
        <header className="border-b p-2">
          <SidebarTrigger />
        </header>
        <div className="mx-auto w-full max-w-[1500px] p-4 py-7">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
