const mongoose = require("mongoose");

const SymptomSpecialistSchema = new mongoose.Schema({
    symptoms: [{ type: String, required: true }], // array of possible variations
    specialist: { type: String, required: true }
});


module.exports = mongoose.model("SymptomSpecialist", SymptomSpecialistSchema);
