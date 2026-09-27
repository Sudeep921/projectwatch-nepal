import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  getAlerts,
  resolveAlert,
  generateAlerts
} from "../services/api";

const h = React.createElement;

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [generating, setGenerating] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [severityFilter, setSeverityFilter] =
    useState("all");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [projectFilter, setProjectFilter] =
    useState("all");

  // ========================================
  // LOAD ALERTS
  // ========================================

  const loadAlerts = async (
    showRefresh = false
  ) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data =
        await getAlerts();

      const alertData =
        data?.alerts ??
        data?.data ??
        data ??
        [];

      setAlerts(
        Array.isArray(alertData)
          ? alertData
          : []
      );
    } catch (err) {
      console.error(
        "ALERT LOAD ERROR:",
        err
      );

      setError(
        err?.message ||
        "Failed to load alerts."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  // ========================================
  // HELPERS
  // ========================================

  const getAlertId = (alert) => {
    return (
      alert?._id ||
      alert?.id ||
      ""
    );
  };

  const getSeverity = (alert) => {
    return String(
      alert?.severity ||
      alert?.level ||
      "medium"
    ).toLowerCase();
  };

  const getStatus = (alert) => {
    return String(
      alert?.status ||
      (alert?.resolved
        ? "resolved"
        : "active")
    ).toLowerCase();
  };

  const getProjectId = (alert) => {
    if (
      typeof alert?.project ===
      "string"
    ) {
      return alert.project;
    }

    return (
      alert?.project?._id ||
      alert?.project?.id ||
      alert?.projectId ||
      ""
    );
  };

  const getProjectName = (alert) => {
    if (
      typeof alert?.project ===
      "object" &&
      alert.project
    ) {
      return (
        alert.project.projectName ||
        alert.project.name ||
        alert.project.title ||
        alert.project.projectCode ||
        "Unknown Project"
      );
    }

    return (
      alert?.projectName ||
      alert?.projectCode ||
      "Unknown Project"
    );
  };

  const getAlertTitle = (alert) => {
    return (
      alert?.title ||
      alert?.name ||
      alert?.type ||
      "Project Alert"
    );
  };

  const getAlertMessage = (alert) => {
    return (
      alert?.message ||
      alert?.description ||
      alert?.observation ||
      "No alert details available."
    );
  };

  const getAlertDate = (alert) => {
    return (
      alert?.createdAt ||
      alert?.date ||
      alert?.updatedAt ||
      ""
    );
  };

  const isResolved = (alert) => {
    const status =
      getStatus(alert);

    return (
      status === "resolved" ||
      status === "closed" ||
      status === "read" ||
      alert?.resolved === true
    );
  };

  // ========================================
  // PROJECT LIST
  // ========================================

  const projectOptions = useMemo(() => {
    const map = {};

    alerts.forEach(
      (alert) => {
        const id =
          getProjectId(alert);

        if (!id) {
          return;
        }

        if (!map[id]) {
          map[id] =
            getProjectName(alert);
        }
      }
    );

    return Object.entries(map);
  }, [alerts]);

  // ========================================
  // FILTER
  // ========================================

  const filteredAlerts = useMemo(() => {
    const search =
      searchTerm
        .trim()
        .toLowerCase();

    return alerts.filter(
      (alert) => {
        const title =
          getAlertTitle(
            alert
          ).toLowerCase();

        const message =
          getAlertMessage(
            alert
          ).toLowerCase();

        const project =
          getProjectName(
            alert
          ).toLowerCase();

        const severity =
          getSeverity(alert);

        const status =
          getStatus(alert);

        const projectId =
          getProjectId(alert);

        const matchesSearch =
          !search ||
          title.includes(search) ||
          message.includes(search) ||
          project.includes(search);

        const matchesSeverity =
          severityFilter ===
          "all" ||
          severity ===
          severityFilter;

        const matchesStatus =
          statusFilter ===
          "all" ||
          (
            statusFilter ===
            "active"
              ? !isResolved(alert)
              : isResolved(alert)
          );

        const matchesProject =
          projectFilter ===
          "all" ||
          String(projectId) ===
          String(projectFilter);

        return (
          matchesSearch &&
          matchesSeverity &&
          matchesStatus &&
          matchesProject
        );
      }
    );
  }, [
    alerts,
    searchTerm,
    severityFilter,
    statusFilter,
    projectFilter
  ]);

  // ========================================
  // SUMMARY
  // ========================================

  const summary = useMemo(() => {
    const total =
      alerts.length;

    const critical =
      alerts.filter(
        (alert) =>
          getSeverity(alert) ===
          "critical"
      ).length;

    const high =
      alerts.filter(
        (alert) =>
          getSeverity(alert) ===
          "high"
      ).length;

    const active =
      alerts.filter(
        (alert) =>
          !isResolved(alert)
      ).length;

    const resolved =
      alerts.filter(
        (alert) =>
          isResolved(alert)
      ).length;

    return {
      total,
      critical,
      high,
      active,
      resolved
    };
  }, [alerts]);

  // ========================================
  // SORT ALERTS
  // ========================================

  const sortedAlerts = useMemo(() => {
    return [
      ...filteredAlerts
    ].sort(
      (a, b) => {
        const dateA =
          new Date(
            getAlertDate(a) ||
            0
          ).getTime();

        const dateB =
          new Date(
            getAlertDate(b) ||
            0
          ).getTime();

        return dateB - dateA;
      }
    );
  }, [
    filteredAlerts
  ]);

  // ========================================
  // RESOLVE ALERT
  // ========================================

  const handleResolve = async (
    alert
  ) => {
    const id =
      getAlertId(alert);

    if (!id) {
      setError(
        "Alert ID not found."
      );
      return;
    }

    try {
      setError("");
      setSuccess("");

      await resolveAlert(id);

      setSuccess(
        "Alert resolved successfully."
      );

      await loadAlerts(true);
    } catch (err) {
      console.error(
        "RESOLVE ALERT ERROR:",
        err
      );

      setError(
        err?.message ||
        "Failed to resolve alert."
      );
    }
  };

  // ========================================
  // GENERATE ALERTS
  // ========================================

  const handleGenerateAlerts =
    async () => {
      try {
        setGenerating(true);
        setError("");
        setSuccess("");

        await generateAlerts();

        setSuccess(
          "Project alerts generated successfully."
        );

        await loadAlerts(true);
      } catch (err) {
        console.error(
          "GENERATE ALERT ERROR:",
          err
        );

        setError(
          err?.message ||
          "Failed to generate alerts."
        );
      } finally {
        setGenerating(false);
      }
    };

  // ========================================
  // CLEAR FILTERS
  // ========================================

  const clearFilters = () => {
    setSearchTerm("");
    setSeverityFilter("all");
    setStatusFilter("all");
    setProjectFilter("all");
  };

  // ========================================
  // SEVERITY CLASS
  // ========================================

  const severityClass = (
    severity
  ) => {
    switch (
      String(
        severity
      ).toLowerCase()
    ) {
      case "critical":
        return "alert-severity-critical";

      case "high":
        return "alert-severity-high";

      case "medium":
        return "alert-severity-medium";

      case "low":
        return "alert-severity-low";

      default:
        return "alert-severity-medium";
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return h(
      "div",
      {
        className:
          "alerts-page"
      },

      h(
        "div",
        {
          className:
            "alerts-loading"
        },

        "Loading alerts..."
      )
    );
  }

  // ========================================
  // MAIN
  // ========================================

  return h(
    "div",
    {
      className:
        "alerts-page"
    },

    // ======================================
    // HEADER
    // ======================================

    h(
      "div",
      {
        className:
          "alerts-header"
      },

      h(
        "div",
        null,

        h(
          "h1",
          null,
          "Alerts"
        ),

        h(
          "p",
          null,
          "Monitor critical project risks and system alerts."
        )
      ),

      h(
        "div",
        {
          className:
            "alerts-header-actions"
        },

        h(
          "button",
          {
            className:
              "alerts-generate-button",

            onClick:
              handleGenerateAlerts,

            disabled:
              generating
          },

          generating
            ? "Generating..."
            : "⚡ Generate Alerts"
        ),

        h(
          "button",
          {
            className:
              "alerts-refresh-button",

            onClick: () =>
              loadAlerts(true),

            disabled:
              refreshing
          },

          refreshing
            ? "Refreshing..."
            : "↻ Refresh"
        )
      )
    ),

    // ======================================
    // SUCCESS
    // ======================================

    success &&
      h(
        "div",
        {
          className:
            "alerts-success"
        },

        success
      ),

    // ======================================
    // ERROR
    // ======================================

    error &&
      h(
        "div",
        {
          className:
            "alerts-error"
        },

        error
      ),

    // ======================================
    // SUMMARY
    // ======================================

    h(
      "div",
      {
        className:
          "alerts-summary-grid"
      },

      h(
        "div",
        {
          className:
            "alerts-summary-card"
        },

        h(
          "div",
          {
            className:
              "alerts-summary-icon"
          },

          "🚨"
        ),

        h(
          "div",
          null,

          h(
            "strong",
            null,
            summary.total
          ),

          h(
            "span",
            null,
            "Total Alerts"
          )
        )
      ),

      h(
        "div",
        {
          className:
            "alerts-summary-card"
        },

        h(
          "div",
          {
            className:
              "alerts-summary-icon"
          },

          "⚠️"
        ),

        h(
          "div",
          null,

          h(
            "strong",
            null,
            summary.critical
          ),

          h(
            "span",
            null,
            "Critical"
          )
        )
      ),

      h(
        "div",
        {
          className:
            "alerts-summary-card"
        },

        h(
          "div",
          {
            className:
              "alerts-summary-icon"
          },

          "🔴"
        ),

        h(
          "div",
          null,

          h(
            "strong",
            null,
            summary.high
          ),

          h(
            "span",
            null,
            "High"
          )
        )
      ),

      h(
        "div",
        {
          className:
            "alerts-summary-card"
        },

        h(
          "div",
          {
            className:
              "alerts-summary-icon"
          },

          "🔔"
        ),

        h(
          "div",
          null,

          h(
            "strong",
            null,
            summary.active
          ),

          h(
            "span",
            null,
            "Active"
          )
        )
      )
    ),

    // ======================================
    // TOOLBAR
    // ======================================

    h(
      "div",
      {
        className:
          "alerts-toolbar"
      },

      h(
        "input",
        {
          type: "search",

          className:
            "alerts-search",

          value:
            searchTerm,

          onChange: (
            event
          ) =>
            setSearchTerm(
              event.target.value
            ),

          placeholder:
            "Search alerts, projects..."
        }
      ),

      h(
        "select",
        {
          className:
            "alerts-filter",

          value:
            severityFilter,

          onChange: (
            event
          ) =>
            setSeverityFilter(
              event.target.value
            )
        },

        h(
          "option",
          {
            value: "all"
          },
          "All Severity"
        ),

        h(
          "option",
          {
            value:
              "critical"
          },
          "Critical"
        ),

        h(
          "option",
          {
            value: "high"
          },
          "High"
        ),

        h(
          "option",
          {
            value: "medium"
          },
          "Medium"
        ),

        h(
          "option",
          {
            value: "low"
          },
          "Low"
        )
      ),

      h(
        "select",
        {
          className:
            "alerts-filter",

          value:
            statusFilter,

          onChange: (
            event
          ) =>
            setStatusFilter(
              event.target.value
            )
        },

        h(
          "option",
          {
            value: "all"
          },
          "All Status"
        ),

        h(
          "option",
          {
            value: "active"
          },
          "Active"
        ),

        h(
          "option",
          {
            value: "resolved"
          },
          "Resolved"
        )
      ),

      h(
        "select",
        {
          className:
            "alerts-filter",

          value:
            projectFilter,

          onChange: (
            event
          ) =>
            setProjectFilter(
              event.target.value
            )
        },

        h(
          "option",
          {
            value: "all"
          },
          "All Projects"
        ),

        projectOptions.map(
          ([id, name]) =>
            h(
              "option",
              {
                key: id,
                value: id
              },

              name
            )
        )
      ),

      h(
        "button",
        {
          className:
            "alerts-clear-button",

          onClick:
            clearFilters
        },

        "Clear Filters"
      )
    ),

    // ======================================
    // RESULT COUNT
    // ======================================

    h(
      "div",
      {
        className:
          "alerts-result-count"
      },

      h(
        "strong",
        null,

        sortedAlerts.length
      ),

      " alerts found"
    ),

    // ======================================
    // EMPTY
    // ======================================

    sortedAlerts.length === 0

      ? h(
          "div",
          {
            className:
              "alerts-empty"
          },

          h(
            "div",
            {
              className:
                "alerts-empty-icon"
            },

            "✓"
          ),

          h(
            "h3",
            null,
            "No alerts found"
          ),

          h(
            "p",
            null,

            searchTerm ||
            severityFilter !==
              "all" ||
            statusFilter !==
              "all" ||
            projectFilter !==
              "all"

              ? "Try changing your filters."

              : "There are currently no project alerts."
          )
        )

      // ====================================
      // ALERT LIST
      // ====================================

      : h(
          "div",
          {
            className:
              "alerts-list"
          },

          sortedAlerts.map(
            (
              alert,
              index
            ) => {
              const severity =
                getSeverity(
                  alert
                );

              const resolved =
                isResolved(
                  alert
                );

              const date =
                getAlertDate(
                  alert
                );

              return h(
                "div",
                {
                  key:
                    getAlertId(
                      alert
                    ) ||
                    index,

                  className:
                    "alert-item " +
                    severityClass(
                      severity
                    ) +
                    (
                      resolved
                        ? " alert-resolved"
                        : ""
                    )
                },

                // ALERT ICON
                h(
                  "div",
                  {
                    className:
                      "alert-icon"
                  },

                  severity ===
                  "critical"

                    ? "🚨"

                    : severity ===
                      "high"

                    ? "⚠️"

                    : severity ===
                      "medium"

                    ? "🔔"

                    : "ℹ️"
                ),

                // CONTENT
                h(
                  "div",
                  {
                    className:
                      "alert-content"
                  },

                  h(
                    "div",
                    {
                      className:
                        "alert-top-row"
                    },

                    h(
                      "div",
                      {
                        className:
                          "alert-title"
                      },

                      getAlertTitle(
                        alert
                      )
                    ),

                    h(
                      "span",
                      {
                        className:
                          "alert-severity-badge"
                      },

                      severity
                        .toUpperCase()
                    )
                  ),

                  h(
                    "div",
                    {
                      className:
                        "alert-project"
                    },

                    "Project: ",

                    h(
                      "strong",
                      null,

                      getProjectName(
                        alert
                      )
                    )
                  ),

                  h(
                    "p",
                    {
                      className:
                        "alert-message"
                    },

                    getAlertMessage(
                      alert
                    )
                  ),

                  h(
                    "div",
                    {
                      className:
                        "alert-bottom-row"
                    },

                    h(
                      "span",
                      {
                        className:
                          "alert-date"
                      },

                      date
                        ? new Date(
                            date
                          ).toLocaleString()
                        : "Date unavailable"
                    ),

                    h(
                      "span",
                      {
                        className:
                          "alert-status"
                      },

                      resolved
                        ? "✓ Resolved"
                        : "● Active"
                    )
                  )
                ),

                // ACTION
                !resolved &&
                  h(
                    "button",
                    {
                      className:
                        "alert-resolve-button",

                      onClick:
                        () =>
                          handleResolve(
                            alert
                          )
                    },

                    "Resolve"
                  )
              );
            }
          )
        )
  );
};

export default Alerts;