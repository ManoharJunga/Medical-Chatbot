"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { getUserFromLocalStorage } from "./services/userService";

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
}

const BookAppointment = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const doctorId = searchParams.get("doctorId");

  const [user, setUser] = useState<{ id: string } | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch user from local storage
  useEffect(() => {
    const userData = getUserFromLocalStorage();
    if (!userData) {
      alert("Please log in to book an appointment.");
      router.push("/login");
    } else {
      setUser(userData);
    }
  }, [router]);

  // Fetch doctor details
  useEffect(() => {
    if (!doctorId) return;

    axios
      .get(`http://localhost:5001/api/doctors/docuser/${doctorId}`)
      .then((res) => setDoctor(res.data))
      .catch((err) => console.error("Error fetching doctor:", err));
  }, [doctorId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      await axios.post("http://localhost:5001/api/appointments", {
        doctor: doctorId,
        patient: user.id,
        date,
        status: "pending",
        notes,
      });

      alert("Appointment booked successfully!");
      router.push("/appointments");
    } catch (error) {
      console.error("Failed to book appointment:", error.response?.data || error.message);
      alert("Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) return <p className="text-center text-gray-600">Loading doctor details...</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold text-gray-900">Book Appointment</h2>
      <p className="text-gray-600">{doctor.name} - {doctor.specialty}</p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <div>
          <label className="text-sm font-medium">Select Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded-md mt-1"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Notes</label>
          <textarea
            className="w-full p-2 border rounded-md mt-1"
            placeholder="Additional details..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? "Booking..." : "Confirm Appointment"}
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;
