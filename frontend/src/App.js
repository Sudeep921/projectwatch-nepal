import React from "react";

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
import AdminLogin from "./pages/AdminLogin";


/* =========================================
   PROTECTED ROUTES
========================================= */

const ProtectedRoutes = () => {
  const {
    user,
    loading
  } = useAuth();

  /* Loading */
  if (loading) {
    return React.createElement(
      "div",
      {
        className: "app-loading"
      },
      "Loading ProjectWatch Nepal..."
    );
  }

  /* User not logged in */
  if (!user) {
    return React.createElement(
      Navigate,
      {
        to: "/public",
        replace: true
      }
    );
  }

  /* Logged in */
  return React.createElement(
    DashboardLayout
  );
};


/* =========================================
   APP
========================================= */

const App = () => {

  return React.createElement(
    BrowserRouter,
    null,

    React.createElement(
      Routes,
      null,

      /* =====================================
         PUBLIC PORTAL
      ===================================== */

      React.createElement(
        Route,
        {
          path: "/public",
          element: React.createElement(
            PublicPortal
          )
        }
      ),


      /* =====================================
         ADMIN LOGIN
      ===================================== */

      React.createElement(
        Route,
        {
          path: "/admin-login",
          element: React.createElement(
            AdminLogin
          )
        }
      ),


      /* =====================================
         PROTECTED DASHBOARD
      ===================================== */

      React.createElement(
        Route,
        {
          path: "/",
          element: React.createElement(
            ProtectedRoutes
          )
        },

        /* Dashboard default */
        React.createElement(
          Route,
          {
            index: true,
            element: React.createElement(
              Navigate,
              {
                to: "/dashboard",
                replace: true
              }
            )
          }
        ),


        /* Dashboard */
        React.createElement(
          Route,
          {
            path: "dashboard",
            element: React.createElement(
              Dashboard
            )
          }
        ),


        /* Projects */
        React.createElement(
          Route,
          {
            path: "projects",
            element: React.createElement(
              Projects
            )
          }
        ),


        /* Project Details */
        React.createElement(
          Route,
          {
            path: "projects/:id",
            element: React.createElement(
              ProjectDetails
            )
          }
        ),


        /* Map */
        React.createElement(
          Route,
          {
            path: "map",
            element: React.createElement(
              Map
            )
          }
        ),


        /* Field Reports */
        React.createElement(
          Route,
          {
            path: "field-reports",
            element: React.createElement(
              FieldReports
            )
          }
        ),


        /* Complaints */
        React.createElement(
          Route,
          {
            path: "complaints",
            element: React.createElement(
              Complaints
            )
          }
        ),


        /* Evidence */
        React.createElement(
          Route,
          {
            path: "evidence",
            element: React.createElement(
              Evidence
            )
          }
        ),


        /* Alerts */
        React.createElement(
          Route,
          {
            path: "alerts",
            element: React.createElement(
              Alerts
            )
          }
        ),


        /* Reports */
        React.createElement(
          Route,
          {
            path: "reports",
            element: React.createElement(
              Reports
            )
          }
        ),


        /* Settings */
        React.createElement(
          Route,
          {
            path: "settings",
            element: React.createElement(
              Settings
            )
          }
        )
      ),


      /* =====================================
         UNKNOWN URL
      ===================================== */

      React.createElement(
        Route,
        {
          path: "*",
          element: React.createElement(
            Navigate,
            {
              to: "/public",
              replace: true
            }
          )
        }
      )

    )
  );
};


export default App;