import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const DashboardLayout = () => {
  return React.createElement(
    "div",
    {
      className: "dashboard-layout"
    },

    React.createElement(Sidebar),

    React.createElement(
      "div",
      {
        className: "main-layout"
      },

      React.createElement(Header),

      React.createElement(
        "main",
        {
          className: "main-content"
        },
        React.createElement(Outlet)
      )
    )
  );
};

export default DashboardLayout;