const mongoose = require("mongoose");

const SymptomSpecialistSchema = new mongoose.Schema({
    symptom: { type: String, required: true, unique: true }, // Each symptom should be unique
    specialist: { type: String, required: true } // The specialist who treats the symptom
});

module.exports = mongoose.model("SymptomSpecialist", SymptomSpecialistSchema);
