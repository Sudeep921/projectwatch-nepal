import React, { useMemo, useState } from "react";
import ProjectFilters from "../components/ProjectFilters";
import ProjectTable from "../components/ProjectTable";
import AddProjectModal from "../components/AddProjectModal";

const INITIAL_PROJECTS = [
  {
    id: "PW-BAG-00124",
    name: "Kathmandu Ring Road Expansion",
    icon: "🛣️",
    district: "Kathmandu",
    province: "Bagmati",
    budget: "NPR 8.4B",
    progress: 42,
    progressLabel: "Behind Schedule",
    status: "Critical",
    risk: "Critical",
    updated: "2 hrs ago",
    contractor: "ABC Infrastructure Pvt. Ltd.",
    department: "Department of Roads",
    startDate: "15 Jan 2025",
    endDate: "14 Jan 2028",
    location: "Kathmandu, Bagmati Province"
  },

  {
    id: "PW-GAN-00087",
    name: "Pokhara Regional Bridge",
    icon: "🌉",
    district: "Kaski",
    province: "Gandaki",
    budget: "NPR 3.8B",
    progress: 38,
    progressLabel: "Behind",
    status: "Delayed",
    risk: "High",
    updated: "5 hrs ago",
    contractor: "Gandaki Construction Group",
    department: "Department of Roads",
    startDate: "20 Feb 2025",
    endDate: "20 Dec 2027",
    location: "Pokhara, Gandaki Province"
  },

  {
    id: "PW-KOS-00191",
    name: "District Hospital Upgrade",
    icon: "🏥",
    district: "Morang",
    province: "Koshi",
    budget: "NPR 2.1B",
    progress: 56,
    progressLabel: "On Track",
    status: "Active",
    risk: "Medium",
    updated: "1 day ago",
    contractor: "Himalayan Builders Pvt. Ltd.",
    department: "Ministry of Health",
    startDate: "10 Apr 2025",
    endDate: "30 Mar 2027",
    location: "Morang, Koshi Province"
  },

  {
    id: "PW-LUM-00076",
    name: "Butwal-Bhairahawa Road",
    icon: "🛣️",
    district: "Rupandehi",
    province: "Lumbini",
    budget: "NPR 5.6B",
    progress: 74,
    progressLabel: "Good",
    status: "Active",
    risk: "Low",
    updated: "1 day ago",
    contractor: "National Road Builders",
    department: "Department of Roads",
    startDate: "5 Jan 2024",
    endDate: "30 Dec 2026",
    location: "Rupandehi, Lumbini Province"
  },

  {
    id: "PW-MAD-00214",
    name: "Terai Irrigation Network",
    icon: "💧",
    district: "Dhanusha",
    province: "Madhesh",
    budget: "NPR 4.2B",
    progress: 29,
    progressLabel: "Behind",
    status: "Delayed",
    risk: "High",
    updated: "2 days ago",
    contractor: "Terai Development Contractors",
    department: "Department of Irrigation",
    startDate: "12 Jun 2025",
    endDate: "15 May 2028",
    location: "Dhanusha, Madhesh Province"
  },

  {
    id: "PW-KAR-00042",
    name: "Karnali District Hospital",
    icon: "🏥",
    district: "Surkhet",
    province: "Karnali",
    budget: "NPR 1.7B",
    progress: 91,
    progressLabel: "Good",
    status: "Completed",
    risk: "Low",
    updated: "3 days ago",
    contractor: "Karnali Infrastructure Pvt. Ltd.",
    department: "Ministry of Health",
    startDate: "1 Feb 2023",
    endDate: "30 Jan 2026",
    location: "Surkhet, Karnali Province"
  },

  {
    id: "PW-SUD-00111",
    name: "Mahakali Drinking Water Project",
    icon: "🚰",
    district: "Kanchanpur",
    province: "Sudurpashchim",
    budget: "NPR 980M",
    progress: 63,
    progressLabel: "On Track",
    status: "Active",
    risk: "Medium",
    updated: "3 days ago",
    contractor: "Sudur Infrastructure Group",
    department: "Department of Water Supply",
    startDate: "18 Aug 2025",
    endDate: "20 Jul 2027",
    location: "Kanchanpur, Sudurpashchim Province"
  },

  {
    id: "PW-BAG-00203",
    name: "Community School Reconstruction",
    icon: "🏫",
    district: "Lalitpur",
    province: "Bagmati",
    budget: "NPR 1.2B",
    progress: 81,
    progressLabel: "Good",
    status: "Active",
    risk: "Low",
    updated: "4 days ago",
    contractor: "Kathmandu Valley Builders",
    department: "Ministry of Education",
    startDate: "10 Mar 2025",
    endDate: "15 Feb 2027",
    location: "Lalitpur, Bagmati Province"
  }
];

