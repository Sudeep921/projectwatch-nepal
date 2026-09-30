import React from "react";

const h = React.createElement;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error, info) {
    console.error(
      "PROJECTWATCH UI ERROR:",
      error
    );

    console.error(
      "COMPONENT INFO:",
      info
    );
  }

  handleReload = () => {
    window.location.reload();
  };

  handleHome = () => {
    window.location.href = "/public";
  };

  render() {
    if (this.state.hasError) {
      return h(
        "div",
        {
          className: "error-boundary-page"
        },

        h(
          "div",
          {
            className: "error-boundary-card"
          },

          h(
            "div",
            {
              className: "error-boundary-icon"
            },
            "⚠️"
          ),

          h(
            "h1",
            null,
            "Something went wrong"
          ),

          h(
            "p",
            null,
            "ProjectWatch Nepal encountered an unexpected error."
          ),

          h(
            "div",
            {
              className:
                "error-boundary-actions"
            },

            h(
              "button",
              {
                type: "button",
                onClick:
                  this.handleReload
              },
              "Reload Page"
            ),

            h(
              "button",
              {
                type: "button",
                onClick:
                  this.handleHome
              },
              "Go to Public Portal"
            )
          )
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;