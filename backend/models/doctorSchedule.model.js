const mongoose = require("mongoose");

const doctorScheduleSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  availableSlots: [{ type: String, required: true }], // List of available time slots
});

module.exports = mongoose.model("DoctorSchedule", doctorScheduleSchema);
