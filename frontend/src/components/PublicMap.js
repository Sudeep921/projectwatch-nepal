import React from "react";

const PublicMap = ({ projects = [] }) => {
  return React.createElement(
    "section",
    { className: "public-map-section" },

    React.createElement(
      "div",
      { className: "public-map-header" },

      React.createElement(
        "div",
        null,

        React.createElement(
          "span",
          { className: "public-section-label" },
          "PROJECT MAP"
        ),

        React.createElement(
          "h2",
          null,
          "Projects Across Nepal"
        ),

        React.createElement(
          "p",
          null,
          "Explore registered public development projects."
        )
      )
    ),

    React.createElement(
      "div",
      { className: "public-map-box" },

      React.createElement(
        "div",
        { className: "public-map-placeholder" },

        React.createElement(
          "div",
          { className: "public-map-icon" },
          "🗺️"
        ),

        React.createElement(
          "h3",
          null,
          "Nepal Project Map"
        ),

        React.createElement(
          "p",
          null,
          `${projects.length} public projects registered`
        )
      )
    )
  );
};

export default PublicMap;