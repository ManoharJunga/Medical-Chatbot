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

  // Fetch Appointments when doctorId or selectedDate changes
  useEffect(() => {
    async function fetchAppointments() {
      if (!doctorId) {
        console.log("No doctorId available, skipping fetch.");
        return;
      }
      console.log("Fetching appointments for Doctor ID:", doctorId);

      try {
        const response = await axios.get(
          `http://localhost:5001/api/appointments/doctor/${doctorId}`
        );
        const data = response.data;
        console.log("API Response:", data);

        if (data.success && Array.isArray(data.appointments)) {
          setAppointments(data.appointments);
          console.log("Appointments Updated:", data.appointments);
        } else {
          setAppointments([]);
          console.log("Appointments List is Empty.");
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppointments([]);
      }
    }
    fetchAppointments();
  }, [doctorId, selectedDate]); // Trigger fetch when doctorId or selectedDate changes

  // Initialize Time Slots
  useEffect(() => {
    setTimeSlots([
      "09:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "02:00 PM",
      "03:00 PM",
      "04:00 PM",
      "05:00 PM",
    ]);
    console.log("Time Slots Initialized");
  }, []);

  function formatTime(dateTime: string): string {
    const date = new Date(dateTime);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`;
  }

  function filterAppointmentsByDate(date: string) {
    console.log("Filtering Appointments for Date:", date);
    const filteredAppointments = appointments.filter(
      (appointment) => new Date(appointment.date).toISOString().split("T")[0] === date
    );
    console.log("Filtered Appointments:", filteredAppointments);
    return filteredAppointments;
  }

  return (
    <div className="flex w-full h-screen p-4 gap-4">
      {/* Sidebar Calendar */}
      <div className="w-1/4 bg-gray-100 p-4 rounded-lg shadow-md">
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
              const appointmentsOnSelectedDate = filterAppointmentsByDate(selectedDate);
              const appointmentsInSlot = appointmentsOnSelectedDate.filter(
                (appointment) => formatTime(appointment.date) === timeSlot
              );

              console.log(`Time Slot: ${timeSlot}`, appointmentsInSlot);

              return (
                <div key={timeSlot} className="flex items-start gap-4 py-2 border-t first:border-t-0">
                  <div className="font-medium w-32">{timeSlot}</div>
                  <div className="flex flex-col space-y-2">
                    {appointmentsInSlot.length > 0 ? (
                      appointmentsInSlot.map((appointment) => (
                        <div key={appointment._id} className="p-2 bg-blue-100 rounded">
                          <p>
                            <strong>Patient:</strong> {appointment.patient.name}
                          </p>
                          <p>
                            <strong>Notes:</strong> {appointment.notes}
                          </p>
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
    </div>
  );
}
