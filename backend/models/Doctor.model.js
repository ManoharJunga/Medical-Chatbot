const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

// Hash password before saving
doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("Doctor", doctorSchema);
