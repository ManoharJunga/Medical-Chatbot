const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

// Create a new appointment
router.post("/", appointmentController.createAppointment);

// Get all appointments
router.get("/", appointmentController.getAllAppointments);

// Get an appointment by ID
router.get("/:id", appointmentController.getAppointmentById);

// Get appointments by Doctor ID
router.get("/doctor/:doctorId", appointmentController.getAppointmentsByDoctor);

// Update an appointment
router.put("/:id", appointmentController.updateAppointment);

// Delete an appointment
router.delete("/:id", appointmentController.deleteAppointment);

router.get("/user/:userId", appointmentController.getAppointmentsByUser);

module.exports = router;
