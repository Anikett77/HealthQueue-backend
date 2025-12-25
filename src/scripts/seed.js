// Seed script to populate initial data
require("dotenv").config();
const mongoose = require("mongoose");
const Doctor = require("../models/Doctor");

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing doctors
    await Doctor.deleteMany({});
    console.log("✅ Cleared existing doctors");

    // Seed doctors data
    const doctors = [
      {
        name: "Dr. Sarah Johnson",
        department: "Cardiology",
        hospital: "City General Hospital",
        status: "active"
      },
      {
        name: "Dr. Michael Chen",
        department: "Pediatrics",
        hospital: "City General Hospital",
        status: "active"
      },
      {
        name: "Dr. Emily Davis",
        department: "Orthopedics",
        hospital: "City General Hospital",
        status: "active"
      },
      {
        name: "Dr. James Wilson",
        department: "General Medicine",
        hospital: "City General Hospital",
        status: "active"
      },
      {
        name: "Dr. Lisa Anderson",
        department: "Dermatology",
        hospital: "City General Hospital",
        status: "active"
      },
      {
        name: "Dr. Robert Brown",
        department: "Cardiology",
        hospital: "Central Medical Center",
        status: "active"
      },
      {
        name: "Dr. Maria Garcia",
        department: "Pediatrics",
        hospital: "Central Medical Center",
        status: "active"
      },
      {
        name: "Dr. David Lee",
        department: "Orthopedics",
        hospital: "Central Medical Center",
        status: "active"
      },
      {
        name: "Dr. Jennifer White",
        department: "General Medicine",
        hospital: "Regional Health Institute",
        status: "active"
      },
      {
        name: "Dr. Thomas Moore",
        department: "Dermatology",
        hospital: "Regional Health Institute",
        status: "active"
      }
    ];

    await Doctor.insertMany(doctors);
    console.log(`✅ Seeded ${doctors.length} doctors`);

    // Show summary
    const hospitals = await Doctor.distinct('hospital');
    const departments = await Doctor.distinct('department');
    
    console.log("\n📊 Summary:");
    console.log(`   Hospitals: ${hospitals.length}`);
    hospitals.forEach(h => console.log(`   - ${h}`));
    console.log(`\n   Departments: ${departments.length}`);
    departments.forEach(d => console.log(`   - ${d}`));

    console.log("\n✅ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run seed
seedData();

