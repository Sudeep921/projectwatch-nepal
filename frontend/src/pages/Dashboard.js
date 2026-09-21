import React, {
  useEffect,
  useState
} from "react";

import {
  getDashboardStats,
  getProjectStatusSummary,
  getProvinceSummary
} from "../services/api";

const Dashboard = () => {
  const [stats, setStats] =
    useState(null);

  const [statusData, setStatusData] =
    useState([]);

  const [provinceData, setProvinceData] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        statsResponse,
        statusResponse,
        provinceResponse
      ] = await Promise.all([
        getDashboardStats(),
        getProjectStatusSummary(),
        getProvinceSummary()
      ]);

      setStats(
        statsResponse.stats || {}
      );

      setStatusData(
        statusResponse.summary || []
      );

      setProvinceData(
        provinceResponse.summary || []
      );
    } catch (err) {
      console.error(
        "Dashboard loading error:",
        err
      );

      setError(
        err.message ||
        "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return React.createElement(
      "div",
      {
        className: "page-loading"
      },
      "Loading dashboard..."
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (error) {
    return React.createElement(
      "div",
      {
        className: "page-error"
      },

      React.createElement(
        "h3",
        null,
        "Dashboard could not be loaded"
      ),

      React.createElement(
        "p",
        null,
        error
      ),

      React.createElement(
        "button",
        {
          onClick: loadDashboard
        },
        "Try Again"
      )
    );
  }

  /* =========================
     HEADER
  ========================= */

  const pageHeader =
    React.createElement(
      "div",
      {
        className: "page-header"
      },

      React.createElement(
        "div",
        null,

        React.createElement(
          "h1",
          null,
          "Government Project Dashboard"
        ),

        React.createElement(
          "p",
          null,
          "Monitor Nepal's public projects in real time."
        )
      ),

      React.createElement(
        "button",
        {
          className: "refresh-button",
          onClick: loadDashboard
        },
        "↻ Refresh"
      )
    );

  /* =========================
     STATS
  ========================= */

  const statItems = [
    {
      label: "Total Projects",
      value: stats?.totalProjects || 0
    },
    {
      label: "Active Projects",
      value: stats?.activeProjects || 0
    },
    {
      label: "Delayed Projects",
      value: stats?.delayedProjects || 0
    },
    {
      label: "Critical Projects",
      value: stats?.criticalProjects || 0
    },
    {
      label: "Total Budget",
      value:
        "NPR " +
        Number(
          stats?.totalBudget || 0
        ).toLocaleString()
    },
    {
      label: "Average Progress",
      value:
        `${stats?.averageProgress || 0}%`
    },
    {
      label: "Field Reports",
      value: stats?.fieldReports || 0
    },
    {
      label: "Complaints",
      value: stats?.complaints || 0
    }
  ];

  const statsGrid =
    React.createElement(
      "div",
      {
        className: "stats-grid"
      },

      statItems.map(
        (item, index) =>
          React.createElement(
            "div",
            {
              className: "stat-card",
              key: index
            },

            React.createElement(
              "span",
              null,
              item.label
            ),

            React.createElement(
              "strong",
              null,
              item.value
            )
          )
      )
    );

  /* =========================
     STATUS PANEL
  ========================= */

  const statusRows =
    statusData.length === 0
      ? React.createElement(
          "p",
          null,
          "No project data available."
        )
      : statusData.map(
          (item, index) =>
            React.createElement(
              "div",
              {
                className: "status-row",
                key:
                  item._id ||
                  item.status ||
                  index
              },

              React.createElement(
                "span",
                null,
                item._id ||
                  item.status ||
                  "Unknown"
              ),

              React.createElement(
                "strong",
                null,
                item.count || 0
              )
            )
        );

  const statusPanel =
    React.createElement(
      "section",
      {
        className: "dashboard-panel"
      },

      React.createElement(
        "div",
        {
          className: "panel-header"
        },

        React.createElement(
          "div",
          null,

          React.createElement(
            "h2",
            null,
            "Project Status"
          ),

          React.createElement(
            "p",
            null,
            "Current project distribution"
          )
        )
      ),

      React.createElement(
        "div",
        {
          className: "status-list"
        },
        statusRows
      )
    );

  /* =========================
     PROVINCE PANEL
  ========================= */

  const provinceRows =
    provinceData.length === 0
      ? React.createElement(
          "p",
          null,
          "No province data available."
        )
      : provinceData.map(
          (item, index) =>
            React.createElement(
              "div",
              {
                className: "province-row",
                key:
                  item._id ||
                  item.province ||
                  index
              },

              React.createElement(
                "span",
                null,
                item._id ||
                  item.province ||
                  "Unknown"
              ),

              React.createElement(
                "strong",
                null,
                item.count || 0
              )
            )
        );

  const provincePanel =
    React.createElement(
      "section",
      {
        className: "dashboard-panel"
      },

      React.createElement(
        "div",
        {
          className: "panel-header"
        },

        React.createElement(
          "div",
          null,

          React.createElement(
            "h2",
            null,
            "Projects by Province"
          ),

          React.createElement(
            "p",
            null,
            "Geographic distribution"
          )
        )
      ),

      React.createElement(
        "div",
        {
          className: "province-list"
        },
        provinceRows
      )
    );

  /* =========================
     DASHBOARD GRID
  ========================= */

  const dashboardGrid =
    React.createElement(
      "div",
      {
        className: "dashboard-grid"
      },
      statusPanel,
      provincePanel
    );

  /* =========================
     FINAL PAGE
  ========================= */

  return React.createElement(
    "div",
    {
      className: "dashboard-page"
    },

    pageHeader,
    statsGrid,
    dashboardGrid
  );
};

export default Dashboard;