import React from "react";

const h = React.createElement;

const ErrorState = ({ message, onRetry }) => {
  return h(
    "div",
    { className: "error-state" },

    h(
      "div",
      { className: "error-state-icon" },
      "⚠"
    ),

    h(
      "h3",
      null,
      "Something went wrong"
    ),

    h(
      "p",
      null,
      message || "Unable to load data."
    ),

    onRetry &&
      h(
        "button",
        {
          type: "button",
          onClick: onRetry
        },
        "Retry"
      )
  );
};

export default ErrorState;