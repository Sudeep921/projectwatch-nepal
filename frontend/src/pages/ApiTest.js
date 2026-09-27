import React, {
  useState
} from "react";

import {
  checkApiHealth,
  getDashboardStats,
  getProjectStatusSummary,
  getProvinceSummary,
  getProjects,
  getFieldReports,
  getComplaints,
  getEvidence,
  getAlerts,
  getNotifications,
  getUsers,
  getMySettings,
  getPublicProjects,
  getPublicSummary
} from "../services/api";

const h = React.createElement;

const ApiTest = () => {
  const [results, setResults] = useState([]);
  const [testing, setTesting] = useState(false);

  const addResult = (
    name,
    status,
    message
  ) => {
    setResults((prev) => [
      ...prev,
      {
        id:
          Date.now() +
          Math.random(),
        name,
        status,
        message
      }
    ]);
  };

  const runTest = async (
    name,
    apiFunction
  ) => {
    try {
      const response =
        await apiFunction();

      addResult(
        name,
        "success",
        getResponseMessage(response)
      );

      return true;
    } catch (error) {
      console.error(
        `${name} ERROR:`,
        error
      );

      addResult(
        name,
        "error",
        error.message ||
          "Request failed"
      );

      return false;
    }
  };

  const getResponseMessage = (
    response
  ) => {
    if (
      response === null ||
      response === undefined
    ) {
      return "API responded successfully";
    }

    if (
      Array.isArray(response)
    ) {
      return `Success — ${response.length} records`;
    }

    if (
      typeof response === "object"
    ) {
      if (
        response.count !==
        undefined
      ) {
        return `Success — ${response.count} records`;
      }

      if (
        response.projects &&
        Array.isArray(
          response.projects
        )
      ) {
        return `Success — ${response.projects.length} projects`;
      }

      if (
        response.users &&
        Array.isArray(
          response.users
        )
      ) {
        return `Success — ${response.users.length} users`;
      }

      if (
        response.notifications &&
        Array.isArray(
          response.notifications
        )
      ) {
        return `Success — ${response.notifications.length} notifications`;
      }

      return (
        response.message ||
        "API responded successfully"
      );
    }

    return "API responded successfully";
  };

  const runAllTests = async () => {
    if (testing) {
      return;
    }

    setTesting(true);
    setResults([]);

    // ========================================
    // SYSTEM
    // ========================================

    await runTest(
      "API Health",
      checkApiHealth
    );

    // ========================================
    // DASHBOARD
    // ========================================

    await runTest(
      "Dashboard Stats",
      getDashboardStats
    );

    await runTest(
      "Project Status Summary",
      getProjectStatusSummary
    );

    await runTest(
      "Province Summary",
      getProvinceSummary
    );

    // ========================================
    // PROJECTS
    // ========================================

    await runTest(
      "Projects",
      getProjects
    );

    // ========================================
    // FIELD REPORTS
    // ========================================

    await runTest(
      "Field Reports",
      getFieldReports
    );

    // ========================================
    // COMPLAINTS
    // ========================================

    await runTest(
      "Complaints",
      getComplaints
    );

    // ========================================
    // EVIDENCE
    // ========================================

    await runTest(
      "Evidence",
      getEvidence
    );

    // ========================================
    // ALERTS
    // ========================================

    await runTest(
      "Alerts",
      getAlerts
    );

    // ========================================
    // NOTIFICATIONS
    // ========================================

    await runTest(
      "Notifications",
      getNotifications
    );

    // ========================================
    // USERS
    // ========================================

    await runTest(
      "Users",
      getUsers
    );

    // ========================================
    // SETTINGS
    // ========================================

    await runTest(
      "My Settings",
      getMySettings
    );

    // ========================================
    // PUBLIC
    // ========================================

    await runTest(
      "Public Projects",
      getPublicProjects
    );

    await runTest(
      "Public Summary",
      getPublicSummary
    );

    setTesting(false);
  };

  const successCount =
    results.filter(
      (item) =>
        item.status ===
        "success"
    ).length;

  const errorCount =
    results.filter(
      (item) =>
        item.status ===
        "error"
    ).length;

  return h(
    "div",
    {
      className:
        "api-test-page page-container"
    },

    // ========================================
    // HEADER
    // ========================================

    h(
      "div",
      {
        className:
          "page-header"
      },

      h(
        "div",
        null,

        h(
          "h1",
          null,
          "API Testing"
        ),

        h(
          "p",
          null,
          "Check ProjectWatch Nepal backend API connections."
        )
      ),

      h(
        "button",
        {
          className:
            "api-test-run-button",
          onClick:
            runAllTests,
          disabled: testing
        },
        testing
          ? "Testing..."
          : "Run All Tests"
      )
    ),

    // ========================================
    // SUMMARY
    // ========================================

    results.length > 0
      ? h(
          "div",
          {
            className:
              "api-test-summary"
          },

          h(
            "div",
            {
              className:
                "api-test-summary-card"
            },

            h(
              "span",
              {
                className:
                  "api-test-summary-icon"
              },
              "🧪"
            ),

            h(
              "div",
              null,

              h(
                "strong",
                null,
                results.length
              ),

              h(
                "span",
                null,
                "Total Tests"
              )
            )
          ),

          h(
            "div",
            {
              className:
                "api-test-summary-card success"
            },

            h(
              "span",
              {
                className:
                  "api-test-summary-icon"
              },
              "✓"
            ),

            h(
              "div",
              null,

              h(
                "strong",
                null,
                successCount
              ),

              h(
                "span",
                null,
                "Passed"
              )
            )
          ),

          h(
            "div",
            {
              className:
                "api-test-summary-card error"
            },

            h(
              "span",
              {
                className:
                  "api-test-summary-icon"
              },
              "!"
            ),

            h(
              "div",
              null,

              h(
                "strong",
                null,
                errorCount
              ),

              h(
                "span",
                null,
                "Failed"
              )
            )
          )
        )
      : null,

    // ========================================
    // RESULTS
    // ========================================

    h(
      "div",
      {
        className:
          "api-test-card"
      },

      h(
        "div",
        {
          className:
            "api-test-card-header"
        },

        h(
          "div",
          null,

          h(
            "h2",
            null,
            "API Test Results"
          ),

          h(
            "p",
            null,
            "Read-only requests are used for testing."
          )
        )
      ),

      results.length === 0
        ? h(
            "div",
            {
              className:
                "api-test-empty"
            },

            h(
              "div",
              {
                className:
                  "api-test-empty-icon"
              },
              "🧪"
            ),

            h(
              "h3",
              null,
              "Ready to test"
            ),

            h(
              "p",
              null,
              "Click “Run All Tests” to check all available APIs."
            )
          )
        : h(
            "div",
            {
              className:
                "api-test-results"
            },

            results.map(
              (item, index) =>
                h(
                  "div",
                  {
                    key: item.id,
                    className:
                      `api-test-result ${
                        item.status ===
                        "success"
                          ? "passed"
                          : "failed"
                      }`
                  },

                  h(
                    "div",
                    {
                      className:
                        "api-test-result-number"
                    },
                    index + 1
                  ),

                  h(
                    "div",
                    {
                      className:
                        "api-test-result-info"
                    },

                    h(
                      "strong",
                      null,
                      item.name
                    ),

                    h(
                      "span",
                      null,
                      item.message
                    )
                  ),

                  h(
                    "div",
                    {
                      className:
                        "api-test-result-status"
                    },
                    item.status ===
                    "success"
                      ? "✓ PASS"
                      : "✕ FAIL"
                  )
                )
            )
          )
    )
  );
};

export default ApiTest;