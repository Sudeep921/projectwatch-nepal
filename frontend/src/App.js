import React from "react";
import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";
import DashboardLayout from "./layouts/DashboardLayout";

// ========================================
// ADMIN PAGES
// ========================================

import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Map from "./pages/Map";
import FieldReports from "./pages/FieldReports";
import Complaints from "./pages/Complaints";
import Evidence from "./pages/Evidence";
import Alerts  from "./pages/Alerts";
import Reports from "./pages/Reports";
import Settings  from "./pages/Settings";
import Notifications  from "./pages/Notifications";
import AddProjectPage  from "./pages/AddProjectPage";
import EditProjectPage from "./pages/EditProjectPage";
import UserManagement from "./pages/UserManagement";
import AuditLogs from "./pages/AuditLogs";
import SystemSettings  from "./pages/SystemSettings";

// ========================================
// PUBLIC PAGES
// ========================================

import PublicPortal from "./pages/PublicPortal";
import PublicProjectDetails from "./pages/PublicProjectDetails";
import PublicComplaintForm from "./pages/PublicComplaintForm";
import PublicComplaint from "./pages/PublicComplaint";
import PublicMap from "./pages/PublicMap";

// ========================================
// AUTH
// ========================================

import AdminLogin from "./pages/AdminLogin";

// ========================================
// TEST PAGES
// ========================================

import SystemTest from "./pages/SystemTest";
import ApiTest from "./pages/ApiTest";

// ========================================
// ERROR / NOT FOUND
// ========================================

import ErrorBoundary
  from "./components/ErrorBoundary";

import NotFound from "./pages/NotFound";
import ReleaseStatus from "./pages/ReleaseStatus";
import NetworkStatus
  from "./components/NetworkStatus";

// ========================================
// REACT CREATE ELEMENT
// ========================================

const h = React.createElement;


// ========================================
// PROTECTED ADMIN ROUTES
// ========================================

const ProtectedRoutes = () => {

  const {
    user,
    loading
  } = useAuth();

  // ======================================
  // LOADING
  // ======================================

  if (loading) {
    return h(
      "div",
      {
        className: "app-loading"
      },
      "Loading ProjectWatch Nepal..."
    );
  }

  // ======================================
  // NOT LOGGED IN
  // ======================================

  if (!user) {
    return h(
      Navigate,
      {
        to: "/admin-login",
        replace: true
      }
    );
  }

  // ======================================
  // ROLE CHECK
  // ======================================

  const role =
    String(
      user?.role || ""
    ).toLowerCase();

  const allowedRoles = [
    "admin",
    "officer"
  ];

  // ======================================
  // INVALID ROLE
  // ======================================

  if (
    !allowedRoles.includes(role)
  ) {
    return h(
      Navigate,
      {
        to: "/admin-login",
        replace: true
      }
    );
  }

  // ======================================
  // ALLOW ADMIN / OFFICER
  // ======================================

  return h(
    DashboardLayout
  );
};


// ========================================
// ADMIN ONLY ROUTE GUARD
// ========================================

const AdminOnlyRoute = ({
  children
}) => {

  const {
    user,
    loading
  } = useAuth();

  // ======================================
  // LOADING
  // ======================================

  if (loading) {
    return h(
      "div",
      {
        className: "app-loading"
      },
      "Loading ProjectWatch Nepal..."
    );
  }

  // ======================================
  // NOT LOGGED IN
  // ======================================

  if (!user) {
    return h(
      Navigate,
      {
        to: "/admin-login",
        replace: true
      }
    );
  }

  // ======================================
  // GET ROLE
  // ======================================

  const role =
    String(
      user?.role || ""
    ).toLowerCase();

  // ======================================
  // ADMIN ONLY
  // ======================================

  if (role !== "admin") {
    return h(
      "div",
      {
        className: "permission-denied"
      },

      h(
        "h2",
        null,
        "Access Denied"
      ),

      h(
        "p",
        null,
        "Only administrators can access this page."
      ),

      h(
        "button",
        {
          type: "button",
          onClick: () => {
            window.location.href =
              "/admin/dashboard";
          }
        },
        "Go to Dashboard"
      )
    );
  }

  // ======================================
  // ADMIN ALLOWED
  // ======================================

  return children;
};


// ========================================
// APP
// ========================================

