const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const workerRoutes = require("./routes/workerRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const projectRoutes = require("./routes/projectRoutes");
dotenv.config();

const app = express();

// ===============================
// MIDDLEWARE
// ===============================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/workers", workerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/projects", projectRoutes);
// ===============================
// ROUTES
// ===============================
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

// ===============================
// TEST ROUTE
// ===============================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ProjectWatch Nepal Backend is running 🚀"
  });
});

// ===============================
// MONGODB
// ===============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
  });

// ===============================
// SERVER
// ===============================
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});