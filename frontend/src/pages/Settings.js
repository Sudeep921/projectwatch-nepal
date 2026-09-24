import React, {
  useState
} from "react";

import {
  useAuth
} from "../context/AuthContext";

const h = React.createElement;

const Settings = () => {
  const {
    user
  } = useAuth();

  const [
    notifications,
    setNotifications
  ] = useState(true);

  const [
    saved,
    setSaved
  ] = useState(false);

  const save = () => {
    localStorage.setItem(
      "projectwatch_settings",
      JSON.stringify({
        notifications
      })
    );

    setSaved(true);

    setTimeout(
      () => setSaved(false),
      2000
    );
  };

  return h(
    "div",
    {
      className:
        "page"
    },

    h(
      "div",
      {
        className:
          "page-heading"
      },

      h(
        "div",
        null,

        h(
          "span",
          {
            className:
              "eyebrow"
          },
          "SYSTEM"
        ),

        h(
          "h1",
          null,
          "Settings"
        )
      )
    ),

    h(
      "div",
      {
        className:
          "settings-card"
      },

      h(
        "h2",
        null,
        "Account"
      ),

      h(
        "p",
        null,
        user?.name ||
          "Administrator"
      ),

      h(
        "p",
        null,
        user?.email ||
          "-"
      ),

      h(
        "label",
        {
          className:
            "setting-toggle"
        },

        h(
          "input",
          {
            type: "checkbox",
            checked:
              notifications,
            onChange: (e) =>
              setNotifications(
                e.target.checked
              )
          }
        ),

        h(
          "span",
          null,
          "Enable notifications"
        )
      ),

      h(
        "button",
        {
          className:
            "primary-button",
          onClick: save
        },
        saved
          ? "✓ Saved"
          : "Save Settings"
      )
    )
  );
};

export default Settings;