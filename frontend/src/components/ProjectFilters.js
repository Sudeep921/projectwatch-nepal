import React from "react";

const h = React.createElement;

const ProjectFilters = ({
  search,
  setSearch,
  province,
  setProvince,
  status,
  setStatus,
  risk,
  setRisk,
  onClear
}) =>
  h(
    "div",
    {
      className:
        "project-filter-bar"
    },

    h(
      "input",
      {
        className:
          "project-search-input",
        value: search,
        onChange: (e) =>
          setSearch(
            e.target.value
          ),
        placeholder:
          "Search projects..."
      }
    ),

    h(
      "select",
      {
        value: province,
        onChange: (e) =>
          setProvince(
            e.target.value
          )
      },

      [
        "All Provinces",
        "Bagmati",
        "Gandaki",
        "Koshi",
        "Lumbini",
        "Madhesh",
        "Karnali",
        "Sudurpashchim"
      ].map(
        (x) =>
          h(
            "option",
            {
              key: x
            },
            x
          )
      )
    ),

    h(
      "select",
      {
        value: status,
        onChange: (e) =>
          setStatus(
            e.target.value
          )
      },

      [
        "All Status",
        "Active",
        "Delayed",
        "Completed",
        "Critical"
      ].map(
        (x) =>
          h(
            "option",
            {
              key: x
            },
            x
          )
      )
    ),

    h(
      "select",
      {
        value: risk,
        onChange: (e) =>
          setRisk(
            e.target.value
          )
      },

      [
        "All Risk",
        "Low",
        "Medium",
        "High",
        "Critical"
      ].map(
        (x) =>
          h(
            "option",
            {
              key: x
            },
            x
          )
      )
    ),

    h(
      "button",
      {
        className:
          "filter-clear",
        onClick: onClear
      },
      "Clear"
    )
  );

export default ProjectFilters;