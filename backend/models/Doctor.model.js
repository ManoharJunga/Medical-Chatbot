const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: String,
  specialty: String,
  symptoms: [String],
  location: String,
  contact: String,
});

module.exports = mongoose.model("Doctor", doctorSchema);
