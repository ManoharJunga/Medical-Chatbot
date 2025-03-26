const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true }, // Time slot (e.g., "10:00 AM - 10:30 AM")
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  notes: String,
});

module.exports = mongoose.model("Appointment", appointmentSchema);
