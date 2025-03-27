import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowDown, ArrowUp, Calendar, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardStats({ paramDoctorId }: { paramDoctorId?: string }) {
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [todaysAppointments, setTodaysAppointments] = useState<number>(0);
  const [yesterdaysAppointments, setYesterdaysAppointments] = useState<number>(0);
  const [pendingRequests, setPendingRequests] = useState<number>(0);
  const [yesterdaysPending, setYesterdaysPending] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const getLocalDate = (isoDate: string) => {
    const dateObj = new Date(isoDate);
    return dateObj.toISOString().split("T")[0]; // Returns YYYY-MM-DD
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedDoctor = localStorage.getItem("doctor");
    const doctor = storedDoctor ? JSON.parse(storedDoctor) : null;
    const finalDoctorId = paramDoctorId || doctor?._id || null;

    setDoctorId(finalDoctorId);
  }, [paramDoctorId]);

  useEffect(() => {
    async function fetchAppointments() {
      if (!doctorId) return;
  
      try {
        const response = await axios.get(
          `http://localhost:5001/api/appointments?doctorId=${doctorId}`
        );
  
        console.log("Fetched Appointments Data:", response.data);
  
        if (response.data.success && Array.isArray(response.data.appointments)) {
          const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split("T")[0];
  
          console.log("Today's Date:", today);
          console.log("Yesterday's Date:", yesterdayStr);
  
          // Convert appointment dates to local date format
          const appointments = response.data.appointments.map((appointment) => ({
            ...appointment,
            localDate: getLocalDate(appointment.date), // Ensure correct format
            status: appointment.status?.toLowerCase() || "", // Handle undefined status
          }));
  
          // Debugging: Log all fetched appointments
          appointments.forEach((appointment) => {
            console.log(
              `ID: ${appointment._id}, Local Date: ${appointment.localDate}, Status: ${appointment.status}`
            );
          });
  
          // Count appointments, treating "confirmed" as "approved"
          const approvedStatuses = ["approved", "confirmed"];
  
          const todayApproved = appointments.filter(
            (appt) => approvedStatuses.includes(appt.status) && appt.localDate === today
          ).length;
  
          const yesterdayApproved = appointments.filter(
            (appt) => approvedStatuses.includes(appt.status) && appt.localDate === yesterdayStr
          ).length;
  
          const todayPending = appointments.filter(
            (appt) => appt.status === "pending" && appt.localDate === today
          ).length;
  
          const yesterdayPending = appointments.filter(
            (appt) => appt.status === "pending" && appt.localDate === yesterdayStr
          ).length;
  
          console.log("Today's Approved Appointments:", todayApproved);
          console.log("Yesterday's Approved Appointments:", yesterdayApproved);
          console.log("Today's Pending Requests:", todayPending);
          console.log("Yesterday's Pending Requests:", yesterdayPending);
  
          // Update state
          setTodaysAppointments(todayApproved);
          setYesterdaysAppointments(yesterdayApproved);
          setPendingRequests(todayPending);
          setYesterdaysPending(yesterdayPending);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchAppointments();
  }, [doctorId]);
  
  
  

  const stats = [
    {
      title: "Today's Appointments",
      value: todaysAppointments,
      change: todaysAppointments - yesterdaysAppointments,
      changeType: todaysAppointments >= yesterdaysAppointments ? "increase" : "decrease",
      icon: Calendar,
    },
    {
      title: "Pending Requests",
      value: pendingRequests,
      change: pendingRequests - yesterdaysPending,
      changeType: pendingRequests >= yesterdaysPending ? "increase" : "decrease",
      icon: Clock,
    },
    {
      title: "Completed Today",
      value: 4, // Placeholder for completed cases (update as needed)
      change: 1,
      changeType: "increase",
      icon: CheckCircle,
    },
    {
      title: "Emergency Cases",
      value: 3, // Placeholder for emergency cases
      change: 1,
      changeType: "increase",
      icon: AlertTriangle,
      alert: true,
    },
  ];

  if (loading) return <p>Loading statistics...</p>;

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
                {Math.abs(stat.change)} from yesterday
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
