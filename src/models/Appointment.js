const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true
  },
  doctorId: {
    type: String,
    required: true
  },
  doctorName: {
    type: String
  },
  hospital: {
    type: String
  },
  department: {
    type: String
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  queueNumber: {
    type: Number,
    required: true
  },
  token: {
    type: String,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'waiting', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  predictedWaitingTime: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Appointment", appointmentSchema);
