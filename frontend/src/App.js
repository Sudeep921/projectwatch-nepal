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

const ProtectedRoutes = () => {
  const {
    user,
    loading
  } = useAuth();

  if (loading) {
    return React.createElement(
      "div",
      {
        className: "app-loading"
      },
      "Loading ProjectWatch Nepal..."
    );
  }

  if (!user) {
    return React.createElement(
      Navigate,
      {
        to: "/public",
        replace: true
      }
    );
  }

  return React.createElement(
    DashboardLayout
  );
};

const App = () => {
  return React.createElement(
    BrowserRouter,
    null,

    React.createElement(
      Routes,
      null,

      React.createElement(
        Route,
        {
          path: "/public",
          element:
            React.createElement(
              PublicPortal
            )
        }
      ),

      React.createElement(
        Route,
        {
          path: "/",
          element:
            React.createElement(
              ProtectedRoutes
            )
        },

        React.createElement(
          Route,
          {
            index: true,
            element:
              React.createElement(
                Navigate,
                {
                  to: "/dashboard",
                  replace: true
                }
              )
          }
        ),

        React.createElement(
          Route,
          {
            path: "dashboard",
            element:
              React.createElement(
                Dashboard
              )
          }
        ),

        React.createElement(
          Route,
          {
            path: "projects",
            element:
              React.createElement(
                Projects
              )
          }
        ),

        React.createElement(
          Route,
          {
            path: "projects/:id",
            element:
              React.createElement(
                ProjectDetails
              )
          }
        ),

        React.createElement(
          Route,
          {
            path: "map",
            element:
              React.createElement(Map)
          }
        ),

        React.createElement(
          Route,
          {
            path: "field-reports",
            element:
              React.createElement(
                FieldReports
              )
          }
        ),

        React.createElement(
          Route,
          {
            path: "complaints",
            element:
              React.createElement(
                Complaints
              )
          }
        ),

        React.createElement(
          Route,
          {
            path: "evidence",
            element:
              React.createElement(
                Evidence
              )
          }
        ),

        React.createElement(
          Route,
          {
            path: "alerts",
            element:
              React.createElement(
                Alerts
              )
          }
        ),

        React.createElement(
          Route,
          {
            path: "reports",
            element:
              React.createElement(
                Reports
              )
          }
        ),

        React.createElement(
          Route,
          {
            path: "settings",
            element:
              React.createElement(
                Settings
              )
          }
        )
      ),

      React.createElement(
        Route,
        {
          path: "*",
          element:
            React.createElement(
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