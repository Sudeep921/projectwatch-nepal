import React, {
  useState
} from "react";

import {
  createComplaint
} from "../services/api";

const PublicComplaint = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    project: "",
    subject: "",
    message: ""
  });

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]:
        event.target.value
    });
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      await createComplaint({
        ...form,
        source: "Public Portal"
      });

      setSuccess(
        "Your complaint has been submitted successfully."
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        project: "",
        subject: "",
        message: ""
      });
    } catch (err) {
      setError(
        err.message ||
          "Unable to submit complaint."
      );
    } finally {
      setLoading(false);
    }
  };

  return React.createElement(
    "div",
    {
      className:
        "public-complaint-page"
    },

    React.createElement(
      "div",
      {
        className:
          "public-complaint-header"
      },

      React.createElement(
        "a",
        {
          href: "/"
        },
        "← Back to Public Portal"
      ),

      React.createElement(
        "span",
        {
          className:
            "public-section-label"
        },
        "CITIZEN FEEDBACK"
      ),

      React.createElement(
        "h1",
        null,
        "Submit a Complaint"
      ),

      React.createElement(
        "p",
        null,
        "Report a concern related to a public development project."
      )
    ),

    React.createElement(
      "form",
      {
        className:
          "public-complaint-form",
        onSubmit: handleSubmit
      },

      success
        ? React.createElement(
            "div",
            {
              className:
                "public-form-success"
            },
            success
          )
        : null,

      error
        ? React.createElement(
            "div",
            {
              className:
                "public-form-error"
            },
            error
          )
        : null,

      React.createElement(
        "div",
        {
          className:
            "public-form-grid"
        },

        React.createElement(
          "input",
          {
            name: "name",
            value: form.name,
            onChange: handleChange,
            placeholder: "Your Name",
            required: true
          }
        ),

        React.createElement(
          "input",
          {
            name: "email",
            type: "email",
            value: form.email,
            onChange: handleChange,
            placeholder: "Email Address",
            required: true
          }
        ),

        React.createElement(
          "input",
          {
            name: "phone",
            value: form.phone,
            onChange: handleChange,
            placeholder: "Phone Number"
          }
        ),

        React.createElement(
          "input",
          {
            name: "project",
            value: form.project,
            onChange: handleChange,
            placeholder:
              "Project Name / Project Code"
          }
        )
      ),

      React.createElement(
        "input",
        {
          name: "subject",
          value: form.subject,
          onChange: handleChange,
          placeholder: "Complaint Subject",
          required: true
        }
      ),

      React.createElement(
        "textarea",
        {
          name: "message",
          value: form.message,
          onChange: handleChange,
          placeholder:
            "Describe your complaint or concern...",
          rows: 7,
          required: true
        }
      ),

      React.createElement(
        "button",
        {
          type: "submit",
          disabled: loading
        },
        loading
          ? "Submitting..."
          : "Submit Complaint"
      )
    )
  );
};

export default PublicComplaint;