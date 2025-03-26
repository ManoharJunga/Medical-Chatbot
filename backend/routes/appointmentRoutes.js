const express = require("express");
const appointmentController = require("../controllers/appointmentController");
const router = express.Router();

router.post("/", appointmentController.createAppointment);
router.get("/", appointmentController.getAllAppointments);
router.get("/doctor/:doctorId", appointmentController.getAppointmentsByDoctor);
router.get("/user/:userId", appointmentController.getAppointmentsByUser);
router.get("/available-slots", appointmentController.getAvailableSlots); // This must be before :id
router.post("/set-available-slots", appointmentController.setAvailableSlots);
router.get("/:id", appointmentController.getAppointmentById);
router.put("/:id", appointmentController.updateAppointment);
router.delete("/:id", appointmentController.deleteAppointment);

module.exports = router;
