import React, { useMemo, useState } from "react";

const INITIAL_ALERTS = [
  {
    id: "ALT-2026-00881",
    type: "AI Verification",
    title: "Potential discrepancy detected",
    message:
      "Field evidence for Kathmandu Ring Road Expansion requires human review.",
    project: "Kathmandu Ring Road Expansion",
    severity: "Critical",
    status: "Unread",
    time: "12 minutes ago",
    icon: "🤖"
  },
  {
    id: "ALT-2026-00880",
    type: "Deadline",
    title: "Project deadline approaching",
    message:
      "Butwal-Bhairahawa Road is approaching its scheduled completion date.",
    project: "Butwal-Bhairahawa Road",
    severity: "High",
    status: "Unread",
    time: "48 minutes ago",
    icon: "⏰"
  },
  {
    id: "ALT-2026-00879",
    type: "Citizen Complaint",
    title: "New citizen complaint received",
    message:
      "A new complaint has been submitted regarding construction quality.",
    project: "Pokhara Regional Bridge",
    severity: "High",
    status: "Unread",
    time: "1 hour ago",
    icon: "👤"
  },
  {
    id: "ALT-2026-00878",
    type: "Evidence",
    title: "New field evidence submitted",
    message:
      "Field officer submitted new photo and GPS evidence for project verification.",
    project: "District Hospital Upgrade",
    severity: "Medium",
    status: "Read",
    time: "3 hours ago",
    icon: "📸"
  },
  {
    id: "ALT-2026-00877",
    type: "Progress",
    title: "Project progress below expected level",
    message:
      "Terai Irrigation Network progress is significantly below the expected schedule.",
    project: "Terai Irrigation Network",
    severity: "High",
    status: "Read",
    time: "5 hours ago",
    icon: "📉"
  },
  {
    id: "ALT-2026-00876",
    type: "System",
    title: "Field report verified",
    message:
      "Latest field report has successfully completed human verification.",
    project: "Community School Reconstruction",
    severity: "Low",
    status: "Read",
    time: "Yesterday",
    icon: "✓"
  }
];

