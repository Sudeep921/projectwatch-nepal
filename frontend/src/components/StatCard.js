import React from "react";

function StatCard({
  icon,
  title,
  value,
  change,
  description,
  type,
}) {
  function handleMenuClick() {
    alert(title + " details will be available soon.");
  }

  return React.createElement(
    "div",
    { className: "stat-card" },

    React.createElement(
      "div",
      { className: "stat-top" },

      React.createElement(
        "div",
        {
          className: "stat-icon " + type,
        },
        icon
      ),

      React.createElement(
        "button",
        {
          className: "stat-menu",
          onClick: handleMenuClick,
          title: "View details",
        },
        "•••"
      )
    ),

    React.createElement(
      "div",
      { className: "stat-title" },
      title
    ),

    React.createElement(
      "div",
      { className: "stat-value" },
      value
    ),

    React.createElement(
      "div",
      { className: "stat-bottom" },

      React.createElement(
        "span",
        { className: "stat-change" },
        change
      ),

      React.createElement(
        "span",
        { className: "stat-description" },
        description
      )
    )
  );
}

export default StatCard;