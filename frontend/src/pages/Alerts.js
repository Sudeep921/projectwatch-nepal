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

  const loadAlerts =
    async () => {
      try {
        const data =
          await getAlerts();

        setAlerts(
          data.alerts || []
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadAlerts();
  }, []);

  const getClass =
    (severity) => {
      return (
        `alert-item alert-${String(
          severity || "Medium"
        ).toLowerCase()}`
      );
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
          "h1",
          {
            className:
              "page-title"
          },
          "Project Alerts"
        ),

        React.createElement(
          "p",
          {
            className:
              "page-description"
          },
          "Monitor project risks, delays and critical issues."
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
        "Refresh"
      )
    ),

    loading
      ? React.createElement(
          "div",
          {
            className:
              "empty-state"
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
          "No active alerts."
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
                  key:
                    alert._id,
                  className:
                    getClass(
                      alert.severity
                    )
                },

                React.createElement(
                  "div",
                  {
                    className:
                      "alert-item-top"
                  },

                  React.createElement(
                    "div",
                    {
                      className:
                        "alert-icon"
                    },
                    alert.severity ===
                    "Critical"
                      ? "🚨"
                      : alert.severity ===
                        "High"
                      ? "⚠️"
                      : "ℹ️"
                  ),

                  React.createElement(
                    "div",
                    null,

                    React.createElement(
                      "h3",
                      null,
                      alert.title
                    ),

                    React.createElement(
                      "p",
                      null,
                      alert.message
                    )
                  )
                ),

                React.createElement(
                  "div",
                  {
                    className:
                      "alert-item-bottom"
                  },

                  React.createElement(
                    "span",
                    null,
                    alert.project?.name ||
                      "Project"
                  ),

                  React.createElement(
                    "strong",
                    null,
                    alert.status
                  )
                )
              )
          )
        )
  );
};

export default Alerts;