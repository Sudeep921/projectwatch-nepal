import React from "react";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";


const Header = () => {

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const {
    user,
    logout
  } = useAuth();


  const pageNames = {
    "/dashboard": "Government Dashboard",
    "/projects": "Project Management",
    "/map": "Live Project Map",
    "/field-reports": "Field Reports",
    "/complaints": "Citizen Complaints",
    "/evidence": "Evidence Management",
    "/alerts": "Alerts & Notifications",
    "/reports": "Reports & Analytics",
    "/settings": "System Settings"
  };


  const currentPage =
    pageNames[
      location.pathname
    ] || "Government Dashboard";


  const handleLogout = () => {

    logout();

    navigate(
      "/public",
      {
        replace: true
      }
    );
  };


  const openAlerts = () => {

    navigate("/alerts");
  };


  const getUserName = () => {

    if (user && user.name) {
      return user.name;
    }

    return "Administrator";
  };


  const getUserRole = () => {

    if (user && user.role) {

      if (
        user.role === "admin"
      ) {
        return "Super Admin";
      }

      if (
        user.role === "officer"
      ) {
        return "Field Officer";
      }

      if (
        user.role === "citizen"
      ) {
        return "Citizen";
      }

      return user.role;
    }

    return "Super Admin";
  };


  return React.createElement(
    "header",
    {
      className:
        "projectwatch-header"
    },

    /* =====================================
       LEFT
    ===================================== */

    React.createElement(
      "div",
      {
        className:
          "header-left"
      },

      React.createElement(
        "div",
        {
          className:
            "header-title"
        },

        React.createElement(
          "h1",
          null,
          currentPage
        ),

        React.createElement(
          "div",
          {
            className:
              "header-breadcrumb"
          },

          React.createElement(
            "span",
            null,
            "ProjectWatch Nepal"
          ),

          React.createElement(
            "span",
            {
              className:
                "breadcrumb-separator"
            },
            "/"
          ),

          React.createElement(
            "strong",
            null,
            currentPage
          )
        )
      )
    ),


    /* =====================================
       RIGHT
    ===================================== */

    React.createElement(
      "div",
      {
        className:
          "header-right"
      },


      /* Notification */

      React.createElement(
        "button",
        {
          type: "button",

          className:
            "header-notification",

          onClick:
            openAlerts,

          title:
            "View notifications"
        },

        React.createElement(
          "span",
          {
            className:
              "notification-icon"
          },
          "🔔"
        ),

        React.createElement(
          "span",
          {
            className:
              "notification-dot"
          }
        )
      ),


      /* User */

      React.createElement(
        "div",
        {
          className:
            "header-user"
        },

        React.createElement(
          "div",
          {
            className:
              "header-user-avatar"
          },

          getUserName()
            .charAt(0)
            .toUpperCase()
        ),


        React.createElement(
          "div",
          {
            className:
              "header-user-info"
          },

          React.createElement(
            "strong",
            null,
            getUserName()
          ),

          React.createElement(
            "span",
            null,
            getUserRole()
          )
        )
      ),


      /* Logout */

      React.createElement(
        "button",
        {
          type: "button",

          className:
            "header-logout-button",

          onClick:
            handleLogout
        },

        React.createElement(
          "span",
          null,
          "↪"
        ),

        React.createElement(
          "span",
          null,
          "Logout"
        )
      )

    )
  );
};


export default Header;