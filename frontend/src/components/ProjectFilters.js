import React from "react";

const ProjectFilters = ({
  search,
  setSearch,
  province,
  setProvince,
  status,
  setStatus,
  risk,
  setRisk,
  onReset
}) => {
  return React.createElement(
    "div",
    {
      className: "project-filters"
    },

    React.createElement(
      "div",
      {
        className: "filter-search"
      },

      React.createElement(
        "span",
        {
          className: "filter-search-icon"
        },
        "⌕"
      ),

      React.createElement("input", {
        type: "text",
        placeholder: "Search projects...",
        value: search,
        onChange: (event) =>
          setSearch(event.target.value)
      })
    ),

    React.createElement(
      "select",
      {
        value: province,
        onChange: (event) =>
          setProvince(event.target.value)
      },

      React.createElement(
        "option",
        { value: "" },
        "All Provinces"
      ),

      React.createElement(
        "option",
        { value: "Bagmati" },
        "Bagmati"
      ),

      React.createElement(
        "option",
        { value: "Gandaki" },
        "Gandaki"
      ),

      React.createElement(
        "option",
        { value: "Koshi" },
        "Koshi"
      ),

      React.createElement(
        "option",
        { value: "Lumbini" },
        "Lumbini"
      ),

      React.createElement(
        "option",
        { value: "Madhesh" },
        "Madhesh"
      ),

      React.createElement(
        "option",
        { value: "Karnali" },
        "Karnali"
      ),

      React.createElement(
        "option",
        { value: "Sudurpashchim" },
        "Sudurpashchim"
      )
    ),

    React.createElement(
      "select",
      {
        value: status,
        onChange: (event) =>
          setStatus(event.target.value)
      },

      React.createElement(
        "option",
        { value: "" },
        "All Status"
      ),

      React.createElement(
        "option",
        { value: "Active" },
        "Active"
      ),

      React.createElement(
        "option",
        { value: "Delayed" },
        "Delayed"
      ),

      React.createElement(
        "option",
        { value: "Completed" },
        "Completed"
      ),

      React.createElement(
        "option",
        { value: "Critical" },
        "Critical"
      )
    ),

    React.createElement(
      "select",
      {
        value: risk,
        onChange: (event) =>
          setRisk(event.target.value)
      },

      React.createElement(
        "option",
        { value: "" },
        "All Risk"
      ),

      React.createElement(
        "option",
        { value: "Low" },
        "Low"
      ),

      React.createElement(
        "option",
        { value: "Medium" },
        "Medium"
      ),

      React.createElement(
        "option",
        { value: "High" },
        "High"
      ),

      React.createElement(
        "option",
        { value: "Critical" },
        "Critical"
      )
    ),

    React.createElement(
      "button",
      {
        type: "button",
        className: "filter-reset-button",
        onClick: onReset
      },
      "Reset"
    )
  );
};

export default ProjectFilters;