import React from "react";

const h = React.createElement;

const ProjectTimeline = ({
  timeline = []
}) => {
  if (!timeline.length) {
    return h(
      "div",
      {
        className:
          "empty-box"
      },
      "No timeline updates available."
    );
  }

  return h(
    "div",
    {
      className:
        "project-timeline"
    },

    timeline.map(
      (item, index) =>
        h(
          "div",
          {
            className:
              "timeline-item",
            key:
              item._id ||
              item.id ||
              index
          },

          h(
            "div",
            {
              className:
                "timeline-dot"
            }
          ),

          h(
            "div",
            {
              className:
                "timeline-content"
            },

            h(
              "strong",
              null,
              item.title ||
                item.status ||
                "Project Update"
            ),

            h(
              "p",
              null,
              item.description ||
                item.note ||
                "Project activity recorded."
            ),

            h(
              "small",
              null,
              item.date
                ? new Date(
                    item.date
                  ).toLocaleDateString()
                : ""
            )
          )
        )
    )
  );
};

export default ProjectTimeline;