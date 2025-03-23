"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import { getUserFromLocalStorage } from "./services/userService";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, MoreVertical } from "lucide-react";

interface Doctor {
    _id: string;
    name: string;
    specialty: string;
    location: string;
    contact: string;
}

interface Appointment {
    _id: string;
    doctor: Doctor;
    date: string;
    status: string;
    notes: string;
}

const Appointments = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
    const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
    const router = useRouter();
    const [user, setUser] = useState<{ id: string } | null>(null);

    useEffect(() => {
        const userData = getUserFromLocalStorage();
        if (!userData) {
            alert("Please log in to book an appointment.");
            router.push("/login");
        } else {
            setUser(userData);
        }
    }, [router]);

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!user) return;

            try {
                const res = await axios.get(`http://localhost:5001/api/appointments/user/${user.id}`);
                if (res.data.success) {
                    setAppointments(res.data.appointments);
                    const now = new Date();
                    setUpcomingAppointments(res.data.appointments.filter((appt: Appointment) => new Date(appt.date) > now));
                    setPastAppointments(res.data.appointments.filter((appt: Appointment) => new Date(appt.date) < now));
                }
            } catch (error) {
                console.error("Error fetching appointments:", error);
            }
        };

        fetchAppointments();
    }, [user]);

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 py-10 px-4 bg-gray-50">
                <div className="container mx-auto max-w-6xl">
                    <h1 className="text-3xl font-bold mb-4">Appointments</h1>
                    <Tabs defaultValue="upcoming">
                        <TabsList>
                            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                            <TabsTrigger value="past">Past Appointments</TabsTrigger>
                        </TabsList>

                        <TabsContent value="upcoming" className="space-y-6">
                            {upcomingAppointments.length > 0 ? (
                                upcomingAppointments.map((appt) => (
                                    <Card key={appt._id} className="border rounded-lg p-4 bg-white">
                                        <CardHeader className="flex flex-col md:flex-row justify-between">
                                            <div>
                                                <CardTitle className="font-medium text-lg">Dr. {appt.doctor.name}</CardTitle>
                                                <CardTitle className="text-gray-500 text-sm">{appt.doctor.specialty}</CardTitle>

                                            </div>
                                            <div className="mt-2 md:mt-0">
                                                <Badge
                                                    variant={appt.status === "pending" ? "default" : "outline"}
                                                    className={`${appt.status === "confirmed" ? "bg-green-500" :
                                                            appt.status === "cancelled" ? "bg-red-500" : ""
                                                        }`}
                                                >
                                                    {appt.status}
                                                </Badge>
                                            </div>

                                        </CardHeader>
                                        <CardContent className=" grid grid-cols-1 md:grid-cols-3 gap-2">
                                            <div className="flex items-center text-gray-600">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                <span>{new Date(appt.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Clock className="h-4 w-4 mr-2" />
                                                <span>{new Date(appt.date).toLocaleTimeString()}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <MapPin className="h-4 w-4 mr-2" />
                                                <span>{appt.doctor.location}</span>
                                            </div>

                                            <p className="text-gray-700"><strong>Notes:</strong> {appt.notes}</p>
                                            <div className="flex gap-2 mt-3">
                                                <Button variant="outline" size="sm">
                                                    Reschedule
                                                </Button>
                                                <Button variant="destructive" size="sm" >Cancel</Button>
                                            </div>
                                        </CardContent>

                                    </Card>
                                ))
                            ) : (
                                <p>No upcoming appointments.</p>
                            )}
                        </TabsContent>

                        <TabsContent value="past" className="space-y-6">
                            {pastAppointments.length > 0 ? (
                                pastAppointments.map((appt) => (
                                    <Card key={appt._id} className="border rounded-lg p-4 bg-white">
                                        <CardHeader className="flex flex-col md:flex-row justify-between">
                                            <div>
                                                <CardTitle className="font-medium text-lg">Dr. {appt.doctor.name}</CardTitle>
                                                <CardTitle className="text-gray-500 text-sm">{appt.doctor.specialty}</CardTitle>

                                            </div>
                                            <div className="mt-2 md:mt-0">
                                                <Badge
                                                    variant={appt.status === "pending" ? "default" : "outline"}
                                                    className={`${appt.status === "confirmed" ? "bg-green-500" :
                                                            appt.status === "cancelled" ? "bg-red-500" : ""
                                                        }`}
                                                >
                                                    {appt.status}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                            <div className="flex items-center text-gray-600">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                <span>{new Date(appt.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Clock className="h-4 w-4 mr-2" />
                                                <span>{new Date(appt.date).toLocaleTimeString()}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <MapPin className="h-4 w-4 mr-2" />
                                                <span>{appt.doctor.location}</span>
                                            </div>
                                            <p className="text-gray-700"><strong>Notes:</strong> {appt.notes}</p>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <p>No past appointments.</p>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
};

export default Appointments;