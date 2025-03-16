const Doctor = require("../models/Doctor.model");

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

// Get doctors based on symptoms
exports.getDoctorsBySymptoms = async (req, res) => {
    try {
        const { symptoms } = req.body;
        if (!symptoms || !Array.isArray(symptoms)) {
            return res.status(400).json({ error: "Invalid symptoms input" });
        }

        // Find doctors who match at least one of the symptoms
        const doctors = await Doctor.find({ symptoms: { $in: symptoms } });

        if (doctors.length === 0) {
            return res.status(404).json({ message: "No doctors found for the given symptoms" });
        }

        res.status(200).json(doctors);
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
