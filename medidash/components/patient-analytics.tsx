"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendItem,
} from "@/components/ui/chart";
import {
  AreaChart,
  BarChart,
  PieChart,
  Pie,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  Bar,
  Cell,
} from "recharts";
import { ProgressDemo } from "@/components/progress-demo";

export function PatientAnalytics() {
  const ageDistributionData = [
    { name: "0-18", value: 15 },
    { name: "19-35", value: 25 },
    { name: "36-50", value: 30 },
    { name: "51-65", value: 20 },
    { name: "65+", value: 10 },
  ];

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
  ];

  const conditionData = [
    { name: "Hypertension", value: 28 },
    { name: "Diabetes", value: 22 },
    { name: "Respiratory", value: 18 },
    { name: "Cardiac", value: 15 },
    { name: "Other", value: 17 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Patient Growth</CardTitle>
          <CardDescription>Total patients over time</CardDescription>
        </CardHeader>
        <CardContent>
          <Chart className="h-[300px]">
            <ChartContainer data={patientGrowthData}>
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
                <Area type="monotone" dataKey="patients" stroke="#0088FE" fill="url(#patientGrowth)" />
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
            <ChartContainer data={ageDistributionData}>
              <PieChart>
                <Pie data={ageDistributionData} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
                  {ageDistributionData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip>
                  {({ active, payload }) => (
                    active && payload && payload.length ? (
                      <ChartTooltipContent title={payload[0].payload.name} content={`${payload[0].value}%`} />
                    ) : null
                  )}
                </ChartTooltip>
              </PieChart>
            </ChartContainer>
          </Chart>
        </CardContent>
      </Card>
    </div>
  );
}