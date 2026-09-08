import React, { useState } from "react";

function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState({
    name: "Administrator",
    email: "admin@projectwatch.gov.np",
    phone: "+977 98XXXXXXXX",
    department: "Project Monitoring Unit",
    role: "Super Admin"
  });

  const [notifications, setNotifications] = useState({
    aiAlerts: true,
    projectAlerts: true,
    complaintAlerts: true,
    evidenceAlerts: true,
    deadlineAlerts: true,
    emailNotifications: false
  });

  const [aiSettings, setAiSettings] = useState({
    evidenceVerification: true,
    gpsVerification: true,
    duplicateDetection: true,
    progressAnalysis: true,
    humanReview: true
  });

  const [mapSettings, setMapSettings] = useState({
    defaultMap: "street",
    showProjects: true,
    showCritical: true,
    showDelayed: true,
    showFieldReports: true
  });

  const [saved, setSaved] = useState(false);

  function updateProfile(field, value) {
    setProfile(function (previous) {
      return {
        ...previous,
        [field]: value
      };
    });
  }

  function toggleNotification(field) {
    setNotifications(function (previous) {
      return {
        ...previous,
        [field]: !previous[field]
      };
    });
  }

  function toggleAI(field) {
    setAiSettings(function (previous) {
      return {
        ...previous,
        [field]: !previous[field]
      };
    });
  }

  function toggleMap(field) {
    setMapSettings(function (previous) {
      return {
        ...previous,
        [field]: !previous[field]
      };
    });
  }

  function saveSettings() {
    setSaved(true);

    setTimeout(function () {
      setSaved(false);
    }, 3000);
  }

  function resetSettings() {
    setNotifications({
      aiAlerts: true,
      projectAlerts: true,
      complaintAlerts: true,
      evidenceAlerts: true,
      deadlineAlerts: true,
      emailNotifications: false
    });

    setAiSettings({
      evidenceVerification: true,
      gpsVerification: true,
      duplicateDetection: true,
      progressAnalysis: true,
      humanReview: true
    });

    setMapSettings({
      defaultMap: "street",
      showProjects: true,
      showCritical: true,
      showDelayed: true,
      showFieldReports: true
    });
  }

  function renderToggle(label, description, checked, onChange) {
    return React.createElement(
      "div",
      { className: "settings-toggle-row" },

      React.createElement(
        "div",
        { className: "settings-toggle-info" },

        React.createElement(
          "strong",
          null,
          label
        ),

        React.createElement(
          "small",
          null,
          description
        )
      ),

      React.createElement(
        "button",
        {
          type: "button",
          className:
            "settings-toggle " +
            (checked ? "active" : ""),
          onClick: onChange,
          "aria-pressed": checked
        },

        React.createElement(
          "span",
          null
        )
      )
    );
  }

  function renderProfile() {
    return React.createElement(
      "div",
      { className: "settings-content" },

      React.createElement(
        "div",
        { className: "settings-section-card" },

        React.createElement(
          "div",
          { className: "settings-section-header" },

          React.createElement(
            "div",
            { className: "settings-section-icon blue" },
            "👤"
          ),

          React.createElement(
            "div",
            null,

            React.createElement(
              "h2",
              null,
              "Administrator Profile"
            ),

            React.createElement(
              "p",
              null,
              "Manage your government administrator account information."
            )
          )
        ),

        React.createElement(
          "div",
          { className: "settings-profile-box" },

          React.createElement(
            "div",
            { className: "settings-avatar-large" },
            "A"
          ),

          React.createElement(
            "div",
            null,

            React.createElement(
              "strong",
              null,
              profile.name
            ),

            React.createElement(
              "span",
              null,
              profile.role
            ),

            React.createElement(
              "small",
              null,
              "ProjectWatch Nepal Administrator"
            )
          )
        ),

        React.createElement(
          "div",
          { className: "settings-form-grid" },

          React.createElement(
            "div",
            { className: "settings-field" },

            React.createElement(
              "label",
              null,
              "FULL NAME"
            ),

            React.createElement("input", {
              value: profile.name,
              onChange: function (e) {
                updateProfile("name", e.target.value);
              }
            })
          ),

          React.createElement(
            "div",
            { className: "settings-field" },

            React.createElement(
              "label",
              null,
              "EMAIL ADDRESS"
            ),

            React.createElement("input", {
              type: "email",
              value: profile.email,
              onChange: function (e) {
                updateProfile("email", e.target.value);
              }
            })
          ),

          React.createElement(
            "div",
            { className: "settings-field" },

            React.createElement(
              "label",
              null,
              "PHONE NUMBER"
            ),

            React.createElement("input", {
              value: profile.phone,
              onChange: function (e) {
                updateProfile("phone", e.target.value);
              }
            })
          ),

          React.createElement(
            "div",
            { className: "settings-field" },

            React.createElement(
              "label",
              null,
              "DEPARTMENT"
            ),

            React.createElement("input", {
              value: profile.department,
              onChange: function (e) {
                updateProfile(
                  "department",
                  e.target.value
                );
              }
            })
          )
        )
      ),

      React.createElement(
        "div",
        { className: "settings-section-card" },

        React.createElement(
          "div",
          { className: "settings-section-header" },

          React.createElement(
            "div",
            { className: "settings-section-icon purple" },
            "🔐"
          ),

          React.createElement(
            "div",
            null,

            React.createElement(
              "h2",
              null,
              "Security"
            ),

            React.createElement(
              "p",
              null,
              "Manage account security and authentication settings."
            )
          )
        ),

        React.createElement(
          "div",
          { className: "settings-security-list" },

          React.createElement(
            "div",
            { className: "settings-security-item" },

            React.createElement(
              "div",
              null,

              React.createElement(
                "strong",
                null,
                "Password"
              ),

              React.createElement(
                "small",
                null,
                "Last changed 30 days ago"
              )
            ),

            React.createElement(
              "button",
              { className: "settings-outline-button" },
              "Change Password"
            )
          ),

          React.createElement(
            "div",
            { className: "settings-security-item" },

            React.createElement(
              "div",
              null,

              React.createElement(
                "strong",
                null,
                "Two-Factor Authentication"
              ),

              React.createElement(
                "small",
                null,
                "Additional protection for administrator account"
              )
            ),

            React.createElement(
              "span",
              { className: "settings-enabled-badge" },
              "Enabled"
            )
          ),

          React.createElement(
            "div",
            { className: "settings-security-item" },

            React.createElement(
              "div",
              null,

              React.createElement(
                "strong",
                null,
                "Active Sessions"
              ),

              React.createElement(
                "small",
                null,
                "1 active administrator session"
              )
            ),

            React.createElement(
              "button",
              { className: "settings-outline-button" },
              "View Sessions"
            )
          )
        )
      )
    );
  }

  function renderNotifications() {
    return React.createElement(
      "div",
      { className: "settings-content" },

      React.createElement(
        "div",
        { className: "settings-section-card" },

        React.createElement(
          "div",
          { className: "settings-section-header" },

          React.createElement(
            "div",
            { className: "settings-section-icon orange" },
            "🔔"
          ),

          React.createElement(
            "div",
            null,

            React.createElement(
              "h2",
              null,
              "Notification Preferences"
            ),

            React.createElement(
              "p",
              null,
              "Choose which project events should generate alerts."
            )
          )
        ),

        renderToggle(
          "AI Verification Alerts",
          "Notify administrators when potential discrepancies are detected.",
          notifications.aiAlerts,
          function () {
            toggleNotification("aiAlerts");
          }
        ),

        renderToggle(
          "Project Alerts",
          "Receive important project status and progress notifications.",
          notifications.projectAlerts,
          function () {
            toggleNotification("projectAlerts");
          }
        ),

        renderToggle(
          "Citizen Complaint Alerts",
          "Notify when citizens submit new complaints.",
          notifications.complaintAlerts,
          function () {
            toggleNotification("complaintAlerts");
          }
        ),

        renderToggle(
          "Evidence Submission Alerts",
          "Notify when field officers submit new evidence.",
          notifications.evidenceAlerts,
          function () {
            toggleNotification("evidenceAlerts");
          }
        ),

        renderToggle(
          "Deadline Alerts",
          "Notify when project deadlines are approaching.",
          notifications.deadlineAlerts,
          function () {
            toggleNotification("deadlineAlerts");
          }
        ),

        renderToggle(
          "Email Notifications",
          "Send selected system notifications to administrator email.",
          notifications.emailNotifications,
          function () {
            toggleNotification("emailNotifications");
          }
        )
      )
    );
  }

  function renderAI() {
    return React.createElement(
      "div",
      { className: "settings-content" },

      React.createElement(
        "div",
        { className: "settings-section-card" },

        React.createElement(
          "div",
          { className: "settings-section-header" },

          React.createElement(
            "div",
            { className: "settings-section-icon purple" },
            "🤖"
          ),

          React.createElement(
            "div",
            null,

            React.createElement(
              "h2",
              null,
              "AI Verification Settings"
            ),

            React.createElement(
              "p",
              null,
              "Configure automated project evidence verification."
            )
          )
        ),

        React.createElement(
          "div",
          { className: "settings-ai-notice" },

          React.createElement(
            "span",
            null,
            "ⓘ"
          ),

          React.createElement(
            "p",
            null,
            "AI results are advisory only. Potential discrepancies should be reviewed by authorized human personnel before further action."
          )
        ),

        renderToggle(
          "Evidence Verification",
          "Analyze uploaded photos and videos for consistency.",
          aiSettings.evidenceVerification,
          function () {
            toggleAI("evidenceVerification");
          }
        ),

        renderToggle(
          "GPS Verification",
          "Compare evidence coordinates with registered project locations.",
          aiSettings.gpsVerification,
          function () {
            toggleAI("gpsVerification");
          }
        ),

        renderToggle(
          "Duplicate Evidence Detection",
          "Identify potentially reused or duplicate project evidence.",
          aiSettings.duplicateDetection,
          function () {
            toggleAI("duplicateDetection");
          }
        ),

        renderToggle(
          "Progress Analysis",
          "Compare reported progress with expected project progress.",
          aiSettings.progressAnalysis,
          function () {
            toggleAI("progressAnalysis");
          }
        ),

        renderToggle(
          "Human Review Requirement",
          "Require human review before an AI flag is treated as verified.",
          aiSettings.humanReview,
          function () {
            toggleAI("humanReview");
          }
        )
      )
    );
  }

  function renderMapSettings() {
    return React.createElement(
      "div",
      { className: "settings-content" },

      React.createElement(
        "div",
        { className: "settings-section-card" },

        React.createElement(
          "div",
          { className: "settings-section-header" },

          React.createElement(
            "div",
            { className: "settings-section-icon green" },
            "🗺️"
          ),

          React.createElement(
            "div",
            null,

            React.createElement(
              "h2",
              null,
              "Map Settings"
            ),

            React.createElement(
              "p",
              null,
              "Configure the default ProjectWatch Nepal map experience."
            )
          )
        ),

        React.createElement(
          "div",
          { className: "settings-field settings-map-select" },

          React.createElement(
            "label",
            null,
            "DEFAULT MAP STYLE"
          ),

          React.createElement(
            "select",
            {
              value: mapSettings.defaultMap,
              onChange: function (e) {
                setMapSettings(function (previous) {
                  return {
                    ...previous,
                    defaultMap: e.target.value
                  };
                });
              }
            },

            React.createElement(
              "option",
              { value: "street" },
              "Street Map"
            ),

            React.createElement(
              "option",
              { value: "satellite" },
              "Satellite Map"
            )
          )
        ),

        renderToggle(
          "Show Project Markers",
          "Display registered government projects on the live map.",
          mapSettings.showProjects,
          function () {
            toggleMap("showProjects");
          }
        ),

        renderToggle(
          "Show Critical Projects",
          "Highlight projects requiring urgent attention.",
          mapSettings.showCritical,
          function () {
            toggleMap("showCritical");
          }
        ),

        renderToggle(
          "Show Delayed Projects",
          "Highlight projects currently behind schedule.",
          mapSettings.showDelayed,
          function () {
            toggleMap("showDelayed");
          }
        ),

        renderToggle(
          "Show Field Reports",
          "Display field report locations on the live map.",
          mapSettings.showFieldReports,
          function () {
            toggleMap("showFieldReports");
          }
        )
      )
    );
  }

  function renderUsers() {
    return React.createElement(
      "div",
      { className: "settings-content" },

      React.createElement(
        "div",
        { className: "settings-section-card" },

        React.createElement(
          "div",
          { className: "settings-section-header" },

          React.createElement(
            "div",
            { className: "settings-section-icon blue" },
            "👥"
          ),

          React.createElement(
            "div",
            null,

            React.createElement(
              "h2",
              null,
              "Users & Roles"
            ),

            React.createElement(
              "p",
              null,
              "Manage authorized personnel and system access."
            )
          )
        ),

        React.createElement(
          "div",
          { className: "settings-role-grid" },

          React.createElement(
            "div",
            { className: "settings-role-card" },

            React.createElement(
              "span",
              null,
              "👑"
            ),

            React.createElement(
              "strong",
              null,
              "Super Admin"
            ),

            React.createElement(
              "small",
              null,
              "Full system access"
            ),

            React.createElement(
              "b",
              null,
              "2 users"
            )
          ),

          React.createElement(
            "div",
            { className: "settings-role-card" },

            React.createElement(
              "span",
              null,
              "🛡️"
            ),

            React.createElement(
              "strong",
              null,
              "Government Admin"
            ),

            React.createElement(
              "small",
              null,
              "Project management access"
            ),

            React.createElement(
              "b",
              null,
              "18 users"
            )
          ),

          React.createElement(
            "div",
            { className: "settings-role-card" },

            React.createElement(
              "span",
              null,
              "📍"
            ),

            React.createElement(
              "strong",
              null,
              "Field Officer"
            ),

            React.createElement(
              "small",
              null,
              "Field report and evidence access"
            ),

            React.createElement(
              "b",
              null,
              "126 users"
            )
          ),

          React.createElement(
            "div",
            { className: "settings-role-card" },

            React.createElement(
              "span",
              null,
              "👤"
            ),

            React.createElement(
              "strong",
              null,
              "Reviewer"
            ),

            React.createElement(
              "small",
              null,
              "Verification and review access"
            ),

            React.createElement(
              "b",
              null,
              "34 users"
            )
          )
        ),

        React.createElement(
          "button",
          {
            className: "settings-primary-button",
            onClick: function () {
              alert("User management module will be connected to the backend.");
            }
          },
          "+ Manage Users"
        )
      )
    );
  }

  function renderAudit() {
    return React.createElement(
      "div",
      { className: "settings-content" },

      React.createElement(
        "div",
        { className: "settings-section-card" },

        React.createElement(
          "div",
          { className: "settings-section-header" },

          React.createElement(
            "div",
            { className: "settings-section-icon orange" },
            "📋"
          ),

          React.createElement(
            "div",
            null,

            React.createElement(
              "h2",
              null,
              "Audit Log"
            ),

            React.createElement(
              "p",
              null,
              "Track important administrative actions across the platform."
            )
          )
        ),

        React.createElement(
          "div",
          { className: "settings-audit-list" },

          React.createElement(
            "div",
            { className: "settings-audit-item" },

            React.createElement(
              "span",
              null,
              "✓"
            ),

            React.createElement(
              "div",
              null,

              React.createElement(
                "strong",
                null,
                "Evidence marked as verified"
              ),

              React.createElement(
                "small",
                null,
                "Administrator • EV-2026-00481 • 12 minutes ago"
              )
            )
          ),

          React.createElement(
            "div",
            { className: "settings-audit-item" },

            React.createElement(
              "span",
              null,
              "!"
            ),

            React.createElement(
              "div",
              null,

              React.createElement(
                "strong",
                null,
                "Complaint status changed"
              ),

              React.createElement(
                "small",
                null,
                "Administrator • CP-2026-00981 • 42 minutes ago"
              )
            )
          ),

          React.createElement(
            "div",
            { className: "settings-audit-item" },

            React.createElement(
              "span",
              null,
              "+"
            ),

            React.createElement(
              "div",
              null,

              React.createElement(
                "strong",
                null,
                "New project registered"
              ),

              React.createElement(
                "small",
                null,
                "Government Admin • PW-BAG-00203 • Yesterday"
              )
            )
          ),

          React.createElement(
            "div",
            { className: "settings-audit-item" },

            React.createElement(
              "span",
              null,
              "⚙"
            ),

            React.createElement(
              "div",
              null,

              React.createElement(
                "strong",
                null,
                "System settings updated"
              ),

              React.createElement(
                "small",
                null,
                "Super Admin • Notification settings • 2 days ago"
              )
            )
          )
        )
      )
    );
  }

  function renderActiveContent() {
    if (activeTab === "profile") {
      return renderProfile();
    }

    if (activeTab === "notifications") {
      return renderNotifications();
    }

    if (activeTab === "ai") {
      return renderAI();
    }

    if (activeTab === "map") {
      return renderMapSettings();
    }

    if (activeTab === "users") {
      return renderUsers();
    }

    if (activeTab === "audit") {
      return renderAudit();
    }

    return renderProfile();
  }

  const tabs = [
    {
      id: "profile",
      icon: "👤",
      label: "Profile"
    },
    {
      id: "notifications",
      icon: "🔔",
      label: "Notifications"
    },
    {
      id: "ai",
      icon: "🤖",
      label: "AI Verification"
    },
    {
      id: "map",
      icon: "🗺️",
      label: "Map Settings"
    },
    {
      id: "users",
      icon: "👥",
      label: "Users & Roles"
    },
    {
      id: "audit",
      icon: "📋",
      label: "Audit Log"
    }
  ];

  return React.createElement(
    "main",
    { className: "settings-page" },

    /* HEADER */

    React.createElement(
      "div",
      { className: "settings-page-header" },

      React.createElement(
        "div",
        null,

        React.createElement(
          "div",
          { className: "breadcrumb" },

          "ProjectWatch Nepal",

          React.createElement(
            "span",
            null,
            "/"
          ),

          " Settings"
        ),

        React.createElement(
          "h1",
          null,
          "System Settings"
        ),

        React.createElement(
          "p",
          null,
          "Manage platform configuration, security and administrative controls."
        )
      ),

      React.createElement(
        "div",
        { className: "settings-header-actions" },

        React.createElement(
          "button",
          {
            className: "settings-reset-button",
            onClick: resetSettings
          },
          "Reset"
        ),

        React.createElement(
          "button",
          {
            className: "settings-save-button",
            onClick: saveSettings
          },
          "✓ Save Changes"
        )
      )
    ),

    /* SUCCESS */

    saved
      ? React.createElement(
          "div",
          { className: "settings-save-message" },

          React.createElement(
            "span",
            null,
            "✓"
          ),

          React.createElement(
            "div",
            null,

            React.createElement(
              "strong",
              null,
              "Settings saved successfully"
            ),

            React.createElement(
              "small",
              null,
              "Your ProjectWatch Nepal configuration has been updated."
            )
          )
        )
      : null,

    /* SETTINGS LAYOUT */

    React.createElement(
      "div",
      { className: "settings-layout" },

      /* SIDEBAR */

      React.createElement(
        "aside",
        { className: "settings-nav" },

        React.createElement(
          "div",
          { className: "settings-nav-title" },
          "SETTINGS"
        ),

        tabs.map(function (tab) {
          return React.createElement(
            "button",
            {
              key: tab.id,
              className:
                "settings-nav-item " +
                (activeTab === tab.id ? "active" : ""),
              onClick: function () {
                setActiveTab(tab.id);
              }
            },

            React.createElement(
              "span",
              { className: "settings-nav-icon" },
              tab.icon
            ),

            React.createElement(
              "span",
              null,
              tab.label
            )
          );
        }),

        React.createElement(
          "div",
          { className: "settings-system-status" },

          React.createElement(
            "span",
            { className: "settings-status-dot" }
          ),

          React.createElement(
            "div",
            null,

            React.createElement(
              "strong",
              null,
              "System Online"
            ),

            React.createElement(
              "small",
              null,
              "All services operational"
            )
          )
        )
      ),

      /* CONTENT */

      React.createElement(
        "div",
        { className: "settings-main-content" },

        renderActiveContent()
      )
    )
  );
}

export default Settings;