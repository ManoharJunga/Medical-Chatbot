"use client";

import { useState, useEffect } from "react";
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
  Menu,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const [doctor, setDoctor] = useState<{ name: string; email: string } | null>(null);
  const [specialty, setSpecialty] = useState<{ name: string; email: string } | null>(null);


  useEffect(() => {
    // Retrieve doctor details from localStorage
    const doctorData = localStorage.getItem("doctor");
    console.log("sidebar render",doctorData);
    if (doctorData) {
      setDoctor(JSON.parse(doctorData));
    } else {
      router.push("/login"); // Redirect if not logged in
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("doctor");
    localStorage.removeItem("doctorId");
    router.push("/login");
  };


  return (
    <aside className={`fixed h-screen bg-white dark:bg-gray-900 border-r transition-all duration-300 ${isOpen ? "w-64" : "w-20"}`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-6 w-6 text-primary" />
          {isOpen && <span className="font-semibold text-lg">MediDash</span>}
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Sidebar Menu */}
      <nav className="flex flex-col gap-2 p-4">
        {routes.map((route) => (
          <Link key={route.path} href={route.path} className={`flex items-center gap-3 p-2 rounded-md transition-colors ${pathname === route.path ? "bg-gray-200 dark:bg-gray-800 text-primary" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
            <route.icon className="h-5 w-5" />
            {isOpen && <span>{route.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="absolute bottom-0 w-full border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="Dr. Smith" />
              <AvatarFallback>DS</AvatarFallback>
            </Avatar>
            {isOpen && (
              <div className="text-sm">
                <div className="font-medium">{doctor?.name || "Doctor"}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{doctor?.specialty || "specialty"}</div>
              </div>
            )}
          </div>
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
      </div>
    </aside>
  );
}
