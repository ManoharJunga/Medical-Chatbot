"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileDown, Printer, Send } from "lucide-react"

export function PrescriptionForm() {
  const [doctorId, setDoctorId] = useState<string | null>(null)
  const [patients, setPatients] = useState<{ _id: string; name: string }[]>([])
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
  const [instructions, setInstructions] = useState("")
  const [loading, setLoading] = useState(true) // Loading state
  const [medications, setMedications] = useState([
    { id: 1, name: "", dosage: "", frequency: "", duration: "" },
  ])

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedDoctor = localStorage.getItem("doctor");
    const doctor = storedDoctor ? JSON.parse(storedDoctor) : null;
    console.log(storedDoctor);
    setDoctorId(doctor?._id || null);
  }, []);

  useEffect(() => {
    if (!doctorId) return;
  
    async function fetchPatients() {
      try {
        setLoading(true);
        console.log("Fetching patients for doctorId:", doctorId);
  
        const response = await fetch(`http://localhost:5001/api/prescriptions/doctor/${doctorId}/patients`);
        if (!response.ok) throw new Error("Failed to fetch patients");
        const data = await response.json();
        
        console.log("API Response:", data);
  
        if (!data.treatedPatients || data.treatedPatients.length === 0) {
          console.log("No treated patients found");
          setPatients([]);
          return;
        }
        // Fetch full patient details for each ID
        const patientDetails = await Promise.all(
          data.treatedPatients.map(async (patientId) => {
            console.log(`Fetching details for patient ID: ${patientId}`);
            const patientResponse = await fetch(`http://localhost:5001/api/users/${patientId}`);

            if (!patientResponse.ok) {
              console.error(`Failed to fetch details for patient ID: ${patientId}`);
              throw new Error(`Failed to fetch patient details for ID: ${patientId}`);
            }

            const patientData = await patientResponse.json();
            console.log(`Patient details for ${patientId}:`, patientData);
            return patientData;
          })
        );
  
        setPatients(patientDetails);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchPatients();
  }, [doctorId]);
  
  

  const addMedication = () => {
    setMedications([...medications, { id: medications.length + 1, name: "", dosage: "", frequency: "", duration: "" }])
  }

  const removeMedication = (id: number) => {
    if (medications.length > 1) {
      setMedications(medications.filter((med) => med.id !== id))
    }
  }

  const updateMedication = (id: number, field: string, value: string) => {
    setMedications(medications.map((med) => (med.id === id ? { ...med, [field]: value } : med)))
  }

  const handleSubmit = async () => {
    if (!selectedPatient || medications.some((med) => !med.name || !med.dosage || !med.frequency || !med.duration)) {
      alert("Please fill in all fields")
      return
    }

    const prescriptionData = {
      patient: selectedPatient,
      doctor: doctorId,
      medications: medications.map(({ id, ...med }) => med),
      instructions,
    }

    try {
      const response = await fetch("http://localhost:5001/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prescriptionData),
      });

      if (response.ok) {
        alert("Prescription generated successfully!");
      } else {
        alert("Error saving prescription");
      }
    } catch (error) {
      console.error("Error submitting prescription:", error);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Prescription</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Patient Selection */}
        <div className="space-y-2">
          <Label htmlFor="patient">Patient</Label>
          {loading ? (
            <p>Loading patients...</p>
          ) : (
            <Select onValueChange={(value) => setSelectedPatient(value)}>
              <SelectTrigger id="patient">
                <SelectValue placeholder="Select patient" />
              </SelectTrigger>
              <SelectContent>
                {patients?.length > 0 ? (
                  patients.map((patient) => (
                    <SelectItem key={patient._id} value={patient._id || "unknown"}>
                      {patient.name}
                    </SelectItem>
                  ))
                ) : (
                  <p>No patients available</p>
                )}

              </SelectContent>
            </Select>
          )}
        </div>

        {/* Medications */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Medications</Label>
            <Button type="button" variant="outline" size="sm" onClick={addMedication}>
              Add Medication
            </Button>
          </div>

          <div className="space-y-4">
            {medications.map((med) => (
              <div key={med.id} className="space-y-2 rounded-md border p-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor={`med-name-${med.id}`}>Medication</Label>
                    <Input id={`med-name-${med.id}`} placeholder="Medication name" value={med.name} onChange={(e) => updateMedication(med.id, "name", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`med-dosage-${med.id}`}>Dosage</Label>
                    <Input id={`med-dosage-${med.id}`} placeholder="e.g., 500mg" value={med.dosage} onChange={(e) => updateMedication(med.id, "dosage", e.target.value)} />
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
                    <Input id={`med-duration-${med.id}`} placeholder="e.g., 7 days" value={med.duration} onChange={(e) => updateMedication(med.id, "duration", e.target.value)} />
                  </div>
                </div>
                {medications.length > 1 && (
                  <div className="pt-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => removeMedication(med.id)} className="w-full text-destructive hover:bg-destructive/10">
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <Button className="w-full" onClick={handleSubmit}>
            <Send className="mr-2 h-4 w-4" />
            Generate Prescription
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
