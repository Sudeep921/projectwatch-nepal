import React from "react";
import StatCard from "../components/StatCard";

function Dashboard() {
  const stats = [
    {
      icon: "▣",
      title: "Total Projects",
      value: "1,284",
      change: "+12.5%",
      description: "vs last month",
      type: "blue",
    },
    {
      icon: "◉",
      title: "Active Projects",
      value: "742",
      change: "+8.2%",
      description: "currently active",
      type: "green",
    },
    {
      icon: "◷",
      title: "Delayed Projects",
      value: "151",
      change: "-4.3%",
      description: "vs last month",
      type: "orange",
    },
    {
      icon: "⚠",
      title: "Critical Projects",
      value: "37",
      change: "+2.1%",
      description: "requires attention",
      type: "red",
    },
  ];

  const criticalProjects = [
    {
      name: "Kathmandu Ring Road Expansion",
      province: "Bagmati",
      progress: "42%",
      risk: "Critical",
    },
    {
      name: "Pokhara Regional Bridge",
      province: "Gandaki",
      progress: "38%",
      risk: "Critical",
    },
    {
      name: "District Hospital Upgrade",
      province: "Koshi",
      progress: "56%",
      risk: "At Risk",
    },
  ];

  const alerts = [
    {
      title: "Progress discrepancy detected",
      project: "Ring Road Project",
      time: "12 min ago",
      icon: "!",
      type: "warning",
    },
    {
      title: "Evidence submission received",
      project: "Pokhara Bridge",
      time: "34 min ago",
      icon: "✓",
      type: "success",
    },
    {
      title: "Project deadline approaching",
      project: "Hospital Upgrade",
      time: "1 hr ago",
      icon: "◷",
      type: "warning",
    },
    {
      title: "New citizen complaint",
      project: "Road Maintenance",
      time: "2 hrs ago",
      icon: "!",
      type: "danger",
    },
  ];

  function handleAddProject() {
    alert(
      "Add New Project form will be available in the next step."
    );
  }

  function handleViewAll() {
    alert(
      "Critical Projects page will be connected in the next step."
    );
  }

  return React.createElement(
    "main",
    { className: "main-content" },

    /* =====================================================
       WELCOME HEADER
       ===================================================== */

    React.createElement(
      "div",
      { className: "welcome-row" },

      React.createElement(
        "div",
        null,

        React.createElement(
          "h2",
          null,
          "Overview"
        ),

        React.createElement(
          "p",
          null,
          "Here's what's happening across Nepal's public projects."
        )
      ),

      React.createElement(
        "button",
        {
          className: "add-project-button",
          onClick: handleAddProject,
        },
        "+ Add New Project"
      )
    ),

    /* =====================================================
       STATISTICS
       ===================================================== */

    React.createElement(
      "div",
      { className: "stats-grid" },

      stats.map(function (stat) {
        return React.createElement(StatCard, {
          key: stat.title,
          icon: stat.icon,
          title: stat.title,
          value: stat.value,
          change: stat.change,
          description: stat.description,
          type: stat.type,
        });
      })
    ),

    /* =====================================================
       BUDGET + PROGRESS
       ===================================================== */

    React.createElement(
      "div",
      { className: "dashboard-grid" },

      /* ---------------- BUDGET ---------------- */

      React.createElement(
        "section",
        { className: "panel budget-panel" },

        React.createElement(
          "div",
          { className: "panel-header" },

          React.createElement(
            "div",
            null,

            React.createElement(
              "h3",
              null,
              "Project Budget"
            ),

            React.createElement(
              "p",
              null,
              "Total allocated government project budget"
            )
          ),

          React.createElement(
            "button",
            {
              className: "period-button",
              onClick: function () {
                alert("Budget period selector will be added soon.");
              },
            },
            "This Year ⌄"
          )
        ),

        React.createElement(
          "div",
          { className: "budget-number" },
          "NPR 48.2B"
        ),

        React.createElement(
          "div",
          { className: "progress-bar" },

          React.createElement(
            "div",
            {
              className: "progress-fill",
              style: {
                width: "72%",
              },
            }
          )
        ),

        React.createElement(
          "div",
          { className: "budget-footer" },

          React.createElement(
            "span",
            null,
            "72% allocated"
          ),

          React.createElement(
            "strong",
            null,
            "NPR 13.5B remaining"
          )
        )
      ),

      /* ---------------- PROJECT PROGRESS ---------------- */

      React.createElement(
        "section",
        { className: "panel progress-panel" },

        React.createElement(
          "div",
          { className: "panel-header" },

          React.createElement(
            "div",
            null,

            React.createElement(
              "h3",
              null,
              "Project Progress"
            ),

            React.createElement(
              "p",
              null,
              "Overall completion across monitored projects"
            )
          )
        ),

        React.createElement(
          "div",
          { className: "progress-circle-container" },

          React.createElement(
            "div",
            { className: "progress-circle" },

            React.createElement(
              "div",
              { className: "circle-inner" },

              React.createElement(
                "strong",
                null,
                "67%"
              ),

              React.createElement(
                "span",
                null,
                "Completed"
              )
            )
          ),

          React.createElement(
            "div",
            { className: "progress-legend" },

            React.createElement(
              "div",
              null,

              React.createElement(
                "i",
                {
                  className: "dot completed",
                }
              ),

              React.createElement(
                "span",
                null,
                "Completed"
              ),

              React.createElement(
                "strong",
                null,
                "391"
              )
            ),

            React.createElement(
              "div",
              null,

              React.createElement(
                "i",
                {
                  className: "dot active-dot",
                }
              ),

              React.createElement(
                "span",
                null,
                "In Progress"
              ),

              React.createElement(
                "strong",
                null,
                "742"
              )
            ),

            React.createElement(
              "div",
              null,

              React.createElement(
                "i",
                {
                  className: "dot delayed",
                }
              ),

              React.createElement(
                "span",
                null,
                "Delayed"
              ),

              React.createElement(
                "strong",
                null,
                "151"
              )
            )
          )
        )
      )
    ),

    /* =====================================================
       CRITICAL PROJECTS + ALERTS
       ===================================================== */

    React.createElement(
      "div",
      { className: "bottom-grid" },

      /* ---------------- CRITICAL PROJECTS ---------------- */

      React.createElement(
        "section",
        { className: "panel critical-panel" },

        React.createElement(
          "div",
          { className: "panel-header" },

          React.createElement(
            "div",
            null,

            React.createElement(
              "h3",
              null,
              "Critical Projects"
            ),

            React.createElement(
              "p",
              null,
              "Projects requiring immediate attention"
            )
          ),

          React.createElement(
            "button",
            {
              className: "view-all",
              onClick: handleViewAll,
            },
            "View All →"
          )
        ),

        criticalProjects.map(function (project) {
          return React.createElement(
            "div",
            {
              className: "project-row",
              key: project.name,
            },

            React.createElement(
              "div",
              {
                className:
                  "project-status red-status",
              },
              "!"
            ),

            React.createElement(
              "div",
              {
                className: "project-info",
              },

              React.createElement(
                "strong",
                null,
                project.name
              ),

              React.createElement(
                "span",
                null,
                project.province
              )
            ),

            React.createElement(
              "div",
              {
                className: "mini-progress",
              },

              React.createElement(
                "div",
                {
                  style: {
                    width: project.progress,
                  },
                }
              )
            ),

            React.createElement(
              "span",
              {
                className: "project-percent",
              },
              project.progress
            ),

            React.createElement(
              "span",
              {
                className:
                  "risk-badge " +
                  (
                    project.risk === "Critical"
                      ? "critical"
                      : "at-risk"
                  ),
              },
              project.risk
            )
          );
        })
      ),

      /* ---------------- RECENT ALERTS ---------------- */

      React.createElement(
        "section",
        { className: "panel alerts-panel" },

        React.createElement(
          "div",
          { className: "panel-header" },

          React.createElement(
            "div",
            null,

            React.createElement(
              "h3",
              null,
              "Recent Alerts"
            ),

            React.createElement(
              "p",
              null,
              "Latest system notifications"
            )
          )
        ),

        alerts.map(function (alert, index) {
          return React.createElement(
            "div",
            {
              className: "alert-row",
              key: index,
            },

            React.createElement(
              "div",
              {
                className:
                  "alert-icon " +
                  alert.type,
              },
              alert.icon
            ),

            React.createElement(
              "div",
              {
                className: "alert-info",
              },

              React.createElement(
                "strong",
                null,
                alert.title
              ),

              React.createElement(
                "span",
                null,
                alert.project
              )
            ),

            React.createElement(
              "small",
              null,
              alert.time
            )
          );
        })
      )
    )
  );
}

export default Dashboard;