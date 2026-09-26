const mongoose = require("mongoose");

const getHealth = async (req, res) => {
  const mongoConnected =
    mongoose.connection.readyState === 1;

  res.json({
    success: true,
    service: "ProjectWatch Nepal API",
    status: "running",
    database: mongoConnected
      ? "connected"
      : "disconnected",
    uptime: process.uptime(),
    timestamp: new Date()
  });
};

module.exports = {
  getHealth
};