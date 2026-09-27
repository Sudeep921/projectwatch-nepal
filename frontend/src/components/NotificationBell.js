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
  const navigate =
    useNavigate();

  const [
    notifications,
    setNotifications
  ] = useState([]);

  const [
    open,
    setOpen
  ] = useState(false);

  const [
    loading,
    setLoading
  ] = useState(false);


  // ========================================
  // LOAD NOTIFICATIONS
  // ========================================

  const load = async () => {
    try {
      setLoading(true);

      const data =
        await getNotifications();

      const notificationData =
        Array.isArray(data)
          ? data
          : data?.notifications ||
            data?.data ||
            [];

      setNotifications(
        Array.isArray(notificationData)
          ? notificationData
          : []
      );

    } catch (error) {

      console.error(
        "NOTIFICATION LOAD ERROR:",
        error
      );

      setNotifications([]);

    } finally {

      setLoading(false);

    }
  };


  // ========================================
  // INITIAL LOAD + AUTO REFRESH
  // ========================================

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


  // ========================================
  // UNREAD COUNT
  // ========================================

  const unread =
    notifications.filter(
      (item) =>
        !item.isRead &&
        !item.read
    ).length;


  // ========================================
  // OPEN NOTIFICATIONS PAGE
  // ========================================

  const openNotifications =
    () => {

      setOpen(false);

      navigate(
        "/admin/notifications"
      );

    };


  // ========================================
  // READ SINGLE NOTIFICATION
  // ========================================

  const read =
    async (item) => {

      try {

        if (
          item?._id &&
          !item.isRead &&
          !item.read
        ) {

          await markNotificationRead(
            item._id
          );

          setNotifications(
            (previous) =>
              previous.map(
                (notification) =>
                  notification._id ===
                  item._id
                    ? {
                        ...notification,
                        isRead: true,
                        read: true
                      }
                    : notification
              )
          );
        }

      } catch (error) {

        console.error(
          "READ NOTIFICATION ERROR:",
          error
        );

      }

    };


  // ========================================
  // MARK ALL AS READ
  // ========================================

  const readAll =
    async (event) => {

      if (event) {
        event.stopPropagation();
      }

      try {

        await markAllNotificationsAsRead();

        setNotifications(
          (previous) =>
            previous.map(
              (notification) => ({
                ...notification,
                isRead: true,
                read: true
              })
            )
        );

      } catch (error) {

        console.error(
          "MARK ALL ERROR:",
          error
        );

      }

    };


  // ========================================
  // BELL CLICK
  // ========================================

  const handleBellClick =
    () => {

      setOpen(
        (previous) =>
          !previous
      );

    };


  // ========================================
  // RENDER
  // ========================================

  return h(
    "div",
    {
      className:
        "notification-wrapper"
    },


    // ======================================
    // BELL BUTTON
    // ======================================

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


    // ======================================
    // NOTIFICATION PANEL
    // ======================================

    open
      ? h(
          "div",
          {
            className:
              "notification-panel"
          },


          // =================================
          // HEADER
          // =================================

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
              "div",
              {
                className:
                  "notification-header-actions"
              },

              unread > 0
                ? h(
                    "button",
                    {
                      type: "button",

                      onClick:
                        readAll
                    },

                    "Mark all"
                  )

                : null,

              h(
                "button",
                {
                  type: "button",

                  onClick:
                    openNotifications,

                  className:
                    "notification-view-all"
                },

                "View all"
              )
            )
          ),


          // =================================
          // LOADING
          // =================================

          loading

            ? h(
                "div",
                {
                  className:
                    "notification-empty"
                },

                "Loading notifications..."
              )

            : null,


          // =================================
          // NOTIFICATION LIST
          // =================================

          !loading &&
          notifications.length > 0

            ? h(
                "div",
                {
                  className:
                    "notification-list"
                },

                notifications
                  .slice(0, 5)
                  .map(
                    (item) =>
                      h(
                        "div",
                        {
                          key:
                            item._id,

                          className:
                            `notification-item ${
                              !item.isRead &&
                              !item.read
                                ? "unread"
                                : ""
                            }`,

                          onClick:
                            () =>
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
              )

            : null,


          // =================================
          // EMPTY
          // =================================

          !loading &&
          notifications.length === 0

            ? h(
                "div",
                {
                  className:
                    "notification-empty"
                },

                "No notifications"
              )

            : null,


          // =================================
          // VIEW ALL FOOTER
          // =================================

          !loading &&
          notifications.length > 5

            ? h(
                "button",
                {
                  type: "button",

                  className:
                    "notification-view-all-bottom",

                  onClick:
                    openNotifications
                },

                "View all notifications →"
              )

            : null
        )

      : null
  );
};

export default NotificationBell;