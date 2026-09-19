import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard";

function Dashboard() {
  // =====================================================
  // DASHBOARD API DATA
  // =====================================================

  const [dashboardStats, setDashboardStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    delayedProjects: 0,
    criticalProjects: 0,
    totalBudget: 0,
    averageProgress: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH DASHBOARD STATS
  // =====================================================

  useEffect(function () {
    fetchDashboardStats();
  }, []);

  async function fetchDashboardStats() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8000/api/dashboard/stats",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch dashboard statistics"
        );
      }

      if (data.success) {
        setDashboardStats(data.stats);
      }
    } catch (err) {
      console.error("Dashboard API Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // FORMAT BUDGET
  // =====================================================

  function formatBudget(amount) {
    if (!amount) {
      return "NPR 0";
    }

    if (amount >= 1000000000) {
      return (
        "NPR " +
        (amount / 1000000000).toFixed(2) +
        "B"
      );
    }

    if (amount >= 1000000) {
      return (
        "NPR " +
        (amount / 1000000).toFixed(2) +
        "M"
      );
    }

    if (amount >= 1000) {
      return (
        "NPR " +
        (amount / 1000).toFixed(2) +
        "K"
      );
    }

    return "NPR " + Number(amount).toLocaleString();
  }

  // =====================================================
  // CALCULATE REMAINING BUDGET
  // =====================================================

  function getRemainingBudget() {
    const totalBudget = dashboardStats.totalBudget || 0;
    const progress = dashboardStats.averageProgress || 0;

    const usedBudget =
      totalBudget * (progress / 100);

    const remainingBudget =
      totalBudget - usedBudget;

    return remainingBudget > 0
      ? remainingBudget
      : 0;
  }

  // =====================================================
  // STATISTICS
  // =====================================================

  const stats = [
    {
      icon: "▣",
      title: "Total Projects",
      value: loading
        ? "..."
        : dashboardStats.totalProjects.toLocaleString(),
      change: "",
      description: "all registered projects",
      type: "blue",
    },

    {
      icon: "◉",
      title: "Active Projects",
      value: loading
        ? "..."
        : dashboardStats.activeProjects.toLocaleString(),
      change: "",
      description: "currently active",
      type: "green",
    },

    {
      icon: "◷",
      title: "Delayed Projects",
      value: loading
        ? "..."
        : dashboardStats.delayedProjects.toLocaleString(),
      change: "",
      description: "projects behind schedule",
      type: "orange",
    },

    {
      icon: "⚠",
      title: "Critical Projects",
      value: loading
        ? "..."
        : dashboardStats.criticalProjects.toLocaleString(),
      change: "",
      description: "requires attention",
      type: "red",
    },
  ];

  // =====================================================
  // CRITICAL PROJECTS
  // =====================================================

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

  // =====================================================
  // ALERTS
  // =====================================================

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

  // =====================================================
  // BUTTON FUNCTIONS
  // =====================================================

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

  function handleBudgetPeriod() {
    alert(
      "Budget period selector will be added soon."
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return React.createElement(
    "main",
    { className: "main-content" },

    // ===================================================
    // WELCOME HEADER
    // ===================================================

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

    // ===================================================
    // ERROR MESSAGE
    // ===================================================

    error &&
      React.createElement(
        "div",
        {
          className: "dashboard-error",
        },
        "⚠ ",
        error
      ),

    // ===================================================
    // STATISTICS
    // ===================================================

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

    // ===================================================
    // BUDGET + PROGRESS
    // ===================================================

    React.createElement(
      "div",
      { className: "dashboard-grid" },

      // -------------------------------------------------
      // PROJECT BUDGET
      // -------------------------------------------------

      React.createElement(
        "section",
        {
          className: "panel budget-panel",
        },

        React.createElement(
          "div",
          {
            className: "panel-header",
          },

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
              onClick: handleBudgetPeriod,
            },
            "This Year ⌄"
          )
        ),

        React.createElement(
          "div",
          {
            className: "budget-number",
          },
          loading
            ? "..."
            : formatBudget(
                dashboardStats.totalBudget
              )
        ),

        React.createElement(
          "div",
          {
            className: "progress-bar",
          },

          React.createElement(
            "div",
            {
              className: "progress-fill",
              style: {
                width:
                  Math.min(
                    dashboardStats.averageProgress || 0,
                    100
                  ) + "%",
              },
            }
          )
        ),

        React.createElement(
          "div",
          {
            className: "budget-footer",
          },

          React.createElement(
            "span",
            null,
            loading
              ? "Loading..."
              : Math.round(
                  dashboardStats.averageProgress || 0
                ) + "% progress"
          ),

          React.createElement(
            "strong",
            null,
            loading
              ? "..."
              : formatBudget(
                  getRemainingBudget()
                ) + " remaining"
          )
        )
      ),

      // -------------------------------------------------
      // PROJECT PROGRESS
      // -------------------------------------------------

      React.createElement(
        "section",
        {
          className: "panel progress-panel",
        },

        React.createElement(
          "div",
          {
            className: "panel-header",
          },

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
          {
            className: "progress-circle-container",
          },

          React.createElement(
            "div",
            {
              className: "progress-circle",
              style: {
                "--progress":
                  (dashboardStats.averageProgress || 0) +
                  "%",
              },
            },

            React.createElement(
              "div",
              {
                className: "circle-inner",
              },

              React.createElement(
                "strong",
                null,
                loading
                  ? "..."
                  : Math.round(
                      dashboardStats.averageProgress || 0
                    ) + "%"
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
            {
              className: "progress-legend",
            },

            // COMPLETED

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
                dashboardStats.completedProjects
              )
            ),

            // ACTIVE

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
                dashboardStats.activeProjects
              )
            ),

            // DELAYED

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
                dashboardStats.delayedProjects
              )
            )
          )
        )
      )
    ),

    // ===================================================
    // CRITICAL PROJECTS + ALERTS
    // ===================================================

    React.createElement(
      "div",
      {
        className: "bottom-grid",
      },

      // -------------------------------------------------
      // CRITICAL PROJECTS
      // -------------------------------------------------

      React.createElement(
        "section",
        {
          className: "panel critical-panel",
        },

        React.createElement(
          "div",
          {
            className: "panel-header",
          },

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

      // -------------------------------------------------
      // RECENT ALERTS
      // -------------------------------------------------

      React.createElement(
        "section",
        {
          className: "panel alerts-panel",
        },

        React.createElement(
          "div",
          {
            className: "panel-header",
          },

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