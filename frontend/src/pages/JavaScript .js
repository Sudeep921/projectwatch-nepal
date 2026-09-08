import React, { useMemo, useState } from "react";

const PROJECTS = [
  {
    id: "PW-BAG-00124",
    name: "Kathmandu Ring Road Expansion",
    icon: "🛣️",
    district: "Kathmandu",
    province: "Bagmati",
    budget: "NPR 8.4B",
    progress: 42,
    status: "Critical",
    risk: "Critical",
    updated: "2 hrs ago",
    contractor: "ABC Infrastructure Pvt. Ltd.",
    department: "Department of Roads",
    startDate: "15 Jan 2025",
    endDate: "14 Jan 2028",
    location: "Kathmandu, Bagmati Province",
    description:
      "Major road infrastructure development project focused on expanding and upgrading the Kathmandu Ring Road.",
    verification: "Human Review Required"
  },
  {
    id: "PW-GAN-00087",
    name: "Pokhara Regional Bridge",
    icon: "🌉",
    district: "Kaski",
    province: "Gandaki",
    budget: "NPR 3.8B",
    progress: 38,
    status: "Delayed",
    risk: "High",
    updated: "5 hrs ago",
    contractor: "Gandaki Construction Group",
    department: "Department of Roads",
    startDate: "20 Feb 2025",
    endDate: "20 Dec 2027",
    location: "Pokhara, Gandaki Province",
    description:
      "Regional bridge development project improving transportation connectivity around Pokhara.",
    verification: "Verified"
  },
  {
    id: "PW-KOS-00191",
    name: "District Hospital Upgrade",
    icon: "🏥",
    district: "Morang",
    province: "Koshi",
    budget: "NPR 2.1B",
    progress: 56,
    status: "Active",
    risk: "Medium",
    updated: "1 day ago",
    contractor: "Himalayan Builders Pvt. Ltd.",
    department: "Ministry of Health",
    startDate: "10 Apr 2025",
    endDate: "30 Mar 2027",
    location: "Morang, Koshi Province",
    description:
      "Upgrade and expansion of district hospital infrastructure and essential healthcare facilities.",
    verification: "Verified"
  },
  {
    id: "PW-LUM-00076",
    name: "Butwal-Bhairahawa Road",
    icon: "🛣️",
    district: "Rupandehi",
    province: "Lumbini",
    budget: "NPR 5.6B",
    progress: 74,
    status: "Active",
    risk: "Low",
    updated: "1 day ago",
    contractor: "National Road Builders",
    department: "Department of Roads",
    startDate: "5 Jan 2024",
    endDate: "30 Dec 2026",
    location: "Rupandehi, Lumbini Province",
    description:
      "Road improvement project connecting Butwal and Bhairahawa through upgraded transport infrastructure.",
    verification: "Verified"
  },
  {
    id: "PW-MAD-00214",
    name: "Terai Irrigation Network",
    icon: "💧",
    district: "Dhanusha",
    province: "Madhesh",
    budget: "NPR 4.2B",
    progress: 29,
    status: "Delayed",
    risk: "High",
    updated: "2 days ago",
    contractor: "Terai Development Contractors",
    department: "Department of Irrigation",
    startDate: "12 Jun 2025",
    endDate: "15 May 2028",
    location: "Dhanusha, Madhesh Province",
    description:
      "Large-scale irrigation infrastructure project designed to improve agricultural water access.",
    verification: "Pending"
  },
  {
    id: "PW-KAR-00042",
    name: "Karnali District Hospital",
    icon: "🏥",
    district: "Surkhet",
    province: "Karnali",
    budget: "NPR 1.7B",
    progress: 91,
    status: "Completed",
    risk: "Low",
    updated: "3 days ago",
    contractor: "Karnali Infrastructure Pvt. Ltd.",
    department: "Ministry of Health",
    startDate: "1 Feb 2023",
    endDate: "30 Jan 2026",
    location: "Surkhet, Karnali Province",
    description:
      "District-level hospital infrastructure development project serving communities in Karnali.",
    verification: "Verified"
  },
  {
    id: "PW-SUD-00111",
    name: "Mahakali Drinking Water Project",
    icon: "🚰",
    district: "Kanchanpur",
    province: "Sudurpashchim",
    budget: "NPR 980M",
    progress: 63,
    status: "Active",
    risk: "Medium",
    updated: "3 days ago",
    contractor: "Sudur Infrastructure Group",
    department: "Department of Water Supply",
    startDate: "18 Aug 2025",
    endDate: "20 Jul 2027",
    location: "Kanchanpur, Sudurpashchim Province",
    description:
      "Drinking water infrastructure project intended to improve reliable water access for local communities.",
    verification: "Verified"
  },
  {
    id: "PW-BAG-00203",
    name: "Community School Reconstruction",
    icon: "🏫",
    district: "Lalitpur",
    province: "Bagmati",
    budget: "NPR 1.2B",
    progress: 81,
    status: "Active",
    risk: "Low",
    updated: "4 days ago",
    contractor: "Kathmandu Valley Builders",
    department: "Ministry of Education",
    startDate: "10 Mar 2025",
    endDate: "15 Feb 2027",
    location: "Lalitpur, Bagmati Province",
    description:
      "Reconstruction and improvement of community school facilities for safer learning environments.",
    verification: "Verified"
  }
];

