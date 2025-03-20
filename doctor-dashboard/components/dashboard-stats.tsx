import { ArrowDown, ArrowUp, Calendar, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardStats() {
  const stats = [
    {
      title: "Today's Appointments",
      value: 12,
      change: 2,
      changeType: "increase",
      icon: Calendar,
    },
    {
      title: "Pending Requests",
      value: 8,
      change: 3,
      changeType: "increase",
      icon: Clock,
    },
    {
      title: "Completed Today",
      value: 4,
      change: 1,
      changeType: "increase",
      icon: CheckCircle,
    },
    {
      title: "Emergency Cases",
      value: 3,
      change: 1,
      changeType: "increase",
      icon: AlertTriangle,
      alert: true,
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className={stat.alert ? "border-red-200" : ""}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.alert ? "text-red-500" : "text-muted-foreground"}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center text-xs">
              {stat.changeType === "increase" ? (
                <ArrowUp className="mr-1 h-3 w-3 text-emerald-600" />
              ) : (
                <ArrowDown className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={stat.changeType === "increase" ? "text-emerald-600" : "text-red-500"}>
                {stat.change} from yesterday
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

