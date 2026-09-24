import React from "react";

import {
  Outlet
} from "react-router-dom";

import Sidebar from
  "../components/Sidebar";

import Header from
  "../components/Header";

const h = React.createElement;

const DashboardLayout = () =>
  h(
    "div",
    {
      className:
        "dashboard-shell"
    },

    h(
      Sidebar
    ),

    h(
      "div",
      {
        className:
          "dashboard-main"
      },

      h(
        Header
      ),

      h(
        "main",
        {
          className:
            "dashboard-content"
        },

        h(
          Outlet
        )
      )
    )
  );

export default DashboardLayout;