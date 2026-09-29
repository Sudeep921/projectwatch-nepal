import React from "react";

const h = React.createElement;

const ProjectRiskBadge = ({ risk }) => {
  const value = String(risk || "Low").toLowerCase();

  let background = "#dcfce7";
  let color = "#166534";

  if (value === "medium") {
    background = "#fef3c7";
    color = "#92400e";
  }

  if (value === "high") {
    background = "#fee2e2";
    color = "#991b1b";
  }

  if (value === "critical") {
    background = "#7f1d1d";
    color = "#ffffff";
  }

  return h(
    "span",
    {
      style: {
        display: "inline-block",
        padding: "5px 10px",
        borderRadius: "999px",
        background,
        color,
        fontSize: "12px",
        fontWeight: "700",
        textTransform: "capitalize"
      }
    },
    risk || "Low"
  );
};

export default ProjectRiskBadge;
