"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Shield, Settings } from "lucide-react"

interface ProfileTabsProps {
  activeTab: string
  onTabChange: (value: string) => void
}

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="personal-info" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Personal Information</span>
          <span className="sm:hidden">Personal</span>
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span className="hidden sm:inline">Security Settings</span>
          <span className="sm:hidden">Security</span>
        </TabsTrigger>
        <TabsTrigger value="account" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Account Status</span>
          <span className="sm:hidden">Account</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

