import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, User, Video, X, MapPin, CalendarPlus } from "lucide-react"

const appointmentRequests = [
  {
    id: 1,
    patientName: "Robert Brown",
    patientAvatar: "/placeholder.svg?height=40&width=40",
    patientInitials: "RB",
    requestedTime: "Tomorrow, 10:00 AM",
    type: "Video Call",
    reason: "Persistent Headache",
    isUrgent: false,
  },
  {
    id: 2,
    patientName: "Sarah Wilson",
    patientAvatar: "/placeholder.svg?height=40&width=40",
    patientInitials: "SW",
    requestedTime: "Tomorrow, 2:15 PM",
    type: "In-Person",
    reason: "Shoulder Pain",
    isUrgent: false,
  },
  {
    id: 3,
    patientName: "David Martinez",
    patientAvatar: "/placeholder.svg?height=40&width=40",
    patientInitials: "DM",
    requestedTime: "Today, 5:30 PM",
    type: "Video Call",
    reason: "Follow-up on Test Results",
    isUrgent: true,
  },
]

interface AppointmentsListProps {
  type: "requests" | "past"
}

export function AppointmentsList({ type }: AppointmentsListProps) {
  if (type === "requests") {
    return (
      <div className="space-y-4">
        {appointmentRequests.map((appointment) => (
          <Card key={appointment.id} className={appointment.isUrgent ? "border-amber-200" : ""}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={appointment.patientAvatar} alt={appointment.patientName} />
                  <AvatarFallback>{appointment.patientInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{appointment.patientName}</h3>
                    {appointment.isUrgent && (
                      <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                        Urgent
                      </Badge>
                    )}
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
                    <span>Requested: {appointment.requestedTime}</span>
                    <span>•</span>
                    <span>{appointment.reason}</span>
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
        ))}
      </div>
    )
  }

  return null
}

