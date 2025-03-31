const express = require("express");
const router = express.Router();
const { 
  createPrescription, 
  getPrescriptionById, 
  getPrescriptionsByPatient, 
  getPrescriptionsByDoctor, 
  getPatientsByDoctor 
} = require("../controllers/prescriptionController");

router.post("/", createPrescription); // working
router.get("/:id", getPrescriptionById); // working
router.get("/patient/:doctorId/:patientId", getPrescriptionsByPatient);
router.get("/doctor/:doctorId", getPrescriptionsByDoctor);
router.get("/doctor/:doctorId/patients", getPatientsByDoctor);

module.exports = router;