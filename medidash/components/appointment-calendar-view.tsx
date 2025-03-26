"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

interface Appointment {
  _id: string;
  doctor: {
    _id: string;
    name: string;
    specialty: string;
  };
  patient: {
    _id: string;
    name: string;
    phone: string;
  };
  date: string;
  status: string;
  notes: string;
}

export function AppointmentCalendarView() {
  const { doctorId: paramDoctorId } = useParams();
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0] // Default to today’s date
  );

  // Load doctor ID from URL or localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedDoctor = localStorage.getItem("doctor");
      const doctor = storedDoctor ? JSON.parse(storedDoctor) : null;
      const finalDoctorId = paramDoctorId || doctor?._id || null;
      setDoctorId(finalDoctorId);
      console.log("Doctor ID Set:", finalDoctorId);
    }
  }, [paramDoctorId]);

  // Fetch Available Slots & Appointments
  useEffect(() => {
    async function fetchAppointmentsAndSlots() {
      if (!doctorId) {
        console.log("No doctorId available, skipping fetch.");
        return;
      }
  
      console.log("Fetching appointments & available slots for Doctor ID:", doctorId);
  
      try {
        const response = await axios.get(
          `http://localhost:5001/api/appointments/available-slots?doctorId=${doctorId}&date=${selectedDate}`
        );
        const data = response.data;
        console.log("API Response:", data);
  
        if (data.success) {
          setTimeSlots(data.slots || []); // ✅ Store available slots
          setAppointments(data.bookedAppointments || []); // ✅ Store booked appointments
          console.log("Available Slots Updated:", data.slots);
          console.log("Booked Appointments Updated:", data.bookedAppointments);
        } else {
          setTimeSlots([]);
          setAppointments([]);
          console.log("No available slots or booked appointments.");
        }
      } catch (error) {
        console.error("Error fetching appointments and slots:", error);
        setTimeSlots([]);
        setAppointments([]);
      }
    }
  
    fetchAppointmentsAndSlots();
  }, [doctorId, selectedDate]);
  
  

  function formatTime(dateTime: string): string {
    const date = new Date(dateTime);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`;
  }

  return (
    <div className="flex w-full h-screen p-4 gap-4">
      {/* Sidebar Calendar */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Calendar</h3>
        <p className="text-sm text-gray-600 mb-4">Select a date to view appointments</p>
        <div className="bg-white p-3 rounded-lg">
          <input
            type="date"
            className="w-full p-2 border rounded-lg"
            value={selectedDate}
            onChange={(e) => {
              console.log("Selected Date Changed:", e.target.value);
              setSelectedDate(e.target.value);
            }}
          />
        </div>
      </div>

      {/* Appointment List */}
      <div className="w-3/4 bg-white p-6 rounded-lg shadow-md">
  <h2 className="text-xl font-semibold mb-4">Appointments</h2>
  {doctorId ? (
    <div className="space-y-3">
      {timeSlots.map((timeSlot) => {
        // Find appointments for the current time slot
        const appointmentsInSlot = appointments.filter(
          (appointment) => formatTime(appointment.date) === timeSlot
        );

        return (
          <div key={timeSlot} className="flex items-start gap-4 py-2 border-t first:border-t-0">
            <div className="font-medium w-32">{timeSlot}</div>
            <div className="flex flex-col space-y-2">
              {appointmentsInSlot.length > 0 ? (
                // ✅ Show booked appointments
                appointmentsInSlot.map((appointment) => (
                  <div key={appointment._id} className="p-2 bg-red-100 rounded">
                    <p>
                      <strong>Patient:</strong> {appointment.patient.name}
                    </p>
                    <p>
                      <strong>Notes:</strong> {appointment.notes}
                    </p>
                  </div>
                ))
              ) : (
                // ✅ Show available slots
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
