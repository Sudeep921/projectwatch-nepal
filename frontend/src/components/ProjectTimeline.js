import React, {
  useMemo,
  useState
} from "react";

const h = React.createElement;

const ProjectTimeline = ({
  timeline = []
}) => {
  const [filter, setFilter] =
    useState("all");

  const [expanded, setExpanded] =
    useState(null);

  const items = Array.isArray(timeline)
    ? timeline
    : [];

  const filteredItems = useMemo(() => {
    if (filter === "all") {
      return items;
    }

    if (filter === "report") {
      return items.filter(
        (item) =>
          item.type === "field_report" ||
          item.type === "report"
      );
    }

    if (filter === "progress") {
      return items.filter(
        (item) =>
          item.progress !== undefined &&
          item.progress !== null
      );
    }

    if (filter === "completed") {
      return items.filter(
        (item) =>
          String(
            item.status || ""
          ).toLowerCase() ===
            "completed" ||
          item.type === "completed"
      );
    }

    return items;
  }, [items, filter]);

  const getType = (item) => {
    if (
      item.type === "completed" ||
      String(item.status || "").toLowerCase() ===
        "completed"
    ) {
      return "completed";
    }

    if (
      item.type === "field_report" ||
      item.type === "report"
    ) {
      return "report";
    }

    return "project";
  };

  const getIcon = (type) => {
    if (type === "completed") {
      return "✓";
    }

    if (type === "report") {
      return "📋";
    }

    return "🚀";
  };

  const getTitle = (item, type) => {
    if (item.title) {
      return item.title;
    }

    if (type === "completed") {
      return "Project Completed";
    }

    if (type === "report") {
      return "Field Report";
    }

    return "Project Started";
  };

  const getDate = (item) => {
    const value =
      item.date ||
      item.createdAt ||
      item.reportDate ||
      item.timestamp;

    if (!value) {
      return "Date unavailable";
    }

    try {
      return new Date(
        value
      ).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return "Date unavailable";
    }
  };

  const getProgress = (item) => {
    if (
      item.progress !== undefined &&
      item.progress !== null
    ) {
      return Number(item.progress);
    }

    if (
      item.reportedProgress !== undefined &&
      item.reportedProgress !== null
    ) {
      return Number(
        item.reportedProgress
      );
    }

    return null;
  };

  const toggleItem = (index) => {
    setExpanded(
      expanded === index
        ? null
        : index
    );
  };

  if (!items.length) {
    return h(
      "div",
      {
        className:
          "advanced-timeline-empty"
      },

      h(
        "div",
        {
          className:
            "advanced-timeline-empty-icon"
        },
        "🕒"
      ),

      h(
        "strong",
        null,
        "No timeline activity yet"
      ),

      h(
        "p",
        null,
        "Project activities and field reports will appear here."
      )
    );
  }

  return h(
    "div",
    {
      className:
        "advanced-project-timeline"
    },

    h(
      "div",
      {
        className:
          "timeline-filter-bar"
      },

      h(
        "button",
        {
          className:
            filter === "all"
              ? "timeline-filter active"
              : "timeline-filter",
          onClick: () =>
            setFilter("all")
        },
        "All"
      ),

      h(
        "button",
        {
          className:
            filter === "project"
              ? "timeline-filter active"
              : "timeline-filter",
          onClick: () =>
            setFilter("project")
        },
        "Project"
      ),

      h(
        "button",
        {
          className:
            filter === "report"
              ? "timeline-filter active"
              : "timeline-filter",
          onClick: () =>
            setFilter("report")
        },
        "Reports"
      ),

      h(
        "button",
        {
          className:
            filter === "progress"
              ? "timeline-filter active"
              : "timeline-filter",
          onClick: () =>
            setFilter("progress")
        },
        "Progress"
      ),

      h(
        "button",
        {
          className:
            filter === "completed"
              ? "timeline-filter active"
              : "timeline-filter",
          onClick: () =>
            setFilter("completed")
        },
        "Completed"
      )
    ),

    h(
      "div",
      {
        className:
          "timeline-count"
      },
      `${filteredItems.length} timeline ${
        filteredItems.length === 1
          ? "event"
          : "events"
      }`
    ),

    h(
      "div",
      {
        className:
          "timeline-list"
      },

      filteredItems.map(
        (item, index) => {
          const type =
            getType(item);

          const progress =
            getProgress(item);

          const isOpen =
            expanded === index;

          return h(
            "div",
            {
              key:
                item._id ||
                item.id ||
                `${index}-${getDate(
                  item
                )}`,
              className:
                "timeline-event"
            },

            h(
              "div",
              {
                className:
                  `timeline-marker timeline-marker-${type}`
              },
              getIcon(type)
            ),

            h(
              "div",
              {
                className:
                  "timeline-event-content"
              },

              h(
                "div",
                {
                  className:
                    "timeline-event-top"
                },

                h(
                  "div",
                  null,

                  h(
                    "strong",
                    null,
                    getTitle(
                      item,
                      type
                    )
                  ),

                  h(
                    "span",
                    {
                      className:
                        `timeline-type-badge ${type}`
                    },
                    type ===
                    "field_report"
                      ? "Report"
                      : type
                  )
                ),

                h(
                  "small",
                  null,
                  getDate(item)
                )
              ),

              item.description ||
              item.remarks ||
              item.message
                ? h(
                    "p",
                    {
                      className:
                        "timeline-event-description"
                    },
                    item.description ||
                      item.remarks ||
                      item.message
                  )
                : null,

              progress !== null
                ? h(
                    "div",
                    {
                      className:
                        "timeline-progress-row"
                    },

                    h(
                      "span",
                      null,
                      "Progress"
                    ),

                    h(
                      "div",
                      {
                        className:
                          "timeline-progress-track"
                      },

                      h(
                        "div",
                        {
                          className:
                            "timeline-progress-fill",
                          style: {
                            width:
                              `${Math.min(
                                100,
                                Math.max(
                                  0,
                                  progress
                                )
                              )}%`
                          }
                        }
                      )
                    ),

                    h(
                      "strong",
                      null,
                      `${progress}%`
                    )
                  )
                : null,

              h(
                "button",
                {
                  className:
                    "timeline-view-button",
                  onClick: () =>
                    toggleItem(
                      index
                    )
                },
                isOpen
                  ? "Hide details"
                  : "View details"
              ),

              isOpen
                ? h(
                    "div",
                    {
                      className:
                        "timeline-expanded"
                    },

                    item.officer
                      ? h(
                          "div",
                          null,
                          h(
                            "span",
                            null,
                            "Officer"
                          ),
                          h(
                            "strong",
                            null,
                            item.officer.name ||
                              item.officer.fullName ||
                              item.officer.email ||
                              "—"
                          )
                        )
                      : null,

                    item.status
                      ? h(
                          "div",
                          null,
                          h(
                            "span",
                            null,
                            "Status"
                          ),
                          h(
                            "strong",
                            null,
                            item.status
                          )
                        )
                      : null,

                    item.remarks
                      ? h(
                          "div",
                          null,
                          h(
                            "span",
                            null,
                            "Remarks"
                          ),
                          h(
                            "strong",
                            null,
                            item.remarks
                          )
                        )
                      : null
                  )
                : null
            )
          );
        }
      )
    )
  );
};

export default ProjectTimeline;