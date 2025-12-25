const Appointment = require('../models/Appointment');

exports.getPatientsAhead = async (doctorId, queueNumber) => {
  return await Appointment.countDocuments({
    doctorId,
    queueNumber: { $lt: queueNumber },
    status: { $in: ['pending', 'waiting', 'in-progress'] }
  });
};
