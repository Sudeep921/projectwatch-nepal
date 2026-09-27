import React from "react";

const h = React.createElement;

const ProjectProgressCard = ({
  progress = 0,
  status = "Active",
  risk = "Low",
  budget = 0
}) => {
  const safeProgress = Math.min(
    100,
    Math.max(0, Number(progress) || 0)
  );

  const formatBudget = (value) => {
    const amount = Number(value) || 0;

    if (amount >= 1000000000) {
      return "NPR " + (amount / 1000000000).toFixed(2) + "B";
    }

    if (amount >= 10000000) {
      return "NPR " + (amount / 10000000).toFixed(2) + "Cr";
    }

    if (amount >= 100000) {
      return "NPR " + (amount / 100000).toFixed(2) + "L";
    }

    return "NPR " + amount.toLocaleString();
  };

  const statusClass =
    String(status)
      .toLowerCase()
      .replace(/\s+/g, "-");

  const riskClass =
    String(risk)
      .toLowerCase()
      .replace(/\s+/g, "-");

  return h(
    "div",
    { className: "project-progress-card" },

    h(
      "div",
      { className: "project-progress-header" },

      h(
        "div",
        null,

        h(
          "div",
          { className: "project-progress-label" },
          "Project Progress"
        ),

        h(
          "div",
          { className: "project-progress-subtitle" },
          "Current implementation progress"
        )
      ),

      h(
        "div",
        { className: "project-progress-percent" },
        Math.round(safeProgress) + "%"
      )
    ),

    h(
      "div",
      { className: "project-progress-track" },

      h("div", {
        className: "project-progress-fill",
        style: {
          width: safeProgress + "%"
        }
      })
    ),

    h(
      "div",
      { className: "project-progress-footer" },

      h(
        "div",
        { className: "project-progress-budget" },

        h(
          "span",
          { className: "project-progress-small-label" },
          "Project Budget"
        ),

        h(
          "strong",
          null,
          formatBudget(budget)
        )
      ),

      h(
        "div",
        { className: "project-progress-tags" },

        h(
          "span",
          {
            className:
              "project-progress-status status-" +
              statusClass
          },
          status
        ),

        h(
          "span",
          {
            className:
              "project-progress-risk risk-" +
              riskClass
          },
          risk + " Risk"
        )
      )
    )
  );
};

export default ProjectProgressCard;