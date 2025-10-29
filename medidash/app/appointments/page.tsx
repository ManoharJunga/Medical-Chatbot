"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AppointmentCalendarView } from "@/components/appointment-calendar-view";
import { AppointmentsList } from "@/components/appointments-list";
import { UpcomingAppointments } from "@/components/upcoming-appointments";
import { EmergencyCases } from "@/components/emergency-cases";
import { useToast } from "@/components/ui/use-toast";

const API_URL = "http://localhost:5001"; // ✅ Temporary backend base URL

export default function AppointmentsPage() {
  const [requestCount, setRequestCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [doctor, setDoctor] = useState<any>(null);
  const [appointments, setAppointments] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const router = useRouter();
  const { toast } = useToast();

  // ✅ Load doctor details & appointments
  useEffect(() => {
    const doctorData = localStorage.getItem("doctor");
    if (doctorData) {
      const parsedDoctor = JSON.parse(doctorData);
      setDoctor(parsedDoctor);
      fetchAppointments(parsedDoctor._id);
    } else {
      router.push("/login");
    }
  }, [router]);

  // ✅ Fetch appointments
  const fetchAppointments = async (doctorId: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/appointments/doctor/${doctorId}/approved`
      );
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  // ✅ Fetch available time slots for selected date
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (doctor?._id && date) {
        try {
          const response = await axios.get(
            `${API_URL}/api/appointments/available-slots?doctorId=${doctor._id}&date=${date}`
          );

          setAvailableSlots(response.data.availableSlots || []);
        } catch (error) {
          console.error("Error fetching available slots:", error);
          setAvailableSlots([]);
        }
      }
    };

    fetchAvailableSlots();
  }, [doctor, date]);

  // ✅ Handle manual appointment creation
  const handleManualAppointment = async () => {
    if (!patientName || !patientPhone || !date || !timeSlot) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await axios.post(`${API_URL}/api/appointments/manual`, {
        doctor: doctor._id,
        patientName,
        patientPhone,
        date,
        timeSlot,
        notes,
      });

      toast({
        title: "Success",
        description: "Appointment created successfully",
      });

      setIsDialogOpen(false);
      setPatientName("");
      setPatientPhone("");
      setDate("");
      setTimeSlot("");
      setNotes("");
      fetchAppointments(doctor._id);
    } catch (error: any) {
      console.error("Error creating appointment:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to create appointment",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Appointments</h1>
          <p className="text-sm text-muted-foreground">
            Manage your schedule and patient appointments
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-56">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search appointments..."
              className="w-full pl-8 text-sm"
            />
          </div>

          {/* Add Manual Appointment Button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-1 h-4 w-4" />
                New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Manual Appointment</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-3 py-2">
                <div>
                  <Label>Patient Name</Label>
                  <Input
                    placeholder="Enter patient name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Patient Phone</Label>
                  <Input
                    placeholder="Enter phone number"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Time Slot</Label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full border rounded p-2 text-sm"
                  >
                    <option value="">Select a slot</option>
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot, i) => (
                        <option key={i} value={slot}>
                          {slot}
                        </option>
                      ))
                    ) : (
                      <option disabled>No available slots</option>
                    )}
                  </select>
                </div>

                <div>
                  <Label>Notes</Label>
                  <Input
                    placeholder="Additional details"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <Button onClick={handleManualAppointment} className="w-full">
                  Save Appointment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="calendar" className="space-y-3">
        <TabsList className="space-x-2">
          <TabsTrigger value="calendar">
            <CalendarIcon className="mr-1 h-4 w-4" /> Calendar View
          </TabsTrigger>

          <TabsTrigger value="upcoming">
            <ChevronRight className="mr-1 h-4 w-4" /> Upcoming
            {upcomingCount > 0 && (
              <Badge variant="outline" className="ml-1 text-xs">
                {upcomingCount}
              </Badge>
            )}
          </TabsTrigger>

          <TabsTrigger value="requests">
            <ChevronLeft className="mr-1 h-4 w-4" /> Requests
            {requestCount > 0 && (
              <Badge variant="outline" className="ml-1 text-xs">
                {requestCount}
              </Badge>
            )}
          </TabsTrigger>

          <TabsTrigger value="emergency">
            <Badge
              variant="destructive"
              className="mr-1 h-2 w-2 p-0 rounded-full"
            />{" "}
            Emergency
            <Badge variant="outline" className="ml-1 text-xs text-red-500">
              3
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-2">
          <Card className="md:col-span-3">
            <CardHeader className="p-3">
              <CardTitle className="text-sm">Appointments for Today</CardTitle>
              <CardDescription className="text-xs">
                Wednesday, March 22, 2025
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              <AppointmentCalendarView appointments={appointments} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-3">
          <UpcomingAppointments setUpcomingCount={setUpcomingCount} />
        </TabsContent>

        <TabsContent value="requests" className="space-y-3">
          <AppointmentsList setRequestCount={setRequestCount} />
        </TabsContent>

        <TabsContent value="emergency" className="space-y-3">
          <EmergencyCases />
        </TabsContent>
      </Tabs>
    </div>
  );
}
