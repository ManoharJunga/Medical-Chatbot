"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Calendar,
  ChevronDown,
  Home,
  LogOut,
  Moon,
  Settings,
  Sun,
  Users,
  Stethoscope,
  FileText,
  CreditCard,
  LineChart,
  BellRing,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarGroup,
  SidebarGroupContent,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const routes = [
  { path: "/dashboard", label: "Dashboard", icon: Home },
  { path: "/appointments", label: "Appointments", icon: Calendar },
  { path: "/patients", label: "Patients", icon: Users },
  { path: "/ai-insights", label: "AI Insights", icon: Stethoscope },
  { path: "/prescriptions", label: "Prescriptions", icon: FileText },
  { path: "/billing", label: "Billing", icon: CreditCard },
  { path: "/analytics", label: "Analytics", icon: LineChart },
  { path: "/notifications", label: "Notifications", icon: BellRing },
];

export function DoctorSidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  // State to store doctor details
  const [doctor, setDoctor] = useState<{ name: string; specialty: string; avatar: string } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return; // Prevent SSR issues

    const userID = localStorage.getItem("userID");
    if (!userID) {
      router.push("/login");
      return;
    }
  
    fetch(`http://localhost:5001/api/doctors/docuser/${userID}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data._id) {  // Ensure valid data
          setDoctor({
            name: data.name || "Unknown Doctor",
            specialty: data.specialty || "Unknown Specialty",
            avatar: data.avatar || "/placeholder.svg?height=32&width=32",
          });
        } else {
          localStorage.removeItem("userID");  // Clear invalid user data
          router.push("/dashboard");
        }
      })
      .catch((error) => {
        console.error("Error fetching doctor details:", error);
        router.push("/dashboard"); // Redirect on error
      });
  }, [router]);
  
  const handleLogout = () => {
    document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem("userID"); // Remove userID from storage
    router.push("/login");
  };

  return (
    <Sidebar className="w-64 min-w-[16rem] h-screen border-r border-border bg-sidebar">
      {/* Sidebar Header */}
      <SidebarHeader className="border-b pb-2">
        <div className="flex items-center gap-2 px-4 py-3">
          <Stethoscope className="h-6 w-6 text-primary" />
          <div className="font-semibold text-lg">MediDash</div>
        </div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-muted-foreground">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map((route) => (
                <SidebarMenuItem key={route.path}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(route.path)} tooltip={route.label}>
                    <Link href={route.path} className="flex items-center gap-3 px-4 py-2 hover:bg-muted rounded-md">
                      <route.icon className="h-5 w-5" />
                      <span className="text-sm">{route.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer with Doctor Details */}
      <SidebarFooter className="border-t p-3">
        {doctor ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={doctor.avatar} alt={doctor.name} />
                <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <div className="font-medium">{doctor.name}</div>
                <div className="text-xs text-muted-foreground">{doctor.specialty}</div>
              </div>
            </div>

            {/* Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                  {theme === "dark" ? (
                    <>
                      <Sun className="mr-2 h-4 w-4" />
                      <span>Light mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="mr-2 h-4 w-4" />
                      <span>Dark mode</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">Loading doctor info...</div>
        )}
      </SidebarFooter>
      <SidebarTrigger />
    </Sidebar>
  );
}
