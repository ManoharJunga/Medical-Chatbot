const Prescription = require("../models/Prescription");

// Create a new prescription
exports.createPrescription = async (req, res) => {
  try {
    const { doctor, patient, medications, status = "active" } = req.body;
    const newPrescription = new Prescription({ doctor, patient, medications, status });
    await newPrescription.save();
    res.status(201).json(newPrescription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get prescription by ID (Ensures the doctor has access)
exports.getPrescriptionById = async (req, res) => {
  try {
    const { doctorId } = req.query; // Doctor ID from query params
    const prescription = await Prescription.findById(req.params.id).populate("doctor patient");

    if (!prescription) return res.status(404).json({ message: "Prescription not found" });

    // Ensure the doctor can only access their own prescriptions
    if (prescription.doctor._id.toString() !== doctorId)
      return res.status(403).json({ message: "Access denied" });

    res.json(prescription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all prescriptions issued by a specific doctor
exports.getPrescriptionsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const prescriptions = await Prescription.find({ doctor: doctorId }).populate("patient");

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all prescriptions of a patient (Ensures access for doctors only)
exports.getPrescriptionsByPatient = async (req, res) => {
  try {
    const { doctorId, patientId } = req.params;
    const prescriptions = await Prescription.find({ patient: patientId, doctor: doctorId }).populate("doctor");

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get unique patients treated by a doctor
exports.getPatientsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const patients = await Prescription.distinct("patient", { doctor: doctorId });

    res.json({ treatedPatients: patients });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
