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


// ========================================
// ADMIN LOGIN
// ========================================

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


  // ======================================
  // SUBMIT LOGIN
  // ======================================

  const submit = async (
    event
  ) => {

    event.preventDefault();


    // ------------------------------------
    // BASIC VALIDATION
    // ------------------------------------

    if (!email.trim()) {

      setError(
        "Please enter your email."
      );

      return;

    }


    if (!password) {

      setError(
        "Please enter your password."
      );

      return;

    }


    try {

      setLoading(true);

      setError("");

      console.log("LOGIN BUTTON CLICKED");
      console.log(
        "ADMIN LOGIN START:",
        email
      );


      // ------------------------------------
      // LOGIN
      // IMPORTANT:
      // login(email, password)
      // ------------------------------------

      const response =
        await login(
          email.trim(),
          password
        );


      console.log(
        "LOGIN RESULT:",
        response
      );


      // ------------------------------------
      // GET USER
      // ------------------------------------

      const loggedInUser =
        response?.user ||
        response?.data?.user ||
        null;


      console.log(
        "LOGGED IN USER:",
        loggedInUser
      );


      // ------------------------------------
      // CHECK USER
      // ------------------------------------

      if (!loggedInUser) {

        throw new Error(
          "Login successful, but user information was not received."
        );

      }


      // ------------------------------------
      // CHECK ROLE
      // ------------------------------------

      const role =
        String(
          loggedInUser.role || ""
        ).toLowerCase();


      console.log(
        "USER ROLE:",
        role
      );


      if (
        role !== "admin" &&
        role !== "officer"
      ) {

        throw new Error(
          "Admin or officer access required."
        );

      }


      // ------------------------------------
      // ADMIN LOGIN SUCCESS
      // ------------------------------------

      console.log(
        "ADMIN LOGIN SUCCESS"
      );


      /*
        IMPORTANT:

        App.js has:

        /admin
        /admin/dashboard

        So we must navigate to:

        /admin/dashboard
      */

      navigate(
        "/admin/dashboard",
        {
          replace: true
        }
      );

    } catch (err) {

      console.error(
        "ADMIN LOGIN ERROR:",
        err
      );


      setError(
        err?.message ||
        "Login failed. Please check your email and password."
      );

    } finally {

      setLoading(false);

    }

  };


  // ======================================
  // PAGE
  // ======================================

  return h(
    "div",
    {
      className: "login-page"
    },


    // ====================================
    // LOGIN CARD
    // ====================================

    h(
      "div",
      {
        className: "login-card"
      },


      // ----------------------------------
      // LOGO / TITLE
      // ----------------------------------

      h(
        "div",
        {
          className: "login-header"
        },

        h(
          "div",
          {
            className: "login-logo"
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
          "Admin Portal"
        )

      ),


      // ----------------------------------
      // ERROR
      // ----------------------------------

      error &&
        h(
          "div",
          {
            className: "login-error"
          },
          error
        ),


      // ----------------------------------
      // FORM
      // ----------------------------------

      h(
        "form",
        {
          onSubmit: submit
          
          
        },


        // -------------------------------
        // EMAIL
        // -------------------------------

        h(
          "div",
          {
            className: "form-group"
          },

          h(
            "label",
            null,
            "Email"
          ),

          h(
            "input",
            {
              type: "text",
              value: email,
              onChange: (
                event
              ) =>
                setEmail(
                  event.target.value
                ),
              placeholder:
                "Enter admin email",
              autoComplete:
                "email",
              disabled:
                loading,
              required: true
            }
          )

        ),


        // -------------------------------
        // PASSWORD
        // -------------------------------

        h(
          "div",
          {
            className: "form-group"
          },

          h(
            "label",
            null,
            "Password"
          ),

          h(
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
                "Enter password",
              autoComplete:
                "current-password",
              disabled:
                loading,
              required: true
            }
          )

        ),


        // -------------------------------
        // LOGIN BUTTON
        // -------------------------------

        h(
          "button",
          {
            type: "submit",
            className:
              "login-button",
            disabled:
              loading
          },

          loading
            ? "Logging in..."
            : "Login to Admin Portal"

        )

      ),


      // ----------------------------------
      // BACK TO PUBLIC PORTAL
      // ----------------------------------

      h(
        "button",
        {
          type: "button",
          className:
            "login-back-button",
          onClick: () =>
            navigate("/public"),
          disabled:
            loading
        },
       
      )

    )

  );

};


export default AdminLogin;