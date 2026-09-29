import React, {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsAsRead
} from "../services/api";

const h = React.createElement;

const NotificationBell = () => {
  const navigate = useNavigate();

  const [
    notifications,
    setNotifications
  ] = useState([]);

  const [
    open,
    setOpen
  ] = useState(false);

  const load = async () => {
    try {
      const data =
        await getNotifications();

      setNotifications(
        data?.notifications ||
        data?.data ||
        []
      );
    } catch (error) {
      console.error(
        "NOTIFICATION LOAD ERROR:",
        error
      );
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
      (item) =>
        !item.isRead &&
        !item.read
    ).length;

  const readNotification =
    async (item) => {
      try {
        if (item?._id) {
          await markNotificationRead(
            item._id
          );
        }

        await load();
      } catch (error) {
        console.error(error);
      }
    };

  const readAll =
    async () => {
      try {
        await markAllNotificationsAsRead();
        await load();
      } catch (error) {
        console.error(error);
      }
    };

  const handleBellClick =
    async () => {
      const willOpen = !open;

      setOpen(willOpen);

      if (
        willOpen &&
        unread > 0
      ) {
        await readAll();
      }
    };

  const visible =
    notifications.slice(0, 5);

  return h(
    "div",
    {
      className:
        "notification-wrapper"
    },

    h(
      "button",
      {
        type: "button",
        className:
          "notification-button",
        onClick:
          handleBellClick,
        title:
          "Notifications"
      },
      "🔔",

      unread > 0
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

            h(
              "button",
              {
                type: "button",
                onClick: readAll
              },
              "Mark all"
            )
          ),

          visible.length
            ? visible.map(
                (item) =>
                  h(
                    "div",
                    {
                      key:
                        item._id,
                      className:
                        "notification-item",
                      onClick:
                        async () => {
                          await readNotification(
                            item
                          );

                          navigate(
                            "/admin/notifications"
                          );

                          setOpen(false);
                        }
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
              ),

          notifications.length > 5
            ? h(
                "button",
                {
                  type: "button",
                  className:
                    "notification-view-all",
                  onClick: () => {
                    navigate(
                      "/admin/notifications"
                    );

                    setOpen(false);
                  }
                },
                "View all notifications →"
              )
            : null
        )
      : null
  );
};

export default NotificationBell;