import React from "react";
import ProjectTimelineItem from "./ProjectTimelineItem";

const h = React.createElement;

const ProjectTimelineList = ({
  timeline = []
}) => {
  if (!timeline.length) {
    return h(
      "div",
      {
        className:
          "project-timeline-empty"
      },
      "No timeline updates available."
    );
  }

  return h(
    "div",
    {
      className:
        "project-timeline-list"
    },
    timeline.map(
      (item, index) =>
        h(
          ProjectTimelineItem,
          {
            key:
              item._id ||
              item.id ||
              index,
            item,
            index
          }
        )
    )
  );
};

export default ProjectTimelineList;