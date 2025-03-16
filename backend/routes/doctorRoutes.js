const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");

// Add a new doctor
router.post("/add", doctorController.addDoctor);

// Get all doctors
router.get("/all", doctorController.getAllDoctors);

// Get doctors by symptoms
router.post("/find", doctorController.getDoctorsBySymptoms);

// Update doctor details
router.put("/update/:id", doctorController.updateDoctor);

// Delete a doctor
router.delete("/delete/:id", doctorController.deleteDoctor);


module.exports = router;
