"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
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
} from "lucide-react"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
} from "@/components/ui/sidebar"

const routes = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: Home,
  },
  {
    path: "/appointments",
    label: "Appointments",
    icon: Calendar,
  },
  {
    path: "/patients",
    label: "Patients",
    icon: Users,
  },
  {
    path: "/ai-insights",
    label: "AI Insights",
    icon: Stethoscope,
  },
  {
    path: "/prescriptions",
    label: "Prescriptions",
    icon: FileText,
  },
  {
    path: "/billing",
    label: "Billing",
    icon: CreditCard,
  },
  {
    path: "/analytics",
    label: "Analytics",
    icon: LineChart,
  },
  {
    path: "/notifications",
    label: "Notifications",
    icon: BellRing,
  },
]

export function DoctorSidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [showNotifications, setShowNotifications] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    // Delete the auth cookie
    document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    // Redirect to login page
    router.push("/login")
  }

  return (
    <>
      <Sidebar>
        <SidebarHeader className="border-b pb-2">
          <div className="flex items-center gap-2 px-2">
            <Stethoscope className="h-6 w-6 text-primary" />
            <div className="font-semibold">MediDash</div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {routes.map((route) => (
                  <SidebarMenuItem key={route.path}>
                    <SidebarMenuButton asChild isActive={pathname === route.path} tooltip={route.label}>
                      <Link href={route.path}>
                        <route.icon className="h-4 w-4" />
                        <span>{route.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t">
          <div className="p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Dr. Smith" />
                  <AvatarFallback>DS</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium">Dr. Smith</div>
                  <div className="text-xs text-muted-foreground">Cardiologist</div>
                </div>
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
        </SidebarFooter>
        <SidebarTrigger />
      </Sidebar>
    </>
  )
}

