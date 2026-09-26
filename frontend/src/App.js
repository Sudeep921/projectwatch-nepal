import React from "react";
import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import {
  useAuth
} from "./context/AuthContext";

import DashboardLayout
  from "./layouts/DashboardLayout";

import Dashboard
  from "./pages/Dashboard";

import Projects
  from "./pages/Projects";

import ProjectDetails
  from "./pages/ProjectDetails";

import Map
  from "./pages/Map";

import FieldReports
  from "./pages/FieldReports";

import Complaints
  from "./pages/Complaints";

import Evidence
  from "./pages/Evidence";

import Alerts
  from "./pages/Alerts";

import Reports
  from "./pages/Reports";

import Settings
  from "./pages/Settings";

import Notifications
  from "./pages/Notifications";

import AddProjectPage
  from "./pages/AddProjectPage";

import UserManagement
  from "./pages/UserManagement";

import AuditLogs
  from "./pages/AuditLogs";

import SystemSettings
  from "./pages/SystemSettings";

import PublicPortal
  from "./pages/PublicPortal";

import PublicProjectDetails
  from "./pages/PublicProjectDetails";

import PublicComplaintForm
  from "./pages/PublicComplaintForm";

import PublicComplaint
  from "./pages/PublicComplaint";

import PublicMap
  from "./pages/PublicMap";

import AdminLogin
  from "./pages/AdminLogin";


const h = React.createElement;


/* =========================================
   PROTECTED ADMIN LAYOUT
========================================= */

const ProtectedRoutes = () => {
  const {
    user,
    loading
  } = useAuth();

  if (loading) {
    return h(
      "div",
      {
        className: "app-loading"
      },
      "Loading ProjectWatch Nepal..."
    );
  }

  if (!user) {
    return h(
      Navigate,
      {
        to: "/admin-login",
        replace: true
      }
    );
  }

  return h(
    DashboardLayout
  );
};


/* =========================================
   APP
========================================= */

const App = () => {
  return h(
    BrowserRouter,
    null,

    h(
      Routes,
      null,

      /* =====================================
         PUBLIC HOME
      ===================================== */

      h(
        Route,
        {
          path: "/",
          element: h(
            PublicPortal
          )
        }
      ),

      /* =====================================
         PUBLIC PORTAL
      ===================================== */

      h(
        Route,
        {
          path: "/public",
          element: h(
            PublicPortal
          )
        }
      ),

      /* =====================================
         PUBLIC PROJECT DETAILS
      ===================================== */

      h(
        Route,
        {
          path: "/public/projects/:id",
          element: h(
            PublicProjectDetails
          )
        }
      ),

      /* =====================================
         PUBLIC COMPLAINT
      ===================================== */

      h(
        Route,
        {
          path: "/public/report",
          element: h(
            PublicComplaintForm
          )
        }
      ),

      h(
        Route,
        {
          path: "/complaints-public",
          element: h(
            PublicComplaint
          )
        }
      ),

      /* =====================================
         PUBLIC MAP
      ===================================== */

      h(
        Route,
        {
          path: "/public-map",
          element: h(
            PublicMap
          )
        }
      ),

      /* =====================================
         ADMIN LOGIN
      ===================================== */

      h(
        Route,
        {
          path: "/admin-login",
          element: h(
            AdminLogin
          )
        }
      ),

      /* =====================================
         PROTECTED ADMIN AREA
      ===================================== */

      h(
        Route,
        {
          path: "/admin",
          element: h(
            ProtectedRoutes
          )
        },

        /* ===================================
           ADMIN DEFAULT
        =================================== */

        h(
          Route,
          {
            index: true,
            element: h(
              Navigate,
              {
                to: "/admin/dashboard",
                replace: true
              }
            )
          }
        ),

        /* ===================================
           DASHBOARD
        =================================== */

        h(
          Route,
          {
            path: "dashboard",
            element: h(
              Dashboard
            )
          }
        ),

        /* ===================================
           PROJECTS
        =================================== */

        h(
          Route,
          {
            path: "projects",
            element: h(
              Projects
            )
          }
        ),

        /* ===================================
           ADD PROJECT
        =================================== */

        h(
          Route,
          {
            path: "projects/new",
            element: h(
              AddProjectPage
            )
          }
        ),

        /* ===================================
           PROJECT DETAILS
        =================================== */

        h(
          Route,
          {
            path: "projects/:id",
            element: h(
              ProjectDetails
            )
          }
        ),

        /* ===================================
           MAP
        =================================== */

        h(
          Route,
          {
            path: "map",
            element: h(
              Map
            )
          }
        ),

        /* ===================================
           FIELD REPORTS
        =================================== */

        h(
          Route,
          {
            path: "field-reports",
            element: h(
              FieldReports
            )
          }
        ),

        /* ===================================
           COMPLAINTS
        =================================== */

        h(
          Route,
          {
            path: "complaints",
            element: h(
              Complaints
            )
          }
        ),

        /* ===================================
           EVIDENCE
        =================================== */

        h(
          Route,
          {
            path: "evidence",
            element: h(
              Evidence
            )
          }
        ),

        /* ===================================
           ALERTS
        =================================== */

        h(
          Route,
          {
            path: "alerts",
            element: h(
              Alerts
            )
          }
        ),

        /* ===================================
           NOTIFICATIONS
        =================================== */

        h(
          Route,
          {
            path: "notifications",
            element: h(
              Notifications
            )
          }
        ),

        /* ===================================
           REPORTS
        =================================== */

        h(
          Route,
          {
            path: "reports",
            element: h(
              Reports
            )
          }
        ),

        /* ===================================
           SETTINGS
        =================================== */

        h(
          Route,
          {
            path: "settings",
            element: h(
              Settings
            )
          }
        ),

        /* ===================================
           USERS
        =================================== */

        h(
          Route,
          {
            path: "users",
            element: h(
              UserManagement
            )
          }
        ),

        /* ===================================
           AUDIT LOGS
        =================================== */

        h(
          Route,
          {
            path: "audit-logs",
            element: h(
              AuditLogs
            )
          }
        ),

        /* ===================================
           SYSTEM SETTINGS
        =================================== */

        h(
          Route,
          {
            path: "system-settings",
            element: h(
              SystemSettings
            )
          }
        )
      ),

      /* =====================================
         UNKNOWN ROUTE
      ===================================== */

      h(
        Route,
        {
          path: "*",
          element: h(
            Navigate,
            {
              to: "/",
              replace: true
            }
          )
        }
      )
    )
  );
};


export default App;