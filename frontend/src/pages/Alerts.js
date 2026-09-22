import React, {
  useEffect,
  useState
} from "react";

import {
  getAlerts
} from "../services/api";

const Alerts = () => {
  const [alerts, setAlerts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getAlerts();

      setAlerts(
        response?.alerts ||
          response?.data ||
          []
      );
    } catch (err) {
      console.error(
        "Alert loading failed:",
        err
      );

      setError(
        err.message ||
          "Unable to load alerts."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const getAlertClass = (
    alert
  ) => {
    const level =
      String(
        alert.level ||
          alert.severity ||
          alert.type ||
          ""
      ).toLowerCase();

    if (
      level.includes("critical")
    ) {
      return "alert-critical";
    }

    if (
      level.includes("high")
    ) {
      return "alert-high";
    }

    if (
      level.includes("medium")
    ) {
      return "alert-medium";
    }

    return "alert-low";
  };

  return React.createElement(
    "div",
    {
      className:
        "page-container"
    },

    React.createElement(
      "div",
      {
        className:
          "page-header"
      },

      React.createElement(
        "div",
        null,

        React.createElement(
          "span",
          {
            className:
              "page-eyebrow"
          },
          "RISK & ALERTS"
        ),

        React.createElement(
          "h1",
          null,
          "Alerts"
        ),

        React.createElement(
          "p",
          null,
          "Monitor project risks, verification issues and operational alerts."
        )
      ),

      React.createElement(
        "button",
        {
          className:
            "primary-button",
          onClick:
            loadAlerts
        },
        "↻ Refresh Alerts"
      )
    ),

    error
      ? React.createElement(
          "div",
          {
            className:
              "form-error"
          },
          "⚠ ",
          error
        )
      : null,

    loading
      ? React.createElement(
          "div",
          {
            className:
              "page-loading"
          },
          "Loading alerts..."
        )
      : alerts.length === 0
      ? React.createElement(
          "div",
          {
            className:
              "empty-state"
          },

          React.createElement(
            "h3",
            null,
            "No active alerts"
          ),

          React.createElement(
            "p",
            null,
            "Project risks and system alerts will appear here when detected."
          )
        )
      : React.createElement(
          "div",
          {
            className:
              "alerts-list"
          },

          alerts.map(
            (alert) =>
              React.createElement(
                "div",
                {
                  className:
                    `alert-card ${
                      getAlertClass(
                        alert
                      )
                    }`,
                  key:
                    alert._id ||
                    alert.id
                },

                React.createElement(
                  "div",
                  {
                    className:
                      "alert-icon"
                  },
                  alert.severity ===
                  "Critical"
                    ? "!"
                    : "⚠"
                ),

                React.createElement(
                  "div",
                  {
                    className:
                      "alert-content"
                  },

                  React.createElement(
                    "div",
                    {
                      className:
                        "alert-card-header"
                    },

                    React.createElement(
                      "strong",
                      null,
                      alert.title ||
                        alert.message ||
                        "Project Alert"
                    ),

                    React.createElement(
                      "span",
                      {
                        className:
                          "status-badge"
                      },
                      alert.severity ||
                        alert.level ||
                        "Alert"
                    )
                  ),

                  React.createElement(
                    "p",
                    null,
                    alert.description ||
                      alert.message ||
                      "Project monitoring alert."
                  ),

                  React.createElement(
                    "small",
                    null,
                    alert.createdAt
                      ? new Date(
                          alert.createdAt
                        ).toLocaleString()
                      : "Recent"
                  )
                )
              )
          )
        )
  );
};

export default Alerts;