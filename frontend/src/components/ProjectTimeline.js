import React from "react";

const h = React.createElement;

const ProjectTimeline = ({
  timeline = []
}) => {
  if (
    !timeline ||
    timeline.length === 0
  ) {
    return h(
      "div",
      {
        className:
          "timeline-empty"
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
      (item, index) => {
        /* =========================
           DATE
        ========================= */

        const dateValue =
          item.date ||
          item.createdAt ||
          item.updatedAt;

        const formattedDate =
          dateValue
            ? new Date(
                dateValue
              ).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                }
              )
            : "";

        /* =========================
           PROGRESS
        ========================= */

        const rawProgress =
          item.progress ??
          item.reportedProgress;

        const hasProgress =
          rawProgress !==
            undefined &&
          rawProgress !== null &&
          rawProgress !== "";

        const progress =
          hasProgress
            ? Math.min(
                100,
                Math.max(
                  0,
                  Number(
                    rawProgress
                  ) || 0
                )
              )
            : 0;

        /* =========================
           TITLE
        ========================= */

        const title =
          item.title ||
          item.status ||
          (
            item.reportedProgress !==
              undefined
              ? "Field Report Update"
              : `Project Update ${
                  index + 1
                }`
          );

        /* =========================
           DESCRIPTION
        ========================= */

        const description =
          item.description ||
          item.observation ||
          "";

        /* =========================
           OFFICER
        ========================= */

        const officerName =
          typeof item.officer ===
          "object"
            ? (
                item.officer?.name ||
                item.officer?.email ||
                ""
              )
            : (
                item.officer ||
                ""
              );

        /* =========================
           LOCATION
        ========================= */

        const location =
          item.location ||
          "";

        return h(
          "div",
          {
            className:
              "timeline-item",

            key:
              item._id ||
              item.id ||
              index
          },

          /* =======================
             MARKER
          ======================= */

          h(
            "div",
            {
              className:
                "timeline-marker"
            },

            h(
              "span",
              null,
              item.reportedProgress !==
                undefined
                ? "◉"
                : "✓"
            )
          ),

          /* =======================
             CONTENT
          ======================= */

          h(
            "div",
            {
              className:
                "timeline-content"
            },

            /* HEADER */

            h(
              "div",
              {
                className:
                  "timeline-header"
              },

              h(
                "div",
                null,

                h(
                  "h4",
                  null,
                  title
                ),

                item.status
                  ? h(
                      "span",
                      {
                        className:
                          "timeline-status"
                      },
                      item.status
                    )
                  : null
              ),

              h(
                "span",
                {
                  className:
                    "timeline-date"
                },
                formattedDate
              )
            ),

            /* DESCRIPTION */

            description
              ? h(
                  "p",
                  {
                    className:
                      "timeline-description"
                  },
                  description
                )
              : null,

            /* PROGRESS */

            hasProgress
              ? h(
                  "div",
                  {
                    className:
                      "timeline-progress"
                  },

                  h(
                    "div",
                    {
                      className:
                        "timeline-progress-top"
                    },

                    h(
                      "span",
                      null,
                      "Progress"
                    ),

                    h(
                      "strong",
                      null,
                      `${progress}%`
                    )
                  ),

                  h(
                    "div",
                    {
                      className:
                        "timeline-progress-bar"
                    },

                    h("div", {
                      className:
                        "timeline-progress-fill",

                      style: {
                        width:
                          `${progress}%`
                      }
                    })
                  )
                )
              : null,

            /* OFFICER */

            officerName
              ? h(
                  "div",
                  {
                    className:
                      "timeline-meta"
                  },

                  h(
                    "span",
                    null,
                    "👤 " +
                      officerName
                  )
                )
              : null,

            /* LOCATION */

            location
              ? h(
                  "div",
                  {
                    className:
                      "timeline-meta"
                  },

                  h(
                    "span",
                    null,
                    "📍 " +
                      location
                  )
                )
              : null
          )
        );
      }
    )
  );
};

export default ProjectTimeline;