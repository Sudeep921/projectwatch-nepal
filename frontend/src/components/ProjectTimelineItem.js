import React from "react";

const h = React.createElement;

const ProjectTimelineItem = ({
  item,
  index
}) => {
  if (!item) return null;

  return h(
    "div",
    {
      className: "project-timeline-item"
    },

    h(
      "div",
      {
        className:
          "project-timeline-number"
      },
      index + 1
    ),

    h(
      "div",
      {
        className:
          "project-timeline-content"
      },

      h(
        "h4",
        null,
        item.title ||
          item.event ||
          "Project Update"
      ),

      h(
        "p",
        null,
        item.description ||
          item.note ||
          ""
      ),

      item.date &&
        h(
          "small",
          null,
          new Date(
            item.date
          ).toLocaleDateString()
        )
    )
  );
};

export default ProjectTimelineItem;