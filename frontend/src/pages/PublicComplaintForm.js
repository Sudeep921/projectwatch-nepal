import React, {
  useState
} from "react";

import {
  submitPublicComplaint
} from "../services/api";

const h = React.createElement;

const PublicComplaint = () => {
  const [form, setForm] =
    useState({
      name: "",
      phone: "",
      email: "",
      project: "",
      location: "",
      category: "",
      priority: "normal",
      description: ""
    });

  const [file, setFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(null);

  const [error, setError] =
    useState("");

  const update = (
    field,
    value
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess(null);

    if (
      !form.name.trim()
    ) {
      setError(
        "Please enter your name."
      );
      return;
    }

    if (
      !form.phone.trim()
    ) {
      setError(
        "Please enter your phone number."
      );
      return;
    }

    if (
      !form.project.trim()
    ) {
      setError(
        "Please enter the project name or code."
      );
      return;
    }

    if (
      !form.description.trim()
    ) {
      setError(
        "Please describe your complaint."
      );
      return;
    }

    try {
      setLoading(true);

      // ======================================
      // CATEGORY MAPPING
      // Must match Complaint.js enum
      // ======================================

      let backendCategory =
        "Other";

      if (
        form.category ===
        "project-delay"
      ) {
        backendCategory =
          "Delay";
      } else if (
        form.category ===
        "quality"
      ) {
        backendCategory =
          "Quality";
      } else if (
        form.category ===
        "corruption"
      ) {
        backendCategory =
          "Other";
      } else if (
        form.category ===
        "environment"
      ) {
        backendCategory =
          "Other";
      } else if (
        form.category ===
        "other"
      ) {
        backendCategory =
          "Other";
      }

      // ======================================
      // PRIORITY MAPPING
      // ======================================

      let backendPriority =
        "Medium";

      if (
        form.priority ===
        "high"
      ) {
        backendPriority =
          "High";
      } else if (
        form.priority ===
        "critical"
      ) {
        backendPriority =
          "Critical";
      } else {
        backendPriority =
          "Medium";
      }

      // ======================================
      // SEND COMPLAINT
      //
      // Send project code directly.
      // Backend will find the Project by
      // projectCode and convert it to _id.
      // ======================================

      const response =
        await submitPublicComplaint({
          citizenName:
            form.name.trim(),

          citizenPhone:
            form.phone.trim(),

          citizenEmail:
            form.email.trim(),

          project:
            form.project.trim(),

          title:
            form.description
              .trim()
              .substring(0, 100),

          description:
            form.description.trim(),

          category:
            backendCategory,

          location:
            form.location.trim(),

          priority:
            backendPriority
        });

      // ======================================
      // SUCCESS
      // ======================================

      setSuccess(
        response?.complaintId ||
        response?.complaint
          ?.complaintId ||
        response?.complaint
          ?._id ||
        "Complaint submitted successfully."
      );

      // ======================================
      // RESET
      // ======================================

      setForm({
        name: "",
        phone: "",
        email: "",
        project: "",
        location: "",
        category: "",
        priority: "normal",
        description: ""
      });

      setFile(null);

    } catch (err) {
      console.error(
        "Complaint submit error:",
        err
      );

      setError(
        err.message ||
        "Failed to submit complaint."
      );

    } finally {
      setLoading(false);
    }
  };

  return h(
    "div",
    {
      className:
        "public-complaint-page"
    },

    h(
      "div",
      {
        className:
          "public-complaint-card"
      },

      h(
        "div",
        {
          className:
            "public-complaint-heading"
        },

        h(
          "span",
          null,
          "📢"
        ),

        h(
          "h1",
          null,
          "Report a Public Issue"
        ),

        h(
          "p",
          null,
          "Submit a complaint or report about a government project."
        )
      ),

      error
        ? h(
            "div",
            {
              className:
                "public-complaint-error"
            },
            error
          )
        : null,

      success
        ? h(
            "div",
            {
              className:
                "public-complaint-success"
            },

            h(
              "strong",
              null,
              "Complaint submitted successfully!"
            ),

            h(
              "p",
              null,
              `Your reference: ${success}`
            )
          )
        : null,

      h(
        "form",
        {
          onSubmit: submit
        },

        h(
          "div",
          {
            className:
              "public-complaint-grid"
          },

          h(
            "input",
            {
              value: form.name,

              onChange: (e) =>
                update(
                  "name",
                  e.target.value
                ),

              placeholder:
                "Your name (optional)"
            }
          ),

          h(
            "input",
            {
              value: form.phone,

              onChange: (e) =>
                update(
                  "phone",
                  e.target.value
                ),

              placeholder:
                "Phone (optional)"
            }
          ),

          h(
            "input",
            {
              type: "email",

              value: form.email,

              onChange: (e) =>
                update(
                  "email",
                  e.target.value
                ),

              placeholder:
                "Email (optional)"
            }
          ),

          h(
            "input",
            {
              value:
                form.project,

              onChange: (e) =>
                update(
                  "project",
                  e.target.value
                ),

              placeholder:
                "Project name or code"
            }
          ),

          h(
            "input",
            {
              value:
                form.location,

              onChange: (e) =>
                update(
                  "location",
                  e.target.value
                ),

              placeholder:
                "Issue location"
            }
          ),

          h(
            "select",
            {
              value:
                form.category,

              onChange: (e) =>
                update(
                  "category",
                  e.target.value
                )
            },

            h(
              "option",
              { value: "" },
              "Issue category"
            ),

            h(
              "option",
              {
                value:
                  "project-delay"
              },
              "Project Delay"
            ),

            h(
              "option",
              {
                value:
                  "quality"
              },
              "Construction Quality"
            ),

            h(
              "option",
              {
                value:
                  "corruption"
              },
              "Irregularity"
            ),

            h(
              "option",
              {
                value:
                  "environment"
              },
              "Environment"
            ),

            h(
              "option",
              {
                value:
                  "other"
              },
              "Other"
            )
          ),

          h(
            "select",
            {
              value:
                form.priority,

              onChange: (e) =>
                update(
                  "priority",
                  e.target.value
                )
            },

            h(
              "option",
              {
                value:
                  "normal"
              },
              "Normal Priority"
            ),

            h(
              "option",
              {
                value:
                  "high"
              },
              "High Priority"
            ),

            h(
              "option",
              {
                value:
                  "critical"
              },
              "Critical"
            )
          )
        ),

        h(
          "textarea",
          {
            value:
              form.description,

            onChange: (e) =>
              update(
                "description",
                e.target.value
              ),

            placeholder:
              "Describe the issue in detail...",

            rows: 7,

            required: true
          }
        ),

        h(
          "div",
          {
            className:
              "public-complaint-file"
          },

          h(
            "label",
            null,
            "Attach photo/evidence (optional)"
          ),

          h(
            "input",
            {
              type: "file",

              accept:
                "image/*,.pdf,.doc,.docx",

              onChange: (e) =>
                setFile(
                  e.target.files?.[0] ||
                  null
                )
            }
          )
        ),

        h(
          "button",
          {
            type: "submit",

            disabled:
              loading,

            className:
              "public-complaint-submit"
          },

          loading
            ? "Submitting..."
            : "Submit Complaint"
        )
      )
    )
  );
};

export default PublicComplaint;