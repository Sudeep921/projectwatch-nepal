import React, {
  useEffect,
  useState
} from "react";

const h = React.createElement;

const NetworkStatus = () => {
  const [online, setOnline] = useState(
    navigator.onLine
  );

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
    };

    const handleOffline = () => {
      setOnline(false);
    };

    window.addEventListener(
      "online",
      handleOnline
    );

    window.addEventListener(
      "offline",
      handleOffline
    );

    return () => {
      window.removeEventListener(
        "online",
        handleOnline
      );

      window.removeEventListener(
        "offline",
        handleOffline
      );
    };
  }, []);

  if (online) {
    return null;
  }

  return h(
    "div",
    {
      className:
        "network-status-offline"
    },

    h(
      "strong",
      null,
      "No Internet Connection"
    ),

    h(
      "span",
      null,
      "Please check your network connection."
    )
  );
};

export default NetworkStatus;