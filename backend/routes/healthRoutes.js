const express = require("express");

const router = express.Router();

router.get(
  "/",
  async (req, res) => {
    try {
      const mongoose =
        require("mongoose");

      const dbState =
        mongoose.connection.readyState;

      const database =
        dbState === 1
          ? "connected"
          : "disconnected";

      res.json({
        success: true,
        status: "ok",
        service:
          "ProjectWatch Nepal API",
        database,
        timestamp:
          new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        status: "error",
        message:
          "Health check failed"
      });
    }
  }
);

module.exports = router;