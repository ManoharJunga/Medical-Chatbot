const Doctor = require("../models/Doctor.model");
const SymptomSpecialist = require("../models/SymptomSpecialist"); // Model mapping symptoms to specialists

// Add a new doctor
// Add a new doctor
exports.addDoctor = async (req, res) => {
    try {
        const { name, email, password, specialty, location, contact } = req.body;

        if (!name || !email || !password || !specialty) {
            return res.status(400).json({ error: "Name, email, password, and specialty are required" });
        }

        const newDoctor = new Doctor({ name, email, password, specialty, location, contact });
        await newDoctor.save();

        res.status(201).json({ message: "Doctor added successfully", doctor: newDoctor });
    } catch (error) {
        console.error("Error adding doctor:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// Get all doctors
exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json(doctors);
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await Doctor.findById(id);
        
        if (!doctor) {
            return res.status(404).json({ error: "Doctor not found" });
        }

        res.status(200).json(doctor);
    } catch (error) {
        console.error("Error fetching doctor by ID:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// Get doctors based on symptoms
exports.getDoctorsBySymptoms = async (req, res) => {
  try {
    let { symptoms } = req.body;

    // Ensure symptoms is always an array
    if (!Array.isArray(symptoms)) {
      if (typeof symptoms === "string") {
        symptoms = [symptoms];
      } else {
        return res.status(400).json({ message: "Symptoms must be a string or an array" });
      }
    }

    // Normalize input (to lowercase & trimmed)
    symptoms = symptoms.map(symptom => (typeof symptom === "string" ? symptom.toLowerCase().trim() : ""));

    const matchedSpecialists = [];

    // Loop through each symptom and find specialist
    for (const symptom of symptoms) {
      if (!symptom) continue;

      const mapping = await SymptomSpecialist.findOne({
        symptom: { $regex: new RegExp(`^${symptom}$`, "i") } // case-insensitive match
      });

      if (mapping) {
        matchedSpecialists.push(mapping.specialist);
      }
    }

    if (matchedSpecialists.length === 0) {
      return res.status(404).json({ message: "No specialists found for the given symptoms" });
    }

    // Find doctors who match any of the specialists
    const doctors = await Doctor.find({
      specialty: { $in: matchedSpecialists }
    });

    if (doctors.length === 0) {
      return res.status(404).json({ message: "No doctors available for the given symptoms" });
    }

    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Error finding doctors", error: error.message });
  }
};

// Update doctor details
exports.updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedDoctor = await Doctor.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedDoctor) {
            return res.status(404).json({ error: "Doctor not found" });
        }

        res.status(200).json({ message: "Doctor updated successfully", doctor: updatedDoctor });
    } catch (error) {
        console.error("Error updating doctor:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete a doctor
exports.deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDoctor = await Doctor.findByIdAndDelete(id);

        if (!deletedDoctor) {
            return res.status(404).json({ error: "Doctor not found" });
        }

        res.status(200).json({ message: "Doctor deleted successfully" });
    } catch (error) {
        console.error("Error deleting doctor:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
