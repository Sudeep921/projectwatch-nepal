import React, {
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  createProject,
  generateProjectCode
} from "../services/api";

const h = React.createElement;


// ========================================
// ADD PROJECT PAGE
// ========================================

const AddProjectPage = () => {
  const navigate =
    useNavigate();

  const [
    saving,
    setSaving
  ] = useState(false);

  const [
    codeLoading,
    setCodeLoading
  ] = useState(false);

  const [
    error,
    setError
  ] = useState("");


  // ========================================
  // FORM STATE
  // ========================================

  const [
    form,
    setForm
  ] = useState({
    name: "",
    projectCode: "",
    province: "Bagmati",
    district: "",
    municipality: "",
    budget: "",
    progress: 0,
    status: "Active",
    riskLevel: "Low",
    contractor: "",
    description: "",
    location: "",
    latitude: "",
    longitude: "",
    isPublic: true
  });


  // ========================================
  // UPDATE FORM
  // ========================================

  const update =
    (key) =>
    (event) => {
      setForm({
        ...form,
        [key]:
          event.target.value
      });
    };


  // ========================================
  // GENERATE PROJECT CODE
  // ========================================

  const generateCode =
    async () => {
      try {
        setCodeLoading(true);
        setError("");

        const result =
          await generateProjectCode();

        setForm({
          ...form,
          projectCode:
            result.code || ""
        });
      } catch (err) {
        setError(
          err.message ||
            "Failed to generate project code"
        );
      } finally {
        setCodeLoading(false);
      }
    };


  // ========================================
  // INPUT COMPONENT
  // ========================================

  const input = (
    label,
    key,
    type = "text"
  ) =>
    h(
      "label",
      {
        className:
          "form-field"
      },

      h(
        "span",
        null,
        label
      ),

      h(
        "input",
        {
          type,

          value:
            form[key],

          onChange:
            update(key),

          required:
            key === "name",

          min:
            key === "progress"
              ? 0
              : undefined,

          max:
            key === "progress"
              ? 100
              : undefined
        }
      )
    );


  // ========================================
  // SUBMIT PROJECT
  // ========================================

  const submit =
    async (event) => {
      event.preventDefault();

      try {
        setSaving(true);
        setError("");

        const projectData = {
          ...form,

          // Backend requires projectName
          projectName:
            form.name,

          budget:
            Number(
              form.budget || 0
            ),

          progress:
            Number(
              form.progress || 0
            ),

          latitude:
            form.latitude !== ""
              ? Number(
                  form.latitude
                )
              : undefined,

          longitude:
            form.longitude !== ""
              ? Number(
                  form.longitude
                )
              : undefined
        };

        await createProject(
          projectData
        );

        window.alert(
          "Project created successfully"
        );

        navigate(
          "/admin/projects"
        );

      } catch (err) {
        setError(
          err.message ||
            "Failed to create project"
        );

      } finally {
        setSaving(false);
      }
    };


  // ========================================
  // RENDER
  // ========================================

  return h(
    "div",
    {
      className:
        "page add-project-page"
    },


    // ======================================
    // PAGE HEADING
    // ======================================

    h(
      "div",
      {
        className:
          "page-heading"
      },

      h(
        "div",
        null,

        h(
          "button",
          {
            type: "button",

            className:
              "back-button",

            onClick: () =>
              navigate(
                "/admin/projects"
              )
          },

          "← Back"
        ),

        h(
          "span",
          {
            className:
              "eyebrow"
          },

          "PROJECT REGISTRY"
        ),

        h(
          "h1",
          null,

          "Add New Government Project"
        ),

        h(
          "p",
          null,

          "Register a new public development project."
        )
      )
    ),


    // ======================================
    // ERROR
    // ======================================

    error
      ? h(
          "div",
          {
            className:
              "form-error"
          },

          error
        )
      : null,


    // ======================================
    // FORM
    // ======================================

    h(
      "form",
      {
        className:
          "project-form",

        onSubmit:
          submit
      },


      // ====================================
      // PROJECT INFORMATION
      // ====================================

      h(
        "div",
        {
          className:
            "form-section"
        },

        h(
          "h2",
          null,

          "Project Information"
        ),

        h(
          "div",
          {
            className:
              "form-grid"
          },

          input(
            "Project Name",
            "name"
          ),


          // PROJECT CODE + GENERATE BUTTON

          h(
            "div",
            {
              className:
                "form-field"
            },

            h(
              "span",
              null,

              "Project Code"
            ),

            h(
              "div",
              {
                style: {
                  display: "flex",
                  gap: "8px",
                  alignItems:
                    "stretch"
                }
              },

              h(
                "input",
                {
                  type: "text",

                  value:
                    form.projectCode,

                  onChange:
                    update(
                      "projectCode"
                    ),

                  style: {
                    flex: 1
                  },

                  placeholder:
                    "PW-BAG-00001"
                }
              ),

              h(
                "button",
                {
                  type: "button",

                  className:
                    "operation-btn",

                  onClick:
                    generateCode,

                  disabled:
                    codeLoading
                },

                codeLoading
                  ? "Generating..."
                  : "Generate Code"
              )
            )
          ),


          input(
            "District",
            "district"
          ),

          input(
            "Municipality",
            "municipality"
          ),

          input(
            "Budget (NPR)",
            "budget",
            "number"
          ),

          input(
            "Progress (%)",
            "progress",
            "number"
          ),

          input(
            "Contractor",
            "contractor"
          ),

          input(
            "Location",
            "location"
          )
        )
      ),


      // ====================================
      // CLASSIFICATION
      // ====================================

      h(
        "div",
        {
          className:
            "form-section"
        },

        h(
          "h2",
          null,

          "Classification"
        ),

        h(
          "div",
          {
            className:
              "form-grid"
          },


          // PROVINCE

          h(
            "label",
            {
              className:
                "form-field"
            },

            h(
              "span",
              null,

              "Province"
            ),

            h(
              "select",
              {
                value:
                  form.province,

                onChange:
                  update(
                    "province"
                  )
              },

              [
                "Bagmati",
                "Gandaki",
                "Koshi",
                "Lumbini",
                "Madhesh",
                "Karnali",
                "Sudurpashchim"
              ].map(
                (province) =>
                  h(
                    "option",
                    {
                      key:
                        province,

                      value:
                        province
                    },

                    province
                  )
              )
            )
          ),


          // STATUS

          h(
            "label",
            {
              className:
                "form-field"
            },

            h(
              "span",
              null,

              "Status"
            ),

            h(
              "select",
              {
                value:
                  form.status,

                onChange:
                  update(
                    "status"
                  )
              },

              [
                "Active",
                "Delayed",
                "Completed",
                "Critical"
              ].map(
                (status) =>
                  h(
                    "option",
                    {
                      key:
                        status,

                      value:
                        status
                    },

                    status
                  )
              )
            )
          ),


          // RISK LEVEL

          h(
            "label",
            {
              className:
                "form-field"
            },

            h(
              "span",
              null,

              "Risk Level"
            ),

            h(
              "select",
              {
                value:
                  form.riskLevel,

                onChange:
                  update(
                    "riskLevel"
                  )
              },

              [
                "Low",
                "Medium",
                "High",
                "Critical"
              ].map(
                (risk) =>
                  h(
                    "option",
                    {
                      key:
                        risk,

                      value:
                        risk
                    },

                    risk
                  )
              )
            )
          )
        )
      ),


      // ====================================
      // MAP LOCATION
      // ====================================

      h(
        "div",
        {
          className:
            "form-section"
        },

        h(
          "h2",
          null,

          "Map Location"
        ),

        h(
          "div",
          {
            className:
              "form-grid"
          },

          input(
            "Latitude",
            "latitude",
            "number"
          ),

          input(
            "Longitude",
            "longitude",
            "number"
          )
        )
      ),


      // ====================================
      // DESCRIPTION
      // ====================================

      h(
        "div",
        {
          className:
            "form-section"
        },

        h(
          "label",
          {
            className:
              "form-field"
          },

          h(
            "span",
            null,

            "Description"
          ),

          h(
            "textarea",
            {
              rows: 5,

              value:
                form.description,

              onChange:
                update(
                  "description"
                ),

              placeholder:
                "Enter project description..."
            }
          )
        )
      ),


      // ====================================
      // PUBLIC PROJECT
      // ====================================

      h(
        "div",
        {
          className:
            "form-section"
        },

        h(
          "label",
          {
            className:
              "checkbox-field"
          },

          h(
            "input",
            {
              type: "checkbox",

              checked:
                form.isPublic,

              onChange:
                (event) =>
                  setForm({
                    ...form,

                    isPublic:
                      event.target
                        .checked
                  })
            }
          ),

          h(
            "span",
            null,

            "Make this project publicly visible"
          )
        )
      ),


      // ====================================
      // FORM ACTIONS
      // ====================================

      h(
        "div",
        {
          className:
            "form-actions"
        },


        // CANCEL

        h(
          "button",
          {
            type: "button",

            className:
              "secondary-button",

            onClick: () =>
              navigate(
                "/admin/projects"
              ),

            disabled:
              saving
          },

          "Cancel"
        ),


        // SUBMIT

        h(
          "button",
          {
            type: "submit",

            className:
              "primary-button",

            disabled:
              saving
          },

          saving
            ? "Creating..."
            : "Create Project"
        )
      )
    )
  );
};


export default AddProjectPage;