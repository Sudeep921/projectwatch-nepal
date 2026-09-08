import React, { useState } from "react";

function ProjectDetails({ project, onBack }) {
  const data = project || {
    id: "PW-BAG-00124",
    name: "Kathmandu Ring Road Expansion",
    icon: "🛣️",
    district: "Kathmandu",
    province: "Bagmati",
    budget: "NPR 8.4B",
    progress: 42,
    progressLabel: "Behind Schedule",
    status: "Critical",
    risk: "Critical",
    updated: "2 hrs ago",
    contractor: "ABC Infrastructure Pvt. Ltd.",
    department: "Department of Roads",
    startDate: "15 Jan 2025",
    endDate: "14 Jan 2028",
    location: "Kathmandu, Bagmati Province",
    description:
      "Major road infrastructure development project focused on expanding and upgrading the Kathmandu Ring Road."
  };

  const [activeTab, setActiveTab] = useState("overview");

  function getStatusClass(status) {
    return String(status || "Active")
      .toLowerCase()
      .replace(/\s+/g, "-");
  }

  function getRiskClass(risk) {
    return String(risk || "Low")
      .toLowerCase()
      .replace(/\s+/g, "-");
  }

  function handleEdit() {
    alert("Edit Project module will be connected to the backend.");
  }

  function handleEvidence() {
    alert("Evidence upload module will be connected next.");
  }

  function handleMap() {
    alert("Live Map module will open next.");
  }

  function handleReports() {
    alert("Field Reports module will open next.");
  }

  function handleAlerts() {
    alert("Project Alerts module will open next.");
  }

  function handleGenerateReport() {
    alert("Report generation module will be connected next.");
  }

  return React.createElement(
    "main",
    { className: "page-content project-details-page" },

    /* =========================================
       TOP BAR
       ========================================= */

    React.createElement(
      "div",
      { className: "details-topbar" },

      React.createElement(
        "button",
        {
          type: "button",
          className: "back-button",
          onClick: function () {
            if (onBack) {
              onBack();
            }
          }
        },
        "← Back to Projects"
      ),

      React.createElement(
        "div",
        { className: "details-actions" },

        React.createElement(
          "button",
          {
            type: "button",
            className: "secondary-button",
            onClick: handleEdit
          },
          "✎ Edit Project"
        ),

        React.createElement(
          "button",
          {
            type: "button",
            className: "primary-button",
            onClick: handleEvidence
          },
          "+ Add Evidence"
        )
      )
    ),

    /* =========================================
       PROJECT HERO
       ========================================= */

    React.createElement(
      "section",
      { className: "project-detail-hero" },

      React.createElement(
        "div",
        { className: "detail-project-icon" },
        data.icon || "🏗️"
      ),

      React.createElement(
        "div",
        { className: "detail-project-main" },

        React.createElement(
          "div",
          { className: "detail-project-id" },
          data.id
        ),

        React.createElement(
          "h1",
          null,
          data.name
        ),

        React.createElement(
          "p",
          null,
          data.description ||
            "Government infrastructure development project"
        ),

        React.createElement(
          "div",
          { className: "detail-meta-row" },

          React.createElement(
            "span",
            null,
            "📍 ",
            data.location
          ),

          React.createElement(
            "span",
            null,
            "🏛️ ",
            data.department
          ),

          React.createElement(
            "span",
            null,
            "🔄 Updated ",
            data.updated
          )
        )
      ),

      React.createElement(
        "div",
        { className: "detail-status-area" },

        React.createElement(
          "span",
          {
            className:
              "detail-status " +
              getStatusClass(data.status)
          },
          React.createElement("i"),
          data.status
        ),

        React.createElement(
          "span",
          {
            className:
              "detail-risk " +
              getRiskClass(data.risk)
          },
          "⚠ ",
          data.risk,
          " Risk"
        )
      )
    ),

    /* =========================================
       TAB NAVIGATION
       ========================================= */

    React.createElement(
      "div",
      { className: "details-tabs" },

      React.createElement(
        "button",
        {
          type: "button",
          className:
            activeTab === "overview"
              ? "details-tab active"
              : "details-tab",
          onClick: function () {
            setActiveTab("overview");
          }
        },
        "Overview"
      ),

      React.createElement(
        "button",
        {
          type: "button",
          className:
            activeTab === "evidence"
              ? "details-tab active"
              : "details-tab",
          onClick: function () {
            setActiveTab("evidence");
          }
        },
        "Evidence"
      ),

      React.createElement(
        "button",
        {
          type: "button",
          className:
            activeTab === "activity"
              ? "details-tab active"
              : "details-tab",
          onClick: function () {
            setActiveTab("activity");
          }
        },
        "Activity"
      )
    ),

    /* =========================================
       KEY STATS
       ========================================= */

    React.createElement(
      "section",
      { className: "detail-stats-grid" },

      React.createElement(
        "div",
        { className: "detail-stat-card" },

        React.createElement(
          "span",
          null,
          "TOTAL BUDGET"
        ),

        React.createElement(
          "strong",
          null,
          data.budget
        ),

        React.createElement(
          "small",
          null,
          "Approved project budget"
        )
      ),

      React.createElement(
        "div",
        { className: "detail-stat-card" },

        React.createElement(
          "span",
          null,
          "CURRENT PROGRESS"
        ),

        React.createElement(
          "strong",
          null,
          data.progress + "%"
        ),

        React.createElement(
          "small",
          null,
          data.progressLabel || "Current implementation"
        )
      ),

      React.createElement(
        "div",
        { className: "detail-stat-card" },

        React.createElement(
          "span",
          null,
          "PROJECT STATUS"
        ),

        React.createElement(
          "strong",
          {
            className:
              getStatusClass(data.status) + "-text"
          },
          data.status
        ),

        React.createElement(
          "small",
          null,
          data.risk === "Critical"
            ? "Requires immediate monitoring"
            : "Project monitoring active"
        )
      ),

      React.createElement(
        "div",
        { className: "detail-stat-card" },

        React.createElement(
          "span",
          null,
          "LAST VERIFIED"
        ),

        React.createElement(
          "strong",
          null,
          data.updated
        ),

        React.createElement(
          "small",
          null,
          "Field verification"
        )
      )
    ),

    /* =========================================
       MAIN CONTENT
       ========================================= */

    React.createElement(
      "div",
      { className: "details-content-grid" },

      /* =====================================
         LEFT COLUMN
         ===================================== */

      React.createElement(
        "div",
        { className: "details-main-column" },

        /* PROJECT PROGRESS */

        React.createElement(
          "section",
          { className: "detail-panel" },

          React.createElement(
            "div",
            { className: "detail-panel-header" },

            React.createElement(
              "div",
              null,

              React.createElement(
                "h2",
                null,
                "Project Progress"
              ),

              React.createElement(
                "p",
                null,
                "Current implementation progress"
              )
            ),

            React.createElement(
              "strong",
              { className: "large-progress" },
              data.progress + "%"
            )
          ),

          React.createElement(
            "div",
            { className: "detail-progress-track" },

            React.createElement("span", {
              style: {
                width:
                  Math.min(
                    Math.max(Number(data.progress) || 0, 0),
                    100
                  ) + "%"
              }
            })
          ),

          React.createElement(
            "div",
            { className: "progress-info-row" },

            React.createElement(
              "span",
              null,
              "Project Start: ",
              data.startDate
            ),

            React.createElement(
              "span",
              null,
              "Expected Completion: ",
              data.endDate
            )
          )
        ),

        /* DESCRIPTION */

        React.createElement(
          "section",
          { className: "detail-panel" },

          React.createElement(
            "div",
            { className: "detail-panel-header" },

            React.createElement(
              "div",
              null,

              React.createElement(
                "h2",
                null,
                "Project Description"
              ),

              React.createElement(
                "p",
                null,
                "Overview of the government project"
              )
            )
          ),

          React.createElement(
            "p",
            {
              style: {
                margin: "0",
                color: "#64748b",
                fontSize: "13px",
                lineHeight: "1.8"
              }
            },
            data.description ||
              "No project description has been added yet."
          )
        ),

        /* TIMELINE */

        React.createElement(
          "section",
          { className: "detail-panel" },

          React.createElement(
            "div",
            { className: "detail-panel-header" },

            React.createElement(
              "div",
              null,

              React.createElement(
                "h2",
                null,
                "Project Timeline"
              ),

              React.createElement(
                "p",
                null,
                "Major project milestones"
              )
            )
          ),

          React.createElement(
            "div",
            { className: "project-timeline" },

            React.createElement(
              "div",
              { className: "timeline-item completed" },

              React.createElement(
                "div",
                { className: "timeline-dot" },
                "✓"
              ),

              React.createElement(
                "div",
                null,

                React.createElement(
                  "strong",
                  null,
                  "Project Approved"
                ),

                React.createElement(
                  "span",
                  null,
                  data.startDate,
                  " • Completed"
                )
              )
            ),

            React.createElement(
              "div",
              { className: "timeline-item completed" },

              React.createElement(
                "div",
                { className: "timeline-dot" },
                "✓"
              ),

              React.createElement(
                "div",
                null,

                React.createElement(
                  "strong",
                  null,
                  "Construction Started"
                ),

                React.createElement(
                  "span",
                  null,
                  "10 Mar 2025 • Completed"
                )
              )
            ),

            React.createElement(
              "div",
              { className: "timeline-item current" },

              React.createElement(
                "div",
                { className: "timeline-dot" },
                "●"
              ),

              React.createElement(
                "div",
                null,

                React.createElement(
                  "strong",
                  null,
                  "Main Construction"
                ),

                React.createElement(
                  "span",
                  null,
                  data.progress + "% Complete • Current Stage"
                )
              )
            ),

            React.createElement(
              "div",
              { className: "timeline-item" },

              React.createElement(
                "div",
                { className: "timeline-dot" },
                "○"
              ),

              React.createElement(
                "div",
                null,

                React.createElement(
                  "strong",
                  null,
                  "Final Inspection"
                ),

                React.createElement(
                  "span",
                  null,
                  data.endDate + " • Planned"
                )
              )
            )
          )
        ),

        /* EVIDENCE */

        React.createElement(
          "section",
          { className: "detail-panel" },

          React.createElement(
            "div",
            { className: "detail-panel-header" },

            React.createElement(
              "div",
              null,

              React.createElement(
                "h2",
                null,
                "Latest Evidence"
              ),

              React.createElement(
                "p",
                null,
                "Recent field verification submissions"
              )
            ),

            React.createElement(
              "button",
              {
                type: "button",
                className: "text-button",
                onClick: function () {
                  setActiveTab("evidence");
                }
              },
              "View All →"
            )
          ),

          React.createElement(
            "div",
            { className: "evidence-grid" },

            React.createElement(
              "div",
              {
                className: "evidence-card",
                onClick: handleEvidence
              },

              React.createElement(
                "div",
                { className: "evidence-image" },
                "📷"
              ),

              React.createElement(
                "div",
                { className: "evidence-info" },

                React.createElement(
                  "strong",
                  null,
                  "Road construction site"
                ),

                React.createElement(
                  "span",
                  null,
                  "Field Officer • 2 hrs ago"
                )
              )
            ),

            React.createElement(
              "div",
              {
                className: "evidence-card",
                onClick: handleEvidence
              },

              React.createElement(
                "div",
                { className: "evidence-image" },
                "📹"
              ),

              React.createElement(
                "div",
                { className: "evidence-info" },

                React.createElement(
                  "strong",
                  null,
                  "Construction progress video"
                ),

                React.createElement(
                  "span",
                  null,
                  "Field Officer • 5 hrs ago"
                )
              )
            )
          )
        ),

        /* ACTIVITY */

        React.createElement(
          "section",
          { className: "detail-panel" },

          React.createElement(
            "div",
            { className: "detail-panel-header" },

            React.createElement(
              "div",
              null,

              React.createElement(
                "h2",
                null,
                "Recent Activity"
              ),

              React.createElement(
                "p",
                null,
                "Latest project monitoring activities"
              )
            )
          ),

          React.createElement(
            "div",
            {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: "15px"
              }
            },

            createActivity(
              "📷",
              "New field evidence submitted",
              "Field Officer submitted construction site evidence.",
              "2 hours ago"
            ),

            createActivity(
              "⚠️",
              "AI verification flag created",
              "Potential discrepancy detected between reported progress and field evidence.",
              "3 hours ago"
            ),

            createActivity(
              "📋",
              "Project record updated",
              "Project progress was updated to " +
                data.progress +
                "%.",
              "5 hours ago"
            )
          )
        )
      ),

      /* =====================================
         RIGHT COLUMN
         ===================================== */

      React.createElement(
        "aside",
        { className: "details-side-column" },

        /* PROJECT INFORMATION */

        React.createElement(
          "section",
          { className: "detail-panel" },

          React.createElement(
            "div",
            { className: "detail-panel-header" },

            React.createElement(
              "div",
              null,

              React.createElement(
                "h2",
                null,
                "Project Information"
              ),

              React.createElement(
                "p",
                null,
                "Official project details"
              )
            )
          ),

          React.createElement(
            "div",
            { className: "info-list" },

            createInfoRow("Project ID", data.id),
            createInfoRow("Province", data.province),
            createInfoRow("District", data.district),
            createInfoRow("Department", data.department),
            createInfoRow("Contractor", data.contractor),
            createInfoRow("Start Date", data.startDate),
            createInfoRow("End Date", data.endDate)
          )
        ),

        /* AI VERIFICATION */

        React.createElement(
          "section",
          { className: "ai-warning-card" },

          React.createElement(
            "div",
            { className: "ai-warning-icon" },
            "✦"
          ),

          React.createElement(
            "span",
            { className: "ai-label" },
            "AI VERIFICATION"
          ),

          React.createElement(
            "h3",
            null,
            "Potential discrepancy detected"
          ),

          React.createElement(
            "p",
            null,
            "Reported progress appears higher than recent field evidence. Manual verification is recommended."
          ),

          React.createElement(
            "button",
            {
              type: "button",
              className: "ai-review-button",
              onClick: handleEvidence
            },
            "Review Evidence →"
          )
        ),

        /* RISK SUMMARY */

        React.createElement(
          "section",
          { className: "detail-panel" },

          React.createElement(
            "div",
            { className: "detail-panel-header" },

            React.createElement(
              "div",
              null,

              React.createElement(
                "h2",
                null,
                "Risk Summary"
              ),

              React.createElement(
                "p",
                null,
                "Current project risk assessment"
              )
            )
          ),

          React.createElement(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px",
                borderRadius: "10px",
                background: "#fff7f7"
              }
            },

            React.createElement(
              "div",
              {
                style: {
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "#fee2e2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px"
                }
              },
              "⚠"
            ),

            React.createElement(
              "div",
              null,

              React.createElement(
                "strong",
                {
                  style: {
                    display: "block",
                    fontSize: "13px",
                    color: "#b91c1c"
                  }
                },
                data.risk,
                " Risk"
              ),

              React.createElement(
                "span",
                {
                  style: {
                    display: "block",
                    marginTop: "3px",
                    fontSize: "11px",
                    color: "#7f1d1d"
                  }
                },
                "Additional monitoring recommended"
              )
            )
          )
        ),

        /* QUICK ACTIONS */

        React.createElement(
          "section",
          { className: "detail-panel quick-actions-panel" },

          React.createElement(
            "h2",
            null,
            "Quick Actions"
          ),

          React.createElement(
            "button",
            {
              type: "button",
              className: "quick-action",
              onClick: handleMap
            },
            "📍 View on Live Map"
          ),

          React.createElement(
            "button",
            {
              type: "button",
              className: "quick-action",
              onClick: handleReports
            },
            "📋 Field Reports"
          ),

          React.createElement(
            "button",
            {
              type: "button",
              className: "quick-action",
              onClick: handleAlerts
            },
            "⚠ View Alerts"
          ),

          React.createElement(
            "button",
            {
              type: "button",
              className: "quick-action",
              onClick: handleGenerateReport
            },
            "📊 Generate Report"
          )
        )
      )
    )
  );
}

