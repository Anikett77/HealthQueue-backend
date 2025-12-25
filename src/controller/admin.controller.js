const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");


exports.getStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const totalPatientsToday = await Appointment.countDocuments({
      createdAt: { $gte: new Date(today) }
    });

    const appointments = await Appointment.find({
      createdAt: { $gte: new Date(today) }
    });
    
    const avgWaitTime = appointments.length > 0
      ? Math.round(
          appointments.reduce((sum, apt) => sum + (apt.predictedWaitingTime || 0), 0) / 
          appointments.length
        )
      : 0;

    const peakHours = '10:00 AM - 12:00 PM';

    res.json({
      totalPatientsToday,
      averageWaitTime: avgWaitTime,
      peakHours
    });
  } catch (err) {
    console.error("Error fetching admin stats:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDepartmentLoad = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const appointments = await Appointment.find({
      createdAt: { $gte: new Date(today) }
    });


    const departmentMap = {};
    appointments.forEach(apt => {
      if (apt.department) {
        if (!departmentMap[apt.department]) {
          departmentMap[apt.department] = 0;
        }
        departmentMap[apt.department]++;
      }
    });


    const departments = await Doctor.distinct('department');
    
    const departmentLoad = departments.map(dept => {
      const patients = departmentMap[dept] || 0;

      const load = Math.min(100, Math.round((patients / 50) * 100));
      
      return {
        department: dept,
        patients,
        load
      };
    });

    res.json({ departmentLoad });
  } catch (err) {
    console.error("Error fetching department load:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const doctors = await Doctor.find({ status: 'active' });
    
    const doctorsWithStats = await Promise.all(
      doctors.map(async (doctor) => {
        const patientsToday = await Appointment.countDocuments({
          doctorId: doctor._id.toString(),
          createdAt: { $gte: new Date(today) }
        });

        return {
          id: doctor._id,
          name: doctor.name,
          department: doctor.department,
          patientsToday,
          status: doctor.status
        };
      })
    );

    res.json({ doctors: doctorsWithStats });
  } catch (err) {
    console.error("Error fetching doctors with stats:", err);
    res.status(500).json({ message: "Server error" });
  }
};

