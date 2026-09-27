import React from "react";

const h = React.createElement;

const LoadingState = ({ text }) => {
  return h(
    "div",
    { className: "loading-state" },
    h(
      "div",
      { className: "loading-spinner" }
    ),
    h(
      "span",
      null,
      text || "Loading..."
    )
  );
};

export default LoadingState;