function Projects({ setPage, onViewProject }) {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);

  const [search, setSearch] = useState("");
  const [province, setProvince] = useState("All Provinces");
  const [status, setStatus] = useState("All Status");
  const [risk, setRisk] = useState("All Risk");

  const [showAddProject, setShowAddProject] = useState(false);

  const filteredProjects = useMemo(function () {
    return projects.filter(function (project) {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        searchText === "" ||
        project.name.toLowerCase().includes(searchText) ||
        project.id.toLowerCase().includes(searchText) ||
        project.district.toLowerCase().includes(searchText);

      const matchesProvince =
        province === "All Provinces" ||
        project.province === province;

      const matchesStatus =
        status === "All Status" ||
        project.status === status;

      const matchesRisk =
        risk === "All Risk" ||
        project.risk === risk;

      return (
        matchesSearch &&
        matchesProvince &&
        matchesStatus &&
        matchesRisk
      );
    });
  }, [projects, search, province, status, risk]);

  function clearFilters() {
    setSearch("");
    setProvince("All Provinces");
    setStatus("All Status");
    setRisk("All Risk");
  }

  function addNewProject() {
    console.log("Add New Project clicked");
    setShowAddProject(true);
  }

  function closeAddProject() {
    setShowAddProject(false);
  }

  function saveProject(newProject) {
    setProjects(function (previousProjects) {
      return [
        newProject,
        ...previousProjects
      ];
    });

    setShowAddProject(false);
  }

  function openProject(project) {
    if (onViewProject) {
      onViewProject(project);
    }
  }

  const criticalCount = projects.filter(function (project) {
    return project.risk === "Critical";
  }).length;

  const delayedCount = projects.filter(function (project) {
    return project.status === "Delayed";
  }).length;

  return React.createElement(
    "main",
    {
      className: "page-content projects-page"
    },

    /* =========================
       HEADER
    ========================= */

    React.createElement(
      "div",
      {
        className: "page-header"
      },

      React.createElement(
        "div",
        null,

        React.createElement(
          "div",
          {
            className: "breadcrumb"
          },

          "Project Management",

          React.createElement(
            "span",
            null,
            "/"
          ),

          " All Projects"
        ),

        React.createElement(
          "h1",
          null,
          "Government Projects"
        ),

        React.createElement(
          "p",
          null,
          "Monitor, verify and manage government development projects across Nepal."
        )
      ),

      /* ADD NEW PROJECT BUTTON */

      React.createElement(
        "button",
        {
          type: "button",
          className: "primary-button",
          onClick: function (event) {
            event.preventDefault();
            event.stopPropagation();

            console.log("ADD PROJECT BUTTON CLICKED");

            setShowAddProject(true);
          }
        },
        "+ Add New Project"
      )
    ),

    /* =========================
       SUMMARY
    ========================= */

    React.createElement(
      "div",
      {
        className: "project-summary-row"
      },

      React.createElement(
        "div",
        {
          className: "project-summary-card"
        },

        React.createElement(
          "span",
          null,
          "Total Projects"
        ),

        React.createElement(
          "strong",
          null,
          projects.length
        )
      ),

      React.createElement(
        "div",
        {
          className: "project-summary-card"
        },

        React.createElement(
          "span",
          null,
          "Filtered"
        ),

        React.createElement(
          "strong",
          null,
          filteredProjects.length
        )
      ),

      React.createElement(
        "div",
        {
          className: "project-summary-card"
        },

        React.createElement(
          "span",
          null,
          "Critical"
        ),

        React.createElement(
          "strong",
          null,
          criticalCount
        )
      ),

      React.createElement(
        "div",
        {
          className: "project-summary-card"
        },

        React.createElement(
          "span",
          null,
          "Delayed"
        ),

        React.createElement(
          "strong",
          null,
          delayedCount
        )
      )
    ),

    /* =========================
       FILTERS
    ========================= */

    React.createElement(
      ProjectFilters,
      {
        search: search,
        setSearch: setSearch,

        province: province,
        setProvince: setProvince,

        status: status,
        setStatus: setStatus,

        risk: risk,
        setRisk: setRisk,

        onClear: clearFilters
      }
    ),

    /* =========================
       PROJECT TABLE
    ========================= */

    React.createElement(
      ProjectTable,
      {
        projects: Array.isArray(filteredProjects)
          ? filteredProjects
          : [],

        onViewProject: openProject
      }
    ),

    /* =========================
       ADD PROJECT MODAL
    ========================= */

    showAddProject
      ? React.createElement(
          AddProjectModal,
          {
            onClose: closeAddProject,
            onSave: saveProject
          }
        )
      : null
  );
}

export default Projects;