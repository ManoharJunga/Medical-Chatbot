const Appointment = require("../models/appointment.model");
const DoctorSchedule = require("../models/doctorSchedule.model");
const Notification = require("../models/Notification");

// Create a new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { doctor, patient, date, timeSlot, status, notes, aiAnalysis } = req.body;

    // ✅ Create the appointment
    const newAppointment = new Appointment({
      doctor,
      patient,
      date,
      timeSlot,
      status,
      notes,
      aiAnalysis,
    });

    const savedAppointment = await newAppointment.save();

    // ✅ Automatically create a notification for the doctor
    const notification = new Notification({
      user: doctor, // notification belongs to the doctor
      title: "New Appointment Request",
      message: `A new appointment has been booked by patient ID ${patient} for ${date} at ${timeSlot}.`,
      type: "appointment",
      priority: "normal",
    });

    await notification.save();

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully and notification created.",
      data: savedAppointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({
      success: false,
      message: "Error creating appointment",
      error: error.message,
    });
  }
};

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("doctor").populate("patient");
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching appointments", error: error.message });
  }
};
exports.createManualAppointment = async (req, res) => {
  try {
    console.log("🟢 Incoming manual appointment data:", req.body);

    const { doctor, patientName, patientPhone, date, timeSlot, notes } = req.body;

    const newAppointment = new Appointment({
      doctor,
      patientName,
      patientPhone,
      date,
      timeSlot,
      notes,
      isManual: true, // Optional: mark it as manually created
    });

    await newAppointment.save();
    res.status(201).json({ success: true, appointment: newAppointment });
  } catch (error) {
    console.error("❌ Error creating manual appointment:", error);
    res.status(500).json({
      success: false,
      message: "Error creating manual appointment",
      error: error.message,
    });
  }
};


// Get an appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate("doctor").populate("patient");

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.status(200).json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching appointment", error: error.message });
  }
};
// Controller to fetch pending appointments
exports.getPendingAppointmentsByDoctor = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const appointments = await Appointment.find({ doctor: req.params.doctorId, status: { $ne: "confirmed" } })
      .populate("doctor")
      .populate("patient")
      .skip((page - 1) * limit)
      .limit(limit);

    if (!appointments.length) {
      return res.status(404).json({ success: false, message: "No pending appointments found for this doctor" });
    }

    const totalAppointments = await Appointment.countDocuments({ doctor: req.params.doctorId, status: { $ne: "confirmed" } });

    res.status(200).json({
      success: true,
      appointments,
      totalAppointments,
      totalPages: Math.ceil(totalAppointments / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching pending appointments", error: error.message });
  }
};
// Controller to fetch approved appointments
exports.getApprovedAppointmentsByDoctor = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const appointments = await Appointment.find({ doctor: req.params.doctorId, status: "confirmed" })
      .populate("doctor")
      .populate("patient")
      .skip((page - 1) * limit)
      .limit(limit);

    if (!appointments.length) {
      return res.status(404).json({ success: false, message: "No approved appointments found for this doctor" });
    }

    const totalAppointments = await Appointment.countDocuments({ doctor: req.params.doctorId, status: "confirmed" });

    res.status(200).json({
      success: true,
      appointments,
      totalAppointments,
      totalPages: Math.ceil(totalAppointments / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching approved appointments", error: error.message });
  }
};


// Update an appointment
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!["confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    // Find and update appointment
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.status(200).json({ success: true, message: `Appointment updated to ${status}`, appointment });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



// Delete an appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.status(200).json({ success: true, message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting appointment", error: error.message });
  }
};

exports.getAppointmentsByUser = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.params.userId })
      .populate("doctor")
      .populate("patient");

    if (!appointments.length) {
      return res.status(404).json({ success: false, message: "No appointments found for this user" });
    }

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching user appointments", error: error.message });
  }
};


exports.getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    if (!doctorId || !date) {
      return res.status(400).json({ success: false, message: "Doctor ID and date are required" });
    }

    const allSlots = [
      "09:00 AM - 10:00 AM",
      "10:00 AM - 11:00 AM",
      "11:00 AM - 12:00 PM",
      "01:00 PM - 02:00 PM",
      "02:00 PM - 03:00 PM",
      "03:00 PM - 04:00 PM",
      "04:00 PM - 05:00 PM"
    ];

    const schedule = await DoctorSchedule.findOne({ doctor: doctorId });
    const availableSlots = schedule ? schedule.availableSlots : allSlots;

    const bookedAppointments = await Appointment.find({ doctor: doctorId, date })
      .populate("patient", "name phone")
      .select("timeSlot patient notes aiAnalysis");

    const bookedSlots = bookedAppointments.map(app => ({
      timeSlot: app.timeSlot,
      patient: app.patient,
      notes: app.notes,
      aiAnalysis: app.aiAnalysis, // ✅ structured AI analysis
    }));

    const finalAvailableSlots = availableSlots.filter(
      slot => !bookedSlots.some(booked => booked.timeSlot === slot)
    );

    res.status(200).json({
      success: true,
      availableSlots: finalAvailableSlots,
      bookedAppointments: bookedSlots,
    });
  } catch (error) {
    console.error("Error fetching available slots:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching available slots",
      error: error.message,
    });
  }
};


exports.setAvailableSlots = async (req, res) => {
  try {
    const { doctor, availableSlots } = req.body;

    let schedule = await DoctorSchedule.findOne({ doctor });

    if (!schedule) {
      schedule = new DoctorSchedule({ doctor, availableSlots });
    } else {
      schedule.availableSlots = availableSlots;
    }

    await schedule.save();

    res.status(200).json({ success: true, message: "Available slots updated successfully", schedule });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating available slots", error: error.message });
  }
};

