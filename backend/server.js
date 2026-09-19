const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");



dotenv.config();

const app = express();

// ===============================
// MIDDLEWARE
// ===============================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));



// ===============================
// ROUTES
// ===============================
const authRoutes = require("./routes/authRoutes");
const workerRoutes = require("./routes/workerRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const projectRoutes = require("./routes/projectRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const fieldReportRoutes = require("./routes/fieldReportRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
const evidenceRoutes = require("./routes/evidenceRoutes");
const alertRoutes = require("./routes/alertRoutes");
const publicRoutes = require("./routes/publicRoutes");


app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/field-reports", fieldReportRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/verifications", verificationRoutes);
app.use("/api/evidence", evidenceRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/public", publicRoutes);




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