import React from "react";

function ProjectFilters({
  search,
  setSearch,
  province,
  setProvince,
  status,
  setStatus,
  risk,
  setRisk,
  onClear
}) {
  return React.createElement(
    "div",
    { className: "project-filters" },

    React.createElement(
      "div",
      { className: "filter-search" },

      React.createElement(
        "span",
        { className: "filter-search-icon" },
        "⌕"
      ),

      React.createElement("input", {
        type: "text",
        placeholder: "Search project name or ID...",
        value: search,
        onChange: function (e) {
          setSearch(e.target.value);
        }
      })
    ),

    React.createElement(
      "select",
      {
        value: province,
        onChange: function (e) {
          setProvince(e.target.value);
        }
      },

      React.createElement(
        "option",
        { value: "All Provinces" },
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
        onChange: function (e) {
          setStatus(e.target.value);
        }
      },

      React.createElement(
        "option",
        { value: "All Status" },
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
        onChange: function (e) {
          setRisk(e.target.value);
        }
      },

      React.createElement(
        "option",
        { value: "All Risk" },
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
        className: "filter-clear-btn",
        onClick: onClear
      },
      "Clear"
    )
  );
}

export default ProjectFilters;