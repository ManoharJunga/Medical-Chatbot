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
  Area,
  Bar,
} from "recharts"
import { ProgressDemo } from "@/components/progress-demo"

export function PatientAnalytics() {
  // Data for patient demographics
  const ageDistributionData = [
    { name: "0-18", value: 15 },
    { name: "19-35", value: 25 },
    { name: "36-50", value: 30 },
    { name: "51-65", value: 20 },
    { name: "65+", value: 10 },
  ]

  // Data for patient growth
  const patientGrowthData = [
    { month: "Jan", patients: 980 },
    { month: "Feb", patients: 1020 },
    { month: "Mar", patients: 1050 },
    { month: "Apr", patients: 1080 },
    { month: "May", patients: 1120 },
    { month: "Jun", patients: 1150 },
    { month: "Jul", patients: 1180 },
    { month: "Aug", patients: 1210 },
    { month: "Sep", patients: 1230 },
    { month: "Oct", patients: 1248 },
  ]

  // Data for patient conditions
  const conditionData = [
    { name: "Hypertension", value: 28 },
    { name: "Diabetes", value: 22 },
    { name: "Respiratory", value: 18 },
    { name: "Cardiac", value: 15 },
    { name: "Other", value: 17 },
  ]

  // Colors for the pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Patient Growth</CardTitle>
          <CardDescription>Total patients over time</CardDescription>
        </CardHeader>
        <CardContent>
          <Chart className="h-[300px]">
            <ChartContainer data={patientGrowthData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <AreaChart>
                <defs>
                  <linearGradient id="patientGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0088FE" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="patients" stroke="#0088FE" fillOpacity={1} fill="url(#patientGrowth)" />
              </AreaChart>
            </ChartContainer>
          </Chart>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Age Distribution</CardTitle>
          <CardDescription>Patient demographics by age</CardDescription>
        </CardHeader>
        <CardContent>
          <Chart className="h-[300px]">
            <ChartContainer data={ageDistributionData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
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
            {ageDistributionData.map((entry, index) => (
              <ChartLegendItem key={`legend-${entry.name}`} name={entry.name} color={COLORS[index % COLORS.length]} />
            ))}
          </ChartLegend>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Patient Retention</CardTitle>
          <CardDescription>Return visit metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>First-time patients</span>
                <span className="font-medium">24%</span>
              </div>
              <ProgressDemo value={24} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Returning patients</span>
                <span className="font-medium">76%</span>
              </div>
              <ProgressDemo value={76} className="text-emerald-600" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Avg. visits per patient</span>
                <span className="font-medium">3.8</span>
              </div>
              <ProgressDemo value={76} className="text-emerald-600" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Patient satisfaction</span>
                <span className="font-medium">92%</span>
              </div>
              <ProgressDemo value={92} className="text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Common Conditions</CardTitle>
          <CardDescription>Top patient conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <Chart className="h-[300px]">
            <ChartContainer data={conditionData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
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
            {conditionData.map((entry, index) => (
              <ChartLegendItem key={`legend-${entry.name}`} name={entry.name} color={COLORS[index % COLORS.length]} />
            ))}
          </ChartLegend>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Patient Referral Sources</CardTitle>
          <CardDescription>How patients find your practice</CardDescription>
        </CardHeader>
        <CardContent>
          <Chart className="h-[300px]">
            <ChartContainer
              data={[
                { source: "Referrals", value: 35 },
                { source: "Insurance", value: 25 },
                { source: "Online Search", value: 20 },
                { source: "Social Media", value: 12 },
                { source: "Other", value: 8 },
              ]}
              margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
            >
              <BarChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0088FE" />
              </BarChart>
            </ChartContainer>
          </Chart>
        </CardContent>
      </Card>
    </div>
  )
}

