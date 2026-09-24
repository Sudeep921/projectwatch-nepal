import React from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";

import NotificationBell from
  "./NotificationBell";

const h = React.createElement;

const Header = () => {
  const navigate =
    useNavigate();

  const {
    user,
    logout
  } = useAuth();

  const logoutNow = () => {
    logout();
    navigate("/admin-login");
  };

  return h(
    "header",
    {
      className:
        "dashboard-header"
    },

    h(
      "div",
      {
        className:
          "header-left"
      },

      h(
        "div",
        {
          className:
            "header-title"
        },

        h(
          "h1",
          null,
          "Government Project Dashboard"
        ),

        h(
          "span",
          null,
          "Monitor Nepal's public projects in real time"
        )
      )
    ),

    h(
      "div",
      {
        className:
          "header-right"
      },

      h(
        NotificationBell
      ),

      h(
        "div",
        {
          className:
            "header-user"
        },

        h(
          "div",
          {
            className:
              "header-avatar"
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
          {
            className:
              "header-user-info"
          },

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
      ),

      h(
        "button",
        {
          className:
            "header-logout",
          onClick:
            logoutNow
        },
        "Logout"
      )
    )
  );
};

export default Header;