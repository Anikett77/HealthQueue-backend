const express = require("express");
const router = express.Router();
const appointmentController = require("../controller/appointment.controller");

// Create appointment
router.post("/", appointmentController.create);

// Get all appointments (must be before /:id routes)
router.get("/", appointmentController.getAll);

// Get appointments by patient (must be before /:doctorId)
router.get("/patient/:patientName", appointmentController.getByPatient);

// Get appointment by ID (must be before /:doctorId)
router.get("/id/:id", appointmentController.getById);

// Update appointment status (must be before /:doctorId)
router.patch("/:id/status", appointmentController.updateStatus);

// Get appointments by doctor
router.get("/doctor/:doctorId", appointmentController.getByDoctor);
// Keep old route for backward compatibility (must be last)
router.get("/:doctorId", appointmentController.getByDoctor);


module.exports = router;
