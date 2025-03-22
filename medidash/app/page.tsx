"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { DoctorSidebar } from "@/components/doctor-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <DoctorSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden p-6">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
