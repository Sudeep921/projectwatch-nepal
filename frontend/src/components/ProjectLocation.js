import React from "react";

const h = React.createElement;

const ProjectLocation = ({ project }) => {
  if (!project) return null;

  const location = [
    project.municipality,
    project.district,
    project.province
  ]
    .filter(Boolean)
    .join(", ");

  return h(
    "div",
    { className: "project-location" },

    h(
      "span",
      { className: "project-location-icon" },
      "📍"
    ),

    h(
      "span",
      null,
      location || project.location || "-"
    )
  );
};

export default ProjectLocation;