import React from "react";
import ProjectStatus from "./ProjectStatus";
import ProjectRisk from "./ProjectRisk";
import ProjectProgress from "./ProjectProgress";

const h = React.createElement;

const ProjectOverviewCard = ({
  project
}) => {
  if (!project) return null;

  return h(
    "div",
    {
      className:
        "project-overview-card"
    },

    h(
      "div",
      {
        className:
          "project-overview-title"
      },
      h(
        "h2",
        null,
        "Project Overview"
      )
    ),

    h(
      "div",
      {
        className:
          "project-overview-status"
      },

      h(ProjectStatus, {
        status:
          project.status
      }),

      h(ProjectRisk, {
        risk:
          project.riskLevel ||
          project.risk
      })
    ),

    h(ProjectProgress, {
      progress:
        project.progress
    })
  );
};

export default ProjectOverviewCard;