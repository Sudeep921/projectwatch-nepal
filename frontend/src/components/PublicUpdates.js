import React from "react";

const PublicUpdates = () => {
  const updates = [
    {
      icon: "🏗️",
      title: "Project registry updated",
      text: "Government project information has been refreshed."
    },
    {
      icon: "📊",
      title: "Progress monitoring",
      text: "Project implementation progress is being monitored."
    },
    {
      icon: "🔍",
      title: "Public verification",
      text: "Citizens can review publicly available project information."
    }
  ];

  return React.createElement(
    "section",
    { className: "public-updates-section" },

    React.createElement(
      "div",
      { className: "public-section-heading" },

      React.createElement(
        "span",
        { className: "public-section-label" },
        "LATEST UPDATES"
      ),

      React.createElement(
        "h2",
        null,
        "ProjectWatch Updates"
      )
    ),

    React.createElement(
      "div",
      { className: "public-updates-grid" },

      updates.map((item, index) =>
        React.createElement(
          "div",
          {
            className: "public-update-card",
            key: index
          },

          React.createElement(
            "div",
            { className: "public-update-icon" },
            item.icon
          ),

          React.createElement(
            "h3",
            null,
            item.title
          ),

          React.createElement(
            "p",
            null,
            item.text
          )
        )
      )
    )
  );
};

export default PublicUpdates;