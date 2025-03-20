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
  AreaChart,
  BarChart,
  PieChart,
  PieArcSeries,
  PieArc,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area,
  Bar,
} from "recharts"
import { ProgressDemo } from "@/components/progress-demo"

export function AppointmentAnalytics() {
  // Data for appointment trends
  const appointmentTrendData = [
    { month: "Jan", inPerson: 120, online: 80 },
    { month: "Feb", inPerson: 125, online: 85 },
    { month: "Mar", inPerson: 130, online: 90 },
    { month: "Apr", inPerson: 125, online: 95 },
    { month: "May", inPerson: 130, online: 100 },
    { month: "Jun", inPerson: 135, online: 105 },
    { month: "Jul", inPerson: 140, online: 110 },
    { month: "Aug", inPerson: 145, online: 115 },
    { month: "Sep", inPerson: 150, online: 120 },
    { month: "Oct", inPerson: 155, online: 125 },
  ]

  // Data for appointment types
  const appointmentTypeData = [
    { name: "Initial Consultation", value: 30 },
    { name: "Follow-up", value: 45 },
    { name: "Emergency", value: 10 },
    { name: "Procedure", value: 15 },
  ]

  // Colors for the pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Appointment Trends</CardTitle>
          <CardDescription>Monthly appointment volume</CardDescription>
        </CardHeader>
        <CardContent>
          <Chart className="h-[300px]">
            <ChartContainer data={appointmentTrendData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <AreaChart>
                <defs>
                  <linearGradient id="inPersonGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0088FE" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="onlineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#00C49F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="inPerson"
                  name="In-Person"
                  stroke="#0088FE"
                  fillOpacity={1}
                  fill="url(#inPersonGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="online"
                  name="Online"
                  stroke="#00C49F"
                  fillOpacity={1}
                  fill="url(#onlineGradient)"
                />
              </AreaChart>
            </ChartContainer>
          </Chart>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appointment Types</CardTitle>
          <CardDescription>Distribution by appointment type</CardDescription>
        </CardHeader>
        <CardContent>
          <Chart className="h-[300px]">
            <ChartContainer data={appointmentTypeData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <PieChart>
                <PieArcSeries dataKey="value" cornerRadius={4} paddingAngle={2}>
                  {({ arcData }) => (
                    <PieArc
                      key={`arc-${arcData.name}`}
                      arcData={arcData}
                      fill={COLORS[arcData.index % COLORS.length]}
                    />
                  )}
                </PieArcSeries>
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
            {appointmentTypeData.map((entry, index) => (
              <ChartLegendItem key={`legend-${entry.name}`} name={entry.name} color={COLORS[index % COLORS.length]} />
            ))}
          </ChartLegend>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appointment Metrics</CardTitle>
          <CardDescription>Key performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>No-show rate</span>
                <span className="font-medium">8%</span>
              </div>
              <ProgressDemo value={8} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Cancellation rate</span>
                <span className="font-medium">12%</span>
              </div>
              <ProgressDemo value={12} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Rescheduling rate</span>
                <span className="font-medium">15%</span>
              </div>
              <ProgressDemo value={15} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Appointment utilization</span>
                <span className="font-medium">92%</span>
              </div>
              <ProgressDemo value={92} className="text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Busiest Days</CardTitle>
          <CardDescription>Appointment volume by day of week</CardDescription>
        </CardHeader>
        <CardContent>
          <Chart className="h-[300px]">
            <ChartContainer
              data={[
                { day: "Mon", appointments: 65 },
                { day: "Tue", appointments: 75 },
                { day: "Wed", appointments: 85 },
                { day: "Thu", appointments: 70 },
                { day: "Fri", appointments: 60 },
                { day: "Sat", appointments: 25 },
                { day: "Sun", appointments: 0 },
              ]}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <BarChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="appointments" fill="#0088FE" />
              </BarChart>
            </ChartContainer>
          </Chart>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Appointment Duration</CardTitle>
          <CardDescription>Average time spent by appointment type</CardDescription>
        </CardHeader>
        <CardContent>
          <Chart className="h-[300px]">
            <ChartContainer
              data={[
                { type: "Initial Consultation", duration: 45 },
                { type: "Follow-up", duration: 20 },
                { type: "Emergency", duration: 35 },
                { type: "Specialist Referral", duration: 30 },
                { type: "Procedure", duration: 60 },
              ]}
              margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
            >
              <BarChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis label={{ value: "Minutes", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Bar dataKey="duration" fill="#0088FE" />
              </BarChart>
            </ChartContainer>
          </Chart>
        </CardContent>
      </Card>
    </div>
  )
}

