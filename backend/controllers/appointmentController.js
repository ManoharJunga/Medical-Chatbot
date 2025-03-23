const Appointment = require("../models/appointment.model");

// Create a new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { doctor, patient, date, status, notes } = req.body;

    const appointment = new Appointment({ doctor, patient, date, status, notes });
    await appointment.save();

    res.status(201).json({ success: true, message: "Appointment created successfully", appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating appointment", error: error.message });
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

// Get appointments by Doctor ID
exports.getAppointmentsByDoctor = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.params.doctorId }).populate("doctor").populate("patient");
    
    if (!appointments.length) {
      return res.status(404).json({ success: false, message: "No appointments found for this doctor" });
    }

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching appointments", error: error.message });
  }
};

// Update an appointment
exports.updateAppointment = async (req, res) => {
  try {
    const { doctor, patient, date, status, notes } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { doctor, patient, date, status, notes },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.status(200).json({ success: true, message: "Appointment updated successfully", appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating appointment", error: error.message });
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
