require("dotenv").config();
const app = require("./src/app");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
app.use(express.json());

// ✅ IMPORT ROUTE
const appointmentRoutes = require("./routes/appointmentRoutes");
// ROOT CHECK
app.get("/", (req, res) => {
  res.send("Health Queue API running 🚑");
});

// Connect to MongoDB
if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is not set in .env file");
  process.exit(1);
}


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API Base URL: http://localhost:${PORT}/api`);
});
