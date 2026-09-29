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
  const [
    alerts,
    setAlerts
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    error,
    setError
  ] = useState("");

  const [
    search,
    setSearch
  ] = useState("");

  const [
    severity,
    setSeverity
  ] = useState("all");

  const [
    status,
    setStatus
  ] = useState("all");

  const loadAlerts =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getAlerts();

        const data =
          response?.alerts ||
          response?.data ||
          response ||
          [];

        setAlerts(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (err) {
        console.error(
          "ALERT LOAD ERROR:",
          err
        );

        setError(
          err.message ||
          "Failed to load alerts."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleResolve =
    async (id) => {
      try {
        await resolveAlert(id);
        await loadAlerts();
      } catch (err) {
        window.alert(
          err.message ||
          "Failed to resolve alert."
        );
      }
    };

  const handleGenerate =
    async () => {
      try {
        await generateAlerts();
        await loadAlerts();
      } catch (err) {
        window.alert(
          err.message ||
          "Failed to generate alerts."
        );
      }
    };

  const filteredAlerts =
    useMemo(() => {
      const q =
        search
          .trim()
          .toLowerCase();

      return alerts.filter(
        (alert) => {
          const text =
            [
              alert.title,
              alert.message,
              alert.description,
              alert.project?.name,
              alert.projectName
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

          const level =
            String(
              alert.severity ||
              alert.level ||
              "medium"
            ).toLowerCase();

          const currentStatus =
            alert.isResolved ||
            alert.resolved
              ? "resolved"
              : "open";

          return (
            (!q ||
              text.includes(q)) &&
            (severity === "all" ||
              level === severity) &&
            (status === "all" ||
              currentStatus === status)
          );
        }
      );
    }, [
      alerts,
      search,
      severity,
      status
    ]);

  const criticalCount =
    alerts.filter(
      (item) =>
        String(
          item.severity ||
          item.level ||
          ""
        ).toLowerCase() ===
        "critical"
    ).length;

  const openCount =
    alerts.filter(
      (item) =>
        !item.isResolved &&
        !item.resolved
    ).length;

  const resolvedCount =
    alerts.filter(
      (item) =>
        item.isResolved ||
        item.resolved
    ).length;

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
          "Monitor critical project and field-report alerts."
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
            type: "button",
            onClick:
              handleGenerate
          },
          "⚡ Generate Alerts"
        ),

        h(
          "button",
          {
            type: "button",
            onClick:
              loadAlerts
          },
          "↻ Refresh"
        )
      )
    ),

    h(
      "div",
      {
        className:
          "alerts-summary"
      },

      h(
        "div",
        {
          className:
            "alert-summary-card"
        },
        h(
          "strong",
          null,
          alerts.length
        ),
        h(
          "span",
          null,
          "Total Alerts"
        )
      ),

      h(
        "div",
        {
          className:
            "alert-summary-card"
        },
        h(
          "strong",
          null,
          openCount
        ),
        h(
          "span",
          null,
          "Open"
        )
      ),

      h(
        "div",
        {
          className:
            "alert-summary-card"
        },
        h(
          "strong",
          null,
          criticalCount
        ),
        h(
          "span",
          null,
          "Critical"
        )
      ),

      h(
        "div",
        {
          className:
            "alert-summary-card"
        },
        h(
          "strong",
          null,
          resolvedCount
        ),
        h(
          "span",
          null,
          "Resolved"
        )
      )
    ),

    h(
      "div",
      {
        className:
          "alerts-filters"
      },

      h(
        "input",
        {
          type: "text",
          placeholder:
            "Search alerts...",
          value: search,
          onChange: (e) =>
            setSearch(
              e.target.value
            )
        }
      ),

      h(
        "select",
        {
          value: severity,
          onChange: (e) =>
            setSeverity(
              e.target.value
            )
        },

        h(
          "option",
          { value: "all" },
          "All Severity"
        ),

        h(
          "option",
          { value: "critical" },
          "Critical"
        ),

        h(
          "option",
          { value: "high" },
          "High"
        ),

        h(
          "option",
          { value: "medium" },
          "Medium"
        ),

        h(
          "option",
          { value: "low" },
          "Low"
        )
      ),

      h(
        "select",
        {
          value: status,
          onChange: (e) =>
            setStatus(
              e.target.value
            )
        },

        h(
          "option",
          { value: "all" },
          "All Status"
        ),

        h(
          "option",
          { value: "open" },
          "Open"
        ),

        h(
          "option",
          { value: "resolved" },
          "Resolved"
        )
      )
    ),

    error
      ? h(
          "div",
          {
            className:
              "alerts-error"
          },
          error
        )
      : null,

    loading
      ? h(
          "div",
          {
            className:
              "alerts-empty"
          },
          "Loading alerts..."
        )
      : filteredAlerts.length
      ? h(
          "div",
          {
            className:
              "alerts-list"
          },

          filteredAlerts.map(
            (alert) => {
              const isResolved =
                Boolean(
                  alert.isResolved ||
                  alert.resolved
                );

              const level =
                String(
                  alert.severity ||
                  alert.level ||
                  "medium"
                ).toLowerCase();

              return h(
                "div",
                {
                  key:
                    alert._id ||
                    alert.id,
                  className:
                    `alert-card alert-${level} ${
                      isResolved
                        ? "alert-resolved"
                        : ""
                    }`
                },

                h(
                  "div",
                  {
                    className:
                      "alert-card-top"
                  },

                  h(
                    "span",
                    {
                      className:
                        "alert-severity"
                    },
                    level.toUpperCase()
                  ),

                  h(
                    "span",
                    null,
                    isResolved
                      ? "Resolved"
                      : "Open"
                  )
                ),

                h(
                  "h3",
                  null,
                  alert.title ||
                    "Project Alert"
                ),

                h(
                  "p",
                  null,
                  alert.message ||
                    alert.description ||
                    "No alert description."
                ),

                h(
                  "div",
                  {
                    className:
                      "alert-meta"
                  },

                  h(
                    "span",
                    null,
                    `Project: ${
                      alert.project?.name ||
                      alert.projectName ||
                      "N/A"
                    }`
                  ),

                  h(
                    "span",
                    null,
                    alert.createdAt
                      ? new Date(
                          alert.createdAt
                        ).toLocaleString()
                      : ""
                  )
                ),

                !isResolved
                  ? h(
                      "button",
                      {
                        type: "button",
                        onClick: () =>
                          handleResolve(
                            alert._id ||
                              alert.id
                          )
                      },
                      "✓ Resolve Alert"
                    )
                  : null
              );
            }
          )
        )
      : h(
          "div",
          {
            className:
              "alerts-empty"
          },
          "No alerts found."
        )
  );
};

export default Alerts;