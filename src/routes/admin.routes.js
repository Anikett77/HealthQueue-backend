const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin.controller");

// Get admin dashboard stats
router.get("/stats", adminController.getStats);

// Get department load
router.get("/department-load", adminController.getDepartmentLoad);

// Get all doctors with stats
router.get("/doctors", adminController.getDoctors);

module.exports = router;

