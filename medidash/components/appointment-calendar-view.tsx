"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

interface Appointment {
  _id: string;
  doctor: { _id: string; name: string; specialty: string };
  patient: { _id: string; name: string; phone: string };
  date: string;
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
        setTimeSlots(data.success ? data.slots || [] : []);
        setAppointments(data.success ? data.bookedAppointments || [] : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setTimeSlots([]);
        setAppointments([]);
      }
    };
    fetchAppointmentsAndSlots();
  }, [doctorId, selectedDate]);

  const formatTime = (dateTime: string): string => {
    const date = new Date(dateTime);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`;
  };

  return (
    <div className="flex flex-col md:flex-row w-full p-4 gap-4">
      <div className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center w-full md:w-1/4">
        <h3 className="text-lg font-semibold mb-2">Calendar</h3>
        <p className="text-sm text-gray-600 mb-4">Select a date to view appointments</p>
        <input
          type="date"
          className="p-2 border rounded-lg w-full"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md flex-1 w-full">
        <h2 className="text-xl font-semibold mb-4">Appointments</h2>
        {doctorId ? (
          <div className="flex flex-col gap-3">
            {timeSlots.map((timeSlot) => {
              const appointmentsInSlot = appointments.filter(
                (appointment) => formatTime(appointment.date) === timeSlot
              );
              return (
                <div key={timeSlot} className="flex items-start gap-4 py-2 border-t first:border-t-0">
                  <div className="font-medium w-full">{timeSlot}</div>
                  <div className="flex flex-col gap-2">
                    {appointmentsInSlot.length > 0 ? (
                      appointmentsInSlot.map((appointment) => (
                        <div key={appointment._id} className="p-2 bg-red-100 rounded">
                          <p><strong>Patient:</strong> {appointment.patient.name}</p>
                          <p><strong>Notes:</strong> {appointment.notes}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-2 bg-green-100 rounded text-gray-600">Available</div>
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