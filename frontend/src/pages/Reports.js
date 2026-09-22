import React, {
  useEffect,
  useState
} from "react";

import {
  getProjectReport
} from "../services/api";

const Reports = () => {
  const [report, setReport] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getProjectReport();

      setReport(
        response?.report ||
          response?.data ||
          response ||
          null
      );
    } catch (err) {
      console.error(
        "Project report loading failed:",
        err
      );

      setError(
        err.message ||
          "Unable to load project report."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const getValue = (
    object,
    keys,
    fallback = 0
  ) => {
    if (!object) {
      return fallback;
    }

    for (const key of keys) {
      if (
        object[key] !==
        undefined
      ) {
        return object[key];
      }
    }

    return fallback;
  };

  const total =
    getValue(
      report,
      [
        "totalProjects",
        "total"
      ]
    );

  const active =
    getValue(
      report,
      [
        "activeProjects",
        "active"
      ]
    );

  const delayed =
    getValue(
      report,
      [
        "delayedProjects",
        "delayed"
      ]
    );

  const completed =
    getValue(
      report,
      [
        "completedProjects",
        "completed"
      ]
    );

  const critical =
    getValue(
      report,
      [
        "criticalProjects",
        "critical"
      ]
    );

  const budget =
    getValue(
      report,
      [
        "totalBudget",
        "budget"
      ]
    );

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
          "ANALYTICS & REPORTING"
        ),

        React.createElement(
          "h1",
          null,
          "Project Reports"
        ),

        React.createElement(
          "p",
          null,
          "Government project performance and monitoring summary."
        )
      ),

      React.createElement(
        "button",
        {
          className:
            "primary-button",
          onClick:
            loadReport
        },
        "↻ Refresh Report"
      )
    ),

    loading
      ? React.createElement(
          "div",
          {
            className:
              "page-loading"
          },
          "Generating project report..."
        )
      : error
      ? React.createElement(
          "div",
          {
            className:
              "form-error"
          },
          "⚠ ",
          error
        )
      : React.createElement(
          React.Fragment,
          null,

          React.createElement(
            "div",
            {
              className:
                "report-stat-grid"
            },

            React.createElement(
              "div",
              {
                className:
                  "report-stat-card"
              },

              React.createElement(
                "span",
                null,
                "Total Projects"
              ),

              React.createElement(
                "strong",
                null,
                total
              )
            ),

            React.createElement(
              "div",
              {
                className:
                  "report-stat-card"
              },

              React.createElement(
                "span",
                null,
                "Active Projects"
              ),

              React.createElement(
                "strong",
                null,
                active
              )
            ),

            React.createElement(
              "div",
              {
                className:
                  "report-stat-card"
              },

              React.createElement(
                "span",
                null,
                "Delayed Projects"
              ),

              React.createElement(
                "strong",
                null,
                delayed
              )
            ),

            React.createElement(
              "div",
              {
                className:
                  "report-stat-card"
              },

              React.createElement(
                "span",
                null,
                "Completed Projects"
              ),

              React.createElement(
                "strong",
                null,
                completed
              )
            ),

            React.createElement(
              "div",
              {
                className:
                  "report-stat-card"
              },

              React.createElement(
                "span",
                null,
                "Critical Projects"
              ),

              React.createElement(
                "strong",
                null,
                critical
              )
            ),

            React.createElement(
              "div",
              {
                className:
                  "report-stat-card"
              },

              React.createElement(
                "span",
                null,
                "Total Budget"
              ),

              React.createElement(
                "strong",
                null,
                `NPR ${Number(
                  budget
                ).toLocaleString()}`
              )
            )
          ),

          React.createElement(
            "div",
            {
              className:
                "report-summary-card"
            },

            React.createElement(
              "span",
              {
                className:
                  "page-eyebrow"
              },
              "SYSTEM SUMMARY"
            ),

            React.createElement(
              "h2",
              null,
              "Project Monitoring Overview"
            ),

            React.createElement(
              "p",
              null,
              "This report summarizes the current government project monitoring data available in ProjectWatch Nepal."
            ),

            React.createElement(
              "div",
              {
                className:
                  "report-summary-row"
              },

              React.createElement(
                "span",
                null,
                "Report generated"
              ),

              React.createElement(
                "strong",
                null,
                new Date().toLocaleString()
              )
            )
          )
        )
  );
};

export default Reports;