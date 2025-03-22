"use client";

import { usePathname } from "next/navigation";
import { DoctorSidebar } from "@/components/doctor-sidebar";

export function SidebarWrapper() {
  const pathname = usePathname();

  // Hide sidebar on login, register, and OTP verify pages
  const hideSidebar = ["/login", "/register", "/otp-verify"].includes(pathname);

  if (hideSidebar) return null;

  return (
    <div className="w-64 min-w-[16rem] h-screen">
      <DoctorSidebar />
    </div>
  );
}