const App = () => {

  return h(
    ErrorBoundary,
    null,

    h(
      BrowserRouter,
      null,

      h(
        Routes,
        null,

        // ====================================
        // PUBLIC HOME
        // /
        // ====================================

        h(
          Route,
          {
            path: "/",
            element: h(
              Navigate,
              {
                to: "/public",
                replace: true
              }
            )
          }
        ),


        // ====================================
        // PUBLIC PORTAL
        // /public
        // ====================================

        h(
          Route,
          {
            path: "/public",
            element: h(
              PublicPortal
            )
          }
        ),


        // ====================================
        // PUBLIC PROJECT DETAILS
        // /public/projects/:id
        // ====================================

        h(
          Route,
          {
            path: "/public/projects/:id",
            element: h(
              PublicProjectDetails
            )
          }
        ),


        // ====================================
        // PUBLIC MAP
        // /public-map
        // ====================================

        h(
          Route,
          {
            path: "/public-map",
            element: h(
              PublicMap
            )
          }
        ),


        // ====================================
        // PUBLIC REPORT
        // /public/report
        // ====================================

        h(
          Route,
          {
            path: "/public/report",
            element: h(
              PublicComplaintForm
            )
          }
        ),


        // ====================================
        // PUBLIC COMPLAINT
        // /complaints-public
        // ====================================

        h(
          Route,
          {
            path: "/complaints-public",
            element: h(
              PublicComplaint
            )
          }
        ),


        // ====================================
        // ADMIN LOGIN
        // /admin-login
        // ====================================

        h(
          Route,
          {
            path: "/admin-login",
            element: h(
              AdminLogin
            )
          }
        ),


        // ====================================
        // SYSTEM TEST
        // /system-test
        // ====================================

        h(
          Route,
          {
            path: "/system-test",
            element: h(
              SystemTest
            )
          }
        ),


        // ====================================
        // API TEST
        // /api-test
        // ====================================

        h(
          Route,
          {
            path: "/api-test",
            element: h(
              ApiTest
            )
          }
        ),


        // ====================================
        // PROTECTED ADMIN AREA
        // /admin/*
        // ====================================

        h(
          Route,
          {
            path: "/admin",
            element: h(
              ProtectedRoutes
            )
          },

          // ==================================
          // ADMIN DEFAULT
          // /admin
          // ==================================

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


          // ==================================
          // DASHBOARD
          // /admin/dashboard
          // ==================================

          h(
            Route,
            {
              path: "dashboard",
              element: h(
                Dashboard
              )
            }
          ),


          // ==================================
          // PROJECTS
          // /admin/projects
          // ==================================

          h(
            Route,
            {
              path: "projects",
              element: h(
                Projects
              )
            }
          ),


          // ==================================
          // ADD PROJECT
          // /admin/projects/new
          // ==================================

          h(
            Route,
            {
              path: "projects/new",
              element: h(
                AddProjectPage
              )
            }
          ),


          // ==================================
          // PROJECT DETAILS
          // /admin/projects/:id
          // ==================================

          h(
            Route,
            {
              path: "projects/:id",
              element: h(
                ProjectDetails
              )
            }
          ),


          // ==================================
          // EDIT PROJECT
          // /admin/projects/:id/edit
          // ==================================

          h(
            Route,
            {
              path: "projects/:id/edit",
              element: h(
                EditProjectPage
              )
            }
          ),


          // ==================================
          // MAP
          // /admin/map
          // ==================================

          h(
            Route,
            {
              path: "map",
              element: h(
                Map
              )
            }
          ),


          // ==================================
          // FIELD REPORTS
          // /admin/field-reports
          // ==================================

          h(
            Route,
            {
              path: "field-reports",
              element: h(
                FieldReports
              )
            }
          ),


          // ==================================
          // COMPLAINTS
          // /admin/complaints
          // ==================================

          h(
            Route,
            {
              path: "complaints",
              element: h(
                Complaints
              )
            }
          ),


          // ==================================
          // EVIDENCE
          // /admin/evidence
          // ==================================

          h(
            Route,
            {
              path: "evidence",
              element: h(
                Evidence
              )
            }
          ),


          // ==================================
          // ALERTS
          // /admin/alerts
          // ==================================

          h(
            Route,
            {
              path: "alerts",
              element: h(
                Alerts
              )
            }
          ),


          // ==================================
          // NOTIFICATIONS
          // /admin/notifications
          // ==================================

          h(
            Route,
            {
              path: "notifications",
              element: h(
                Notifications
              )
            }
          ),


          // ==================================
          // REPORTS
          // /admin/reports
          // ==================================

          h(
            Route,
            {
              path: "reports",
              element: h(
                Reports
              )
            }
          ),


          // ==================================
          // SETTINGS
          // /admin/settings
          // ==================================

          h(
            Route,
            {
              path: "settings",
              element: h(
                Settings
              )
            }
          ),


          // ==================================
          // USER MANAGEMENT
          // ADMIN ONLY
          // /admin/users
          // ==================================

          h(
            Route,
            {
              path: "users",
              element: h(
                AdminOnlyRoute,
                null,
                h(
                  UserManagement
                )
              )
            }
          ),


          // ==================================
          // AUDIT LOGS
          // ADMIN ONLY
          // /admin/audit-logs
          // ==================================

          h(
            Route,
            {
              path: "audit-logs",
              element: h(
                AdminOnlyRoute,
                null,
                h(
                  AuditLogs
                )
              )
            }
          ),


          // ==================================
          // SYSTEM SETTINGS
          // ADMIN ONLY
          // /admin/system-settings
          // ==================================

          h(
            Route,
            {
              path: "system-settings",
              element: h(
                AdminOnlyRoute,
                null,
                h(
                  SystemSettings
                )
              )
            }
          )

        ),


        // ====================================
        // UNKNOWN ROUTE
        // ====================================

        h(
          Route,
          {
            path: "*",
            element: h(
              NotFound
            )
          }
        ),
        h(
          Route,
          {
            path: "release-status",
            element: h(
              ReleaseStatus
            )
          }
        )

      )

    )

  );

};


// ========================================
// EXPORT
// ========================================

export default App;