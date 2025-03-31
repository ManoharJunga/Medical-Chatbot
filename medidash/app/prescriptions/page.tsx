"use client"
import { Suspense, useEffect, useState } from "react";
import { FileDown, FilePlus, Printer, Search, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PrescriptionForm } from "@/components/prescription-form";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";

export default function PrescriptionsPage() {
  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prescriptions</h1>
          <p className="text-muted-foreground">Create and manage patient prescriptions</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search prescriptions..." className="w-full pl-9" />
          </div>
          <Button>
            <FilePlus className="mr-2 h-4 w-4" />
            New Prescription
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense fallback={<PrescriptionTableSkeleton />}>
            <PrescriptionHistory />
          </Suspense>
        </div>

        <div>
          <PrescriptionForm />
        </div>
      </div>
    </div>
  );
}

function PrescriptionHistory() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/prescriptions/doctor/67dd18cf5505a60ed069db7e")
      .then((response) => {
        setPrescriptions(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching prescriptions:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <PrescriptionTableSkeleton />;

  return (
    <Card>
      <CardHeader className="px-6 pt-6 pb-3">
        <CardTitle>Recent Prescriptions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Patient</TableHead>
              <TableHead>Medications</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prescriptions.map((prescription) => (
              <TableRow key={prescription._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{prescription.patient.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{prescription.patient.name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {prescription.medications.map((med) => `${med.name} ${med.dosage}`).join(", ")}
                  </div>
                </TableCell>
                <TableCell>{new Date(prescription.issuedDate).toLocaleDateString()}</TableCell>
                <TableCell>{prescription.status}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Printer className="h-4 w-4" />
                      <span className="sr-only">Print</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <FileDown className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function PrescriptionTableSkeleton() {
  return (
    <Card>
      <CardHeader className="px-6 pt-6 pb-3">
        <Skeleton className="h-6 w-36" />
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {Array(5).fill(null).map((_, index) => (
                <TableHead key={index}><Skeleton className="h-4 w-16" /></TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {Array(3).fill(null).map((_, index) => (
                      <Skeleton key={index} className="h-8 w-8 rounded-md" />
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}