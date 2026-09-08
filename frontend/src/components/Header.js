import React from "react";

function Header() {
  return React.createElement(
    "header",
    { className: "header" },

    React.createElement(
      "div",
      { className: "header-left" },

      React.createElement(
        "button",
        { className: "mobile-menu" },
        "☰"
      ),

      React.createElement(
        "div",
        null,
        React.createElement(
          "h1",
          null,
          "Government Project Dashboard"
        ),

        React.createElement(
          "p",
          null,
          "Monitor Nepal's public projects in real time"
        )
      )
    ),

    React.createElement(
      "div",
      { className: "header-right" },

      React.createElement(
        "button",
        { className: "notification-button" },
        "♧",
        React.createElement(
          "span",
          { className: "notification-badge" },
          "4"
        )
      ),

      React.createElement(
        "div",
        { className: "profile" },

        React.createElement(
          "div",
          { className: "profile-avatar" },
          "A"
        ),

        React.createElement(
          "div",
          { className: "profile-info" },
          React.createElement(
            "strong",
            null,
            "Administrator"
          ),
          React.createElement(
            "span",
            null,
            "Super Admin"
          )
        ),

        React.createElement(
          "span",
          { className: "profile-arrow" },
          "⌄"
        )
      )
    )
  );
}

export default Header;