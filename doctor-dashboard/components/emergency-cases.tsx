import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, Phone, User, Video } from "lucide-react"

const emergencyCases = [
  {
    id: 1,
    patientName: "Thomas Harris",
    patientAvatar: "/placeholder.svg?height=40&width=40",
    patientInitials: "TH",
    symptoms: "Severe Chest Pain, Shortness of Breath",
    time: "10 minutes ago",
    aiConfidence: "High (95%)",
    aiSuggestion: "Possible Myocardial Infarction",
  },
  {
    id: 2,
    patientName: "Lisa Garcia",
    patientAvatar: "/placeholder.svg?height=40&width=40",
    patientInitials: "LG",
    symptoms: "Severe Abdominal Pain, Nausea, Fever",
    time: "25 minutes ago",
    aiConfidence: "Medium (78%)",
    aiSuggestion: "Possible Appendicitis",
  },
  {
    id: 3,
    patientName: "James Williams",
    patientAvatar: "/placeholder.svg?height=40&width=40",
    patientInitials: "JW",
    symptoms: "Slurred Speech, Facial Drooping, Arm Weakness",
    time: "35 minutes ago",
    aiConfidence: "High (92%)",
    aiSuggestion: "Possible Stroke",
  },
]

export function EmergencyCases() {
  return (
    <div className="space-y-4">
      {emergencyCases.map((emergency) => (
        <Card key={emergency.id} className="border-red-200 bg-red-50/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={emergency.patientAvatar} alt={emergency.patientName} />
                <AvatarFallback>{emergency.patientInitials}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{emergency.patientName}</h3>
                  <Badge variant="destructive" className="font-medium">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Emergency
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Reported: {emergency.time}</span>
                </div>
                <div className="mt-1 text-sm font-medium text-red-600">Symptoms: {emergency.symptoms}</div>
                <div className="mt-1 text-xs">
                  <span className="font-medium">AI Diagnosis:</span> {emergency.aiSuggestion} ({emergency.aiConfidence}{" "}
                  confidence)
                </div>
              </div>
              <div className="ml-auto flex gap-2">
                <Button variant="outline" size="sm">
                  <User className="mr-2 h-4 w-4" />
                  View Profile
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="mr-2 h-4 w-4" />
                  Call
                </Button>
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  <Video className="mr-2 h-4 w-4" />
                  Emergency Consult
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

