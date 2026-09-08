import React, { useState } from "react";

function AddProjectModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    province: "Bagmati",
    district: "",
    budget: "",
    status: "Active",
    risk: "Low",
    contractor: "",
    department: "",
    startDate: "",
    endDate: "",
    location: "",
    description: ""
  });

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    setForm(function (previous) {
      return {
        ...previous,
        [name]: value
      };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.district.trim() ||
      !form.budget.trim() ||
      !form.startDate ||
      !form.endDate
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const newProject = {
      id:
        "PW-" +
        form.province.substring(0, 3).toUpperCase() +
        "-" +
        Math.floor(10000 + Math.random() * 90000),

      name: form.name,
      icon: "🏗️",
      district: form.district,
      province: form.province,
      budget: form.budget,
      progress: 0,
      progressLabel: "Not Started",
      status: form.status,
      risk: form.risk,
      updated: "Just now",
      contractor: form.contractor || "Not assigned",
      department: form.department || "Not assigned",
      startDate: form.startDate,
      endDate: form.endDate,
      location:
        form.location ||
        form.district + ", " + form.province + " Province",
      description: form.description
    };

    console.log("NEW PROJECT:", newProject);

    if (onSave) {
      onSave(newProject);
    }
  }

  return React.createElement(
    "div",
    {
      style: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999,
        background: "rgba(15, 23, 42, 0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px"
      },

      onClick: function (event) {
        if (event.target === event.currentTarget) {
          if (onClose) {
            onClose();
          }
        }
      }
    },

    React.createElement(
      "div",
      {
        style: {
          width: "100%",
          maxWidth: "850px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#ffffff",
          borderRadius: "18px",
          boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
          padding: "30px"
        },

        onClick: function (event) {
          event.stopPropagation();
        }
      },

      /* HEADER */

      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "25px"
          }
        },

        React.createElement(
          "div",
          null,

          React.createElement(
            "div",
            {
              style: {
                fontSize: "11px",
                fontWeight: "800",
                color: "#2563eb",
                letterSpacing: "1px",
                marginBottom: "7px"
              }
            },
            "PROJECT MANAGEMENT"
          ),

          React.createElement(
            "h2",
            {
              style: {
                margin: 0,
                fontSize: "26px",
                color: "#172033"
              }
            },
            "Add New Project"
          ),

          React.createElement(
            "p",
            {
              style: {
                margin: "7px 0 0",
                color: "#7b8798",
                fontSize: "13px"
              }
            },
            "Create a new government project record."
          )
        ),

        React.createElement(
          "button",
          {
            type: "button",
            onClick: onClose,
            style: {
              border: "none",
              background: "#f1f5f9",
              width: "36px",
              height: "36px",
              borderRadius: "9px",
              fontSize: "22px",
              cursor: "pointer",
              color: "#64748b"
            }
          },
          "×"
        )
      ),

      /* FORM */

      React.createElement(
        "form",
        {
          onSubmit: handleSubmit
        },

        /* BASIC */

        React.createElement(
          "h3",
          {
            style: {
              fontSize: "14px",
              color: "#334155",
              margin: "0 0 15px",
              paddingBottom: "10px",
              borderBottom: "1px solid #e8edf3"
            }
          },
          "Basic Information"
        ),

        React.createElement(
          "div",
          {
            style: {
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "18px"
            }
          },

          createInput(
            "Project Name",
            "name",
            form.name,
            handleChange,
            "e.g. Kathmandu Ring Road Expansion",
            true
          ),

          createSelect(
            "Province",
            "province",
            form.province,
            handleChange,
            [
              "Bagmati",
              "Gandaki",
              "Koshi",
              "Lumbini",
              "Madhesh",
              "Karnali",
              "Sudurpashchim"
            ]
          ),

          createInput(
            "District",
            "district",
            form.district,
            handleChange,
            "e.g. Kathmandu",
            true
          ),

          createInput(
            "Budget",
            "budget",
            form.budget,
            handleChange,
            "e.g. NPR 2.5B",
            true
          ),

          createInput(
            "Location",
            "location",
            form.location,
            handleChange,
            "Project location"
          ),

          createInput(
            "Contractor",
            "contractor",
            form.contractor,
            handleChange,
            "Contractor company"
          ),

          createInput(
            "Department",
            "department",
            form.department,
            handleChange,
            "Government department"
          ),

          createSelect(
            "Status",
            "status",
            form.status,
            handleChange,
            [
              "Active",
              "Delayed",
              "Completed",
              "Critical"
            ]
          ),

          createSelect(
            "Risk Level",
            "risk",
            form.risk,
            handleChange,
            [
              "Low",
              "Medium",
              "High",
              "Critical"
            ]
          ),

          createInput(
            "Start Date",
            "startDate",
            form.startDate,
            handleChange,
            "",
            true,
            "date"
          ),

          createInput(
            "End Date",
            "endDate",
            form.endDate,
            handleChange,
            "",
            true,
            "date"
          )
        ),

        /* DESCRIPTION */

        React.createElement(
          "div",
          {
            style: {
              marginTop: "20px"
            }
          },

          React.createElement(
            "label",
            {
              style: {
                display: "block",
                fontSize: "12px",
                fontWeight: "700",
                color: "#475569",
                marginBottom: "7px"
              }
            },
            "Project Description"
          ),

          React.createElement("textarea", {
            name: "description",
            value: form.description,
            onChange: handleChange,
            placeholder: "Brief description of the project...",
            rows: 4,
            style: {
              width: "100%",
              padding: "12px",
              border: "1px solid #dbe2ea",
              borderRadius: "9px",
              resize: "vertical",
              fontFamily: "inherit",
              fontSize: "13px",
              outline: "none",
              boxSizing: "border-box"
            }
          })
        ),

        /* FOOTER */

        React.createElement(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "25px",
              paddingTop: "20px",
              borderTop: "1px solid #e8edf3"
            }
          },

          React.createElement(
            "button",
            {
              type: "button",
              onClick: onClose,
              style: {
                height: "42px",
                padding: "0 20px",
                border: "1px solid #dbe2ea",
                background: "#ffffff",
                borderRadius: "9px",
                cursor: "pointer",
                fontWeight: "700",
                color: "#64748b"
              }
            },
            "Cancel"
          ),

          React.createElement(
            "button",
            {
              type: "submit",
              style: {
                height: "42px",
                padding: "0 24px",
                border: "none",
                background: "#2563eb",
                color: "#ffffff",
                borderRadius: "9px",
                cursor: "pointer",
                fontWeight: "700"
              }
            },
            "✓ Save Project"
          )
        )
      )
    )
  );
}


