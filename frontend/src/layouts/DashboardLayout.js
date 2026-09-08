import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function DashboardLayout({
  children,
  currentPage,
  setPage
}) {
  return React.createElement(
    "div",
    { className: "dashboard-layout" },

    React.createElement(Sidebar, {
      currentPage: currentPage,
      setPage: setPage
    }),

    React.createElement(
      "div",
      { className: "main-area" },

      React.createElement(Header),

      children
    )
  );
}

export default DashboardLayout;