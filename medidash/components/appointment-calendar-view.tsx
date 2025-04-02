"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

interface Appointment {
  _id: string;
  doctor: { _id: string; name: string; specialty: string };
  patient: { _id: string; name: string; phone: string };
  date: string;
  timeSlot: string;
  status: string;
  notes: string;
}

export function AppointmentCalendarView() {
  const { doctorId: paramDoctorId } = useParams();
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedDoctor = localStorage.getItem("doctor");
      const doctor = storedDoctor ? JSON.parse(storedDoctor) : null;
      setDoctorId(paramDoctorId || doctor?._id || null);
    }
  }, [paramDoctorId]);

  useEffect(() => {
    const fetchAppointmentsAndSlots = async () => {
      if (!doctorId) return;

      try {
        const response = await axios.get(
          `http://localhost:5001/api/appointments/available-slots?doctorId=${doctorId}&date=${selectedDate}`
        );
        const data = response.data;

        setTimeSlots(data.success ? data.availableSlots || [] : []);
        setAppointments(data.success ? data.bookedAppointments || [] : []);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
        setTimeSlots([]);
        setAppointments([]);
      }
    };

    fetchAppointmentsAndSlots();
  }, [doctorId, selectedDate]);

  return (
    <div className="flex flex-col md:flex-row w-full p-6 gap-6">
      {/* Calendar Section */}
      <div className="bg-gray-100 p-5 rounded-lg shadow-md w-full md:w-1/4 flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-3">Select Date</h3>
        <input
          type="date"
          className="p-2 border rounded-lg w-full"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Appointments List Section */}
      <div className="bg-white p-6 rounded-lg shadow-md flex-1 w-full">
        <h2 className="text-xl font-semibold mb-4">Appointments</h2>

        {doctorId ? (
          <div className="space-y-4">
            {timeSlots.map((timeSlot) => {
              // Filter appointments for the current time slot
              const appointmentsInSlot = appointments.filter(
                (appointment) =>
                  appointment.timeSlot.trim().toLowerCase() ===
                  timeSlot.trim().toLowerCase()
              );

              return (
                <div key={timeSlot} className="border rounded-lg p-4">
                  <div className="font-medium text-lg text-gray-700">{timeSlot}</div>
                  <div className="mt-2 space-y-2">
                    {appointmentsInSlot.length > 0 ? (
                      appointmentsInSlot.map((appointment) => (
                        <div
                          key={appointment._id}
                          className="p-3 bg-red-100 border-l-4 border-red-400 rounded-md"
                        >
                          <p className="font-semibold">
                            {appointment.patient?.name || "N/A"}
                          </p>
                          <p className="text-sm">{appointment.timeSlot || "N/A"}</p>
                          <p className="text-sm text-gray-600">
                            {appointment.notes || "No notes provided"}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 bg-green-100 border-l-4 border-green-400 rounded-md">
                        <p className="text-gray-700">Available</p>
                      </div>
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
    </div>
  );
}
