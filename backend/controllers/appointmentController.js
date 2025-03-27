const Appointment = require("../models/appointment.model");
const DoctorSchedule = require("../models/doctorSchedule.model");

// Create a new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { doctor, patient, date, timeSlot, status, notes } = req.body;

    // Check if the slot is already booked
    const existingAppointment = await Appointment.findOne({ doctor, date, timeSlot });

    if (existingAppointment) {
      return res.status(400).json({ success: false, message: "Time slot already booked. Please select another slot." });
    }

    // Create the appointment
    const appointment = new Appointment({ doctor, patient, date, timeSlot, status, notes });
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
    const appointments = await Appointment.find({ 
      doctor: req.params.doctorId, 
      status: { $ne: "confirmed" }  // Exclude confirmed appointments
    })
    .populate("doctor")
    .populate("patient");

    if (!appointments.length) {
      return res.status(404).json({ success: false, message: "No pending appointments found for this doctor" });
    }

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching appointments", error: error.message });
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
    const { doctorId, date } = req.params;

    // Fetch doctor's schedule
    const schedule = await DoctorSchedule.findOne({ doctor: doctorId });

    if (!schedule) {
      return res.status(404).json({ success: false, message: "Doctor's schedule not found" });
    }

    // Get booked slots for the selected date
    const bookedAppointments = await Appointment.find({ doctor: doctorId, date }).select("timeSlot");

    const bookedSlots = bookedAppointments.map(app => app.timeSlot);
    const availableSlots = schedule.availableSlots.filter(slot => !bookedSlots.includes(slot));

    res.status(200).json({ success: true, availableSlots });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching available slots", error: error.message });
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

exports.getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    if (!doctorId || !date) {
      return res.status(400).json({ success: false, message: "Doctor ID and date are required" });
    }

    // Define available slots
    const allSlots = [
      "09:00 AM - 10:00 AM",
      "10:00 AM - 11:00 AM",
      "11:00 AM - 12:00 PM",
      "01:00 PM - 02:00 PM",
      "02:00 PM - 03:00 PM",
      "03:00 PM - 04:00 PM",
      "04:00 PM - 05:00 PM"
    ];

    // Fetch booked slots
    const bookedAppointments = await Appointment.find({ doctor: doctorId, date }).select("timeSlot");
    const bookedSlots = bookedAppointments.map((appt) => appt.timeSlot);

    // Filter available slots
    const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));

    res.status(200).json({ success: true, slots: availableSlots });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching slots", error: error.message });
  }
};

