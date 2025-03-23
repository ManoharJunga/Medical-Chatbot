"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Appointment {
  _id: string;
  doctorId: string;
  date: string;
  time: string;
}

export function AppointmentCalendarView() {
  const { doctorId: paramDoctorId } = useParams();
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  // ✅ Fetch doctor ID from localStorage inside useEffect (Client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedDoctor = localStorage.getItem("doctor");
      const doctor = storedDoctor ? JSON.parse(storedDoctor) : null;
      setDoctorId(paramDoctorId || doctor?._id || null);
    }
  }, [paramDoctorId]);

  // ✅ Fetch Appointments
  useEffect(() => {
    async function fetchAppointments() {
      if (!doctorId) return;

      try {
        const response = await fetch(`http://localhost:5001/api/appointments/doctor/${doctorId}`);
        const data = await response.json();
        console.log("Fetched Appointments:", data);

        setAppointments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppointments([]);
      }
    }

    fetchAppointments();
  }, [doctorId]);

  // ✅ Define Time Slots
  useEffect(() => {
    setTimeSlots([
      "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
      "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
    ]);
  }, []);

  // ✅ Function to check if an appointment is in a specific time slot
  function isAppointmentInTimeSlot(appointment: Appointment, timeSlot: string) {
    return appointment.time === timeSlot;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Appointments</h2>
      {doctorId ? (
        <div className="space-y-1">
          {timeSlots.map((timeSlot) => {
            const appointmentsInSlot = appointments.filter((appointment) =>
              isAppointmentInTimeSlot(appointment, timeSlot)
            );

            return (
              <div key={timeSlot} className="flex items-start gap-4 py-2 border-t first:border-t-0">
                <div className="font-medium">{timeSlot}</div>
                <div className="flex flex-col space-y-2">
                  {appointmentsInSlot.length > 0 ? (
                    appointmentsInSlot.map((appointment) => (
                      <div key={appointment._id} className="p-2 bg-blue-100 rounded">
                        Appointment at {appointment.time}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">No appointments</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-red-500">Doctor ID is missing. Please log in again.</p>
      )}
    </div>
  );
}
