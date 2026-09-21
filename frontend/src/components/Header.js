import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const pageNames = {
  "/dashboard": "Government Dashboard",
  "/projects": "Project Management",
  "/map": "Live Project Map",
  "/field-reports": "Field Reports",
  "/complaints": "Citizen Complaints",
  "/evidence": "Evidence Center",
  "/alerts": "Alerts & Notifications",
  "/reports": "Reports & Analytics",
  "/settings": "System Settings"
};

const Header = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const currentPage =
    pageNames[location.pathname] ||
    "ProjectWatch Nepal";

  const displayName =
    user?.name || "Administrator";

  const role =
    user?.role === "admin"
      ? "Super Admin"
      : user?.role || "Administrator";

  const handleLogout = () => {
    logout();
    window.location.href = "/public";
  };

  return React.createElement(
    "header",
    {
      className: "top-header"
    },

    React.createElement(
      "div",
      {
        className: "header-left"
      },

      React.createElement(
        "div",
        {
          className: "mobile-brand"
        },
        "ProjectWatch Nepal"
      ),

      React.createElement(
        "div",
        {
          className: "breadcrumb"
        },

        React.createElement(
          "span",
          null,
          "ProjectWatch"
        ),

        React.createElement(
          "span",
          {
            className: "breadcrumb-separator"
          },
          "/"
        ),

        React.createElement(
          "strong",
          null,
          currentPage
        )
      )
    ),

    React.createElement(
      "div",
      {
        className: "header-right"
      },

      React.createElement(
        "button",
        {
          type: "button",
          className: "header-icon-button",
          title: "Notifications",
          onClick: () => {
            window.location.href = "/alerts";
          }
        },
        "🔔"
      ),

      React.createElement(
        "div",
        {
          className: "header-user"
        },

        React.createElement(
          "div",
          {
            className: "header-avatar"
          },
          displayName
            .charAt(0)
            .toUpperCase()
        ),

        React.createElement(
          "div",
          {
            className: "header-user-info"
          },

          React.createElement(
            "strong",
            null,
            displayName
          ),

          React.createElement(
            "span",
            null,
            role
          )
        )
      ),

      React.createElement(
        "button",
        {
          type: "button",
          className: "logout-button",
          onClick: handleLogout
        },
        "Logout"
      )
    )
  );
};

export default Header;