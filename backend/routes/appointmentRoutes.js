const express = require("express");
const appointmentController = require("../controllers/appointmentController");
const router = express.Router();

// ✅ Static routes first
router.post("/manual", appointmentController.createManualAppointment);
router.get("/available-slots", appointmentController.getAvailableSlots);
router.post("/set-available-slots", appointmentController.setAvailableSlots);

// ✅ Main CRUD routes
router.post("/", appointmentController.createAppointment);
router.get("/", appointmentController.getAllAppointments);

// ✅ Doctor and User specific routes
router.get("/user/:userId", appointmentController.getAppointmentsByUser);
router.get("/doctor/:doctorId/pending", appointmentController.getPendingAppointmentsByDoctor);
router.get("/doctor/:doctorId/approved", appointmentController.getApprovedAppointmentsByDoctor);

// ✅ Dynamic routes should come last
router.get("/:id", appointmentController.getAppointmentById);
router.put("/:appointmentId/status", appointmentController.updateAppointmentStatus);
router.delete("/:id", appointmentController.deleteAppointment);

module.exports = router;
