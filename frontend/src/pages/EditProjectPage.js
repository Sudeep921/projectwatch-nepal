import React, {
  useEffect,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  getProject,
  updateProject
} from "../services/api";

const h = React.createElement;

const EditProjectPage = () => {

  const {
    id
  } = useParams();

  const navigate =
    useNavigate();


  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    saving,
    setSaving
  ] = useState(false);

  const [
    error,
    setError
  ] = useState("");


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
    location: "",
    latitude: "",
    longitude: "",
    description: "",
    isPublic: true
  });


  /* =========================
     LOAD PROJECT
  ========================= */

  useEffect(() => {

    const loadProject =
      async () => {

        try {

          setLoading(true);
          setError("");

          const result =
            await getProject(id);

          const project =
            result?.project ||
            result?.data ||
            result;

          if (
            !project ||
            typeof project !==
              "object"
          ) {
            throw new Error(
              "Project data not found."
            );
          }


          setForm({

            name:
              project.name ||
              project.projectName ||
              "",

            projectCode:
              project.projectCode ||
              project.code ||
              "",

            province:
              project.province ||
              "Bagmati",

            district:
              project.district ||
              "",

            municipality:
              project.municipality ||
              "",

            budget:
              project.budget ??
              "",

            progress:
              project.progress ??
              project.completionPercentage ??
              0,

            status:
              project.status ||
              "Active",

            riskLevel:
              project.riskLevel ||
              project.risk ||
              "Low",

            contractor:
              project.contractor ||
              "",

            location:
              project.location ||
              "",

            latitude:
              project.latitude ??
              "",

            longitude:
              project.longitude ??
              "",

            description:
              project.description ||
              "",

            isPublic:
              project.isPublic !== false

          });

        } catch (err) {

          console.error(
            "EDIT PROJECT LOAD ERROR:",
            err
          );

          setError(
            err?.message ||
            "Failed to load project."
          );

        } finally {

          setLoading(false);

        }

      };


    if (id) {
      loadProject();
    }

  }, [id]);


  /* =========================
     UPDATE FIELD
  ========================= */

  const updateField =
    (key) =>
    (event) => {

      const value =
        event.target.value;

      setForm(
        (previous) => ({
          ...previous,
          [key]: value
        })
      );

    };


  /* =========================
     VALIDATE
  ========================= */

  const validateForm =
    () => {

      if (
        !form.name.trim()
      ) {
        return "Project name is required.";
      }

      if (
        !form.projectCode.trim()
      ) {
        return "Project code is required.";
      }

      const progress =
        Number(
          form.progress
        );

      if (
        Number.isNaN(progress) ||
        progress < 0 ||
        progress > 100
      ) {
        return "Progress must be between 0 and 100.";
      }

      const budget =
        Number(
          form.budget || 0
        );

      if (
        Number.isNaN(budget) ||
        budget < 0
      ) {
        return "Budget cannot be negative.";
      }

      if (
        form.latitude !== ""
      ) {

        const latitude =
          Number(
            form.latitude
          );

        if (
          Number.isNaN(latitude) ||
          latitude < -90 ||
          latitude > 90
        ) {
          return "Latitude must be between -90 and 90.";
        }

      }

      if (
        form.longitude !== ""
      ) {

        const longitude =
          Number(
            form.longitude
          );

        if (
          Number.isNaN(longitude) ||
          longitude < -180 ||
          longitude > 180
        ) {
          return "Longitude must be between -180 and 180.";
        }

      }

      return "";

    };


  /* =========================
     SAVE PROJECT
  ========================= */

  const saveProject =
    async (event) => {

      event.preventDefault();

      const validationError =
        validateForm();

      if (validationError) {

        setError(
          validationError
        );

        return;

      }


      try {

        setSaving(true);
        setError("");


        const progress =
          Math.min(
            100,
            Math.max(
              0,
              Number(
                form.progress || 0
              )
            )
          );


        const budget =
          Math.max(
            0,
            Number(
              form.budget || 0
            )
          );


        const data = {

          name:
            form.name.trim(),

          projectName:
            form.name.trim(),

          projectCode:
            form.projectCode.trim(),

          province:
            form.province,

          district:
            form.district.trim(),

          municipality:
            form.municipality.trim(),

          budget,

          progress,

          status:
            form.status,

          riskLevel:
            form.riskLevel,

          contractor:
            form.contractor.trim(),

          location:
            form.location.trim(),

          description:
            form.description.trim(),

          isPublic:
            Boolean(
              form.isPublic
            )

        };


        if (
          form.latitude !== ""
        ) {

          data.latitude =
            Number(
              form.latitude
            );

        }


        if (
          form.longitude !== ""
        ) {

          data.longitude =
            Number(
              form.longitude
            );

        }


        console.log(
          "UPDATING PROJECT:",
          data
        );


        await updateProject(
          id,
          data
        );


        window.alert(
          "Project updated successfully."
        );


        /*
         * IMPORTANT:
         * App.js uses:
         * /admin/projects/:id
         */

        navigate(
          `/admin/projects/${id}`,
          {
            replace: true
          }
        );


      } catch (err) {

        console.error(
          "UPDATE PROJECT ERROR:",
          err
        );

        setError(
          err?.message ||
          "Failed to update project."
        );

      } finally {

        setSaving(false);

      }

    };


  /* =========================
     FORM FIELD
  ========================= */

  const field =
    (
      label,
      key,
      type = "text"
    ) => {

      return h(
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
              updateField(key),

            min:
              key === "progress"
                ? 0
                : undefined,

            max:
              key === "progress"
                ? 100
                : undefined,

            step:
              key === "latitude" ||
              key === "longitude"
                ? "any"
                : undefined

          }
        )

      );

    };


  /* =========================
     LOADING
  ========================= */

  if (loading) {

    return h(
      "div",
      {
        className:
          "page"
      },

      h(
        "div",
        {
          className:
            "loading-box"
        },

        "Loading project..."
      )

    );

  }


  /* =========================
     PAGE
  ========================= */

  return h(
    "div",
    {
      className:
        "page add-project-page"
    },


    /* =========================
       HEADER
    ========================= */

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
            type:
              "button",

            className:
              "back-button",

            onClick: () =>
              navigate(
                `/admin/projects/${id}`
              ),

            disabled:
              saving
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

          "Edit Government Project"
        ),

        h(
          "p",
          null,

          "Update project information and monitoring details."
        )

      )

    ),


    /* =========================
       ERROR
    ========================= */

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


    /* =========================
       FORM
    ========================= */

    h(
      "form",
      {
        className:
          "project-form",

        onSubmit:
          saveProject
      },


      /* =========================
         PROJECT INFORMATION
      ========================= */

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

          field(
            "Project Name",
            "name"
          ),

          field(
            "Project Code",
            "projectCode"
          ),

          field(
            "District",
            "district"
          ),

          field(
            "Municipality",
            "municipality"
          ),

          field(
            "Budget (NPR)",
            "budget",
            "number"
          ),

          field(
            "Progress (%)",
            "progress",
            "number"
          ),

          field(
            "Contractor",
            "contractor"
          ),

          field(
            "Location",
            "location"
          )

        )

      ),


      /* =========================
         CLASSIFICATION
      ========================= */

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


          /* PROVINCE */

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
                  updateField(
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
                (value) =>
                  h(
                    "option",
                    {
                      key:
                        value,

                      value
                    },

                    value
                  )
              )

            )

          ),


          /* STATUS */

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
                  updateField(
                    "status"
                  )
              },

              [
                "Active",
                "Delayed",
                "Completed",
                "Critical"
              ].map(
                (value) =>
                  h(
                    "option",
                    {
                      key:
                        value,

                      value
                    },

                    value
                  )
              )

            )

          ),


          /* RISK */

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
                  updateField(
                    "riskLevel"
                  )
              },

              [
                "Low",
                "Medium",
                "High",
                "Critical"
              ].map(
                (value) =>
                  h(
                    "option",
                    {
                      key:
                        value,

                      value
                    },

                    value
                  )
              )

            )

          )

        )

      ),


      /* =========================
         MAP LOCATION
      ========================= */

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

          field(
            "Latitude",
            "latitude",
            "number"
          ),

          field(
            "Longitude",
            "longitude",
            "number"
          )

        )

      ),


      /* =========================
         DESCRIPTION
      ========================= */

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
                updateField(
                  "description"
                ),

              placeholder:
                "Enter project description..."
            }
          )

        )

      ),


      /* =========================
         PUBLIC VISIBILITY
      ========================= */

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
              type:
                "checkbox",

              checked:
                form.isPublic,

              onChange:
                (event) =>
                  setForm(
                    (previous) => ({
                      ...previous,

                      isPublic:
                        event.target
                          .checked
                    })
                  )
            }
          ),

          h(
            "span",
            null,

            "Make this project publicly visible"
          )

        )

      ),


      /* =========================
         ACTIONS
      ========================= */

      h(
        "div",
        {
          className:
            "form-actions"
        },


        /* CANCEL */

        h(
          "button",
          {
            type:
              "button",

            className:
              "secondary-button",

            onClick: () =>
              navigate(
                `/admin/projects/${id}`
              ),

            disabled:
              saving
          },

          "Cancel"
        ),


        /* SAVE */

        h(
          "button",
          {
            type:
              "submit",

            className:
              "primary-button",

            disabled:
              saving
          },

          saving
            ? "Saving..."
            : "Save Changes"
        )

      )

    )

  );

};

export default EditProjectPage;