"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CalendarIcon, ChevronLeft, ChevronRight, Filter, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppointmentsList } from "@/components/appointments-list";
import { UpcomingAppointments } from "@/components/upcoming-appointments";
import { EmergencyCases } from "@/components/emergency-cases";
import { AppointmentCalendarView } from "@/components/appointment-calendar-view";

export default function AppointmentsPage() {
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const router = useRouter();
  useEffect(() => {
    // Retrieve doctor details from localStorage
    const doctorData = localStorage.getItem("doctor");

    if (doctorData) {
      const parsedDoctor = JSON.parse(doctorData);
      setDoctor(parsedDoctor);

      // Fetch appointments using doctorId
      fetchAppointments(parsedDoctor._id);
    } else {
      router.push("/login"); // Redirect if not logged in
    }
  }, [router]);

  const fetchAppointments = async (doctorId: string) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/appointments/doctor/${doctorId}`);
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Appointments</h1>
          <p className="text-sm text-muted-foreground">Manage your schedule and patient appointments</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-56">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search appointments..." className="w-full pl-8 text-sm" />
          </div>
          <Button size="sm">
            <Plus className="mr-1 h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>

      <Tabs defaultValue="calendar" className="space-y-3">
        <TabsList className="space-x-2">
          <TabsTrigger value="calendar">
            <CalendarIcon className="mr-1 h-4 w-4" /> Calendar View
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            <ChevronRight className="mr-1 h-4 w-4" /> Upcoming
            {upcomingCount > 0 && (
              <Badge variant="outline" className="ml-1 text-xs">{upcomingCount}</Badge>
            )}
          </TabsTrigger>

          <TabsTrigger value="requests">
            <ChevronLeft className="mr-1 h-4 w-4" /> Requests
            <Badge variant="outline" className="ml-1 text-xs">8</Badge>
          </TabsTrigger>
          <TabsTrigger value="emergency">
            <Badge variant="destructive" className="mr-1 h-2 w-2 p-0 rounded-full" /> Emergency
            <Badge variant="outline" className="ml-1 text-xs text-red-500">3</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">


            <Card className="md:col-span-3">
              <CardHeader className="p-3">
                <CardTitle className="text-sm">Appointments for Today</CardTitle>
                <CardDescription className="text-xs">Wednesday, March 22, 2025</CardDescription>
              </CardHeader>
              <CardContent className="p-3">
                <AppointmentCalendarView appointments={appointments} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-3">
        <UpcomingAppointments setUpcomingCount={setUpcomingCount} />
        </TabsContent>

        <TabsContent value="requests" className="space-y-3">
          <AppointmentsList type="requests" />
        </TabsContent>

        <TabsContent value="emergency" className="space-y-3">
          <EmergencyCases />
        </TabsContent>
      </Tabs>
    </div>
  );
}
