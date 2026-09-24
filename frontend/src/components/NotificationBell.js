import React, {
  useEffect,
  useState
} from "react";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsAsRead
} from "../services/api";

const h = React.createElement;

const NotificationBell = () => {
  const [
    notifications,
    setNotifications
  ] = useState([]);

  const [
    open,
    setOpen
  ] = useState(false);

  const load =
    async () => {
      try {
        const data =
          await getNotifications();

        setNotifications(
          data.notifications ||
            data.data ||
            []
        );
      } catch (error) {
        console.error(error);
      }
    };

  useEffect(() => {
    load();

    const timer =
      setInterval(
        load,
        30000
      );

    return () =>
      clearInterval(timer);
  }, []);

  const unread =
    notifications.filter(
      (x) =>
        !x.isRead &&
        !x.read
    ).length;

  const read =
    async (item) => {
      try {
        await markNotificationRead(
          item._id
        );

        load();
      } catch (error) {
        console.error(error);
      }
    };

  const readAll =
    async () => {
      try {
        await markAllNotificationsAsRead();
        load();
      } catch (error) {
        console.error(error);
      }
    };

  return h(
    "div",
    {
      className:
        "notification-wrapper"
    },

    h(
      "button",
      {
        className:
          "notification-button",
        onClick: () =>
          setOpen(!open)
      },
      "🔔",

      unread
        ? h(
            "span",
            {
              className:
                "notification-count"
            },
            unread > 99
              ? "99+"
              : unread
          )
        : null
    ),

    open
      ? h(
          "div",
          {
            className:
              "notification-panel"
          },

          h(
            "div",
            {
              className:
                "notification-header"
            },

            h(
              "strong",
              null,
              "Notifications"
            ),

            unread
              ? h(
                  "button",
                  {
                    onClick:
                      readAll
                  },
                  "Mark all"
                )
              : null
          ),

          notifications.length
            ? notifications.map(
                (item) =>
                  h(
                    "div",
                    {
                      key:
                        item._id,
                      className:
                        "notification-item",
                      onClick: () =>
                        read(item)
                    },

                    h(
                      "strong",
                      null,
                      item.title ||
                        "Notification"
                    ),

                    h(
                      "p",
                      null,
                      item.message ||
                        ""
                    ),

                    h(
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
            : h(
                "div",
                {
                  className:
                    "notification-empty"
                },
                "No notifications"
              )
        )
      : null
  );
};

export default NotificationBell;