"use client";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, User, X, CalendarPlus } from "lucide-react";

interface Appointment {
  _id: string;
  date: string;
  doctor: { _id: string; name: string };
  patient: { _id: string; name: string; email: string; phone: string };
  notes: string;
  status: string;
}

export function AppointmentsList({ doctorId }: { doctorId: string }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!doctorId) return; // Ensure doctorId is available before fetching
      try {
        const response = await fetch(`http://localhost:5001/api/appointments/doctor/${doctorId}`);
        if (!response.ok) throw new Error("Failed to fetch appointments");
        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [doctorId]);

  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!appointments.length) return <p>No appointments found.</p>;

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => {
        const formattedDate = new Intl.DateTimeFormat("en-US", {
          weekday: "long",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
          day: "2-digit",
          month: "short",
          year: "numeric"
        }).format(new Date(appointment.date));

        return (
          <Card key={appointment._id} className={appointment.status === "pending" ? "border-amber-200" : ""}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder.svg" alt={appointment.patient.name} />
                  <AvatarFallback>{appointment.patient.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{appointment.patient.name}</h3>
                    {appointment.status === "pending" && (
                      <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                        Pending
                      </Badge>
                    )}
                    <Badge variant="outline">
                      <User className="mr-1 h-3 w-3" /> {appointment.doctor.name}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Scheduled: {formattedDate}</span>
                    <span>•</span>
                    <span>{appointment.notes}</span>
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
                  <Button size="sm">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
