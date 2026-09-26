import React, { useState } from "react";

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    publicPortal: true,
    notifications: true,
    emailAlerts: true,
    maintenance: false
  });

  const toggle = (key) => {
    setSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

  const items = [
    [
      "publicPortal",
      "Public Portal",
      "Allow citizens to access public project information."
    ],
    [
      "notifications",
      "Notifications",
      "Enable system notifications."
    ],
    [
      "emailAlerts",
      "Email Alerts",
      "Send important alerts through email."
    ],
    [
      "maintenance",
      "Maintenance Mode",
      "Temporarily disable public access."
    ]
  ];

  return React.createElement(
    "div",
    { className: "page-container" },

    React.createElement(
      "div",
      { className: "page-header" },

      React.createElement(
        "div",
        null,
        React.createElement("h1", null, "System Settings"),
        React.createElement(
          "p",
          null,
          "Configure ProjectWatch system preferences."
        )
      )
    ),

    React.createElement(
      "div",
      { className: "settings-card" },

      items.map((item) =>
        React.createElement(
          "div",
          {
            className: "setting-row",
            key: item[0]
          },

          React.createElement(
            "div",
            null,

            React.createElement(
              "h3",
              null,
              item[1]
            ),

            React.createElement(
              "p",
              null,
              item[2]
            )
          ),

          React.createElement(
            "button",
            {
              className:
                settings[item[0]]
                  ? "toggle active"
                  : "toggle",
              onClick: () =>
                toggle(item[0])
            },

            React.createElement(
              "span",
              null
            )
          )
        )
      )
    )
  );
};

export default SystemSettings;