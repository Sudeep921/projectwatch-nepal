import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification
} from "../services/api";

const h = React.createElement;

const Notifications = () => {
  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const loadNotifications = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const result =
        await getNotifications();

      const data =
        result?.notifications ??
        result?.data ??
        result ??
        [];

      setNotifications(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(err);

      setError(
        err?.message ||
        "Failed to load notifications."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const getNotificationId = (
    notification
  ) => {
    return (
      notification?._id ||
      notification?.id ||
      ""
    );
  };

  const isRead = (notification) => {
    return (
      notification?.read === true ||
      notification?.isRead === true ||
      notification?.status === "read"
    );
  };

  const getTitle = (notification) => {
    return (
      notification?.title ||
      notification?.subject ||
      "Notification"
    );
  };

  const getMessage = (notification) => {
    return (
      notification?.message ||
      notification?.description ||
      notification?.body ||
      "No notification message."
    );
  };

  const getType = (notification) => {
    return (
      notification?.type ||
      notification?.notificationType ||
      "General"
    );
  };

  const getDate = (notification) => {
    return (
      notification?.createdAt ||
      notification?.date ||
      notification?.timestamp ||
      null
    );
  };

  const formatDate = (value) => {
    if (!value) {
      return "Unknown date";
    }

    const date = new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "Unknown date";
    }

    return date.toLocaleString();
  };

  const filteredNotifications =
    useMemo(() => {
      if (filter === "unread") {
        return notifications.filter(
          (item) => !isRead(item)
        );
      }

      if (filter === "read") {
        return notifications.filter(
          (item) => isRead(item)
        );
      }

      return notifications;
    }, [
      notifications,
      filter
    ]);

  const unreadCount =
    notifications.filter(
      (item) => !isRead(item)
    ).length;

  const readCount =
    notifications.filter(
      (item) => isRead(item)
    ).length;

  const handleMarkRead = async (
    notification
  ) => {
    const id =
      getNotificationId(
        notification
      );

    if (!id || isRead(notification)) {
      return;
    }

    try {
      await markNotificationRead(
        id
      );

      setNotifications(
        (previous) =>
          previous.map(
            (item) => {
              if (
                String(
                  getNotificationId(item)
                ) !== String(id)
              ) {
                return item;
              }

              return {
                ...item,
                read: true,
                isRead: true,
                status: "read"
              };
            }
          )
      );
    } catch (err) {
      console.error(err);

      setError(
        err?.message ||
        "Failed to mark notification as read."
      );
    }
  };

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) {
      return;
    }

    try {
      await markAllNotificationsRead();

      setNotifications(
        (previous) =>
          previous.map(
            (item) => ({
              ...item,
              read: true,
              isRead: true,
              status: "read"
            })
          )
      );
    } catch (err) {
      console.error(err);

      setError(
        err?.message ||
        "Failed to mark all notifications as read."
      );
    }
  };

  const handleDelete = async (
    notification
  ) => {
    const id =
      getNotificationId(
        notification
      );

    if (!id) {
      return;
    }

    try {
      await deleteNotification(
        id
      );

      setNotifications(
        (previous) =>
          previous.filter(
            (item) =>
              String(
                getNotificationId(item)
              ) !== String(id)
          )
      );
    } catch (err) {
      console.error(err);

      setError(
        err?.message ||
        "Failed to delete notification."
      );
    }
  };

  const getTypeClass = (type) => {
    return String(type)
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  if (loading) {
    return h(
      "div",
      {
        className:
          "notifications-page"
      },

      h(
        "div",
        {
          className:
            "notifications-loading"
        },
        "Loading notifications..."
      )
    );
  }

  return h(
    "div",
    {
      className:
        "notifications-page"
    },

    h(
      "div",
      {
        className:
          "notifications-header"
      },

      h(
        "div",
        null,

        h(
          "h1",
          null,
          "Notifications"
        ),

        h(
          "p",
          null,
          "Stay updated with ProjectWatch Nepal activities."
        )
      ),

      h(
        "button",
        {
          className:
            "notifications-refresh",
          onClick: () =>
            loadNotifications(true),
          disabled: refreshing
        },
        refreshing
          ? "Refreshing..."
          : "↻ Refresh"
      )
    ),

    error &&
      h(
        "div",
        {
          className:
            "notifications-error"
        },
        error
      ),

    h(
      "div",
      {
        className:
          "notifications-summary"
      },

      h(
        "div",
        {
          className:
            "notification-summary-card"
        },

        h(
          "div",
          {
            className:
              "notification-summary-icon"
          },
          "🔔"
        ),

        h(
          "div",
          null,

          h(
            "strong",
            null,
            notifications.length
          ),

          h(
            "span",
            null,
            "Total Notifications"
          )
        )
      ),

      h(
        "div",
        {
          className:
            "notification-summary-card"
        },

        h(
          "div",
          {
            className:
              "notification-summary-icon"
          },
          "●"
        ),

        h(
          "div",
          null,

          h(
            "strong",
            null,
            unreadCount
          ),

          h(
            "span",
            null,
            "Unread"
          )
        )
      ),

      h(
        "div",
        {
          className:
            "notification-summary-card"
        },

        h(
          "div",
          {
            className:
              "notification-summary-icon"
          },
          "✓"
        ),

        h(
          "div",
          null,

          h(
            "strong",
            null,
            readCount
          ),

          h(
            "span",
            null,
            "Read"
          )
        )
      )
    ),

    h(
      "div",
      {
        className:
          "notifications-toolbar"
      },

      h(
        "div",
        {
          className:
            "notification-tabs"
        },

        h(
          "button",
          {
            className:
              filter === "all"
                ? "active"
                : "",
            onClick: () =>
              setFilter("all")
          },
          "All"
        ),

        h(
          "button",
          {
            className:
              filter === "unread"
                ? "active"
                : "",
            onClick: () =>
              setFilter("unread")
          },
          "Unread",
          unreadCount > 0
            ? " (" +
                unreadCount +
                ")"
            : ""
        ),

        h(
          "button",
          {
            className:
              filter === "read"
                ? "active"
                : "",
            onClick: () =>
              setFilter("read")
          },
          "Read"
        )
      ),

      h(
        "button",
        {
          className:
            "mark-all-read-button",
          onClick:
            handleMarkAllRead,
          disabled:
            unreadCount === 0
        },
        "✓ Mark All as Read"
      )
    ),

    filteredNotifications.length === 0
      ? h(
          "div",
          {
            className:
              "notifications-empty"
          },

          h(
            "div",
            {
              className:
                "notifications-empty-icon"
            },
            "🔔"
          ),

          h(
            "h3",
            null,
            filter === "unread"
              ? "No unread notifications"
              : filter === "read"
              ? "No read notifications"
              : "No notifications"
          ),

          h(
            "p",
            null,
            "You're all caught up."
          )
        )

      : h(
          "div",
          {
            className:
              "notifications-list"
          },

          filteredNotifications.map(
            (
              notification,
              index
            ) => {
              const read =
                isRead(
                  notification
                );

              const type =
                getType(
                  notification
                );

              return h(
                "div",
                {
                  key:
                    getNotificationId(
                      notification
                    ) ||
                    index,
                  className:
                    "notification-card " +
                    (!read
                      ? "unread"
                      : "")
                },

                h(
                  "div",
                  {
                    className:
                      "notification-icon " +
                      getTypeClass(
                        type
                      )
                  },
                  type
                    .toLowerCase()
                    .includes(
                      "alert"
                    )
                    ? "⚠"
                    : type
                        .toLowerCase()
                        .includes(
                          "project"
                        )
                    ? "📁"
                    : type
                        .toLowerCase()
                        .includes(
                          "report"
                        )
                    ? "📋"
                    : "🔔"
                ),

                h(
                  "div",
                  {
                    className:
                      "notification-content"
                  },

                  h(
                    "div",
                    {
                      className:
                        "notification-card-header"
                    },

                    h(
                      "div",
                      null,

                      h(
                        "h3",
                        null,
                        getTitle(
                          notification
                        )
                      ),

                      h(
                        "span",
                        {
                          className:
                            "notification-type"
                        },
                        type
                      )
                    ),

                    !read &&
                      h(
                        "span",
                        {
                          className:
                            "notification-unread-dot"
                        },
                        "NEW"
                      )
                  ),

                  h(
                    "p",
                    {
                      className:
                        "notification-message"
                    },
                    getMessage(
                      notification
                    )
                  ),

                  h(
                    "div",
                    {
                      className:
                        "notification-card-footer"
                    },

                    h(
                      "span",
                      {
                        className:
                          "notification-date"
                      },
                      "🕒 ",
                      formatDate(
                        getDate(
                          notification
                        )
                      )
                    ),

                    h(
                      "div",
                      {
                        className:
                          "notification-actions"
                      },

                      !read &&
                        h(
                          "button",
                          {
                            onClick: () =>
                              handleMarkRead(
                                notification
                              )
                          },
                          "✓ Mark Read"
                        ),

                      h(
                        "button",
                        {
                          className:
                            "notification-delete",
                          onClick: () =>
                            handleDelete(
                              notification
                            )
                        },
                        "🗑 Delete"
                      )
                    )
                  )
                )
              );
            }
          )
        )
  );
};

export default Notifications;