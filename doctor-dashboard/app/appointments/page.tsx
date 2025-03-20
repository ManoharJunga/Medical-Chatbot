import { CalendarIcon, ChevronLeft, ChevronRight, Filter, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AppointmentsList } from "@/components/appointments-list"
import { UpcomingAppointments } from "@/components/upcoming-appointments"
import { EmergencyCases } from "@/components/emergency-cases"
import { AppointmentCalendarView } from "@/components/appointment-calendar-view"

export default function AppointmentsPage() {
  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">Manage your schedule and patient appointments</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search appointments..." className="w-full pl-9" />
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            <ChevronRight className="mr-2 h-4 w-4" />
            Upcoming
            <Badge variant="outline" className="ml-2 bg-primary/10 text-xs">
              12
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="requests">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Requests
            <Badge variant="outline" className="ml-2 bg-primary/10 text-xs">
              8
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="emergency">
            <Badge variant="destructive" className="mr-2 h-2 w-2 p-0 rounded-full" />
            Emergency
            <Badge variant="outline" className="ml-2 bg-red-500/10 text-red-500 text-xs">
              3
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>Select a date to view appointments</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Calendar mode="single" className="rounded-md border" />
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Filter By</div>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Appointments</SelectItem>
                        <SelectItem value="video">Video Consultations</SelectItem>
                        <SelectItem value="in-person">In-Person Visits</SelectItem>
                        <SelectItem value="emergency">Emergency Cases</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Status</div>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-2">
                    <Button variant="outline" className="w-full">
                      <Filter className="mr-2 h-4 w-4" />
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Appointments for Today</CardTitle>
                <CardDescription>Wednesday, March 20, 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <AppointmentCalendarView />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <UpcomingAppointments />
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <AppointmentsList type="requests" />
        </TabsContent>

        <TabsContent value="emergency" className="space-y-4">
          <EmergencyCases />
        </TabsContent>
      </Tabs>
    </div>
  )
}

