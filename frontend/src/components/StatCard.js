import React from "react";

const h = React.createElement;

const StatCard = ({
  title,
  value,
  icon,
  variant = ""
}) =>
  h(
    "div",
    {
      className:
        `stat-card ${variant}`
    },

    h(
      "div",
      {
        className:
          "stat-card-top"
      },

      h(
        "div",
        {
          className:
            "stat-card-icon"
        },
        icon || "▣"
      )
    ),

    h(
      "strong",
      null,
      value ?? 0
    ),

    h(
      "span",
      {
        className:
          "stat-card-title"
      },
      title
    )
  );

export default StatCard;