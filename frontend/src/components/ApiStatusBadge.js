import React, {
  useEffect,
  useState
} from "react";

import {
  checkApiHealth
} from "../services/api";

const h = React.createElement;

const ApiStatusBadge = () => {
  const [status, setStatus] = useState("checking");

  const checkStatus = async () => {
    try {
      const result = await checkApiHealth();

      if (result?.success) {
        setStatus("online");
      } else {
        setStatus("offline");
      }
    } catch (error) {
      setStatus("offline");
    }
  };

  useEffect(() => {
    checkStatus();

    const interval = setInterval(
      checkStatus,
      30000
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

  const text =
    status === "online"
      ? "API Online"
      : status === "offline"
      ? "API Offline"
      : "Checking API...";

  return h(
    "div",
    {
      className:
        `api-status-badge ${status}`
    },

    h(
      "span",
      {
        className: "api-status-dot"
      }
    ),

    h(
      "span",
      null,
      text
    )
  );
};

export default ApiStatusBadge;