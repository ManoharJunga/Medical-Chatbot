"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { getUserFromLocalStorage } from "./services/userService";
import { Badge } from "@/components/ui/badge";

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  contact?: string;
  location?: string;
}

interface Condition {
  name: string;
  probability: string;
  description: string;
}

interface AIAnalysis {
  identifiedSymptoms?: string[];
  summary?: string;
  possibleConditions?: Condition[];
  recommendedAction?: string;
}

const BookAppointment = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const doctorId = searchParams.get("doctorId");

  const [user, setUser] = useState<{ id: string } | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [date, setDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = getUserFromLocalStorage();
    if (!userData) {
      alert("Please log in to book an appointment.");
      router.push("/login");
    } else {
      setUser(userData);
    }
  }, [router]);

  useEffect(() => {
    if (!doctorId) return;

    axios
      .get(`http://localhost:5001/api/doctors/docuser/${doctorId}`)
      .then((res) => setDoctor(res.data))
      .catch((err) => console.error("Error fetching doctor:", err));
  }, [doctorId]);

  useEffect(() => {
    const stored = sessionStorage.getItem("aiAnalysis");
    if (stored) {
      try {
        setAiAnalysis(JSON.parse(stored));
      } catch (error) {
        console.error("Error parsing AI analysis:", error);
        setAiAnalysis({});
      }
    } else {
      setAiAnalysis({});
    }
  }, []);

  useEffect(() => {
    if (!doctorId || !date) return;

    axios
      .get(`http://localhost:5001/api/appointments/available-slots?doctorId=${doctorId}&date=${date}`)
      .then((res) => setAvailableSlots(res.data.availableSlots || []))
      .catch((err) => {
        console.error("Error fetching slots:", err);
        setAvailableSlots([]);
      });
  }, [doctorId, date]);
  const getNext7Days = () => {
    const days: { dayName: string; dateNum: number; dateString: string }[] = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" }); // Mon, Tue, etc.
      const dateNum = d.getDate();
      const dateString = d.toISOString().split("T")[0]; // yyyy-mm-dd
      days.push({ dayName, dateNum, dateString });
    }

    return days;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedSlot || !doctorId) return;

    setLoading(true);

    try {
      await axios.post("http://localhost:5001/api/appointments", {
        doctor: doctorId,
        patient: user.id,
        date,
        timeSlot: selectedSlot,
        status: "pending",
        notes,
        aiAnalysis: aiAnalysis || {},
      });

      sessionStorage.removeItem("aiAnalysis");
      alert("Appointment booked successfully!");
      router.push("/appointments");
    } catch (error: any) {
      console.error("Failed to book appointment:", error.response?.data || error.message);
      alert("Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) {
    return <p className="text-center text-gray-600 mt-10">Loading doctor details...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 space-y-6">
      {/* Doctor Info */}
      <div className="p-4 bg-white shadow-lg rounded-lg flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{doctor.name}</h2>
          <p className="text-gray-600">{doctor.specialty}</p>
          {doctor.contact && <p className="text-gray-600">Contact: {doctor.contact}</p>}
          {doctor.location && <p className="text-gray-600">Location: {doctor.location}</p>}
        </div>
      </div>

      {/* Horizontal Card Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* AI Analysis Card */}
        {aiAnalysis && (
          <div className="flex-1 p-6 bg-blue-50 border border-blue-200 rounded-lg shadow-md space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">AI Symptom Analysis</h3>

            {aiAnalysis.summary && (
              <div>
                <p className="font-medium text-gray-700 mb-1">Summary:</p>
                <p className="text-gray-700">{aiAnalysis.summary}</p>
              </div>
            )}

            {aiAnalysis.identifiedSymptoms?.length ? (
              <div>
                <p className="font-medium text-gray-700 mb-1">Identified Symptoms:</p>
                <div className="flex flex-wrap gap-2">
                  {aiAnalysis.identifiedSymptoms.map((symptom, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">{symptom}</Badge>
                  ))}
                </div>
              </div>
            ) : null}

            {aiAnalysis.possibleConditions?.length ? (
              <div>
                <p className="font-medium text-gray-700 mb-1">Possible Conditions:</p>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                  {aiAnalysis.possibleConditions.map((cond, idx) => (
                    <li key={idx}>
                      <strong>{cond.name}</strong> ({cond.probability}%) - {cond.description}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {aiAnalysis.recommendedAction && (
              <div>
                <p className="font-medium text-gray-700 mb-1">Recommended Action:</p>
                <p className="text-gray-700">{aiAnalysis.recommendedAction}</p>
              </div>
            )}
          </div>
        )}

        {/* Booking Form Card */}
        <div className="flex-1 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Book Appointment</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Custom Date Selector */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Select Date</label>
              <div className="grid grid-cols-4 gap-3">
                {getNext7Days().map((day) => (
                  <button
                    key={day.dateString}
                    type="button"
                    onClick={() => setDate(day.dateString)}
                    className={`
          flex flex-col items-center justify-center p-3 rounded-lg shadow cursor-pointer transition
          ${date === day.dateString
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700 hover:bg-blue-100"
                      }
        `}
                  >
                    <span className="text-sm font-semibold">{day.dayName}</span>
                    <span className="text-lg font-bold mt-1">{day.dateNum}</span>
                  </button>
                ))}
              </div>
            </div>



            {/* Time Slot */}
            {date && (
              <div>
                <label className="text-sm font-medium text-gray-700">Select Time Slot</label>
                <select
                  className="w-full p-2 border rounded-md mt-1"
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  required
                >
                  <option value="">Select a time slot</option>
                  {availableSlots.length > 0 ? (
                    availableSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)
                  ) : (
                    <option disabled>No slots available</option>
                  )}
                </select>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="text-sm font-medium text-gray-700">Notes</label>
              <textarea
                className="w-full p-2 border rounded-md mt-1 h-28"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add additional notes..."
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? "Booking..." : "Confirm Appointment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
