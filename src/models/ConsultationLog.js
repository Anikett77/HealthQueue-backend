const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  doctorId: String,
  department: String,
  consultationDuration: Number,
  timeOfDay: String,
  date: String
});

module.exports = mongoose.model("ConsultationLog", logSchema);
