import React, { useState } from "react";

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

function App() {
  const [page, setPage] = useState("dashboard");
  const [selectedProject, setSelectedProject] = useState(null);

  /* =========================================
     OPEN PROJECT DETAILS
     ========================================= */

  function openProject(project) {
    setSelectedProject(project);
    setPage("project-details");
  }

  /* =========================================
     PUBLIC PORTAL
     ========================================= */

  if (page === "public-portal") {
    return React.createElement(PublicPortal);
  }

  /* =========================================
     RENDER ADMIN PAGES
     ========================================= */

  function renderPage() {
    /* DASHBOARD */

    if (page === "dashboard") {
      return React.createElement(Dashboard);
    }

    /* PROJECTS */

    if (page === "projects") {
      return React.createElement(Projects, {
        setPage: setPage,
        onViewProject: openProject
      });
    }

    /* PROJECT DETAILS */

    if (page === "project-details") {
      return React.createElement(ProjectDetails, {
        project: selectedProject,

        onBack: function () {
          setPage("projects");
        }
      });
    }

    /* LIVE MAP */

    if (page === "map") {
      return React.createElement(Map, {
        setPage: setPage,
        onViewProject: openProject
      });
    }

    /* FIELD REPORTS */

    if (page === "field-reports") {
      return React.createElement(FieldReports);
    }

    /* COMPLAINTS */

    if (page === "complaints") {
      return React.createElement(Complaints);
    }
    if (page === "public-portal") {
      return React.createElement(PublicPortal, {
        setPage: setPage
      });
    }

    /* EVIDENCE */

    if (page === "evidence") {
      return React.createElement(Evidence);
    }

    /* ALERTS */

    if (page === "alerts") {
      return React.createElement(Alerts);
    }

    /* REPORTS */

    if (page === "reports") {
      return React.createElement(Reports);
    }

    /* SETTINGS */

    if (page === "settings") {
      return React.createElement(Settings);
    }

    /* FALLBACK */

    return React.createElement(Dashboard);
  }

  /* =========================================
     ADMIN LAYOUT
     ========================================= */

  return React.createElement(
    DashboardLayout,
    {
      currentPage: page,
      setPage: setPage
    },
    renderPage()
  );
}

export default App;