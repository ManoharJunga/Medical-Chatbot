import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Video,
  MapPin,
  Clock,
  User,
  CalendarPlus,
  X,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Interfaces
interface Patient {
  _id?: string;
  name?: string;
  avatar?: string;
}

interface AIAnalysis {
  identifiedSymptoms?: string[];
  summary?: string;
}

interface Appointment {
  _id: string;
  patient: Patient;
  isUrgent: boolean;
  type: string;
  date: string;
  timeSlot: string;
  patientAvatar?: string;
  aiAnalysis?: AIAnalysis;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  isVerified: boolean;
  isApproved: boolean;
  createdAt: string;
}

interface AppointmentsListProps {
  paramDoctorId?: string;
  onRequestCountChange?: (count: number) => void;
}



export function AppointmentsList({ paramDoctorId, onRequestCountChange }: AppointmentsListProps) {
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Load doctorId
  useEffect(() => {
    const storedDoctor = localStorage.getItem("doctor");
    const doctor = storedDoctor ? JSON.parse(storedDoctor) : null;
    setDoctorId(paramDoctorId || doctor?._id || null);
  }, [paramDoctorId]);

  useEffect(() => {
  if (!doctorId) {
    console.log("⛔ No doctorId provided");
    return;
  }

  const fetchAppointments = async () => {
    console.log("🔄 Fetching appointments for doctorId:", doctorId);

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5001/api/appointments/doctor/${doctorId}/pending`
      );

      console.log("✅ API Response:", response.data); // 🔍 check what the backend sends

      if (response.data.success) {
        const appointments = response.data.appointments || [];
        console.log("📦 Appointments count:", appointments.length);
        setAppointments(appointments);
        onRequestCountChange?.(appointments.length);
      } else {
        console.log("⚠️ Backend returned success=false");
        setAppointments([]);
        onRequestCountChange?.(0);
      }
    } catch (err) {
      console.error("❌ Error fetching appointments:", err);
      setError("Failed to fetch appointments.");
      onRequestCountChange?.(0);
    } finally {
      setLoading(false);
    }
  };

  fetchAppointments();
}, [doctorId, onRequestCountChange]);


  // Fetch appointments
  useEffect(() => {
    if (!doctorId) return;
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get<{ success: boolean; appointments: Appointment[]; message?: string }>(
          `http://localhost:5001/api/appointments/doctor/${doctorId}/pending`
        );
        if (data.success) {
          setAppointments(data.appointments);
          setError("");
        } else {
          setAppointments([]);
          setError(data.message || "No pending appointments.");
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to fetch appointments.");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [doctorId]);

  // Approve appointment
  const approveAppointment = async (appointmentId: string) => {
    try {
      const { data } = await axios.put(`http://localhost:5001/api/appointments/${appointmentId}/status`, {
        status: "confirmed",
      });
      setAppointments((prev) => prev.filter((a) => a._id !== appointmentId));
      console.log("Appointment approved:", data);
    } catch (error) {
      console.error("Error approving appointment:", error);
    }
  };

  const handleViewProfile = async (userId?: string) => {
  if (!userId) return;
  try {
    const { data } = await axios.get<UserProfile>(`http://localhost:5001/api/users/${userId}`);
    setSelectedUser(data); // directly use data, since your API returns the user object itself
    setIsDialogOpen(true);
  } catch (err) {
    console.error("Error fetching user:", err);
  }
};


  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!appointments.length) return <p>No requested appointments found.</p>;

  return (
    <div className="space-y-4">
      {appointments.map(({ _id, patient, isUrgent, type, date, timeSlot, patientAvatar, aiAnalysis }) => (
        <Card key={_id} className={isUrgent ? "border-amber-200" : ""}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={patientAvatar || patient?.avatar} alt={patient?.name || "Unknown"} />
                <AvatarFallback>{patient?.name?.[0] || "?"}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
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
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(date).toLocaleDateString("en-GB")}</span>
                  <span>•</span>
                  <span className="font-medium">Time: {timeSlot}</span>
                </div>
              </div>

              <div className="ml-auto flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleViewProfile(patient?._id)}>
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

            {aiAnalysis?.identifiedSymptoms?.length ? (
              <div className="mt-4 border-t pt-3">
                <p className="font-semibold text-gray-800 mb-1">Identified Symptoms:</p>
                <div className="flex flex-wrap gap-2">
                  {aiAnalysis.identifiedSymptoms.map((symptom, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {symptom}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ))}

      {/* Profile Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Patient Profile</DialogTitle>
            <DialogDescription>Complete details of the patient</DialogDescription>
          </DialogHeader>

          {selectedUser ? (
            <div className="space-y-2 mt-3">
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {selectedUser.email}</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {selectedUser.phone}</p>
              <p className="flex items-center gap-2"><Calendar className="h-4 w-4" /> DOB: {new Date(selectedUser.dob).toLocaleDateString("en-GB")}</p>
              <p><strong>Gender:</strong> {selectedUser.gender}</p>
              <p><strong>Verified:</strong> {selectedUser.isVerified ? "Yes" : "No"}</p>
              <p><strong>Approved:</strong> {selectedUser.isApproved ? "Yes" : "No"}</p>
              <p><strong>Joined On:</strong> {new Date(selectedUser.createdAt).toLocaleDateString("en-GB")}</p>
            </div>
          ) : (
            <p>Loading profile...</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
