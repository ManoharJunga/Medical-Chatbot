"use client";

import { usePathname } from "next/navigation";
import { DoctorSidebar } from "@/components/doctor-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export function SidebarWrapper() {
  const pathname = usePathname();

  // Hide sidebar on login, register, and OTP verify pages
  const hideSidebar = ["/login", "/register", "/otp-verify"].includes(pathname);

  if (hideSidebar) return null;

  return (
    <SidebarProvider defaultOpen>
      <div className="w-64 min-w-[16rem] bg-sidebar border-r border-border">
        <DoctorSidebar />
      </div>
    </SidebarProvider>
  );
}
