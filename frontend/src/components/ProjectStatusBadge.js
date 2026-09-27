import React from "react";

const h = React.createElement;

const ProjectStatusBadge = ({ status }) => {
  const value = String(
    status || "Unknown"
  ).toLowerCase();

  let className = "status-badge";

  if (value === "active") {
    className += " status-active";
  } else if (value === "completed") {
    className += " status-completed";
  } else if (value === "delayed") {
    className += " status-delayed";
  } else if (value === "critical") {
    className += " status-critical";
  } else {
    className += " status-unknown";
  }

  return h(
    "span",
    { className },
    status || "Unknown"
  );
};

export default ProjectStatusBadge;