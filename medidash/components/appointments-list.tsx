import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Video, MapPin, Clock, User, CalendarPlus, X, CheckCircle } from "lucide-react";

// Define types for props and appointment structure
interface Patient {
  name?: string;
  avatar?: string;
}

interface Appointment {
  _id: string;
  patient: Patient;
  isUrgent: boolean;
  type: string;
  date: string;
  timeSlot: string;
  patientAvatar?: string;
}

interface AppointmentsListProps {
  paramDoctorId?: string;
}

export function AppointmentsList({ paramDoctorId }: AppointmentsListProps) {
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedDoctor = localStorage.getItem("doctor");
    const doctor = storedDoctor ? JSON.parse(storedDoctor) : null;
    setDoctorId(paramDoctorId || doctor?._id || null);
  }, [paramDoctorId]);

  useEffect(() => {
    if (!doctorId) return;

    const fetchAppointments = async () => {
      setLoading(true);
      try {
        // Fetch only unapproved appointments
        const { data } = await axios.get<{ appointments: Appointment[] }>(
          `http://localhost:5001/api/appointments/doctor/${doctorId}?status=pending`
        );
        setAppointments(data.appointments);
      } catch (err) {
        setError("Failed to fetch appointments.");
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  const approveAppointment = async (appointmentId: string) => {
    try {
      const { data } = await axios.put(`http://localhost:5001/api/appointments/${appointmentId}/status`, {
        status: "confirmed",
      });

      // Remove approved appointment from state
      setAppointments((prev) => prev.filter((appointment) => appointment._id !== appointmentId));
      

      console.log("Appointment approved successfully:", data);
    } catch (error) {
      console.error("Error approving appointment:", error);
    }
  };

  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!appointments.length) return <p>No pending appointments found.</p>;

  return (
    <div className="space-y-4">
      {appointments.map(({ _id, patient, isUrgent, type, date, timeSlot, patientAvatar }) => (
        <Card key={_id} className={isUrgent ? "border-amber-200" : ""}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={patientAvatar || patient?.avatar} alt={patient?.name || "Unknown"} />
                <AvatarFallback>{patient?.name?.[0] || "?"}</AvatarFallback>
              </Avatar>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{patient?.name || "Unknown"}</h3>
                  {isUrgent && (
                    <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                      Urgent
                    </Badge>
                  )}
                  <Badge variant={type === "Video Call" ? "default" : "outline"}>
                    {type === "Video Call" ? (
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
                  <span>Requested: {new Date(date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="font-medium">Time Slot: {timeSlot}</span>
                </div>
              </div>

              <div className="ml-auto flex gap-2">
                <Button variant="outline" size="sm">
                  <User className="mr-2 h-4 w-4" />
                  View Profile
                </Button>
                <Button variant="outline" size="sm">
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Reschedule
                </Button>
                <Button size="sm" variant="destructive">
                  <X className="mr-2 h-4 w-4" />
                  Decline
                </Button>
                <Button size="sm" onClick={() => approveAppointment(_id)}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
