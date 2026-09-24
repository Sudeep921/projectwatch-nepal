import React, {
  useEffect,
  useState
} from "react";

import {
  getNotifications,
  createNotification
} from "../services/api";

const Notifications = () => {
  const [
    notifications,
    setNotifications
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const load =
    async () => {
      try {
        const data =
          await getNotifications();

        setNotifications(
          data.notifications ||
            []
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    load();
  }, []);

  const sendTest =
    async () => {
      try {
        await createNotification({
          title:
            "ProjectWatch Notification",

          message:
            "Notification system is working successfully.",

          type: "Info"
        });

        load();
      } catch (error) {
        console.error(error);
      }
    };

  return React.createElement(
    "div",
    {
      className:
        "page-container"
    },

    React.createElement(
      "div",
      {
        className:
          "page-header"
      },

      React.createElement(
        "div",
        null,

        React.createElement(
          "h1",
          {
            className:
              "page-title"
          },
          "Notifications"
        ),

        React.createElement(
          "p",
          {
            className:
              "page-description"
          },
          "System notifications and project updates."
        )
      ),

      React.createElement(
        "button",
        {
          className:
            "primary-button",
          onClick:
            sendTest
        },
        "Create Test Notification"
      )
    ),

    loading
      ? React.createElement(
          "div",
          {
            className:
              "empty-state"
          },
          "Loading notifications..."
        )
      : React.createElement(
          "div",
          {
            className:
              "notifications-list"
          },

          notifications.length === 0
            ? React.createElement(
                "div",
                {
                  className:
                    "empty-state"
                },
                "No notifications."
              )
            : notifications.map(
                (item) =>
                  React.createElement(
                    "div",
                    {
                      key:
                        item._id,
                      className:
                        `notification-item ${
                          item.read
                            ? "read"
                            : "unread"
                        }`
                    },

                    React.createElement(
                      "div",
                      {
                        className:
                          "notification-dot"
                    }
                    ),

                    React.createElement(
                      "div",
                      {
                        className:
                          "notification-content"
                      },

                      React.createElement(
                        "h3",
                        null,
                        item.title
                      ),

                      React.createElement(
                        "p",
                        null,
                        item.message
                      ),

                      React.createElement(
                        "small",
                        null,
                        item.createdAt
                          ? new Date(
                              item.createdAt
                            ).toLocaleString()
                          : ""
                      )
                    )
                  )
              )
        )
  );
};

export default Notifications;