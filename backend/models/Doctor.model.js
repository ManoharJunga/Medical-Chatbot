const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  specialty: { type: String, required: true },
  location: String,
  contact: String,
  verified: { type: Boolean, default: false }, // Email verification
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }],
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }],
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model("Doctor", doctorSchema);
