import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Video, MapPin, Clock, User, CalendarPlus, X, CheckCircle } from "lucide-react";

export function AppointmentsList({ paramDoctorId }) {
  const [doctorId, setDoctorId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedDoctor = localStorage.getItem("doctor");
    const doctor = storedDoctor ? JSON.parse(storedDoctor) : null;
    const finalDoctorId = paramDoctorId || doctor?._id || null;

    setDoctorId(finalDoctorId);
  }, [paramDoctorId]);

  useEffect(() => {
    if (!doctorId) return;

    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/appointments/doctor/${doctorId}`);
        setAppointments(response.data.appointments);
      } catch (err) {
        setError("Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  const approveAppointment = async (appointmentId) => {
    try {
      await axios.put(`http://localhost:5001/api/appointments/${appointmentId}/approve`);
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId ? { ...appointment, status: "approved" } : appointment
        )
      );
    } catch (err) {
      alert("Failed to approve appointment. Try again.");
    }
  };

  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!appointments.length) return <p>No appointments found.</p>;

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <Card key={appointment._id} className={appointment.isUrgent ? "border-amber-200" : ""}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={appointment.patientAvatar} alt={appointment.patient.name} />
                <AvatarFallback>{appointment.patient.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{appointment.patient.name}</h3>
                  {appointment.isUrgent && (
                    <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                      Urgent
                    </Badge>
                  )}
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
                  <span>Requested: {new Date(appointment.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="font-medium">Time Slot: {appointment.timeSlot}</span>
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
                <Button size="sm" onClick={() => approveAppointment(appointment._id)}>
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