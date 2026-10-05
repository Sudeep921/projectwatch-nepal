/* =====================================================
   PROJECTWATCH NEPAL
   BACKEND SERVER
   ===================================================== */

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");

dotenv.config();

/* =====================================================
   APP
   ===================================================== */

const app = express();
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin"
    }
  })
);

/* =====================================================
   CORS
   ===================================================== */

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://projectwatch-nepal.vercel.app",    ],
    credentials: true
  })
);

/* =====================================================
   BODY PARSER
   ===================================================== */

app.use(
  express.json({
    limit: "2mb"
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "2mb"
  })
);
app.use(
  express.urlencoded({
    extended: true
  })
);

/* =====================================================
   STATIC FILES
   ===================================================== */

app.use(
  "/uploads",
  express.static("uploads")
);

/* =====================================================
   ROUTE IMPORTS
   ===================================================== */

const authRoutes =
  require("./routes/authRoutes");

const projectRoutes =
  require("./routes/projectRoutes");

const workerRoutes =
  require("./routes/workerRoutes");

const bookingRoutes =
  require("./routes/bookingRoutes");

const dashboardRoutes =
  require("./routes/dashboardRoutes");

const fieldReportRoutes =
  require("./routes/fieldReportRoutes");

const complaintRoutes =
  require("./routes/complaintRoutes");

const notificationRoutes =
  require("./routes/notificationRoutes");

const verificationRoutes =
  require("./routes/verificationRoutes");

const evidenceRoutes =
  require("./routes/evidenceRoutes");

const alertRoutes =
  require("./routes/alertRoutes");

const publicRoutes =
  require("./routes/publicRoutes");

const auditRoutes =
  require("./routes/auditRoutes");

const reportRoutes =
  require("./routes/reportRoutes");

const aiRoutes =
  require("./routes/aiRoutes");

const userRoutes =
  require("./routes/userRoutes");

const healthRoutes =
  require("./routes/healthRoutes");

/* =====================================================
   ROOT
   ===================================================== */

app.get(
  "/",
  (req, res) => {

    res.status(200).json({
      success: true,

      message:
        "ProjectWatch Nepal Backend is running 🚀",

      version:
        "1.0.0"
    });

  }
);

/* =====================================================
   API INFORMATION
   ===================================================== */

app.get(
  "/api",
  (req, res) => {

    res.json({

      success: true,

      name:
        "ProjectWatch Nepal API",

      version:
        "1.0.0",

      status:
        "running",

      timestamp:
        new Date().toISOString(),

      endpoints: {

        auth:
          "/api/auth",

        projects:
          "/api/projects",

        users:
          "/api/users",

        dashboard:
          "/api/dashboard",

        fieldReports:
          "/api/field-reports",

        complaints:
          "/api/complaints",

        notifications:
          "/api/notifications",

        alerts:
          "/api/alerts",

        evidence:
          "/api/evidence",

        audit:
          "/api/audit",

        health:
          "/api/health"

      }

    });

  }
);

/* =====================================================
   API HEALTH
   ===================================================== */

app.get(
  "/api/health",
  (req, res) => {

    res.status(200).json({

      success: true,

      message:
        "ProjectWatch Nepal API is running",

      server:
        "ProjectWatch Nepal",

      status:
        "online",

      timestamp:
        new Date().toISOString()

    });

  }
);

/* =====================================================
   API ROUTES
   ===================================================== */

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/projects",
  projectRoutes
);

app.use(
  "/api/workers",
  workerRoutes
);

app.use(
  "/api/bookings",
  bookingRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/field-reports",
  fieldReportRoutes
);

app.use(
  "/api/complaints",
  complaintRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(
  "/api/verifications",
  verificationRoutes
);

app.use(
  "/api/evidence",
  evidenceRoutes
);

app.use(
  "/api/alerts",
  alertRoutes
);

app.use(
  "/api/public",
  publicRoutes
);

app.use(
  "/api/audit",
  auditRoutes
);

app.use(
  "/api/reports",
  reportRoutes
);

app.use(
  "/api/ai",
  aiRoutes
);

app.use(
  "/api/users",
  userRoutes
);

/*
  healthRoutes पनि राख्ने।
  यदि healthRoutes.js मा /health route छ भने
  यो /api/health सँग duplicate हुन सक्छ।
*/

app.use(
  "/api/system-health",
  healthRoutes
);

/* =====================================================
   API 404 HANDLER
   ===================================================== */

app.use(
  (req, res, next) => {

    if (
      req.originalUrl.startsWith(
        "/api/"
      )
    ) {

      return res.status(404).json({

        success: false,

        message:
          "API endpoint not found",

        path:
          req.originalUrl,

        method:
          req.method

      });

    }

    next();

  }
);

/* =====================================================
   GLOBAL ERROR HANDLER
   ===================================================== */

app.use(
  (
    err,
    req,
    res,
    next
  ) => {

    console.error(
      "❌ Server Error:",
      err
    );

    res.status(
      err.status || 500
    ).json({

      success: false,

      message:
        err.message ||
        "Internal server error"

    });

  }
);

/* =====================================================
   MONGODB CONNECTION
   ===================================================== */

mongoose
  .connect(
    process.env.MONGO_URI
  )

  .then(() => {

    console.log(
      "✅ MongoDB connected successfully"
    );

    const PORT =
      process.env.PORT || 8000;

    /* =================================================
       START SERVER
       ================================================= */

       const errorHandler = require(
          "./middleware/errorHandler"
        );

app.use(errorHandler);
       app.listen(
      PORT,
      () => {

        console.log(
          `🚀 ProjectWatch API running on http://localhost:${PORT}`
        );

        console.log(
          `📡 API Information: http://localhost:${PORT}/api`
        );

        console.log(
          `❤️ API Health: http://localhost:${PORT}/api/health`
        );

      }
    );

  })

  .catch(
    (error) => {

      console.error(
        "❌ MongoDB connection failed:",
        error.message
      );

      process.exit(1);

    }
  );