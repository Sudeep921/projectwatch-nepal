import React from "react";

const h = React.createElement;

const ProjectCoordinates = ({
  latitude,
  longitude
}) => {
  return h(
    "div",
    { className: "project-coordinates" },

    h(
      "span",
      null,
      "Latitude: ",
      latitude || "-"
    ),

    h(
      "span",
      null,
      "Longitude: ",
      longitude || "-"
    )
  );
};

export default ProjectCoordinates;