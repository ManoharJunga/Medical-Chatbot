"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  User,
  Video,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Bell,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Appointment {
  _id: string;
  doctor: string;
  type: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: string;
  aiAnalysis?: {
    identifiedSymptoms?: string[];
    summary?: string;
    possibleConditions?: { name: string; probability: string; description: string }[];
    recommendedAction?: string;
  };
  // For normal appointments
  patient?: { _id?: string; name?: string; phone?: string };
  // For manual appointments
  patientName?: string;
  patientPhone?: string;
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isVerified: boolean;
  isApproved: boolean;
  dob: string;
  gender: string;
  createdAt: string;
}

export function UpcomingAppointments({ paramDoctorId }: { paramDoctorId?: string }) {
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestCount, setRequestCount] = useState<number>(0);

  // Profile popup
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Get doctor ID
  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedDoctor = localStorage.getItem("doctor");
    const doctor = storedDoctor ? JSON.parse(storedDoctor) : null;
    setDoctorId(paramDoctorId || doctor?._id || null);
  }, [paramDoctorId]);

  // Fetch appointments
  useEffect(() => {
    if (!doctorId) return;

    const fetchAppointments = async () => {
      try {
        const res = await axios.get<{ success: boolean; appointments: Appointment[] }>(
          `http://localhost:5001/api/appointments?doctorId=${doctorId}`
        );

        if (res.data.success && Array.isArray(res.data.appointments)) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const validAppointments = res.data.appointments
            .filter(a => a.status !== "pending")
            .filter(a => {
              const aDate = new Date(a.date);
              aDate.setHours(0, 0, 0, 0);
              return aDate >= today;
            });

          setAppointments(validAppointments);
        } else {
          setAppointments([]);
        }
      } catch (err) {
        console.error("❌ Error fetching appointments:", err);
        setError("Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  // Fetch pending count
  useEffect(() => {
    if (!doctorId) return;

    const fetchRequestCount = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/appointments/doctor/${doctorId}/pending`
        );

        if (res.data.success && Array.isArray(res.data.appointments)) {
          setRequestCount(res.data.appointments.length);
        } else {
          setRequestCount(0);
        }
      } catch (err) {
        console.error("❌ Error fetching pending request count:", err);
        setRequestCount(0);
      }
    };

    fetchRequestCount();
  }, [doctorId]);

  // View patient profile
  const handleViewProfile = async (userId?: string) => {
    if (!userId) return;
    try {
      const { data } = await axios.get<UserProfile>(`http://localhost:5001/api/users/${userId}`);
      setSelectedUser(data);
      setIsDialogOpen(true);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  if (appointments.length === 0)
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <p>No upcoming appointments.</p>
      </div>
    );

  return (
    <div className="space-y-4">
      {/* Pending Requests */}
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          You have <span className="font-semibold text-red-500">{requestCount}</span> pending requests.
        </p>
      </div>

      {/* Appointment Cards */}
      {appointments.map((appointment) => {
        const displayName =
          appointment.patient?.name || appointment.patientName || "Unknown";
        const displayPhone =
          appointment.patient?.phone || appointment.patientPhone || "N/A";

        return (
          <Card key={appointment._id}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder.svg" alt={displayName} />
                  <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
                </Avatar>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{displayName}</h3>
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
                    <span>{new Date(appointment.date).toLocaleDateString("en-GB")}</span>
                    <span>•</span>
                    <span>{appointment.timeSlot}</span>
                    {appointment.notes && (
                      <>
                        <span>•</span>
                        <span>{appointment.notes}</span>
                      </>
                    )}
                  </div>

                  {/* Manual Appointment Phone */}
                  <p className="text-sm text-gray-500 mt-1">
                    <Phone className="inline-block h-3 w-3 mr-1" />
                    {displayPhone}
                  </p>

                  {/* AI Symptoms */}
                  {(appointment.aiAnalysis?.identifiedSymptoms ?? []).length > 0 && (
                    <div className="mt-3">
                      <p className="font-semibold text-gray-800 mb-3">
                        Identified Symptoms:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(appointment.aiAnalysis?.identifiedSymptoms ?? []).map(
                          (symptom, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {symptom}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="ml-auto flex gap-2">
                  {appointment.patient?._id ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewProfile(appointment.patient?._id)}
                    >
                      <User className="mr-2 h-4 w-4" />
                      View Profile
                    </Button>
                  ) : (
                    <Badge variant="secondary">Manual Entry</Badge>
                  )}
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
        );
      })}

      {/* Profile Popup */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Patient Profile</DialogTitle>
            <DialogDescription>
              Complete details of the selected patient
            </DialogDescription>
          </DialogHeader>

          {selectedUser ? (
            <div className="space-y-2 mt-3">
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> {selectedUser.email}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> {selectedUser.phone}
              </p>
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> DOB:{" "}
                {new Date(selectedUser.dob).toLocaleDateString("en-GB")}
              </p>
              <p><strong>Gender:</strong> {selectedUser.gender}</p>
              <p><strong>Verified:</strong> {selectedUser.isVerified ? "Yes" : "No"}</p>
              <p><strong>Approved:</strong> {selectedUser.isApproved ? "Yes" : "No"}</p>
              <p>
                <strong>Joined On:</strong>{" "}
                {new Date(selectedUser.createdAt).toLocaleDateString("en-GB")}
              </p>
            </div>
          ) : (
            <p>Loading profile...</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