function PublicPortal() {
  const [search, setSearch] = useState("");
  const [province, setProvince] = useState("All Provinces");
  const [status, setStatus] = useState("All Status");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showReport, setShowReport] = useState(false);

  const filteredProjects = useMemo(function () {
    const query = search.trim().toLowerCase();

    return PROJECTS.filter(function (project) {
      const matchesSearch =
        !query ||
        project.name.toLowerCase().includes(query) ||
        project.id.toLowerCase().includes(query) ||
        project.district.toLowerCase().includes(query) ||
        project.province.toLowerCase().includes(query);

      const matchesProvince =
        province === "All Provinces" ||
        project.province === province;

      const matchesStatus =
        status === "All Status" ||
        project.status === status;

      return matchesSearch && matchesProvince && matchesStatus;
    });
  }, [search, province, status]);

  const provinces = [
    "All Provinces",
    "Bagmati",
    "Gandaki",
    "Koshi",
    "Lumbini",
    "Madhesh",
    "Karnali",
    "Sudurpashchim"
  ];

  function openProject(project) {
    setSelectedProject(project);
  }

  function closeProject() {
    setSelectedProject(null);
  }

  function openReport() {
    setShowReport(true);
  }

  function closeReport() {
    setShowReport(false);
  }

  function renderStatus(statusValue) {
    return React.createElement(
      "span",
      {
        className:
          "public-status public-status-" +
          statusValue.toLowerCase().replace(/\s+/g, "-")
      },
      statusValue
    );
  }

  function renderVerification(value) {
    let className = "public-verification";

    if (value === "Verified") {
      className += " verified";
    } else if (value === "Pending") {
      className += " pending";
    } else {
      className += " review";
    }

    return React.createElement(
      "span",
      { className: className },
      value === "Verified"
        ? "✓ "
        : value === "Pending"
        ? "◷ "
        : "⚠ ",
      value
    );
  }

  function renderProjectCard(project) {
    return React.createElement(
      "article",
      {
        className: "public-project-card",
        key: project.id
      },

      React.createElement(
        "div",
        { className: "public-card-top" },

        React.createElement(
          "div",
          { className: "public-project-icon" },
          project.icon
        ),

        React.createElement(
          "div",
          { className: "public-project-id" },
          project.id
        )
      ),

      React.createElement(
        "h3",
        null,
        project.name
      ),

      React.createElement(
        "div",
        { className: "public-location" },
        "📍 ",
        project.location
      ),

      React.createElement(
        "div",
        { className: "public-card-status-row" },

        renderStatus(project.status),

        React.createElement(
          "span",
          {
            className:
              "public-risk public-risk-" +
              project.risk.toLowerCase()
          },
          project.risk + " Risk"
        )
      ),

      React.createElement(
        "div",
        { className: "public-progress-box" },

        React.createElement(
          "div",
          { className: "public-progress-header" },

          React.createElement(
            "span",
            null,
            "Project Progress"
          ),

          React.createElement(
            "strong",
            null,
            project.progress + "%"
          )
        ),

        React.createElement(
          "div",
          { className: "public-progress-track" },

          React.createElement(
            "div",
            {
              className: "public-progress-fill",
              style: {
                width: project.progress + "%"
              }
            }
          )
        )
      ),

      React.createElement(
        "div",
        { className: "public-card-info" },

        React.createElement(
          "div",
          null,

          React.createElement(
            "small",
            null,
            "BUDGET"
          ),

          React.createElement(
            "strong",
            null,
            project.budget
          )
        ),

        React.createElement(
          "div",
          null,

          React.createElement(
            "small",
            null,
            "UPDATED"
          ),

          React.createElement(
            "strong",
            null,
            project.updated
          )
        )
      ),

      React.createElement(
        "div",
        { className: "public-card-bottom" },

        renderVerification(project.verification),

        React.createElement(
          "button",
          {
            className: "public-view-button",
            onClick: function () {
              openProject(project);
            }
          },
          "View Project →"
        )
      )
    );
  }

  function renderProjectModal() {
    if (!selectedProject) {
      return null;
    }

    return React.createElement(
      "div",
      {
        className: "public-modal-overlay",
        onClick: closeProject
      },

      React.createElement(
        "div",
        {
          className: "public-project-modal",
          onClick: function (e) {
            e.stopPropagation();
          }
        },

        React.createElement(
          "button",
          {
            className: "public-modal-close",
            onClick: closeProject
          },
          "×"
        ),

        React.createElement(
          "div",
          { className: "public-modal-heading" },

          React.createElement(
            "div",
            { className: "public-modal-icon" },
            selectedProject.icon
          ),

          React.createElement(
            "div",
            null,

            React.createElement(
              "span",
              null,
              selectedProject.id
            ),

            React.createElement(
              "h2",
              null,
              selectedProject.name
            ),

            React.createElement(
              "p",
              null,
              "📍 ",
              selectedProject.location
            )
          )
        ),

        React.createElement(
          "div",
          { className: "public-modal-status" },

          renderStatus(selectedProject.status),

          renderVerification(selectedProject.verification)
        ),

        React.createElement(
          "div",
          { className: "public-modal-progress" },

          React.createElement(
            "div",
            { className: "public-progress-header" },

            React.createElement(
              "span",
              null,
              "Current Progress"
            ),

            React.createElement(
              "strong",
              null,
              selectedProject.progress + "%"
            )
          ),

          React.createElement(
            "div",
            { className: "public-progress-track" },

            React.createElement(
              "div",
              {
                className: "public-progress-fill",
                style: {
                  width: selectedProject.progress + "%"
                }
              }
            )
          )
        ),

        React.createElement(
          "p",
          { className: "public-project-description" },
          selectedProject.description
        ),

        React.createElement(
          "div",
          { className: "public-detail-grid" },

          React.createElement(
            "div",
            null,
            React.createElement("small", null, "PROJECT BUDGET"),
            React.createElement("strong", null, selectedProject.budget)
          ),

          React.createElement(
            "div",
            null,
            React.createElement("small", null, "CONTRACTOR"),
            React.createElement("strong", null, selectedProject.contractor)
          ),

          React.createElement(
            "div",
            null,
            React.createElement("small", null, "DEPARTMENT"),
            React.createElement("strong", null, selectedProject.department)
          ),

          React.createElement(
            "div",
            null,
            React.createElement("small", null, "RISK LEVEL"),
            React.createElement("strong", null, selectedProject.risk)
          ),

          React.createElement(
            "div",
            null,
            React.createElement("small", null, "START DATE"),
            React.createElement("strong", null, selectedProject.startDate)
          ),

          React.createElement(
            "div",
            null,
            React.createElement("small", null, "EXPECTED COMPLETION"),
            React.createElement("strong", null, selectedProject.endDate)
          )
        ),

        React.createElement(
          "div",
          { className: "public-modal-actions" },

          React.createElement(
            "button",
            {
              className: "public-modal-map-button",
              onClick: function () {
                window.open(
                  "https://www.google.com/maps/search/?api=1&query=" +
                    encodeURIComponent(selectedProject.location),
                  "_blank"
                );
              }
            },
            "📍 Open Map"
          ),

          React.createElement(
            "button",
            {
              className: "public-modal-report-button",
              onClick: openReport
            },
            "⚠ Report an Issue"
          )
        )
      )
    );
  }

  function renderReportModal() {
    if (!showReport) {
      return null;
    }

    return React.createElement(
      "div",
      {
        className: "public-modal-overlay",
        onClick: closeReport
      },

      React.createElement(
        "div",
        {
          className: "public-report-modal",
          onClick: function (e) {
            e.stopPropagation();
          }
        },

        React.createElement(
          "button",
          {
            className: "public-modal-close",
            onClick: closeReport
          },
          "×"
        ),

        React.createElement(
          "div",
          { className: "public-report-icon" },
          "⚠"
        ),

        React.createElement(
          "h2",
          null,
          "Report a Project Issue"
        ),

        React.createElement(
          "p",
          null,
          "Help improve public project monitoring by reporting an issue you observed."
        ),

        React.createElement(
          "div",
          { className: "public-report-form" },

          React.createElement(
            "label",
            null,
            "PROJECT",

            React.createElement(
              "input",
              {
                value: selectedProject
                  ? selectedProject.name
                  : "",
                readOnly: true
              }
            )
          ),

          React.createElement(
            "label",
            null,
            "ISSUE TYPE",

            React.createElement(
              "select",
              { defaultValue: "" },

              React.createElement(
                "option",
                { value: "" },
                "Select issue type"
              ),

              React.createElement(
                "option",
                null,
                "Progress discrepancy"
              ),

              React.createElement(
                "option",
                null,
                "Construction quality"
              ),

              React.createElement(
                "option",
                null,
                "Project delay"
              ),

              React.createElement(
                "option",
                null,
                "Safety concern"
              ),

              React.createElement(
                "option",
                null,
                "Other"
              )
            )
          ),

          React.createElement(
            "label",
            null,
            "DESCRIPTION",

            React.createElement(
              "textarea",
              {
                placeholder:
                  "Describe the issue you observed..."
              }
            )
          ),

          React.createElement(
            "button",
            {
              className: "public-submit-report",
              onClick: function () {
                alert(
                  "Thank you. Your report has been prepared for submission."
                );
                closeReport();
              }
            },
            "Submit Report"
          )
        )
      )
    );
  }

  return React.createElement(
    "main",
    { className: "public-portal" },

    /* =========================
       NAVBAR
       ========================= */

    React.createElement(
      "header",
      { className: "public-navbar" },

      React.createElement(
        "div",
        { className: "public-brand" },

        React.createElement(
          "div",
          { className: "public-brand-logo" },
          "PW"
        ),

        React.createElement(
          "div",
          null,

          React.createElement(
            "strong",
            null,
            "ProjectWatch Nepal"
          ),

          React.createElement(
            "span",
            null,
            "PUBLIC TRANSPARENCY PORTAL"
          )
        )
      ),

      React.createElement(
        "div",
        { className: "public-nav-right" },

        React.createElement(
          "span",
          { className: "public-live-status" },

          React.createElement(
            "i",
            null
          ),

          "System Online"
        ),

        React.createElement(
          "button",
          {
            className: "public-admin-button",
            onClick: function () {
              alert("Administrator login will be connected later.");
            }
          },
          "Admin Portal"
        )
      )
    ),

    /* =========================
       HERO
       ========================= */

    React.createElement(
      "section",
      { className: "public-hero" },

      React.createElement(
        "div",
        { className: "public-hero-content" },

        React.createElement(
          "div",
          { className: "public-hero-badge" },
          "🇳🇵 Government Project Transparency"
        ),

        React.createElement(
          "h1",
          null,
          "Track Public Projects.",
          React.createElement("br"),
          React.createElement(
            "span",
            null,
            "Know Where Your Money Goes."
          )
        ),

        React.createElement(
          "p",
          null,
          "Explore government projects across Nepal, view project progress, budgets, evidence and verification information — all in one place."
        ),

        React.createElement(
          "div",
          { className: "public-hero-search" },

          React.createElement(
            "span",
            null,
            "⌕"
          ),

          React.createElement("input", {
            value: search,
            onChange: function (e) {
              setSearch(e.target.value);
            },
            placeholder:
              "Search project name, project ID, district..."
          }),

          React.createElement(
            "button",
            null,
            "Search"
          )
        )
      ),

      React.createElement(
        "div",
        { className: "public-hero-stat-strip" },

        React.createElement(
          "div",
          null,
          React.createElement("strong", null, "1,284"),
          React.createElement("span", null, "Public Projects")
        ),

        React.createElement(
          "div",
          null,
          React.createElement("strong", null, "NPR 48.2B"),
          React.createElement("span", null, "Total Budget")
        ),

        React.createElement(
          "div",
          null,
          React.createElement("strong", null, "67%"),
          React.createElement("span", null, "Overall Progress")
        ),

        React.createElement(
          "div",
          null,
          React.createElement("strong", null, "7"),
          React.createElement("span", null, "Provinces Covered")
        )
      )
    ),

    /* =========================
       MAIN
       ========================= */

    React.createElement(
      "section",
      { className: "public-main" },

      React.createElement(
        "div",
        { className: "public-section-heading" },

        React.createElement(
          "div",
          null,

          React.createElement(
            "span",
            null,
            "PROJECT DIRECTORY"
          ),

          React.createElement(
            "h2",
            null,
            "Government Projects"
          ),

          React.createElement(
            "p",
            null,
            "Search and explore publicly available project information."
          )
        ),

        React.createElement(
          "button",
          {
            className: "public-report-main-button",
            onClick: openReport
          },
          "⚠ Report an Issue"
        )
      ),

      /* FILTERS */

      React.createElement(
        "div",
        { className: "public-filters" },

        React.createElement(
          "div",
          { className: "public-filter-search" },

          React.createElement(
            "span",
            null,
            "⌕"
          ),

          React.createElement("input", {
            value: search,
            onChange: function (e) {
              setSearch(e.target.value);
            },
            placeholder: "Search projects..."
          })
        ),

        React.createElement(
          "select",
          {
            value: province,
            onChange: function (e) {
              setProvince(e.target.value);
            }
          },

          provinces.map(function (item) {
            return React.createElement(
              "option",
              {
                key: item,
                value: item
              },
              item
            );
          })
        ),

        React.createElement(
          "select",
          {
            value: status,
            onChange: function (e) {
              setStatus(e.target.value);
            }
          },

          React.createElement(
            "option",
            null,
            "All Status"
          ),

          React.createElement(
            "option",
            null,
            "Active"
          ),

          React.createElement(
            "option",
            null,
            "Delayed"
          ),

          React.createElement(
            "option",
            null,
            "Critical"
          ),

          React.createElement(
            "option",
            null,
            "Completed"
          )
        ),

        React.createElement(
          "button",
          {
            className: "public-clear-button",
            onClick: function () {
              setSearch("");
              setProvince("All Provinces");
              setStatus("All Status");
            }
          },
          "Clear"
        )
      ),

      React.createElement(
        "div",
        { className: "public-result-count" },

        React.createElement(
          "strong",
          null,
          filteredProjects.length
        ),

        " projects found"
      ),

      /* PROJECT GRID */

      filteredProjects.length > 0
        ? React.createElement(
            "div",
            { className: "public-project-grid" },
            filteredProjects.map(renderProjectCard)
          )
        : React.createElement(
            "div",
            { className: "public-empty-state" },

            React.createElement(
              "div",
              null,
              "🔎"
            ),

            React.createElement(
              "h3",
              null,
              "No projects found"
            ),

            React.createElement(
              "p",
              null,
              "Try changing your search or filters."
            )
          )
    ),

    /* =========================
       TRUST SECTION
       ========================= */

    React.createElement(
      "section",
      { className: "public-transparency-section" },

      React.createElement(
        "div",
        { className: "public-transparency-content" },

        React.createElement(
          "span",
          null,
          "WHY PROJECTWATCH?"
        ),

        React.createElement(
          "h2",
          null,
          "Building Trust Through Transparency"
        ),

        React.createElement(
          "p",
          null,
          "ProjectWatch Nepal brings project information, field evidence and citizen feedback together to make public project monitoring more transparent and accountable."
        )
      ),

      React.createElement(
        "div",
        { className: "public-trust-grid" },

        React.createElement(
          "div",
          null,
          React.createElement("span", null, "💰"),
          React.createElement("strong", null, "Budget Transparency"),
          React.createElement(
            "p",
            null,
            "See the publicly reported budget and project investment."
          )
        ),

        React.createElement(
          "div",
          null,
          React.createElement("span", null, "📊"),
          React.createElement("strong", null, "Progress Tracking"),
          React.createElement(
            "p",
            null,
            "Follow reported project progress over time."
          )
        ),

        React.createElement(
          "div",
          null,
          React.createElement("span", null, "📍"),
          React.createElement("strong", null, "Location Evidence"),
          React.createElement(
            "p",
            null,
            "Connect project information with its physical location."
          )
        ),

        React.createElement(
          "div",
          null,
          React.createElement("span", null, "👥"),
          React.createElement("strong", null, "Citizen Voice"),
          React.createElement(
            "p",
            null,
            "Citizens can report issues and contribute observations."
          )
        )
      )
    ),

    /* =========================
       FOOTER
       ========================= */

    React.createElement(
      "footer",
      { className: "public-footer" },

      React.createElement(
        "div",
        null,

        React.createElement(
          "strong",
          null,
          "ProjectWatch Nepal"
        ),

        React.createElement(
          "span",
          null,
          "Public Project Transparency Platform"
        )
      ),

      React.createElement(
        "p",
        null,
        "© 2026 ProjectWatch Nepal. Public information portal."
      )
    ),

    renderProjectModal(),
    renderReportModal()
  );
}

export default PublicPortal;