function Alerts() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("All");
  const [status, setStatus] = useState("All");
  const [selectedAlert, setSelectedAlert] = useState(null);

  const filteredAlerts = useMemo(function () {
    return alerts.filter(function (alert) {
      const searchText = search.toLowerCase();

      const matchesSearch =
        alert.title.toLowerCase().includes(searchText) ||
        alert.message.toLowerCase().includes(searchText) ||
        alert.project.toLowerCase().includes(searchText) ||
        alert.id.toLowerCase().includes(searchText);

      const matchesSeverity =
        severity === "All" || alert.severity === severity;

      const matchesStatus =
        status === "All" || alert.status === status;

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [alerts, search, severity, status]);

  const total = alerts.length;

  const unread = alerts.filter(function (item) {
    return item.status === "Unread";
  }).length;

  const critical = alerts.filter(function (item) {
    return item.severity === "Critical";
  }).length;

  const high = alerts.filter(function (item) {
    return item.severity === "High";
  }).length;

  function severityClass(value) {
    return value.toLowerCase();
  }

  function markAsRead(id) {
    setAlerts(function (current) {
      return current.map(function (alert) {
        if (alert.id !== id) return alert;

        return {
          ...alert,
          status: "Read"
        };
      });
    });

    setSelectedAlert(function (current) {
      if (!current || current.id !== id) return current;

      return {
        ...current,
        status: "Read"
      };
    });
  }

  function markAllRead() {
    setAlerts(function (current) {
      return current.map(function (alert) {
        return {
          ...alert,
          status: "Read"
        };
      });
    });
  }

  return React.createElement(
    "main",
    { className: "alerts-page" },

    /* HEADER */

    React.createElement(
      "div",
      { className: "alerts-page-header" },

      React.createElement(
        "div",
        null,

        React.createElement(
          "div",
          { className: "breadcrumb" },
          "ProjectWatch Nepal",
          React.createElement("span", null, "/"),
          " Alerts"
        ),

        React.createElement("h1", null, "Project Alerts"),

        React.createElement(
          "p",
          null,
          "Monitor critical events, project risks, evidence alerts and citizen reports."
        )
      ),

      unread > 0
        ? React.createElement(
            "button",
            {
              className: "alerts-mark-all",
              onClick: markAllRead
            },
            "✓ Mark All as Read"
          )
        : null
    ),

    /* SUMMARY */

    React.createElement(
      "div",
      { className: "alerts-summary-grid" },

      React.createElement(
        "div",
        { className: "alerts-summary-card" },

        React.createElement(
          "span",
          { className: "summary-icon blue" },
          "🔔"
        ),

        React.createElement(
          "div",
          null,
          React.createElement("strong", null, total),
          React.createElement("small", null, "Total Alerts")
        )
      ),

      React.createElement(
        "div",
        { className: "alerts-summary-card unread-card" },

        React.createElement(
          "span",
          { className: "summary-icon purple" },
          "●"
        ),

        React.createElement(
          "div",
          null,
          React.createElement("strong", null, unread),
          React.createElement("small", null, "Unread")
        )
      ),

      React.createElement(
        "div",
        { className: "alerts-summary-card critical-card" },

        React.createElement(
          "span",
          { className: "summary-icon red" },
          "⚠"
        ),

        React.createElement(
          "div",
          null,
          React.createElement("strong", null, critical),
          React.createElement("small", null, "Critical")
        )
      ),

      React.createElement(
        "div",
        { className: "alerts-summary-card high-card" },

        React.createElement(
          "span",
          { className: "summary-icon orange" },
          "!"
        ),

        React.createElement(
          "div",
          null,
          React.createElement("strong", null, high),
          React.createElement("small", null, "High Priority")
        )
      )
    ),

    /* ALERT LIST */

    React.createElement(
      "section",
      { className: "alerts-management-card" },

      React.createElement(
        "div",
        { className: "alerts-management-header" },

        React.createElement(
          "div",
          null,
          React.createElement("h2", null, "Alert Center"),
          React.createElement(
            "p",
            null,
            filteredAlerts.length + " alerts found"
          )
        ),

        React.createElement(
          "div",
          { className: "alerts-filters" },

          React.createElement("input", {
            type: "text",
            placeholder: "Search alerts or projects...",
            value: search,
            onChange: function (e) {
              setSearch(e.target.value);
            }
          }),

          React.createElement(
            "select",
            {
              value: severity,
              onChange: function (e) {
                setSeverity(e.target.value);
              }
            },

            React.createElement(
              "option",
              { value: "All" },
              "All Severity"
            ),

            React.createElement(
              "option",
              { value: "Critical" },
              "Critical"
            ),

            React.createElement(
              "option",
              { value: "High" },
              "High"
            ),

            React.createElement(
              "option",
              { value: "Medium" },
              "Medium"
            ),

            React.createElement(
              "option",
              { value: "Low" },
              "Low"
            )
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
              { value: "All" },
              "All Status"
            ),

            React.createElement(
              "option",
              { value: "Unread" },
              "Unread"
            ),

            React.createElement(
              "option",
              { value: "Read" },
              "Read"
            )
          )
        )
      ),

      React.createElement(
        "div",
        { className: "alerts-list" },

        filteredAlerts.map(function (alert) {
          return React.createElement(
            "div",
            {
              key: alert.id,
              className:
                "alert-item " +
                (alert.status === "Unread" ? "unread" : "")
            },

            React.createElement(
              "div",
              {
                className:
                  "alert-item-icon " +
                  severityClass(alert.severity)
              },
              alert.icon
            ),

            React.createElement(
              "div",
              { className: "alert-item-content" },

              React.createElement(
                "div",
                { className: "alert-item-top" },

                React.createElement(
                  "div",
                  null,

                  React.createElement(
                    "span",
                    { className: "alert-type" },
                    alert.type
                  ),

                  alert.status === "Unread"
                    ? React.createElement(
                        "span",
                        { className: "alert-unread-dot" },
                        "NEW"
                      )
                    : null
                ),

                React.createElement(
                  "span",
                  {
                    className:
                      "alert-severity " +
                      severityClass(alert.severity)
                  },
                  alert.severity
                )
              ),

              React.createElement(
                "h3",
                null,
                alert.title
              ),

              React.createElement(
                "p",
                null,
                alert.message
              ),

              React.createElement(
                "div",
                { className: "alert-item-meta" },

                React.createElement(
                  "span",
                  null,
                  "📁 ",
                  alert.project
                ),

                React.createElement(
                  "span",
                  null,
                  "🕐 ",
                  alert.time
                ),

                React.createElement(
                  "span",
                  null,
                  alert.id
                )
              )
            ),

            React.createElement(
              "div",
              { className: "alert-item-actions" },

              React.createElement(
                "button",
                {
                  className: "alert-view-button",
                  onClick: function () {
                    setSelectedAlert(alert);

                    if (alert.status === "Unread") {
                      markAsRead(alert.id);
                    }
                  }
                },
                "View"
              )
            )
          );
        })
      ),

      filteredAlerts.length === 0
        ? React.createElement(
            "div",
            { className: "alerts-empty" },

            React.createElement("div", null, "🔎"),

            React.createElement(
              "strong",
              null,
              "No alerts found"
            ),

            React.createElement(
              "p",
              null,
              "Try changing your search or filters."
            )
          )
        : null
    ),

    /* MODAL */

    selectedAlert
      ? React.createElement(
          "div",
          {
            className: "alert-modal-overlay",
            onClick: function () {
              setSelectedAlert(null);
            }
          },

          React.createElement(
            "div",
            {
              className: "alert-modal",
              onClick: function (e) {
                e.stopPropagation();
              }
            },

            React.createElement(
              "div",
              { className: "alert-modal-header" },

              React.createElement(
                "div",
                null,

                React.createElement(
                  "span",
                  {
                    className:
                      "alert-modal-icon " +
                      severityClass(selectedAlert.severity)
                  },
                  selectedAlert.icon
                ),

                React.createElement(
                  "div",
                  null,

                  React.createElement(
                    "h2",
                    null,
                    selectedAlert.title
                  ),

                  React.createElement(
                    "p",
                    null,
                    selectedAlert.id
                  )
                )
              ),

              React.createElement(
                "button",
                {
                  onClick: function () {
                    setSelectedAlert(null);
                  }
                },
                "×"
              )
            ),

            React.createElement(
              "div",
              { className: "alert-modal-body" },

              React.createElement(
                "div",
                { className: "alert-modal-status" },

                React.createElement(
                  "span",
                  {
                    className:
                      "alert-severity " +
                      severityClass(selectedAlert.severity)
                  },
                  selectedAlert.severity
                ),

                React.createElement(
                  "span",
                  {
                    className:
                      "alert-modal-read-status " +
                      (selectedAlert.status === "Unread"
                        ? "unread"
                        : "read")
                  },
                  selectedAlert.status
                )
              ),

              React.createElement(
                "div",
                { className: "alert-message-box" },

                React.createElement(
                  "strong",
                  null,
                  "Alert Details"
                ),

                React.createElement(
                  "p",
                  null,
                  selectedAlert.message
                )
              ),

              React.createElement(
                "div",
                { className: "alert-detail-grid" },

                React.createElement(
                  "div",
                  null,
                  React.createElement("small", null, "Alert Type"),
                  React.createElement(
                    "strong",
                    null,
                    selectedAlert.type
                  )
                ),

                React.createElement(
                  "div",
                  null,
                  React.createElement("small", null, "Project"),
                  React.createElement(
                    "strong",
                    null,
                    selectedAlert.project
                  )
                ),

                React.createElement(
                  "div",
                  null,
                  React.createElement("small", null, "Severity"),
                  React.createElement(
                    "strong",
                    null,
                    selectedAlert.severity
                  )
                ),

                React.createElement(
                  "div",
                  null,
                  React.createElement("small", null, "Received"),
                  React.createElement(
                    "strong",
                    null,
                    selectedAlert.time
                  )
                )
              ),

              React.createElement(
                "div",
                { className: "alert-modal-actions" },

                React.createElement(
                  "button",
                  {
                    className: "alert-modal-secondary",
                    onClick: function () {
                      setSelectedAlert(null);
                    }
                  },
                  "Close"
                ),

                selectedAlert.status === "Unread"
                  ? React.createElement(
                      "button",
                      {
                        className: "alert-modal-primary",
                        onClick: function () {
                          markAsRead(selectedAlert.id);
                        }
                      },
                      "✓ Acknowledge Alert"
                    )
                  : React.createElement(
                      "button",
                      {
                        className: "alert-modal-primary",
                        onClick: function () {
                          setSelectedAlert(null);
                        }
                      },
                      "✓ Acknowledged"
                    )
              )
            )
          )
        )
      : null
  );
}

export default Alerts;