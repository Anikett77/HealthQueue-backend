const express = require("express");
const router = express.Router();
const queueController = require("../controller/queue.controller");

// Get queue status for a patient
router.get("/patient/:appointmentId", queueController.getPatientQueueStatus);

// Get queue for a doctor
router.get("/doctor/:doctorId", queueController.getDoctorQueue);

// Get current position in queue
router.get("/position/:appointmentId", queueController.getCurrentPosition);

module.exports = router;

