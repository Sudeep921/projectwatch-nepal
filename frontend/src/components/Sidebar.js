import React from "react";

function Sidebar({ currentPage, setPage }) {
  const menuItems = [
    {
      name: "Dashboard",
      icon: "▦",
      page: "dashboard"
    },
    {
      name: "Projects",
      icon: "▤",
      page: "projects"
    },
    {
      name: "Live Map",
      icon: "⌖",
      page: "map"
    },
    {
      name: "Field Reports",
      icon: "▣",
      page: "field-reports"
    },
    {
      name: "Complaints",
      icon: "⚑",
      page: "complaints"
    },
    {
      name: "Evidence",
      icon: "▧",
      page: "evidence"
    },
    {
      name: "Alerts",
      icon: "◉",
      page: "alerts"
    },
    {
      name: "Reports",
      icon: "▥",
      page: "reports"
    },
    {
      name: "Settings",
      icon: "⚙",
      page: "settings"
    },

    /* PUBLIC PORTAL */
    {
      name: "Public Portal",
      icon: "🌐",
      page: "public-portal"
    }
  ];

  return React.createElement(
    "aside",
    { className: "sidebar" },

    /* BRAND */
    React.createElement(
      "div",
      { className: "sidebar-brand" },

      React.createElement(
        "div",
        { className: "brand-logo" },
        "PW"
      ),

      React.createElement(
        "div",
        { className: "brand-text" },

        React.createElement(
          "strong",
          null,
          "ProjectWatch"
        ),

        React.createElement(
          "span",
          null,
          "NEPAL"
        )
      )
    ),

    /* MENU TITLE */
    React.createElement(
      "div",
      { className: "sidebar-section-title" },
      "MAIN MENU"
    ),

    /* MENU */
    React.createElement(
      "nav",
      { className: "sidebar-nav" },

      menuItems.map(function (item) {
        const isActive =
          currentPage === item.page;

        return React.createElement(
          "button",
          {
            key: item.page,

            className:
              "sidebar-link" +
              (isActive
                ? " sidebar-link-active"
                : ""),

            onClick: function () {
              setPage(item.page);
            }
          },

          React.createElement(
            "span",
            { className: "sidebar-icon" },
            item.icon
          ),

          React.createElement(
            "span",
            null,
            item.name
          )
        );
      })
    ),

    /* BOTTOM */
    React.createElement(
      "div",
      { className: "sidebar-bottom" },

      React.createElement(
        "div",
        { className: "system-status" },

        React.createElement(
          "span",
          { className: "status-dot" }
        ),

        React.createElement(
          "div",
          null,

          React.createElement(
            "strong",
            null,
            "System Online"
          ),

          React.createElement(
            "span",
            null,
            "All services operational"
          )
        )
      ),

      React.createElement(
        "div",
        { className: "sidebar-version" },
        "ProjectWatch Nepal • v1.0"
      )
    )
  );
}

export default Sidebar;