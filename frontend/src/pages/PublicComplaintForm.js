import React, {
  useEffect,
  useState
} from "react";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  getPublicProjects,
  submitPublicComplaint
} from "../services/api";

const h = React.createElement;

const CATEGORIES = [
  "Delay",
  "Quality",
  "Budget",
  "Contractor",
  "Safety",
  "Other"
];

const PublicComplaintForm = () => {
  const navigate =
    useNavigate();

  const routerLocation =
    useLocation();

  const preset =
    routerLocation.state || {};

  const [
    projects,
    setProjects
  ] = useState([]);

  const [
    submitted,
    setSubmitted
  ] = useState(false);

  const [
    submitting,
    setSubmitting
  ] = useState(false);

  const [
    error,
    setError
  ] = useState("");

  const [
    form,
    setForm
  ] = useState({
    project:
      preset.projectId || "",
    citizenName: "",
    citizenPhone: "",
    citizenEmail: "",
    title: "",
    category: "Other",
    location: "",
    description: ""
  });

  useEffect(() => {
    getPublicProjects()
      .then((data) =>
        setProjects(
          data.projects || []
        )
      )
      .catch(() =>
        setProjects([])
      );
  }, []);

  const update =
    (key) =>
    (event) => {
      setForm((previous) => ({
        ...previous,
        [key]:
          event.target.value
      }));
    };

  const submit =
    async (event) => {
      event.preventDefault();

      if (
        !form.citizenName.trim() ||
        !form.citizenPhone.trim() ||
        !form.title.trim() ||
        !form.description.trim()
      ) {
        setError(
          "Please fill in your name, phone, subject and description."
        );
        return;
      }

      try {
        setSubmitting(true);
        setError("");

        await submitPublicComplaint(
          form
        );

        setSubmitted(true);
      } catch (err) {
        setError(
          err.message ||
            "Unable to submit your complaint. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
    };

  if (submitted) {
    return h(
      "div",
      {
        className:
          "public-portal"
      },

      h(
        "header",
        {
          className:
            "public-header"
        },

        h(
          "div",
          {
            className:
              "public-header-brand",
            style: {
              cursor: "pointer"
            },
            onClick: () =>
              navigate("/")
          },

          h(
            "div",
            {
              className:
                "public-header-logo"
            },
            "PW"
          ),

          h(
            "strong",
            null,
            "ProjectWatch Nepal"
          )
        )
      ),

      h(
        "div",
        {
          className:
            "public-confirm-wrap"
        },

        h(
          "div",
          {
            className:
              "public-confirm-icon"
          },
          "✓"
        ),

        h(
          "h2",
          null,
          "Complaint Submitted"
        ),

        h(
          "p",
          null,
          "Thank you. Your report has been recorded and will be reviewed by ProjectWatch officers."
        ),

        h(
          "button",
          {
            className:
              "primary-button",
            onClick: () =>
              navigate("/")
          },
          "← Back to Home"
        )
      )
    );
  }

  return h(
    "div",
    {
      className:
        "public-portal"
    },

    h(
      "header",
      {
        className:
          "public-header"
      },

      h(
        "div",
        {
          className:
            "public-header-brand",
          style: {
            cursor: "pointer"
          },
          onClick: () =>
            navigate("/")
        },

        h(
          "div",
          {
            className:
              "public-header-logo"
          },
          "PW"
        ),

        h(
          "strong",
          null,
          "ProjectWatch Nepal"
        )
      ),

      h(
        "a",
        {
          href: "/admin-login"
        },
        "Admin Login"
      )
    ),

    h(
      "div",
      {
        className:
          "public-form-wrap"
      },

      h(
        "button",
        {
          className:
            "public-back-button",
          onClick: () =>
            navigate("/")
        },
        "← Back"
      ),

      h(
        "span",
        {
          className: "eyebrow"
        },
        "CITIZEN REPORT"
      ),

      h(
        "h1",
        null,
        "Report a Project Issue"
      ),

      h(
        "p",
        {
          className:
            "public-form-subtitle"
        },
        preset.projectName
          ? `Reporting about: ${preset.projectName}`
          : "Tell us about a delay, quality concern, or other issue with a government project. No login needed."
      ),

      error
        ? h(
            "div",
            {
              className:
                "form-error"
            },
            "⚠ ",
            error
          )
        : null,

      h(
        "form",
        {
          className:
            "public-complaint-form",
          onSubmit: submit
        },

        h(
          "div",
          {
            className:
              "form-grid"
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
              "Your Full Name *"
            ),

            h(
              "input",
              {
                value:
                  form.citizenName,
                onChange:
                  update(
                    "citizenName"
                  ),
                placeholder:
                  "e.g. Sita Sharma",
                required: true
              }
            )
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
              "Phone Number *"
            ),

            h(
              "input",
              {
                value:
                  form.citizenPhone,
                onChange:
                  update(
                    "citizenPhone"
                  ),
                placeholder:
                  "98XXXXXXXX",
                required: true
              }
            )
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
              "Email (optional)"
            ),

            h(
              "input",
              {
                type: "email",
                value:
                  form.citizenEmail,
                onChange:
                  update(
                    "citizenEmail"
                  ),
                placeholder:
                  "you@example.com"
              }
            )
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
              "Related Project"
            ),

            h(
              "select",
              {
                value:
                  form.project,
                onChange:
                  update(
                    "project"
                  )
              },

              h(
                "option",
                { value: "" },
                "Not sure / general complaint"
              ),

              projects.map(
                (p) =>
                  h(
                    "option",
                    {
                      key: p._id,
                      value: p._id
                    },
                    p.name ||
                      p.projectName ||
                      p.projectCode
                  )
              )
            )
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
              "Category"
            ),

            h(
              "select",
              {
                value:
                  form.category,
                onChange:
                  update(
                    "category"
                  )
              },

              CATEGORIES.map(
                (x) =>
                  h(
                    "option",
                    {
                      key: x,
                      value: x
                    },
                    x
                  )
              )
            )
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
              "Location / Site"
            ),

            h(
              "input",
              {
                value:
                  form.location,
                onChange:
                  update(
                    "location"
                  ),
                placeholder:
                  "Ward, tole, or landmark"
              }
            )
          ),

          h(
            "div",
            {
              className:
                "form-group full"
            },

            h(
              "label",
              null,
              "Subject *"
            ),

            h(
              "input",
              {
                value:
                  form.title,
                onChange:
                  update(
                    "title"
                  ),
                placeholder:
                  "Brief summary of the issue",
                required: true
              }
            )
          ),

          h(
            "div",
            {
              className:
                "form-group full"
            },

            h(
              "label",
              null,
              "Description *"
            ),

            h(
              "textarea",
              {
                rows: 6,
                value:
                  form.description,
                onChange:
                  update(
                    "description"
                  ),
                placeholder:
                  "Describe what you observed in detail...",
                required: true
              }
            )
          )
        ),

        h(
          "div",
          {
            className:
              "public-form-actions"
          },

          h(
            "button",
            {
              type: "button",
              className:
                "secondary-button",
              onClick: () =>
                navigate("/")
            },
            "Cancel"
          ),

          h(
            "button",
            {
              type: "submit",
              className:
                "primary-button",
              disabled:
                submitting
            },
            submitting
              ? "Submitting..."
              : "Submit Complaint"
          )
        )
      )
    )
  );
};

export default PublicComplaintForm;