import React from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: "▦"
  },
  {
    label: "Projects",
    path: "/projects",
    icon: "▤"
  },
  {
    label: "Live Map",
    path: "/map",
    icon: "⌖"
  },
  {
    label: "Field Reports",
    path: "/field-reports",
    icon: "◫"
  },
  {
    label: "Complaints",
    path: "/complaints",
    icon: "⚠"
  },
  {
    label: "Evidence",
    path: "/evidence",
    icon: "▣"
  },
  {
    label: "Alerts",
    path: "/alerts",
    icon: "!"
  },
  {
    label: "Reports",
    path: "/reports",
    icon: "▥"
  }
];

const bottomItems = [
  {
    label: "Settings",
    path: "/settings",
    icon: "⚙"
  }
];

const Sidebar = () => {
  const renderItem = (item) => {
    return React.createElement(
      NavLink,
      {
        key: item.path,
        to: item.path,
        className: ({ isActive }) =>
          `sidebar-link ${
            isActive ? "active" : ""
          }`
      },

      React.createElement(
        "span",
        {
          className: "sidebar-icon"
        },
        item.icon
      ),

      React.createElement(
        "span",
        null,
        item.label
      )
    );
  };

  return React.createElement(
    "aside",
    {
      className: "sidebar"
    },

    React.createElement(
      "div",
      {
        className: "sidebar-brand"
      },

      React.createElement(
        "div",
        {
          className: "brand-logo"
        },
        "PW"
      ),

      React.createElement(
        "div",
        {
          className: "brand-text"
        },

        React.createElement(
          "strong",
          null,
          "ProjectWatch"
        ),

        React.createElement(
          "span",
          null,
          "Nepal"
        )
      )
    ),

    React.createElement(
      "div",
      {
        className: "sidebar-section-title"
      },
      "MAIN MENU"
    ),

    React.createElement(
      "nav",
      {
        className: "sidebar-nav"
      },
      menuItems.map(renderItem)
    ),

    React.createElement(
      "div",
      {
        className: "sidebar-section-title sidebar-bottom-title"
      },
      "SYSTEM"
    ),

    React.createElement(
      "nav",
      {
        className: "sidebar-nav"
      },
      bottomItems.map(renderItem)
    ),

    React.createElement(
      "div",
      {
        className: "sidebar-footer"
      },

      React.createElement(
        "div",
        {
          className: "sidebar-footer-status"
        },

        React.createElement(
          "span",
          {
            className: "status-dot"
          }
        ),

        React.createElement(
          "span",
          null,
          "System Operational"
        )
      ),

      React.createElement(
        "small",
        null,
        "ProjectWatch Nepal v1.0"
      )
    )
  );
};

export default Sidebar;