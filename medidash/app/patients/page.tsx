"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export default function PatientsPage() {
  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">Manage all patient appointments</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search patients..." className="w-full pl-9" />
        </div>
      </div>
      <PatientTable />
    </div>
  );
}

function PatientTable() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const doctorData = localStorage.getItem("doctor");
  
    if (doctorData) {
      const parsedDoctor = JSON.parse(doctorData);
      setDoctor(parsedDoctor);  
      async function fetchAppointments(doctorId: string) {
        try {
          const response = await fetch(`http://localhost:5001/api/appointments?doctorId=${doctorId}`);
          const data = await response.json();
          setAppointments(Array.isArray(data.appointments) ? data.appointments : []); // Ensure it's an array
        } catch (error) {
          console.error("Error fetching appointments:", error);
          setAppointments([]); // Handle errors by setting an empty array
        } finally {
          setLoading(false);
        }
      }
  
      fetchAppointments(parsedDoctor._id);
    } else {
      router.push("/login"); // Redirect if not logged in
    }
  }, []); // ✅ No need to add `router` since it’s not dynamically changing
  

  if (loading) return <PatientTableSkeleton />;

  return (
    <Card>
      <CardHeader className="px-6 pt-6 pb-3">
        <CardTitle>All Appointments</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time Slot</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>

            {appointments.map((appointment) => (
              <TableRow key={appointment._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={appointment.patient?.avatar || "/placeholder.svg"} alt={appointment.patient?.name} />
                      <AvatarFallback>{appointment.patient?.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{appointment.patient?.name}</div>
                      <div className="text-xs text-muted-foreground">{appointment.patient?.phoneNumber}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
                <TableCell>{appointment.timeSlot}</TableCell>
                <TableCell>
                  <Badge variant={appointment.status === "cancelled" ? "destructive" : "default"}>{appointment.status}</Badge>
                </TableCell>
                <TableCell>{appointment.notes || "-"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/patients/${appointment.patient?._id}`}>
                      <ArrowRight className="h-4 w-4" />
                      <span className="sr-only">View patient</span>
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function PatientTableSkeleton() {
  return (
    <Card>
      <CardHeader className="px-6 pt-6 pb-3">
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-full ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}