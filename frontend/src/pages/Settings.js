import React, {
  useEffect,
  useState
} from "react";

import {
  getMySettings,
  updateMySettings,
  getSystemHealth
} from "../services/api";

import { useAuth } from "../context/AuthContext";

const h = React.createElement;

const Settings = () => {
  const { user } = useAuth();

  const [settings, setSettings] = useState({
    notifications: true,
    criticalAlerts: true,
    fieldReports: true,
    complaintUpdates: true,
    completionAlerts: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [systemStatus, setSystemStatus] = useState({
    api: "Checking...",
    database: "Checking...",
    version: "1.0.0",
    environment: "Development"
  });

  // ========================================
  // LOAD SETTINGS
  // ========================================

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMySettings();

      const data =
        response?.settings ||
        response?.data ||
        {};

      setSettings({
        notifications:
          data.notifications !== undefined
            ? data.notifications
            : true,

        criticalAlerts:
          data.criticalAlerts !== undefined
            ? data.criticalAlerts
            : true,

        fieldReports:
          data.fieldReports !== undefined
            ? data.fieldReports
            : true,

        complaintUpdates:
          data.complaintUpdates !== undefined
            ? data.complaintUpdates
            : true,

        completionAlerts:
          data.completionAlerts !== undefined
            ? data.completionAlerts
            : true
      });
    } catch (err) {
      console.error("SETTINGS LOAD ERROR:", err);

      setError(
        err.message ||
        "Failed to load settings."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // LOAD SYSTEM STATUS
  // ========================================

  const loadSystemStatus = async () => {
    try {
      await getSystemHealth();

      setSystemStatus((prev) => ({
        ...prev,
        api: "Connected",
        database: "Connected"
      }));
    } catch (err) {
      console.error(
        "SYSTEM STATUS ERROR:",
        err
      );

      setSystemStatus((prev) => ({
        ...prev,
        api: "Unavailable",
        database: "Unknown"
      }));
    }
  };

  useEffect(() => {
    loadSettings();
    loadSystemStatus();
  }, []);

  // ========================================
  // TOGGLE SETTING
  // ========================================

  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));

    setSaved(false);
  };

  // ========================================
  // SAVE SETTINGS
  // ========================================

  const saveSettings = async () => {
    try {
      setSaving(true);
      setSaved(false);
      setError("");

      const response =
        await updateMySettings(settings);

      if (
        response &&
        response.success === false
      ) {
        throw new Error(
          response.message ||
          "Failed to save settings."
        );
      }

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);

    } catch (err) {
      console.error(
        "SETTINGS SAVE ERROR:",
        err
      );

      setError(
        err.message ||
        "Failed to save settings."
      );
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // INFO ROW
  // ========================================

  const infoRow = (
    label,
    value
  ) =>
    h(
      "div",
      {
        className:
          "settings-info-row"
      },
      h(
        "span",
        {
          className:
            "settings-info-label"
        },
        label
      ),
      h(
        "strong",
        {
          className:
            "settings-info-value"
        },
        value
      )
    );

  // ========================================
  // SETTING TOGGLE
  // ========================================

  const settingOption = (
    key,
    title,
    description
  ) =>
    h(
      "div",
      {
        className:
          "settings-option"
      },

      h(
        "div",
        null,

        h(
          "strong",
          null,
          title
        ),

        h(
          "p",
          null,
          description
        )
      ),

      h(
        "label",
        {
          className:
            "settings-toggle"
        },

        h(
          "input",
          {
            type: "checkbox",
            checked:
              Boolean(settings[key]),
            onChange: () =>
              toggleSetting(key)
          }
        ),

        h(
          "span",
          {
            className:
              "settings-toggle-slider"
          }
        )
      )
    );

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return h(
      "div",
      {
        className:
          "settings-page page-container"
      },

      h(
        "div",
        {
          className:
            "loading-box"
        },
        "Loading settings..."
      )
    );
  }

  // ========================================
  // PAGE
  // ========================================

  return h(
    "div",
    {
      className:
        "settings-page page-container"
    },

    // HEADER
    h(
      "div",
      {
        className:
          "page-header"
      },

      h(
        "div",
        null,

        h(
          "h1",
          null,
          "Settings"
        ),

        h(
          "p",
          null,
          "Manage your ProjectWatch account and preferences."
        )
      )
    ),

    // SUCCESS
    saved
      ? h(
          "div",
          {
            className:
              "settings-success"
          },
          "✓ Settings saved successfully"
        )
      : null,

    // ERROR
    error
      ? h(
          "div",
          {
            className:
              "settings-error"
          },
          error
        )
      : null,

    // ========================================
    // ACCOUNT
    // ========================================

    h(
      "div",
      {
        className:
          "settings-card"
      },

      h(
        "div",
        {
          className:
            "settings-card-header"
        },

        h(
          "div",
          {
            className:
              "settings-section-icon"
          },
          "👤"
        ),

        h(
          "div",
          null,

          h(
            "h2",
            null,
            "Account"
          ),

          h(
            "p",
            null,
            "Your ProjectWatch account information."
          )
        )
      ),

      h(
        "div",
        {
          className:
            "settings-account"
        },

        h(
          "div",
          {
            className:
              "settings-avatar"
          },
          (user?.name || "A")
            .charAt(0)
            .toUpperCase()
        ),

        h(
          "div",
          {
            className:
              "settings-account-details"
          },

          h(
            "strong",
            null,
            user?.name ||
              "Administrator"
          ),

          h(
            "span",
            null,
            user?.email ||
              "No email"
          )
        )
      ),

      h(
        "div",
        {
          className:
            "settings-info-grid"
        },

        infoRow(
          "Name",
          user?.name ||
            "Administrator"
        ),

        infoRow(
          "Email",
          user?.email ||
            "—"
        ),

        infoRow(
          "Role",
          user?.role ||
            "admin"
        ),

        infoRow(
          "Account Status",
          user?.isActive === false
            ? "Inactive"
            : "Active"
        )
      )
    ),

    // ========================================
    // NOTIFICATIONS
    // ========================================

    h(
      "div",
      {
        className:
          "settings-card"
      },

      h(
        "div",
        {
          className:
            "settings-card-header"
        },

        h(
          "div",
          {
            className:
              "settings-section-icon"
          },
          "🔔"
        ),

        h(
          "div",
          null,

          h(
            "h2",
            null,
            "Notifications"
          ),

          h(
            "p",
            null,
            "Choose which notifications you want to receive."
          )
        )
      ),

      h(
        "div",
        {
          className:
            "settings-options"
        },

        settingOption(
          "notifications",
          "Enable notifications",
          "Receive ProjectWatch notifications."
        ),

        settingOption(
          "criticalAlerts",
          "Critical project alerts",
          "Get notified when a project becomes critical."
        ),

        settingOption(
          "fieldReports",
          "Field report alerts",
          "Receive updates when field reports are submitted."
        ),

        settingOption(
          "complaintUpdates",
          "Complaint updates",
          "Receive updates about citizen complaints."
        ),

        settingOption(
          "completionAlerts",
          "Project completion alerts",
          "Get notified when a project reaches 100%."
        )
      )
    ),

    // ========================================
    // SYSTEM
    // ========================================

    h(
      "div",
      {
        className:
          "settings-card"
      },

      h(
        "div",
        {
          className:
            "settings-card-header"
        },

        h(
          "div",
          {
            className:
              "settings-section-icon"
          },
          "⚙️"
        ),

        h(
          "div",
          null,

          h(
            "h2",
            null,
            "System"
          ),

          h(
            "p",
            null,
            "Current ProjectWatch system information."
          )
        )
      ),

      h(
        "div",
        {
          className:
            "settings-info-grid"
        },

        infoRow(
          "API Status",
          systemStatus.api
        ),

        infoRow(
          "Database",
          systemStatus.database
        ),

        infoRow(
          "System Version",
          systemStatus.version
        ),

        infoRow(
          "Environment",
          systemStatus.environment
        )
      )
    ),

    // ========================================
    // SAVE
    // ========================================

    h(
      "div",
      {
        className:
          "settings-actions"
      },

      h(
        "button",
        {
          className:
            "settings-save-button",
          onClick: saveSettings,
          disabled: saving
        },
        saving
          ? "Saving..."
          : "Save Settings"
      )
    )
  );
};

export default Settings;