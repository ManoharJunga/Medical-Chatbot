"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendItem,
} from "@/components/ui/chart"
import {
  BarChart,
  LineChart,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  Legend,
  Bar,
} from "recharts"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

export function RevenueAnalytics() {
  // Data for monthly revenue
  const monthlyRevenueData = [
    { month: "Jan", revenue: 18500 },
    { month: "Feb", revenue: 19200 },
    { month: "Mar", revenue: 20100 },
    { month: "Apr", revenue: 20800 },
    { month: "May", revenue: 21500 },
    { month: "Jun", revenue: 22300 },
    { month: "Jul", revenue: 22900 },
    { month: "Aug", revenue: 23400 },
    { month: "Sep", revenue: 23800 },
    { month: "Oct", revenue: 24350 },
  ]

  // Data for revenue by service
  const revenueByServiceData = [
    { name: "Consultations", value: 45 },
    { name: "Procedures", value: 30 },
    { name: "Lab Tests", value: 15 },
    { name: "Prescriptions", value: 10 },
  ]

  // Colors for the pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
          <CardDescription>Revenue trend over time</CardDescription>
        </CardHeader>
        <CardContent>
          <Chart className="h-[300px]">
            <ChartContainer data={monthlyRevenueData} margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0088FE"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </Chart>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue by Service</CardTitle>
          <CardDescription>Distribution of revenue sources</CardDescription>
        </CardHeader>
        <CardContent>
          <Chart className="h-[300px]">
            <ChartContainer data={revenueByServiceData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <PieChart>
                <Pie dataKey="value" nameKey="method" fill={COLORS[0]} label>
                  {revenueByServiceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <ChartTooltip>
                  {({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return <ChartTooltipContent title={`${payload[0].name}`} content={`${payload[0].value}%`} />
                    }
                    return null
                  }}
                </ChartTooltip>
              </PieChart>
            </ChartContainer>
          </Chart>
          <ChartLegend className="mt-4 justify-center">
            {revenueByServiceData.map((entry, index) => (
              <ChartLegendItem key={`legend-${entry.name}`} name={entry.name} color={COLORS[index % COLORS.length]} />
            ))}
          </ChartLegend>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>How patients pay for services</CardDescription>
        </CardHeader>
        <CardContent>
          <Chart className="h-[300px]">
            <ChartContainer
              data={[
                { method: "Insurance", value: 65 },
                { method: "Credit Card", value: 25 },
                { method: "Cash", value: 7 },
                { method: "Other", value: 3 },
              ]}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <PieChart>
                <Pie dataKey="value" nameKey="method" fill={COLORS[0]} label>
                  {revenueByServiceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <ChartTooltip>
                  {({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return <ChartTooltipContent title={`${payload[0].name}`} content={`${payload[0].value}%`} />
                    }
                    return null
                  }}
                </ChartTooltip>
              </PieChart>
            </ChartContainer>
          </Chart>
          <ChartLegend className="mt-4 justify-center">
            {[
              { name: "Insurance", color: COLORS[0] },
              { name: "Credit Card", color: COLORS[1] },
              { name: "Cash", color: COLORS[2] },
              { name: "Other", color: COLORS[3] },
            ].map((entry) => (
              <ChartLegendItem key={`legend-${entry.name}`} name={entry.name} color={entry.color} />
            ))}
          </ChartLegend>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Revenue by Appointment Type</CardTitle>
          <CardDescription>Comparison of revenue sources</CardDescription>
        </CardHeader>
        <CardContent>
          <Chart className="h-[300px]">
            <ChartContainer
              data={[
                { type: "Initial Consultation", inPerson: 8500, online: 6200 },
                { type: "Follow-up", inPerson: 5200, online: 4800 },
                { type: "Specialist Referral", inPerson: 3800, online: 1200 },
                { type: "Emergency", inPerson: 2500, online: 1800 },
                { type: "Procedure", inPerson: 7200, online: 0 },
              ]}
              margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
            >
              <BarChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="inPerson" name="In-Person" fill="#0088FE" />
                <Bar dataKey="online" name="Online" fill="#00C49F" />
              </BarChart>
            </ChartContainer>
          </Chart>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial Highlights</CardTitle>
          <CardDescription>Key revenue metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Average Revenue Per Patient</div>
                <div className="text-2xl font-bold">$185.50</div>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800">
                <TrendingUp className="mr-1 h-3 w-3" />
                +12%
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Average Revenue Per Visit</div>
                <div className="text-2xl font-bold">$95.20</div>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800">
                <TrendingUp className="mr-1 h-3 w-3" />
                +8%
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Collection Rate</div>
                <div className="text-2xl font-bold">94.5%</div>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800">
                <TrendingUp className="mr-1 h-3 w-3" />
                +2.5%
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Days in A/R</div>
                <div className="text-2xl font-bold">18.3</div>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800">
                <TrendingUp className="mr-1 h-3 w-3" />
                Improved
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

