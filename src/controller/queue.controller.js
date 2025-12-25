const Appointment = require("../models/Appointment");
const { getPatientsAhead } = require("../services/queue.service");
const { predictWaitingTime } = require("../services/ai.service");

exports.getPatientQueueStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const allAppointments = await Appointment.find({
      doctorId: appointment.doctorId,
      date: appointment.date,
      status: { $in: ['pending', 'waiting', 'in-progress'] }
    }).sort({ queueNumber: 1 });

    const currentAppointment = allAppointments.find(a => a.status === 'in-progress');
    const currentToken = currentAppointment ? currentAppointment.token : 
      (allAppointments.length > 0 ? allAppointments[0].token : null);

    const patientsAhead = allAppointments.filter(
      a => a.queueNumber < appointment.queueNumber
    ).length;

    const queue = allAppointments.map(a => ({
      token: a.token,
      name: a.patientName,
      status: a.status === 'in-progress' ? 'current' : 'waiting'
    }));

    const estimatedWaitTime = await predictWaitingTime(patientsAhead);

    res.json({
      currentToken,
      myToken: appointment.token,
      patientsAhead,
      estimatedWaitTime,
      queue
    });
  } catch (err) {
    console.error("Error fetching patient queue status:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDoctorQueue = async (req, res) => {
  try {
    const { doctorId } = req.params;
    
    const appointments = await Appointment.find({
      doctorId,
      status: { $in: ['pending', 'waiting', 'in-progress'] }
    }).sort({ queueNumber: 1 });

    const currentPatient = appointments.find(a => a.status === 'in-progress') || 
      (appointments.length > 0 ? appointments[0] : null);
    
    const currentPatientId = currentPatient ? currentPatient._id.toString() : null;
    const nextPatients = appointments
      .filter(a => currentPatientId && a._id.toString() !== currentPatientId)
      .slice(0, 10)
      .map(a => ({
        token: a.token,
        name: a.patientName,
        age: null, 
        appointmentTime: a.time
      }));

    res.json({
      currentPatient: currentPatient ? {
        token: currentPatient.token,
        name: currentPatient.patientName,
        age: null,
        appointmentTime: currentPatient.time
      } : null,
      nextPatients,
      stats: {
        avgConsultationTime: 12,
        totalPatientsToday: appointments.length
      }
    });
  } catch (err) {
    console.error("Error fetching doctor queue:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCurrentPosition = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const patientsAhead = await getPatientsAhead(
      appointment.doctorId,
      appointment.queueNumber
    );

    res.json({
      position: patientsAhead + 1,
      patientsAhead
    });
  } catch (err) {
    console.error("Error fetching queue position:", err);
    res.status(500).json({ message: "Server error" });
  }
};

