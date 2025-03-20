import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, CreditCard, Clock, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PatientAnalytics } from "@/components/patient-analytics"
import { RevenueAnalytics } from "@/components/revenue-analytics"
import { AppointmentAnalytics } from "@/components/appointment-analytics"

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Track your practice performance and patient metrics</p>
        </div>
        <div className="flex items-center gap-4">
          <Select defaultValue="month">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export Report</Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticCard
          title="Total Patients"
          value="1,248"
          change="+12%"
          trend="up"
          description="vs. previous month"
          icon={Users}
        />
        <AnalyticCard
          title="Appointments"
          value="286"
          change="+8%"
          trend="up"
          description="vs. previous month"
          icon={Calendar}
        />
        <AnalyticCard
          title="Revenue"
          value="$24,350"
          change="+15%"
          trend="up"
          description="vs. previous month"
          icon={CreditCard}
        />
        <AnalyticCard
          title="Avg. Wait Time"
          value="12 min"
          change="-3 min"
          trend="down"
          description="vs. previous month"
          icon={Clock}
        />
      </div>

      <Tabs defaultValue="patients" className="space-y-4">
        <TabsList>
          <TabsTrigger value="patients">
            <Users className="mr-2 h-4 w-4" />
            Patient Analytics
          </TabsTrigger>
          <TabsTrigger value="revenue">
            <CreditCard className="mr-2 h-4 w-4" />
            Revenue Analytics
          </TabsTrigger>
          <TabsTrigger value="appointments">
            <Calendar className="mr-2 h-4 w-4" />
            Appointment Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="patients" className="space-y-4">
          <PatientAnalytics />
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <RevenueAnalytics />
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <AppointmentAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface AnalyticCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  description: string
  icon: React.ElementType
}

function AnalyticCard({ title, value, change, trend, description, icon: Icon }: AnalyticCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs">
          {trend === "up" ? (
            <TrendingUp className="mr-1 h-3 w-3 text-emerald-600" />
          ) : (
            <TrendingDown className="mr-1 h-3 w-3 text-emerald-600" />
          )}
          <span className={trend === "up" ? "text-emerald-600" : "text-emerald-600"}>
            {change} {description}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

