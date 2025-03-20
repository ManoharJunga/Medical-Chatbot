import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, User, Video, MapPin } from "lucide-react"

const appointments = [
  {
    id: 1,
    patientName: "Jane Cooper",
    patientAvatar: "/placeholder.svg?height=40&width=40",
    patientInitials: "JC",
    time: "9:00 AM - 9:30 AM",
    type: "Video Call",
    details: "Routine Check-up",
    isOnline: true,
  },
  {
    id: 2,
    patientName: "John Smith",
    patientAvatar: "/placeholder.svg?height=40&width=40",
    patientInitials: "JS",
    time: "10:15 AM - 10:45 AM",
    type: "In-Person",
    details: "Blood Pressure Follow-up",
    isOnline: false,
  },
  {
    id: 3,
    patientName: "Emily Johnson",
    patientAvatar: "/placeholder.svg?height=40&width=40",
    patientInitials: "EJ",
    time: "11:30 AM - 12:15 PM",
    type: "Video Call",
    details: "Medication Review",
    isOnline: true,
  },
  {
    id: 4,
    patientName: "Michael Davis",
    patientAvatar: "/placeholder.svg?height=40&width=40",
    patientInitials: "MD",
    time: "2:00 PM - 2:30 PM",
    type: "In-Person",
    details: "Post-surgery Check-up",
    isOnline: false,
  },
]

export function UpcomingAppointments() {
  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <Card key={appointment.id}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={appointment.patientAvatar} alt={appointment.patientName} />
                <AvatarFallback>{appointment.patientInitials}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{appointment.patientName}</h3>
                  <Badge variant={appointment.isOnline ? "default" : "outline"}>
                    {appointment.isOnline ? (
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
                  <span>{appointment.time}</span>
                  <span>•</span>
                  <span>{appointment.details}</span>
                </div>
              </div>
              <div className="ml-auto flex gap-2">
                <Button variant="outline" size="sm">
                  <User className="mr-2 h-4 w-4" />
                  View Profile
                </Button>
                {appointment.isOnline && (
                  <Button size="sm">
                    <Video className="mr-2 h-4 w-4" />
                    Start Call
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

