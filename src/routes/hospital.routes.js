const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");

// Get all hospitals
router.get("/", async (req, res) => {
  try {
    const hospitals = await Doctor.distinct('hospital');
    const hospitalsList = hospitals.map((hospital, index) => ({
      id: index + 1,
      name: hospital
    }));
    res.json({ hospitals: hospitalsList });
  } catch (err) {
    console.error("Error fetching hospitals:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

