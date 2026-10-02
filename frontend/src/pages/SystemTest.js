import React, {
  useEffect,
  useState
} from "react";

import { checkApiHealth} from "../services/api";

const h = React.createElement;

const SystemTest = () => {
  const [testing, setTesting] =
    useState(true);

  const [apiStatus, setApiStatus] =
    useState("checking");

  const [message, setMessage] =
    useState("");

  const [testTime, setTestTime] =
    useState(null);

  const runTest = async () => {
    try {
      setTesting(true);
      setApiStatus("checking");
      setMessage("");

      const response =
        await checkApiHealth();

      if (
        response?.success === true ||
        response?.status === 200
      ) {
        setApiStatus("online");

        setMessage(
          response?.message ||
          "Backend API is running."
        );
      } else {
        setApiStatus("warning");

        setMessage(
          "Backend responded, but the health check returned an unexpected response."
        );
      }

      setTestTime(
        new Date()
      );
    } catch (error) {
      console.error(
        "System test error:",
        error
      );

      setApiStatus("offline");

      setMessage(
        error?.message ||
        "Unable to connect to backend."
      );

      setTestTime(
        new Date()
      );
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    runTest();
  }, []);

  const getStatusText = () => {
    if (testing) {
      return "Checking...";
    }

    if (apiStatus === "online") {
      return "Online";
    }

    if (apiStatus === "warning") {
      return "Warning";
    }

    return "Offline";
  };

  return h(
    "div",
    {
      className:
        "system-test-page"
    },

    h(
      "div",
      {
        className:
          "system-test-header"
      },

      h(
        "div",
        null,

        h(
          "h1",
          null,
          "System Test"
        ),

        h(
          "p",
          null,
          "Check ProjectWatch Nepal backend connectivity."
        )
      ),

      h(
        "button",
        {
          type: "button",
          onClick: runTest,
          disabled: testing,
          className:
            "system-test-button"
        },
        testing
          ? "Testing..."
          : "Run Test"
      )
    ),

    h(
      "div",
      {
        className:
          `system-test-status ${apiStatus}`
      },

      h(
        "div",
        {
          className:
            "system-test-status-icon"
        },
        testing
          ? "⏳"
          : apiStatus === "online"
          ? "✓"
          : apiStatus === "warning"
          ? "!"
          : "×"
      ),

      h(
        "div",
        null,

        h(
          "span",
          {
            className:
              "system-test-label"
          },
          "Backend API"
        ),

        h(
          "strong",
          null,
          getStatusText()
        ),

        h(
          "p",
          null,
          message ||
            "Waiting for response..."
        )
      )
    ),

    h(
      "div",
      {
        className:
          "system-test-info"
      },

      h(
        "div",
        null,

        h(
          "span",
          null,
          "API URL"
        ),

        h(
          "strong",
          null,
          "http://localhost:8000/api"
        )
      ),

      h(
        "div",
        null,

        h(
          "span",
          null,
          "Health Endpoint"
        ),

        h(
          "strong",
          null,
          "/health"
        )
      ),

      h(
        "div",
        null,

        h(
          "span",
          null,
          "Last Test"
        ),

        h(
          "strong",
          null,
          testTime
            ? testTime.toLocaleString()
            : "Not tested"
        )
      )
    )
  );
};

export default SystemTest;