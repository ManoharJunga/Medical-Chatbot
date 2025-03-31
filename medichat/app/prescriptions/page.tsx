"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "@/components/navbar"; // Import your existing Navbar
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Clock, MoreHorizontal, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getUserFromLocalStorage } from "./services/userService";
import { useRouter } from "next/navigation";

interface Prescription {
  _id: string;
  doctor: {
    name: string;
    specialty: string;
  };
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  status: string;
  issuedDate: string;
}

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<string>("");
  const [reminderTime, setReminderTime] = useState<string>("");
  const [reminders, setReminders] = useState<{ medication: string; time: string }[]>([]);
  const router = useRouter();
  const [user, setUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const userData = getUserFromLocalStorage();
    if (!userData) {
      alert("Please log in to book an appointment.");
      router.push("/login");
    } else {
      setUser(userData);

      // Fetch prescriptions only if userData exists
      axios
        .get(`http://localhost:5001/api/prescriptions/patient/${userData.id}`)
        .then((response) => {
          setPrescriptions(response.data);
        })
        .catch((error) => console.error("Error fetching prescriptions:", error));
    }
  }, [router]);


  const handleSetReminder = () => {
    if (selectedMedication && reminderTime) {
      const newReminder = { medication: selectedMedication, time: reminderTime };
      setReminders((prev) => [...prev, newReminder]);

      // Store in local storage
      localStorage.setItem("medicationReminders", JSON.stringify([...reminders, newReminder]));

      // Show notification at the set time
      const reminderDate = new Date();
      const [hours, minutes] = reminderTime.split(":").map(Number);
      reminderDate.setHours(hours, minutes, 0);

      const now = new Date();
      const timeDifference = reminderDate.getTime() - now.getTime();

      if (timeDifference > 0) {
        setTimeout(() => {
          new Notification("Medication Reminder", {
            body: `Time to take your ${selectedMedication}`,
          });
        }, timeDifference);
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-10 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-2xl font-bold mb-6">Your Prescriptions</h1>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medication</TableHead>
                  <TableHead>Dosage & Frequency</TableHead>
                  <TableHead>Prescribed By</TableHead>
                  <TableHead>Issued Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescriptions.map((prescription) =>
                  prescription.medications.map((med, index) => (
                    <TableRow key={`${prescription._id}-${index}`}>
                      <TableCell className="font-medium">{med.name}</TableCell>
                      <TableCell>
                        {med.dosage}, {med.frequency}
                        <div className="text-xs text-gray-500 mt-1">Duration: {med.duration}</div>
                      </TableCell>
                      <TableCell>{prescription.doctor.name} ({prescription.doctor.specialty})</TableCell>
                      <TableCell>{format(new Date(prescription.issuedDate), "dd MMM yyyy")}</TableCell>
                      <TableCell>
                        {prescription.status === "active" ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Medication Reminders */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Medication Reminders</CardTitle>
              <CardDescription>Set up reminders to take your medications on time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-primary/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-medium">Never Miss a Dose</h3>
                    <p className="text-sm text-gray-600">Set up automated reminders for your medications</p>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Set Up Reminders</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Set Medication Reminder</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <select
                        className="w-full p-2 border rounded-md"
                        value={selectedMedication}
                        onChange={(e) => setSelectedMedication(e.target.value)}
                      >
                        <option value="">Select Medication</option>
                        {prescriptions.flatMap((p) =>
                          p.medications.map((med) => (
                            <option key={med.name} value={med.name}>
                              {med.name}
                            </option>
                          ))
                        )}
                      </select>
                      <Input
                        type="time"
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                      />
                      <Button onClick={handleSetReminder}>Save Reminder</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>

      </main>

    </div>
  );
}