/* =========================
   INPUT COMPONENT
========================= */

function createInput(
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  type
) {
  return React.createElement(
    "div",
    null,

    React.createElement(
      "label",
      {
        style: {
          display: "block",
          fontSize: "12px",
          fontWeight: "700",
          color: "#475569",
          marginBottom: "7px"
        }
      },
      label,
      required
        ? React.createElement(
            "span",
            {
              style: {
                color: "#ef4444"
              }
            },
            " *"
          )
        : null
    ),

    React.createElement("input", {
      type: type || "text",
      name: name,
      value: value,
      onChange: onChange,
      placeholder: placeholder,
      required: required,
      style: {
        width: "100%",
        height: "42px",
        padding: "0 12px",
        border: "1px solid #dbe2ea",
        borderRadius: "9px",
        fontSize: "13px",
        outline: "none",
        boxSizing: "border-box"
      }
    })
  );
}


/* =========================
   SELECT COMPONENT
========================= */

function createSelect(
  label,
  name,
  value,
  onChange,
  options
) {
  return React.createElement(
    "div",
    null,

    React.createElement(
      "label",
      {
        style: {
          display: "block",
          fontSize: "12px",
          fontWeight: "700",
          color: "#475569",
          marginBottom: "7px"
        }
      },
      label
    ),

    React.createElement(
      "select",
      {
        name: name,
        value: value,
        onChange: onChange,
        style: {
          width: "100%",
          height: "42px",
          padding: "0 12px",
          border: "1px solid #dbe2ea",
          borderRadius: "9px",
          background: "#ffffff",
          fontSize: "13px",
          outline: "none",
          boxSizing: "border-box"
        }
      },

      options.map(function (option) {
        return React.createElement(
          "option",
          {
            key: option,
            value: option
          },
          option
        );
      })
    )
  );
}

export default AddProjectModal;