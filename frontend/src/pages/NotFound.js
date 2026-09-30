import React from "react";

import {
  useNavigate
} from "react-router-dom";

const h = React.createElement;

const NotFound = () => {
  const navigate =
    useNavigate();

  return h(
    "div",
    {
      className:
        "not-found-page"
    },

    h(
      "div",
      {
        className:
          "not-found-card"
      },

      h(
        "div",
        {
          className:
            "not-found-number"
        },
        "404"
      ),

      h(
        "h1",
        null,
        "Page Not Found"
      ),

      h(
        "p",
        null,
        "The page you are looking for does not exist."
      ),

      h(
        "div",
        {
          className:
            "not-found-actions"
        },

        h(
          "button",
          {
            type: "button",
            onClick: () =>
              navigate("/public")
          },
          "Public Portal"
        ),

        h(
          "button",
          {
            type: "button",
            onClick: () =>
              navigate("/admin-login")
          },
          "Admin Login"
        )
      )
    )
  );
};

export default NotFound;