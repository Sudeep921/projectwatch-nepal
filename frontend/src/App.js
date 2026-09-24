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

import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Map from "./pages/Map";
import FieldReports from "./pages/FieldReports";
import Complaints from "./pages/Complaints";
import Evidence from "./pages/Evidence";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import PublicPortal from "./pages/PublicPortal";
import PublicProjectDetails from "./pages/PublicProjectDetails";
import PublicComplaintForm from "./pages/PublicComplaintForm";
import AdminLogin from "./pages/AdminLogin";
import Notifications from "./pages/Notifications";
import AddProjectPage from "./pages/AddProjectPage";
import PublicComplaint from "./pages/PublicComplaint";
import PublicMap from "./pages/PublicMap";


const h = React.createElement;


/* =========================================
   PROTECTED ROUTES
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
         PUBLIC PORTAL
         This is the site's HOME page — normal
         citizens land here, no login required.
      ===================================== */

      h(
        Route,
        {
          path: "/",
          element:
            h(PublicPortal)
        }
      ),

      h(
        Route,
        {
          path: "/public",
          element:
            h(PublicPortal)
        }
      ),

      h(
        Route,
        {
          path: "/public/projects/:id",
          element:
            h(PublicProjectDetails)
        }
      ),

      h(
        Route,
        {
          path: "/public/report",
          element:
            h(PublicComplaintForm)
        }
      ),

      React.createElement(
        Route,
        {
          path: "/public/projects/:id",
          element: React.createElement(
            PublicProjectDetails
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
          element:
            h(AdminLogin)
        }
      ),


      /* =====================================
         PROTECTED ADMIN AREA
      ===================================== */

      h(
        Route,
        {
          path: "/admin",
          element:
            h(ProtectedRoutes)
        },


        /* ===================================
           DEFAULT
        =================================== */

        h(
          Route,
          {
            index: true,
            element:
              h(
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
            element:
              h(Dashboard)
          }
        ),


        /* ===================================
           PROJECTS
        =================================== */

        h(
          Route,
          {
            path: "projects",
            element:
              h(Projects)
          }
        ),


        /* ===================================
           ADD PROJECT
        =================================== */

        h(
          Route,
          {
            path: "projects/new",
            element:
              h(AddProjectPage)
          }
        ),


        /* ===================================
           PROJECT DETAILS
        =================================== */

        h(
          Route,
          {
            path: "projects/:id",
            element:
              h(ProjectDetails)
          }
        ),


        /* ===================================
           MAP
        =================================== */

        h(
          Route,
          {
            path: "map",
            element:
              h(Map)
          }
        ),


        /* ===================================
           FIELD REPORTS
        =================================== */

        h(
          Route,
          {
            path: "field-reports",
            element:
              h(FieldReports)
          }
        ),


        /* ===================================
           COMPLAINTS
        =================================== */

        h(
          Route,
          {
            path: "complaints",
            element:
              h(Complaints)
          }
        ),


        /* ===================================
           EVIDENCE
        =================================== */

        h(
          Route,
          {
            path: "evidence",
            element:
              h(Evidence)
          }
        ),


        /* ===================================
           ALERTS
        =================================== */

        h(
          Route,
          {
            path: "alerts",
            element:
              h(Alerts)
          }
        ),


        /* ===================================
           REPORTS
        =================================== */

        h(
          Route,
          {
            path: "reports",
            element:
              h(Reports)
          }
        ),


        /* ===================================
           NOTIFICATIONS
        =================================== */

        h(
          Route,
          {
            path: "notifications",
            element:
              React.createElement(
                Notifications
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
            element:
              h(Settings)
          }
        )
      ),


      /* =====================================
         404 / UNKNOWN ROUTE
      ===================================== */

      h(
        Route,
        {
          path: "*",
          element:
            h(
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