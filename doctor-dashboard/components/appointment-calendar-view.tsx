import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, MoreHorizontal, User, Video } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function AppointmentCalendarView() {
  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ]

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
    {
      id: 5,
      patientName: "Thomas Harris",
      patientAvatar: "/placeholder.svg?height=40&width=40",
      patientInitials: "TH",
      time: "3:15 PM - 3:45 PM",
      type: "Video Call",
      details: "Emergency Consultation",
      isOnline: true,
      isEmergency: true,
    },
  ]

  // Helper function to determine if an appointment is in a time slot
  const isAppointmentInTimeSlot = (appointment: any, timeSlot: string) => {
    const [startTime] = appointment.time.split(" - ")
    return startTime === timeSlot
  }

  return (
    <div className="space-y-1">
      {timeSlots.map((timeSlot) => {
        const appointmentsInSlot = appointments.filter((appointment) => isAppointmentInTimeSlot(appointment, timeSlot))

        return (
          <div key={timeSlot} className="flex items-start gap-4 py-2 border-t first:border-t-0">
            <div className="w-20 pt-2 text-sm font-medium text-muted-foreground">{timeSlot}</div>

            <div className="flex-1">
              {appointmentsInSlot.length > 0 ? (
                <div className="space-y-2">
                  {appointmentsInSlot.map((appointment) => (
                    <div
                      key={appointment.id}
                      className={`
                        rounded-md border p-3 
                        ${
                          appointment.isEmergency
                            ? "border-red-200 bg-red-50/50"
                            : appointment.isOnline
                              ? "border-blue-200 bg-blue-50/50"
                              : "border-gray-200 bg-gray-50/50"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={appointment.patientAvatar} alt={appointment.patientName} />
                          <AvatarFallback>{appointment.patientInitials}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="font-medium">{appointment.patientName}</div>
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
                            {appointment.isEmergency && <Badge variant="destructive">Emergency</Badge>}
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{appointment.time}</span>
                            <span>•</span>
                            <span>{appointment.details}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <User className="mr-2 h-4 w-4" />
                            Profile
                          </Button>
                          {appointment.isOnline && (
                            <Button size="sm">
                              <Video className="mr-2 h-4 w-4" />
                              Call
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Reschedule</DropdownMenuItem>
                              <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Cancel</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-12 rounded-md border border-dashed border-gray-200 flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">No appointments</span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

