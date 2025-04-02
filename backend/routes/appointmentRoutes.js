const express = require("express");
const appointmentController = require("../controllers/appointmentController");
const router = express.Router();

router.post("/", appointmentController.createAppointment);
router.get("/", appointmentController.getAllAppointments);
router.get("/user/:userId", appointmentController.getAppointmentsByUser);
router.get("/available-slots", appointmentController.getAvailableSlots); // This must be before :id
router.post("/set-available-slots", appointmentController.setAvailableSlots);
router.get("/:id", appointmentController.getAppointmentById);
router.put("/:appointmentId/status", appointmentController.updateAppointmentStatus);
router.get("/doctor/:doctorId/pending", appointmentController.getPendingAppointmentsByDoctor);
router.get("/doctor/:doctorId/approved", appointmentController.getApprovedAppointmentsByDoctor);


router.delete("/:id", appointmentController.deleteAppointment);

module.exports = router;
