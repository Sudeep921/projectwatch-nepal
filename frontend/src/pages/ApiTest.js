import React, {
  useEffect,
  useState
} from "react";

import {
  checkApiHealth,
  getSystemHealth
} from "../services/api";

const h = React.createElement;

const ApiTest = () => {
  const [api, setApi] = useState(null);
  const [system, setSystem] = useState(null);
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);

    try {
      const apiResult = await checkApiHealth();
      setApi(apiResult);
    } catch (error) {
      setApi({
        success: false,
        message: error.message
      });
    }

    try {
      const systemResult = await getSystemHealth();
      setSystem(systemResult);
    } catch (error) {
      setSystem({
        success: false,
        message: error.message
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    runTest();
  }, []);

  return h(
    "div",
    { className: "api-test-page" },

    h(
      "div",
      { className: "api-test-header" },

      h(
        "div",
        null,

        h(
          "h1",
          null,
          "API Test"
        ),

        h(
          "p",
          null,
          "Check ProjectWatch Nepal API and database connection."
        )
      ),

      h(
        "button",
        {
          type: "button",
          onClick: runTest,
          disabled: loading
        },
        loading ? "Testing..." : "Run Test"
      )
    ),

    h(
      "div",
      { className: "api-test-grid" },

      h(
        "div",
        { className: "api-test-card" },

        h(
          "h2",
          null,
          "API Connection"
        ),

        h(
          "div",
          {
            className:
              api?.success
                ? "test-status success"
                : "test-status error"
          },
          api?.success ? "Connected" : "Failed"
        ),

        h(
          "pre",
          null,
          JSON.stringify(api, null, 2)
        )
      ),

      h(
        "div",
        { className: "api-test-card" },

        h(
          "h2",
          null,
          "System Health"
        ),

        h(
          "div",
          {
            className:
              system?.success
                ? "test-status success"
                : "test-status error"
          },
          system?.success ? "Healthy" : "Failed"
        ),

        h(
          "pre",
          null,
          JSON.stringify(system, null, 2)
        )
      )
    )
  );
};

export default ApiTest;