import React from "react";

const h = React.createElement;

const ProgressHistory = ({
  history = []
}) => {
  const items = Array.isArray(history)
    ? history
    : [];

  if (items.length === 0) {
    return h(
      "div",
      {
        className: "progress-history-empty"
      },
      "No progress history available."
    );
  }

  const getProgress = (item) => {
    const value = Number(
      item.progress ??
      item.reportedProgress ??
      0
    );

    return Math.max(
      0,
      Math.min(100, value)
    );
  };

  const formatDate = (date) => {
    if (!date) {
      return "No date";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "No date";
    }

    return parsed.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric"
      }
    );
  };

  return h(
    "div",
    {
      className: "progress-history"
    },

    items.map((item, index) => {
      const progress =
        getProgress(item);

      const previous =
        index > 0
          ? getProgress(items[index - 1])
          : 0;

      const difference =
        progress - previous;

      const officer =
        item.officer?.fullName ||
        item.officer?.name ||
        item.officer?.email ||
        "Field Officer";

      return h(
        "div",
        {
          className:
            "progress-history-item",
          key:
            item.reportId ||
            item._id ||
            index
        },

        h(
          "div",
          {
            className:
              "progress-history-marker"
          },
          h(
            "span",
            null,
            `${progress}%`
          )
        ),

        h(
          "div",
          {
            className:
              "progress-history-content"
          },

          h(
            "div",
            {
              className:
                "progress-history-top"
            },

            h(
              "div",
              null,

              h(
                "strong",
                null,
                item.reportNumber
                  ? `Field Report #${item.reportNumber}`
                  : `Progress Update ${index + 1}`
              ),

              h(
                "div",
                {
                  className:
                    "progress-history-date"
                },
                formatDate(
                  item.date ||
                  item.createdAt
                )
              )
            ),

            h(
              "div",
              {
                className:
                  "progress-history-value"
              },
              `${progress}%`
            )
          ),

          h(
            "div",
            {
              className:
                "progress-history-bar"
            },
            h("div", {
              className:
                "progress-history-bar-fill",
              style: {
                width: `${progress}%`
              }
            })
          ),

          h(
            "div",
            {
              className:
                "progress-history-meta"
            },

            h(
              "span",
              null,
              `Officer: ${officer}`
            ),

            h(
              "span",
              {
                className:
                  difference > 0
                    ? "progress-increase"
                    : difference < 0
                    ? "progress-decrease"
                    : "progress-neutral"
              },
              difference > 0
                ? `+${difference}%`
                : `${difference}%`
            )
          ),

          item.observation
            ? h(
                "p",
                {
                  className:
                    "progress-history-observation"
                },
                item.observation
              )
            : null
        )
      );
    })
  );
};

export default ProgressHistory;