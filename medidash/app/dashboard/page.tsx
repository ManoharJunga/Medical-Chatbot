"use client";

import { useState, useEffect, Suspense } from "react";
import { ArrowDown, ArrowUp, Bell, Calendar, Clock, FileText, InfoIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardStats } from "@/components/dashboard-stats";
import { AppointmentsList } from "@/components/appointments-list";
import { UpcomingAppointments } from "@/components/upcoming-appointments";
import { EmergencyCases } from "@/components/emergency-cases";
import { PatientInsights } from "@/components/patient-insights";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [doctor, setDoctor] = useState<{ _id?: string; name: string; email: string } | null>(null);
  const [requestCount, setRequestCount] = useState<number>(0);
  const router = useRouter();
  

  // 🔹 Load doctor details from localStorage
  useEffect(() => {
    const doctorData = localStorage.getItem("doctor");

    if (doctorData) {
      setDoctor(JSON.parse(doctorData));
    } else {
      router.push("/login");
    }
  }, [router]);

  // 🔹 Fetch pending request count immediately when doctor is available
  useEffect(() => {
    if (!doctor?._id) return;

    const fetchRequestCount = async () => {
      try {
        console.log("🔄 Fetching initial request count for doctor:", doctor._id);
        const res = await fetch(
          `http://localhost:5001/api/appointments/doctor/${doctor._id}/pending`
        );
        const data = await res.json();
        console.log("✅ Initial request count data:", data);

        if (data.success && Array.isArray(data.appointments)) {
          setRequestCount(data.appointments.length);
        } else {
          setRequestCount(0);
        }
      } catch (err) {
        console.error("❌ Error fetching initial request count:", err);
        setRequestCount(0);
      }
    };

    fetchRequestCount();
  }, [doctor]);

  return (
    <div className="flex flex-col gap-5 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, Dr. {doctor?.name || "Doctor"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {requestCount}
            </span>
          </Button>

          {/* Start Consultation Button */}
          <Button>
            <Video className="mr-2 h-4 w-4" />
            Start Consultation
          </Button>
        </div>
      </div>

      {/* Stats */}
      <Suspense fallback={<DashboardStatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      {/* Tabs Section */}
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">
            <Calendar className="mr-2 h-4 w-4" />
            Upcoming Appointments
          </TabsTrigger>
          <TabsTrigger value="requests">
            <Clock className="mr-2 h-4 w-4" />
            Requests
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium">
              {requestCount}
            </span>
          </TabsTrigger>
          <TabsTrigger value="emergency">
            <InfoIcon className="mr-2 h-4 w-4" />
            Emergency Cases
            <span className="ml-2 rounded-full bg-red-500/10 text-red-500 px-2 py-0.5 text-xs font-medium">
              3
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Upcoming Appointments */}
        <TabsContent value="upcoming" className="space-y-4">
          <Suspense fallback={<AppointmentsSkeleton />}>
            <UpcomingAppointments paramDoctorId={doctor?._id} />
          </Suspense>
        </TabsContent>

        {/* Requests */}
        <TabsContent value="requests" className="space-y-4">
          <Suspense fallback={<AppointmentsSkeleton />}>
            <AppointmentsList
              paramDoctorId={doctor?._id}
              onRequestCountChange={setRequestCount}
            />
          </Suspense>
        </TabsContent>

        {/* Emergency Cases */}
        <TabsContent value="emergency" className="space-y-4">
          <Suspense fallback={<EmergencyCasesSkeleton />}>
            <EmergencyCases />
          </Suspense>
        </TabsContent>
      </Tabs>

      {/* Bottom Grid Section */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
            <CardDescription>
              Recent diagnostic trends and suggestions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<PatientInsightsSkeleton />}>
              <PatientInsights />
            </Suspense>
          </CardContent>
        </Card>

        {/* Recent Prescriptions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Prescriptions</CardTitle>
            <CardDescription>Last 5 prescriptions issued</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div>
                    <div className="font-medium">Patient {i + 1}</div>
                    <div className="text-sm text-muted-foreground">
                      Antibiotics + Pain Relief
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
            <CardDescription>Recent transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <PaymentRow label="Today" amount="$425.00" trend="up" />
              <PaymentRow label="This Week" amount="$1,850.00" trend="up" />
              <PaymentRow label="This Month" amount="$7,230.00" trend="up" />
              <PaymentRow label="Outstanding" amount="$325.00" trend="down" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* --- Helper Components --- */

function PaymentRow({ label, amount, trend }: { label: string; amount: string; trend: "up" | "down" }) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm font-medium">{label}</div>
      <div
        className={`flex gap-2 items-center ${
          trend === "up" ? "text-emerald-600" : "text-red-500"
        }`}
      >
        {trend === "up" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
        <span className="font-medium">{amount}</span>
      </div>
    </div>
  );
}

/* --- Skeleton Components --- */

function DashboardStatsSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-4 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AppointmentsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="ml-auto flex gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmergencyCasesSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="ml-auto flex gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PatientInsightsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
    </div>
  );
}
