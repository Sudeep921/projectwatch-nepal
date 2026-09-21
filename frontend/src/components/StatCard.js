import React from "react";

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  type,
  onClick
}) => {
  return React.createElement(
    "div",
    {
      className: `stat-card ${
        type || ""
      }`,
      onClick: onClick
    },

    React.createElement(
      "div",
      {
        className: "stat-card-top"
      },

      React.createElement(
        "div",
        {
          className: "stat-card-icon"
        },
        icon || "▦"
      )
    ),

    React.createElement(
      "div",
      {
        className: "stat-card-content"
      },

      React.createElement(
        "span",
        {
          className: "stat-card-title"
        },
        title
      ),

      React.createElement(
        "strong",
        {
          className: "stat-card-value"
        },
        value ?? 0
      ),

      subtitle
        ? React.createElement(
            "span",
            {
              className: "stat-card-subtitle"
            },
            subtitle
          )
        : null
    )
  );
};

export default StatCard;