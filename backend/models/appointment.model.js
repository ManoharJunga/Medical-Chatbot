// models/appointment.model.js
const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  // For manual appointments
  patientName: {
    type: String,
  },
  patientPhone: {
    type: String,
  },
  date: {
    type: String,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },

  // 🧠 New structured field for AI analysis
  aiAnalysis: {
    identifiedSymptoms: [String],
    summary: String,
    possibleConditions: [
      {
        name: String,
        probability: String,
        description: String
      }
    ],
    recommendedAction: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
