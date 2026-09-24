import React, {
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";

const h = React.createElement;

const AdminLogin = () => {
  const navigate =
    useNavigate();

  const {
    login
  } = useAuth();

  const [
    email,
    setEmail
  ] = useState("");

  const [
    password,
    setPassword
  ] = useState("");

  const [
    error,
    setError
  ] = useState("");

  const [
    loading,
    setLoading
  ] = useState(false);

  const submit =
    async (e) => {
      e.preventDefault();

      try {
        setLoading(true);
        setError("");

        const data =
          await login(
            email,
            password
          );

        if (
          data.user?.role !==
            "admin" &&
          data.user?.role !==
            "officer"
        ) {
          throw new Error(
            "Admin or officer access required."
          );
        }

        navigate(
          "/admin/dashboard"
        );
      } catch (err) {
        setError(
          err.message ||
            "Login failed"
        );
      } finally {
        setLoading(false);
      }
    };

  return h(
    "div",
    {
      className:
        "login-page"
    },

    h(
      "div",
      {
        className:
          "login-card"
      },

      h(
        "div",
        {
          className:
            "login-logo"
        },
        "PW"
      ),

      h(
        "h1",
        null,
        "ProjectWatch Nepal"
      ),

      h(
        "p",
        null,
        "Administrator Login"
      ),

      error
        ? h(
            "div",
            {
              className:
                "login-error"
            },
            error
          )
        : null,

      h(
        "form",
        {
          onSubmit: submit
        },

        h(
          "input",
          {
            type: "email",
            placeholder:
              "Email",
            value: email,
            onChange: (e) =>
              setEmail(
                e.target.value
              ),
            required: true
          }
        ),

        h(
          "input",
          {
            type: "password",
            placeholder:
              "Password",
            value: password,
            onChange: (e) =>
              setPassword(
                e.target.value
              ),
            required: true
          }
        ),

        h(
          "button",
          {
            className:
              "login-button",
            disabled: loading
          },
          loading
            ? "Signing in..."
            : "Sign In"
        )
      )
    )
  );
};

export default AdminLogin;