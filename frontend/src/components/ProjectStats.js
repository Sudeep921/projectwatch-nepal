import React from "react";

const h = React.createElement;

const ProjectStats = ({
  projects = []
}) => {
  const total = projects.length;

  const active = projects.filter(
    p => p.status === "Active"
  ).length;

  const completed = projects.filter(
    p => p.status === "Completed"
  ).length;

  const delayed = projects.filter(
    p => p.status === "Delayed"
  ).length;

  const critical = projects.filter(
    p => p.status === "Critical"
  ).length;

  return h(
    "div",
    {
      className:
        "project-stats-grid"
    },

    h(
      "div",
      { className: "project-stat" },
      h("span", null, "Total"),
      h("strong", null, total)
    ),

    h(
      "div",
      { className: "project-stat" },
      h("span", null, "Active"),
      h("strong", null, active)
    ),

    h(
      "div",
      { className: "project-stat" },
      h("span", null, "Completed"),
      h(
        "strong",
        null,
        completed
      )
    ),

    h(
      "div",
      { className: "project-stat" },
      h("span", null, "Delayed"),
      h(
        "strong",
        null,
        delayed
      )
    ),

    h(
      "div",
      { className: "project-stat" },
      h("span", null, "Critical"),
      h(
        "strong",
        null,
        critical
      )
    )
  );
};

export default ProjectStats;