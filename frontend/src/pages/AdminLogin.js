import React, {
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext";

import {
  forgotPassword,
  resetPassword
} from "../services/api";


const h = React.createElement;


// ========================================
// ADMIN LOGIN
// ========================================

const AdminLogin = () => {

  const navigate =
    useNavigate();

  const {
    login,
    verifyLoginOTP
  } = useAuth();


  // ======================================
  // LOGIN STATES
  // ======================================

  const [
    email,
    setEmail
  ] = useState("");

  const [
    password,
    setPassword
  ] = useState("");

  const [
    otp,
    setOtp
  ] = useState("");

  const [
    showOTP,
    setShowOTP
  ] = useState(false);


  // ======================================
  // FORGOT PASSWORD STATES
  // ======================================

  const [
    showForgotPassword,
    setShowForgotPassword
  ] = useState(false);

  const [
    forgotOTP,
    setForgotOTP
  ] = useState("");

  const [
    newPassword,
    setNewPassword
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword
  ] = useState("");

  const [
    resetStep,
    setResetStep
  ] = useState(1);


  // ======================================
  // COMMON STATES
  // ======================================

  const [
    error,
    setError
  ] = useState("");

  const [
    success,
    setSuccess
  ] = useState("");

  const [
    loading,
    setLoading
  ] = useState(false);


  // ======================================
  // LOGIN
  // ======================================

  const submit = async (
    event
  ) => {

    event.preventDefault();

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
      setSuccess("");


      console.log(
        "LOGIN BUTTON CLICKED"
      );

      console.log(
        "ADMIN LOGIN START:",
        email
      );


      const response =
        await login(
          email.trim(),
          password
        );


      console.log(
        "LOGIN RESULT:",
        response
      );


      // ==================================
      // OTP REQUIRED
      // ==================================

      if (
        response?.requires2FA === true
      ) {

        console.log(
          "OTP VERIFICATION REQUIRED"
        );


        setShowOTP(true);

        setOtp("");

        setError("");

        setSuccess("");

        return;
      }


      // ==================================
      // NORMAL LOGIN
      // ==================================

      const loggedInUser =
        response?.user ||
        response?.data?.user ||
        null;


      if (!loggedInUser) {

        throw new Error(
          "Login successful, but user information was not received."
        );
      }


      const role =
        String(
          loggedInUser.role || ""
        ).toLowerCase();


      if (
        role !== "admin" &&
        role !== "officer"
      ) {

        throw new Error(
          "Admin or officer access required."
        );
      }


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
  // VERIFY LOGIN OTP
  // ======================================

  const submitOTP = async (
    event
  ) => {

    event.preventDefault();

    setError("");
    setSuccess("");


    if (!otp.trim()) {

      setError(
        "Please enter the verification code."
      );

      return;
    }


    if (
      otp.trim().length !== 6
    ) {

      setError(
        "Verification code must be 6 digits."
      );

      return;
    }


    try {

      setLoading(true);


      console.log(
        "OTP VERIFICATION START:",
        email
      );


      const response =
        await verifyLoginOTP(
          email.trim(),
          otp.trim()
        );


      console.log(
        "OTP VERIFICATION RESPONSE:",
        response
      );


      // ==================================
      // TOKEN CHECK
      // ==================================

      if (
        !response ||
        !response.token
      ) {

        throw new Error(
          "Invalid OTP."
        );
      }


      const loggedInUser =
        response?.user ||
        response?.data?.user ||
        null;


      if (!loggedInUser) {

        throw new Error(
          "Verification successful, but user information was not received."
        );
      }


      const role =
        String(
          loggedInUser.role || ""
        ).toLowerCase();


      if (
        role !== "admin" &&
        role !== "officer"
      ) {

        throw new Error(
          "Admin or officer access required."
        );
      }


      console.log(
        "OTP VERIFIED - ADMIN LOGIN SUCCESS"
      );


      navigate(
        "/admin/dashboard",
        {
          replace: true
        }
      );

    } catch (err) {

      console.error(
        "OTP VERIFICATION ERROR:",
        err
      );


      // ==================================
      // WRONG OTP
      // ==================================

      setError(
        "Invalid OTP. Please check your email and try again."
      );

      // OTP screen मै नै बस्ने
      setShowOTP(true);

    } finally {

      setLoading(false);
    }

  };


  // ======================================
  // BACK TO LOGIN
  // ======================================

  const backToLogin = () => {

    setShowOTP(false);

    setShowForgotPassword(false);

    setResetStep(1);

    setOtp("");

    setForgotOTP("");

    setNewPassword("");

    setConfirmPassword("");

    setError("");

    setSuccess("");
  };


  // ======================================
  // OPEN FORGOT PASSWORD
  // ======================================

  const openForgotPassword = () => {

    setShowOTP(false);

    setShowForgotPassword(true);

    setResetStep(1);

    setForgotOTP("");

    setNewPassword("");

    setConfirmPassword("");

    setError("");

    setSuccess("");
  };


  // ======================================
  // SEND RESET OTP
  // ======================================

  const submitForgotPassword = async (
    event
  ) => {

    event.preventDefault();

    setError("");
    setSuccess("");


    if (!email.trim()) {

      setError(
        "Please enter your email address."
      );

      return;
    }


    try {

      setLoading(true);


      console.log(
        "FORGOT PASSWORD:",
        email
      );


      const response =
        await forgotPassword(
          email.trim()
        );


      console.log(
        "FORGOT PASSWORD RESPONSE:",
        response
      );


      setResetStep(2);

      setSuccess(
        "Password reset OTP has been sent to your email."
      );

    } catch (err) {

      console.error(
        "FORGOT PASSWORD ERROR:",
        err
      );


      setError(
        err?.message ||
        "Unable to send reset OTP. Please check your email."
      );

    } finally {

      setLoading(false);
    }

  };


  // ======================================
  // RESET PASSWORD
  // ======================================

  const submitResetPassword = async (
    event
  ) => {

    event.preventDefault();

    setError("");
    setSuccess("");


    if (
      forgotOTP.trim().length !== 6
    ) {

      setError(
        "Please enter the 6-digit OTP."
      );

      return;
    }


    if (!newPassword) {

      setError(
        "Please enter your new password."
      );

      return;
    }


    if (
      newPassword.length < 6
    ) {

      setError(
        "New password must be at least 6 characters."
      );

      return;
    }


    if (
      newPassword !== confirmPassword
    ) {

      setError(
        "Passwords do not match."
      );

      return;
    }


    try {

      setLoading(true);


      console.log(
        "RESET PASSWORD START:",
        email
      );


      await resetPassword(
        email.trim(),
        forgotOTP.trim(),
        newPassword
      );


      console.log(
        "PASSWORD RESET SUCCESS"
      );


      setSuccess(
        "Password reset successfully. Please login with your new password."
      );


      setTimeout(() => {

        setShowForgotPassword(false);

        setShowOTP(false);

        setResetStep(1);

        setForgotOTP("");

        setNewPassword("");

        setConfirmPassword("");

        setPassword("");

        setError("");

      }, 1500);

    } catch (err) {

      console.error(
        "RESET PASSWORD ERROR:",
        err
      );


      setError(
        err?.message ||
        "Invalid OTP or unable to reset password."
      );

    } finally {

      setLoading(false);
    }

  };


  // ======================================
  // GRAY PUBLIC PORTAL BUTTON STYLE
  // ======================================

  const publicButtonStyle = {

    width:
      "100%",

    marginTop:
      "14px",

    padding:
      "11px 16px",

    borderRadius:
      "8px",

    border:
      "1px solid #cbd5e1",

    background:
      "#f1f5f9",

    color:
      "#475569",

    cursor:
      loading
        ? "not-allowed"
        : "pointer",

    fontSize:
      "14px",

    fontWeight:
      "600",

    transition:
      "all 0.2s ease"

  };


  // ======================================
  // PAGE
  // ======================================

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


      // ==================================
      // HEADER
      // ==================================

      h(
        "div",
        {
          className:
            "login-header"
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

          showForgotPassword
            ? "Forgot Password"

            : showOTP
              ? "Email Verification"

              : "Admin Portal"

        )

      ),


      // ==================================
      // ERROR
      // ==================================

      error &&

        h(
          "div",
          {
            className:
              "login-error"
          },
          error
        ),


      // ==================================
      // SUCCESS
      // ==================================

      success &&

        h(
          "div",
          {
            style: {

              marginBottom:
                "16px",

              padding:
                "12px 14px",

              borderRadius:
                "8px",

              background:
                "#f0fdf4",

              border:
                "1px solid #bbf7d0",

              color:
                "#166534",

              fontSize:
                "14px",

              lineHeight:
                "1.5"
            }
          },
          success
        ),


      // ==================================
      // FORGOT PASSWORD
      // ==================================

      showForgotPassword

        ? (

          resetStep === 1

            ? h(
                "form",
                {
                  onSubmit:
                    submitForgotPassword
                },


                h(
                  "p",
                  {
                    style: {

                      marginBottom:
                        "20px",

                      color:
                        "#64748b",

                      fontSize:
                        "14px",

                      lineHeight:
                        "1.6",

                      textAlign:
                        "center"
                    }
                  },

                  "Enter your registered email address. We will send you a 6-digit password reset OTP."
                ),


                h(
                  "div",
                  {
                    className:
                      "form-group"
                  },

                  h(
                    "label",
                    null,
                    "Email"
                  ),


                  h(
                    "input",
                    {
                      type:
                        "email",

                      value:
                        email,

                      onChange:
                        (event) =>
                          setEmail(
                            event.target.value
                          ),

                      placeholder:
                        "Enter your email",

                      autoComplete:
                        "email",

                      disabled:
                        loading,

                      required:
                        true
                    }
                  )

                ),


                h(
                  "button",
                  {
                    type:
                      "submit",

                    className:
                      "login-button",

                    disabled:
                      loading
                  },

                  loading
                    ? "Sending OTP..."
                    : "Send Reset OTP"
                )

              )


            // =================================
            // RESET PASSWORD SCREEN
            // =================================

            : h(
                "form",
                {
                  onSubmit:
                    submitResetPassword
                },


                h(
                  "p",
                  {
                    style: {

                      marginBottom:
                        "20px",

                      color:
                        "#64748b",

                      fontSize:
                        "14px",

                      lineHeight:
                        "1.6",

                      textAlign:
                        "center"
                    }
                  },

                  "Enter the OTP sent to ",

                  h(
                    "strong",
                    null,
                    email
                  )

                ),


                // =============================
                // RESET OTP
                // =============================

                h(
                  "div",
                  {
                    className:
                      "form-group"
                  },

                  h(
                    "label",
                    null,
                    "Reset OTP"
                  ),


                  h(
                    "input",
                    {
                      type:
                        "text",

                      value:
                        forgotOTP,

                      onChange:
                        (event) => {

                          const value =
                            event.target.value
                              .replace(
                                /\D/g,
                                ""
                              )
                              .slice(
                                0,
                                6
                              );

                          setForgotOTP(
                            value
                          );

                          if (error) {
                            setError("");
                          }

                        },

                      placeholder:
                        "Enter 6-digit OTP",

                      inputMode:
                        "numeric",

                      autoComplete:
                        "one-time-code",

                      maxLength:
                        6,

                      disabled:
                        loading,

                      autoFocus:
                        true,

                      required:
                        true
                    }
                  )

                ),


                // =============================
                // NEW PASSWORD
                // =============================

                h(
                  "div",
                  {
                    className:
                      "form-group"
                  },

                  h(
                    "label",
                    null,
                    "New Password"
                  ),


                  h(
                    "input",
                    {
                      type:
                        "password",

                      value:
                        newPassword,

                      onChange:
                        (event) =>
                          setNewPassword(
                            event.target.value
                          ),

                      placeholder:
                        "Enter new password",

                      autoComplete:
                        "new-password",

                      disabled:
                        loading,

                      required:
                        true
                    }
                  )

                ),


                // =============================
                // CONFIRM PASSWORD
                // =============================

                h(
                  "div",
                  {
                    className:
                      "form-group"
                  },

                  h(
                    "label",
                    null,
                    "Confirm New Password"
                  ),


                  h(
                    "input",
                    {
                      type:
                        "password",

                      value:
                        confirmPassword,

                      onChange:
                        (event) =>
                          setConfirmPassword(
                            event.target.value
                          ),

                      placeholder:
                        "Confirm new password",

                      autoComplete:
                        "new-password",

                      disabled:
                        loading,

                      required:
                        true
                    }
                  )

                ),


                // =============================
                // RESET BUTTON
                // =============================

                h(
                  "button",
                  {
                    type:
                      "submit",

                    className:
                      "login-button",

                    disabled:
                      loading ||
                      forgotOTP.length !== 6
                  },

                  loading
                    ? "Resetting Password..."
                    : "Reset Password"
                )

              )

        )


      // ==================================
      // LOGIN OTP SCREEN
      // ==================================

      : showOTP

        ? h(
            "form",
            {
              onSubmit:
                submitOTP
            },


            h(
              "div",
              {
                className:
                  "form-group"
              },


              h(
                "label",
                null,
                "Verification Code"
              ),


              h(
                "input",
                {
                  type:
                    "text",

                  value:
                    otp,

                  onChange:
                    (event) => {

                      const value =
                        event.target.value
                          .replace(
                            /\D/g,
                            ""
                          )
                          .slice(
                            0,
                            6
                          );

                      setOtp(value);

                      if (error) {
                        setError("");
                      }

                    },

                  placeholder:
                    "Enter 6-digit OTP",

                  inputMode:
                    "numeric",

                  autoComplete:
                    "one-time-code",

                  maxLength:
                    6,

                  disabled:
                    loading,

                  autoFocus:
                    true,

                  required:
                    true
                }
              )

            ),


            h(
              "p",
              {
                style: {

                  marginTop:
                    "8px",

                  fontSize:
                    "14px",

                  color:
                    "#64748b",

                  textAlign:
                    "center",

                  lineHeight:
                    "1.5"
                }
              },

              "A 6-digit verification code was sent to ",

              h(
                "strong",
                null,
                email
              )

            ),


            h(
              "button",
              {
                type:
                  "submit",

                className:
                  "login-button",

                disabled:
                  loading ||
                  otp.length !== 6
              },

              loading
                ? "Verifying..."
                : "Verify OTP"
            )

          )


        // ==================================
        // NORMAL LOGIN SCREEN
        // ==================================

        : h(
            "form",
            {
              onSubmit:
                submit
            },


            // ==============================
            // EMAIL
            // ==============================

            h(
              "div",
              {
                className:
                  "form-group"
              },


              h(
                "label",
                null,
                "Email"
              ),


              h(
                "input",
                {
                  type:
                    "email",

                  value:
                    email,

                  onChange:
                    (event) =>
                      setEmail(
                        event.target.value
                      ),

                  placeholder:
                    "Enter admin email",

                  autoComplete:
                    "email",

                  disabled:
                    loading,

                  required:
                    true
                }
              )

            ),


            // ==============================
            // PASSWORD
            // ==============================

            h(
              "div",
              {
                className:
                  "form-group"
              },


              h(
                "label",
                null,
                "Password"
              ),


              h(
                "input",
                {
                  type:
                    "password",

                  value:
                    password,

                  onChange:
                    (event) =>
                      setPassword(
                        event.target.value
                      ),

                  placeholder:
                    "Enter password",

                  autoComplete:
                    "current-password",

                  disabled:
                    loading,

                  required:
                    true
                }
              )

            ),


            // ==============================
            // FORGOT PASSWORD
            // ==============================

            h(
              "div",
              {
                style: {

                  textAlign:
                    "right",

                  marginBottom:
                    "16px"
                }
              },


              h(
                "button",
                {
                  type:
                    "button",

                  onClick:
                    openForgotPassword,

                  disabled:
                    loading,

                  style: {

                    border:
                      "none",

                    background:
                      "transparent",

                    color:
                      "#2563eb",

                    cursor:
                      loading
                        ? "not-allowed"
                        : "pointer",

                    fontSize:
                      "14px",

                    fontWeight:
                      "500",

                    padding:
                      "4px"
                  }
                },

                "Forgot Password?"
              )

            ),


            // ==============================
            // LOGIN BUTTON
            // ==============================

            h(
              "button",
              {
                type:
                  "submit",

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


      // ==================================
      // ONE PUBLIC PORTAL BUTTON
      // ==================================

      h(
        "button",
        {
          type:
            "button",

          className:
            "login-back-button",

          onClick:
            () =>
              navigate("/public"),

          disabled:
            loading,

          style:
            publicButtonStyle,

          onMouseEnter:
            (event) => {

              if (!loading) {

                event.currentTarget.style.background =
                  "#e2e8f0";

                event.currentTarget.style.color =
                  "#334155";

              }

            },

          onMouseLeave:
            (event) => {

              event.currentTarget.style.background =
                "#f1f5f9";

              event.currentTarget.style.color =
                "#475569";

            }

        },

        "← Back to Public Portal"

      )

    )

  );

};


export default AdminLogin;