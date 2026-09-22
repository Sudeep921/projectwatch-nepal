import React, {
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";

const AdminLogin = () => {
  const navigate = useNavigate();

  const {
    login
  } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response =
        await login(
          email.trim(),
          password
        );

      if (!response) {
        throw new Error(
          "No response received from server."
        );
      }

      if (!response.token) {
        throw new Error(
          response.message ||
            "Login token was not received."
        );
      }

      const user =
        response.user;

      if (
        user &&
        user.role &&
        user.role !== "admin"
      ) {
        throw new Error(
          "This account does not have administrator access."
        );
      }

      navigate(
        "/dashboard",
        {
          replace: true
        }
      );
    } catch (err) {
      console.error(
        "Admin login error:",
        err
      );

      setError(
        err.message ||
          "Invalid administrator credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return React.createElement(
    "div",
    {
      className:
        "admin-login-page"
    },

    React.createElement(
      "div",
      {
        className:
          "admin-login-card"
      },

      React.createElement(
        "div",
        {
          className:
            "admin-login-brand"
        },

        React.createElement(
          "div",
          {
            className:
              "brand-logo"
          },
          "PW"
        ),

        React.createElement(
          "div",
          {
            className:
              "admin-brand-text"
          },

          React.createElement(
            "strong",
            null,
            "ProjectWatch Nepal"
          ),

          React.createElement(
            "span",
            null,
            "Government Project Monitoring"
          )
        )
      ),

      React.createElement(
        "div",
        {
          className:
            "admin-login-heading"
        },

        React.createElement(
          "span",
          {
            className:
              "login-eyebrow"
          },
          "SECURE ACCESS"
        ),

        React.createElement(
          "h1",
          null,
          "Administrator Login"
        ),

        React.createElement(
          "p",
          null,
          "Sign in to access the ProjectWatch government dashboard."
        )
      ),

      error
        ? React.createElement(
            "div",
            {
              className:
                "form-error"
            },

            React.createElement(
              "span",
              null,
              "⚠"
            ),

            React.createElement(
              "span",
              null,
              error
            )
          )
        : null,

      React.createElement(
        "form",
        {
          onSubmit:
            handleSubmit
        },

        React.createElement(
          "div",
          {
            className:
              "form-group"
          },

          React.createElement(
            "label",
            null,
            "Administrator Email"
          ),

          React.createElement(
            "input",
            {
              type: "email",
              value: email,
              onChange: (
                event
              ) =>
                setEmail(
                  event.target.value
                ),
              placeholder:
                "admin@example.com",
              autoComplete:
                "email",
              required: true,
              disabled: loading
            }
          )
        ),

        React.createElement(
          "div",
          {
            className:
              "form-group"
          },

          React.createElement(
            "label",
            null,
            "Password"
          ),

          React.createElement(
            "input",
            {
              type: "password",
              value: password,
              onChange: (
                event
              ) =>
                setPassword(
                  event.target.value
                ),
              placeholder:
                "Enter your password",
              autoComplete:
                "current-password",
              required: true,
              disabled: loading
            }
          )
        ),

        React.createElement(
          "button",
          {
            type: "submit",
            className:
              "primary-button admin-login-button",
            disabled: loading
          },

          loading
            ? React.createElement(
                React.Fragment,
                null,
                React.createElement(
                  "span",
                  {
                    className:
                      "login-spinner"
                  }
                ),
                "Signing in..."
              )
            : "Sign In Securely"
        )
      ),

      React.createElement(
        "div",
        {
          className:
            "admin-login-security"
        },

        React.createElement(
          "span",
          null,
          "🔒"
        ),

        React.createElement(
          "span",
          null,
          "Protected by secure JWT authentication"
        )
      ),

      React.createElement(
        "button",
        {
          type: "button",
          className:
            "back-public-button",
          onClick: () =>
            navigate("/public"),
          disabled: loading
        },
        "← Back to Public Portal"
      )
    )
  );
};

export default AdminLogin;