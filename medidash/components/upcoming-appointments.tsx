import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Video, MapPin } from "lucide-react";

// Define the Appointment Type
interface Appointment {
  _id: string;
  patient: {
    name: string;
  };
  type: string;
  date: string; // Date stored as a string (ISO format)
  timeSlot: string;
  notes: string;
  status: string;
}

export function UpcomingAppointments({ paramDoctorId }: { paramDoctorId?: string }) {
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch doctorId from local storage or URL param
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedDoctor = localStorage.getItem("doctor");
    const doctor = storedDoctor ? JSON.parse(storedDoctor) : null;
    const finalDoctorId = paramDoctorId || doctor?._id || null;

    setDoctorId(finalDoctorId);
  }, [paramDoctorId]);

  // Fetch Appointments
  useEffect(() => {
    async function fetchAppointments() {
      if (!doctorId) return;

      try {
        const response = await axios.get<{ success: boolean; appointments: Appointment[] }>(
          `http://localhost:5001/api/appointments?doctorId=${doctorId}`
        );

        if (response.data.success && Array.isArray(response.data.appointments)) {
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Normalize to start of the day

          const validAppointments = response.data.appointments
            .filter((appointment) => appointment.status !== "pending")
            .filter((appointment) => {
              const appointmentDate = new Date(appointment.date);
              appointmentDate.setHours(0, 0, 0, 0);
              return appointmentDate >= today; // Only today's and future appointments
            });

          setAppointments(validAppointments);
        } else {
          setAppointments([]);
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to fetch appointments");
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, [doctorId]);

  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (appointments.length === 0) return <p>No upcoming appointments.</p>;

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <Card key={appointment._id}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt={appointment.patient.name} />
                <AvatarFallback>{appointment.patient.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{appointment.patient.name}</h3>
                  <Badge variant={appointment.type === "Video Call" ? "default" : "outline"}>
                    {appointment.type === "Video Call" ? (
                      <>
                        <Video className="mr-1 h-3 w-3" /> Online
                      </>
                    ) : (
                      <>
                        <MapPin className="mr-1 h-3 w-3" /> In-Person
                      </>
                    )}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Upcoming: {new Date(appointment.date).toLocaleDateString("en-GB")}</span>
                  <span>•</span>
                  <span>{appointment.timeSlot}</span>
                  <span>•</span>
                  <span>{appointment.notes}</span>
                </div>
              </div>
              <div className="ml-auto flex gap-2">
                <Button variant="outline" size="sm">
                  <User className="mr-2 h-4 w-4" />
                  View Profile
                </Button>
                {appointment.type === "Video Call" && (
                  <Button size="sm">
                    <Video className="mr-2 h-4 w-4" />
                    Start Call
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
