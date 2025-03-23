const Doctor = require("../models/Doctor.model");
const SymptomSpecialist = require("../models/SymptomSpecialist"); // Model mapping symptoms to specialists

// Add a new doctor
exports.addDoctor = async (req, res) => {
    try {
        const { name, specialty, symptoms, location, contact } = req.body;
        const newDoctor = new Doctor({ name, specialty, symptoms, location, contact });
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
        const { symptoms } = req.body;
        console.log("Received symptoms:", symptoms); // Log received symptoms

        if (!symptoms || !Array.isArray(symptoms)) {
            console.log("Invalid symptoms input");
            return res.status(400).json({ error: "Invalid symptoms input" });
        }

        // Fetch all symptom-specialist mappings
        const allMappings = await SymptomSpecialist.find({});
        console.log("Fetched Symptom-Specialist Mappings:", allMappings); // Log fetched mappings

        // Create a dictionary of symptoms to specialists
        const symptomToSpecialist = {};
        allMappings.forEach(mapping => {
            symptomToSpecialist[mapping.symptom] = mapping.specialist;
        });

        console.log("Symptom to Specialist Dictionary:", symptomToSpecialist); // Log mapping dictionary

        // Find specialists for the given symptoms
        const specialists = new Set();
        symptoms.forEach(symptom => {
            if (symptomToSpecialist[symptom]) {
                specialists.add(symptomToSpecialist[symptom]);
            }
        });

        console.log("Identified Specialists:", [...specialists]); // Log identified specialists

        if (specialists.size === 0) {
            console.log("No specialists found for the given symptoms");
            return res.status(404).json({ message: "No specialists found for the given symptoms" });
        }

        // Fetch doctors based on the found specialists
        const doctors = await Doctor.find({ specialty: { $in: [...specialists] } });
        console.log("Fetched Doctors:", doctors); // Log fetched doctors

        if (doctors.length === 0) {
            console.log("No doctors found for the given symptoms");
            return res.status(404).json({ message: "No doctors found for the given symptoms" });
        }

        res.status(200).json({ specialists: [...specialists], doctors });
    } catch (error) {
        console.error("Error finding doctors:", error);
        res.status(500).json({ error: "Internal Server Error" });
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