/* =========================================
   HELPER: INFO ROW
   ========================================= */

function createInfoRow(label, value) {
  return React.createElement(
    "div",
    { key: label },

    React.createElement(
      "span",
      null,
      label
    ),

    React.createElement(
      "strong",
      null,
      value || "Not available"
    )
  );
}

/* =========================================
   HELPER: ACTIVITY
   ========================================= */

function createActivity(
  icon,
  title,
  description,
  time
) {
  return React.createElement(
    "div",
    {
      style: {
        display: "flex",
        gap: "12px",
        alignItems: "flex-start"
      }
    },

    React.createElement(
      "div",
      {
        style: {
          width: "34px",
          height: "34px",
          flexShrink: 0,
          borderRadius: "9px",
          background: "#f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }
      },
      icon
    ),

    React.createElement(
      "div",
      {
        style: {
          flex: 1
        }
      },

      React.createElement(
        "strong",
        {
          style: {
            display: "block",
            fontSize: "12px",
            color: "#334155"
          }
        },
        title
      ),

      React.createElement(
        "span",
        {
          style: {
            display: "block",
            marginTop: "4px",
            fontSize: "11px",
            color: "#7b8798",
            lineHeight: "1.5"
          }
        },
        description
      ),

      React.createElement(
        "small",
        {
          style: {
            display: "block",
            marginTop: "4px",
            color: "#a0a9b6",
            fontSize: "10px"
          }
        },
        time
      )
    )
  );
}

export default ProjectDetails;