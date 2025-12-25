const Doctor = require("../models/Doctor");

exports.getAll = async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: 'active' });
    res.json({ doctors });
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    
    res.json({ doctor });
  } catch (err) {
    console.error("Error fetching doctor:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    const doctors = await Doctor.find({ 
      department,
      status: 'active' 
    });
    res.json({ doctors });
  } catch (err) {
    console.error("Error fetching doctors by department:", err);
    res.status(500).json({ message: "Server error" });
  }
};

