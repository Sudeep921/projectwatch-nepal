import React from "react";

import {
  NavLink
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";


const h = React.createElement;


const Sidebar = () => {

  const {
    user
  } = useAuth();


  const links = [

    [
      "/admin/dashboard",
      "Dashboard",
      "▦"
    ],

    [
      "/admin/projects",
      "Projects",
      "▤"
    ],

    [
      "/admin/map",
      "Live Map",
      "⌖"
    ],

    [
      "/admin/field-reports",
      "Field Reports",
      "◉"
    ],

    [
      "/admin/evidence",
      "Evidence",
      "▣"
    ],

    [
      "/admin/complaints",
      "Complaints",
      "◌"
    ],

    [
      "/admin/alerts",
      "Alerts",
      "⚠"
    ],

    [
      "/admin/notifications",
      "Notifications",
      "🔔"
    ],

    [
      "/admin/reports",
      "Reports",
      "▥"
    ],

    [
      "/admin/users",
      "Users",
      "♙"
    ],

    [
      "/admin/audit-logs",
      "Audit Logs",
      "▤"
    ],

    [
      "/admin/system-settings",
      "System Settings",
      "⚙"
    ]

  ];


  return h(
    "aside",
    {
      className:
        "dashboard-sidebar"
    },


    /* =====================================
       BRAND
    ===================================== */

    h(
      "div",
      {
        className:
          "sidebar-brand"
      },

      h(
        "div",
        {
          className:
            "sidebar-logo"
        },
        "PW"
      ),

      h(
        "div",
        null,

        h(
          "strong",
          null,
          "ProjectWatch"
        ),

        h(
          "span",
          null,
          "NEPAL"
        )

      )
    ),


    /* =====================================
       SECTION
    ===================================== */

    h(
      "div",
      {
        className:
          "sidebar-section-title"
      },

      "MONITORING"
    ),


    /* =====================================
       NAVIGATION
    ===================================== */

    h(
      "nav",
      {
        className:
          "sidebar-nav"
      },

      links.map(
        ([path, label, icon]) =>

          h(
            NavLink,
            {
              key: path,

              to: path,

              className:
                ({ isActive }) =>
                  `sidebar-link ${
                    isActive
                      ? "active"
                      : ""
                  }`
            },

            h(
              "span",
              {
                className:
                  "sidebar-icon"
              },
              icon
            ),

            h(
              "span",
              null,
              label
            )

          )
      )
    ),


    /* =====================================
       BOTTOM
    ===================================== */

    h(
      "div",
      {
        className:
          "sidebar-bottom"
      },


      /* SETTINGS */

      h(
        NavLink,
        {
          to:
            "/admin/settings",

          className:
            ({ isActive }) =>
              `sidebar-link ${
                isActive
                  ? "active"
                  : ""
              }`
        },

        h(
          "span",
          {
            className:
              "sidebar-icon"
          },
          "⚙"
        ),

        h(
          "span",
          null,
          "Settings"
        )
      ),


      /* USER */

      h(
        "div",
        {
          className:
            "sidebar-user"
        },

        h(
          "div",
          {
            className:
              "sidebar-user-avatar"
          },

          (
            user?.name ||
            "A"
          )
            .charAt(0)
            .toUpperCase()
        ),


        h(
          "div",
          null,

          h(
            "strong",
            null,
            user?.name ||
              "Administrator"
          ),

          h(
            "span",
            null,
            user?.role ||
              "admin"
          )

        )

      )

    )

  );
};


export default Sidebar;