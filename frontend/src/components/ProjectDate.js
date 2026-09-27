import React from "react";

const h = React.createElement;

const ProjectDate = ({
  label,
  date
}) => {
  let value = "-";

  if (date) {
    const parsed = new Date(date);

    if (!Number.isNaN(parsed.getTime())) {
      value = parsed.toLocaleDateString();
    }
  }

  return h(
    "div",
    { className: "project-date" },

    h(
      "span",
      null,
      label || "Date"
    ),

    h(
      "strong",
      null,
      value
    )
  );
};

export default ProjectDate;