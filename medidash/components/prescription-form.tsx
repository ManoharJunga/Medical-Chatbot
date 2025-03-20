"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileDown, Printer, Send } from "lucide-react"

export function PrescriptionForm() {
  const [medications, setMedications] = useState<
    Array<{
      id: number
      name: string
      dosage: string
      frequency: string
      duration: string
    }>
  >([
    {
      id: 1,
      name: "",
      dosage: "",
      frequency: "",
      duration: "",
    },
  ])

  const addMedication = () => {
    setMedications([
      ...medications,
      {
        id: medications.length + 1,
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
      },
    ])
  }

  const removeMedication = (id: number) => {
    if (medications.length > 1) {
      setMedications(medications.filter((med) => med.id !== id))
    }
  }

  const updateMedication = (id: number, field: "name" | "dosage" | "frequency" | "duration", value: string) => {
    setMedications(medications.map((med) => (med.id === id ? { ...med, [field]: value } : med)))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Prescription</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="patient">Patient</Label>
          <Select>
            <SelectTrigger id="patient">
              <SelectValue placeholder="Select patient" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jane">Jane Cooper</SelectItem>
              <SelectItem value="john">John Smith</SelectItem>
              <SelectItem value="emily">Emily Johnson</SelectItem>
              <SelectItem value="michael">Michael Davis</SelectItem>
              <SelectItem value="thomas">Thomas Harris</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Medications</Label>
            <Button type="button" variant="outline" size="sm" onClick={addMedication}>
              Add Medication
            </Button>
          </div>

          <div className="space-y-4">
            {medications.map((med, index) => (
              <div key={med.id} className="space-y-2 rounded-md border p-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor={`med-name-${med.id}`}>Medication</Label>
                    <Input
                      id={`med-name-${med.id}`}
                      placeholder="Medication name"
                      value={med.name}
                      onChange={(e) => updateMedication(med.id, "name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`med-dosage-${med.id}`}>Dosage</Label>
                    <Input
                      id={`med-dosage-${med.id}`}
                      placeholder="e.g., 500mg"
                      value={med.dosage}
                      onChange={(e) => updateMedication(med.id, "dosage", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor={`med-frequency-${med.id}`}>Frequency</Label>
                    <Select onValueChange={(value) => updateMedication(med.id, "frequency", value)}>
                      <SelectTrigger id={`med-frequency-${med.id}`}>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once">Once daily</SelectItem>
                        <SelectItem value="twice">Twice daily</SelectItem>
                        <SelectItem value="three">Three times daily</SelectItem>
                        <SelectItem value="four">Four times daily</SelectItem>
                        <SelectItem value="asneeded">As needed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`med-duration-${med.id}`}>Duration</Label>
                    <Input
                      id={`med-duration-${med.id}`}
                      placeholder="e.g., 7 days"
                      value={med.duration}
                      onChange={(e) => updateMedication(med.id, "duration", e.target.value)}
                    />
                  </div>
                </div>
                {medications.length > 1 && (
                  <div className="pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeMedication(med.id)}
                      className="w-full text-destructive hover:bg-destructive/10"
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="instructions">Special Instructions</Label>
          <Textarea id="instructions" placeholder="Enter any special instructions..." rows={3} />
        </div>

        <div className="flex flex-col gap-2">
          <Button className="w-full">
            <Send className="mr-2 h-4 w-4" />
            Generate Prescription
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" className="flex-1">
              <Send className="mr-2 h-4 w-4" />
              Send to Patient
            </Button>
            <Button variant="outline" className="flex-1">
              <FileDown className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

