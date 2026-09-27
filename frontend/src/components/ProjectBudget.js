import React from "react";

const h = React.createElement;

const ProjectBudget = ({ budget }) => {
  const amount = Number(budget || 0);

  return h(
    "div",
    { className: "project-budget" },

    h(
      "span",
      null,
      "Budget"
    ),

    h(
      "strong",
      null,
      "NPR ",
      amount.toLocaleString()
    )
  );
};

export default ProjectBudget;