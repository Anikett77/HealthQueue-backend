const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const { predictWaitingTime } = require("../services/ai.service");
const { generateToken } = require("../utils/tokenGenerator");

// Create appointment
exports.create = async (req, res) => {
  try {
    const { patientName, doctorId, date, time, hospital, department } = req.body;

    if (!patientName || !doctorId || !date || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }


    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }


    const appointmentsForDoctor = await Appointment.find({
      doctorId,
      date,
      status: { $in: ['pending', 'waiting', 'in-progress'] }
    }).sort({ queueNumber: -1 });

    const queueNumber = appointmentsForDoctor.length > 0 
      ? appointmentsForDoctor[0].queueNumber + 1 
      : 1;


    const token = generateToken();

    const predictedWaitingTime = await predictWaitingTime(queueNumber);

    const appointment = new Appointment({
      patientName,
      doctorId,
      doctorName: doctor.name,
      hospital: hospital || doctor.hospital,
      department: department || doctor.department,
      date,
      time,
      queueNumber,
      token,
      status: 'pending',
      predictedWaitingTime
    });

    await appointment.save();

    res.status(201).json({
      message: "Appointment booked successfully",
      data: appointment
    });
  } catch (err) {
    console.error("Error creating appointment:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const appointments = await Appointment.find({ doctorId })
      .sort({ createdAt: 1 });

    const queueLength = appointments.filter(a => 
      ['pending', 'waiting', 'in-progress'].includes(a.status)
    ).length;

    const estimatedWaitTime = await predictWaitingTime(queueLength);

    res.json({
      doctorId,
      currentQueue: queueLength,
      estimatedWaitTime,
      appointments
    });
  } catch (err) {
    console.error("Error fetching appointments by doctor:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getByPatient = async (req, res) => {
  try {
    const { patientName } = req.params;
    const appointments = await Appointment.find({ patientName })
      .sort({ createdAt: -1 });

    res.json({
      appointments
    });
  } catch (err) {
    console.error("Error fetching appointments by patient:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAll = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .sort({ createdAt: -1 });
    res.json({ appointments });
  } catch (err) {
    console.error("Error fetching all appointments:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    
    res.json({ appointment });
  } catch (err) {
    console.error("Error fetching appointment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({
      message: "Appointment status updated",
      appointment
    });
  } catch (err) {
    console.error("Error updating appointment status:", err);
    res.status(500).json({ message: "Server error" });
  }
};

