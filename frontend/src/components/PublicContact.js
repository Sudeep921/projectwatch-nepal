import React from "react";

const PublicContact = () => {
  return React.createElement(
    "section",
    { className: "public-contact-section" },

    React.createElement(
      "div",
      { className: "public-contact-card" },

      React.createElement(
        "div",
        null,

        React.createElement(
          "span",
          { className: "public-section-label" },
          "CITIZEN SUPPORT"
        ),

        React.createElement(
          "h2",
          null,
          "Need help or have information?"
        ),

        React.createElement(
          "p",
          null,
          "Citizens can submit project-related concerns through ProjectWatch Nepal."
        )
      ),

      React.createElement(
        "a",
        {
          href: "/complaints-public",
          className: "public-contact-button"
        },
        "Submit Complaint →"
      )
    )
  );
};

export default PublicContact;