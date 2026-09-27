import React from "react";
import ProjectInfoRow from "./ProjectInfoRow";

const h = React.createElement;

const ProjectQuickInfo = ({
  project
}) => {
  if (!project) return null;

  return h(
    "div",
    {
      className:
        "project-quick-info"
    },

    h(
      "h2",
      null,
      "Project Information"
    ),

    h(ProjectInfoRow, {
      label: "Project Code",
      value:
        project.projectCode
    }),

    h(ProjectInfoRow, {
      label: "Province",
      value:
        project.province
    }),

    h(ProjectInfoRow, {
      label: "District",
      value:
        project.district
    }),

    h(ProjectInfoRow, {
      label: "Municipality",
      value:
        project.municipality
    }),

    h(ProjectInfoRow, {
      label: "Contractor",
      value:
        project.contractor
    }),

    h(ProjectInfoRow, {
      label: "Budget",
      value:
        "NPR " +
        Number(
          project.budget || 0
        ).toLocaleString()
    })
  );
};

export default ProjectQuickInfo;