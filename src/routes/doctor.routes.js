const express = require("express");
const router = express.Router();
const doctorController = require("../controller/doctor.controller");

// Get all doctors
router.get("/", doctorController.getAll);

// Get doctors by department (must be before /:id to avoid route conflict)
router.get("/department/:department", doctorController.getByDepartment);

// Get doctor by ID (must be last)
router.get("/:id", doctorController.getById);

module.exports = router;

