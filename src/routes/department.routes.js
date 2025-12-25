const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");

// Get all departments
router.get("/", async (req, res) => {
  try {
    const departments = await Doctor.distinct('department');
    const departmentsList = departments.map((dept, index) => ({
      id: index + 1,
      name: dept
    }));
    res.json({ departments: departmentsList });
  } catch (err) {
    console.error("Error fetching departments:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

