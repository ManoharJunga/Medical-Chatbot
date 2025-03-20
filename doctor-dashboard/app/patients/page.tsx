import { Suspense } from "react"
import Link from "next/link"
import { ArrowRight, Plus, Search, Stethoscope } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export default function PatientsPage() {
  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">Manage all patient information</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search patients..." className="w-full pl-9" />
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Patient
          </Button>
        </div>
      </div>

      <Suspense fallback={<PatientTableSkeleton />}>
        <PatientTable />
      </Suspense>
    </div>
  )
}

function PatientTable() {
  const patients = [
    {
      id: 1,
      name: "Jane Cooper",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JC",
      age: 42,
      gender: "Female",
      condition: "Hypertension",
      lastVisit: "2 days ago",
      upcomingAppt: "Today, 9:00 AM",
      aiSuggestion: "Medication Review",
    },
    {
      id: 2,
      name: "John Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JS",
      age: 58,
      gender: "Male",
      condition: "Diabetes Type 2",
      lastVisit: "1 week ago",
      upcomingAppt: "Today, 10:15 AM",
      aiSuggestion: "Blood Sugar Monitoring",
    },
    {
      id: 3,
      name: "Emily Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "EJ",
      age: 35,
      gender: "Female",
      condition: "Migraine",
      lastVisit: "3 days ago",
      upcomingAppt: "Today, 11:30 AM",
      aiSuggestion: "Alternative Pain Management",
    },
    {
      id: 4,
      name: "Michael Davis",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MD",
      age: 62,
      gender: "Male",
      condition: "Post Surgery Care",
      lastVisit: "2 weeks ago",
      upcomingAppt: "Today, 2:00 PM",
      aiSuggestion: "Wound Assessment",
    },
    {
      id: 5,
      name: "Thomas Harris",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "TH",
      age: 68,
      gender: "Male",
      condition: "Coronary Artery Disease",
      lastVisit: "10 minutes ago",
      upcomingAppt: "Emergency",
      aiSuggestion: "Urgent Cardiac Assessment",
      isEmergency: true,
    },
  ]

  return (
    <Card>
      <CardHeader className="px-6 pt-6 pb-3">
        <CardTitle>All Patients</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Patient</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead>Upcoming Appointment</TableHead>
              <TableHead>AI Insights</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={patient.avatar} alt={patient.name} />
                      <AvatarFallback>{patient.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {patient.age} • {patient.gender}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {patient.isEmergency ? <Badge variant="destructive">{patient.condition}</Badge> : patient.condition}
                </TableCell>
                <TableCell>{patient.lastVisit}</TableCell>
                <TableCell>
                  {patient.isEmergency ? <Badge variant="destructive">Emergency</Badge> : patient.upcomingAppt}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Stethoscope className="h-3 w-3 text-primary" />
                    <span className="text-sm">{patient.aiSuggestion}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/patients/${patient.id}`}>
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
  )
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
              <TableHead>
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-16" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

