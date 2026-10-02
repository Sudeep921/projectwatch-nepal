import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  getComplaints,
  updateComplaintStatus,
  updateComplaint
} from "../services/api";

const h = React.createElement;

const Complaints = () => {
  const [complaints, setComplaints] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("all");

  const [priority, setPriority] =
    useState("all");

  const load = async () => {
    try {
      setLoading(true);

      const response =
        await getComplaints();

      const data =
        response?.complaints ||
        response?.data ||
        [];

      setComplaints(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered =
    useMemo(() => {
      const q =
        search
          .trim()
          .toLowerCase();

      return complaints.filter(
        (item) => {
          const text =
            `${item.complaintId || ""} ${
              item.citizenName || ""
            } ${
              item.citizenEmail || ""
            } ${
              item.description || ""
            } ${
              item.category || ""
            }`.toLowerCase();

          const itemStatus =
            String(
              item.status ||
              "Submitted"
            ).toLowerCase();

          const itemPriority =
            String(
              item.priority ||
              "Medium"
            ).toLowerCase();

          return (
            (!q ||
              text.includes(q)) &&
            (status === "all" ||
              itemStatus ===
                status) &&
            (priority === "all" ||
              itemPriority ===
                priority)
          );
        }
      );
    }, [
      complaints,
      search,
      status,
      priority
    ]);

  const changeStatus = async (
    item,
    nextStatus
  ) => {
    try {
      await updateComplaintStatus(
        item._id,
        nextStatus
      );

      setComplaints(
        (current) =>
          current.map((x) =>
            x._id === item._id
              ? {
                  ...x,
                  status:
                    nextStatus
                }
              : x
          )
      );
    } catch (err) {
      window.alert(
        err.message ||
        "Status update failed."
      );
    }
  };

  const formatDate = (value) => {
    if (!value) return "—";

    return new Date(
      value
    ).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric"
      }
    );
  };

  return h(
    "div",
    {
      className:
        "complaints-page"
    },

    h(
      "div",
      {
        className:
          "complaints-header"
      },

      h(
        "div",
        null,

        h(
          "h1",
          null,
          "Complaints"
        ),

        h(
          "p",
          null,
          "Review and manage public complaints."
        )
      ),

      h(
        "button",
        {
          className:
            "complaints-refresh-btn",
          onClick: load
        },
        "↻ Refresh"
      )
    ),

    h(
      "div",
      {
        className:
          "complaints-summary"
      },

      h(
        "div",
        null,

        h(
          "strong",
          null,
          complaints.length
        ),

        h(
          "span",
          null,
          "Total"
        )
      ),

      h(
        "div",
        null,

        h(
          "strong",
          null,
          complaints.filter(
            (x) =>
              String(
                x.status
              ).toLowerCase() ===
              "submitted"
          ).length
        ),

        h(
          "span",
          null,
          "Submitted"
        )
      ),

      h(
        "div",
        null,

        h(
          "strong",
          null,
          complaints.filter(
            (x) =>
              String(
                x.status
              ).toLowerCase() ===
              "in progress"
          ).length
        ),

        h(
          "span",
          null,
          "In Progress"
        )
      ),

      h(
        "div",
        null,

        h(
          "strong",
          null,
          complaints.filter(
            (x) =>
              String(
                x.status
              ).toLowerCase() ===
              "resolved"
          ).length
        ),

        h(
          "span",
          null,
          "Resolved"
        )
      )
    ),

    h(
      "div",
      {
        className:
          "complaints-filters"
      },

      h(
        "input",
        {
          value: search,

          onChange: (e) =>
            setSearch(
              e.target.value
            ),

          placeholder:
            "Search complaint, citizen, description..."
        }
      ),

      h(
        "select",
        {
          value: status,

          onChange: (e) =>
            setStatus(
              e.target.value
            )
        },

        h(
          "option",
          { value: "all" },
          "All Status"
        ),

        h(
          "option",
          {
            value:
              "submitted"
          },
          "Submitted"
        ),

        h(
          "option",
          {
            value:
              "under review"
          },
          "Under Review"
        ),

        h(
          "option",
          {
            value:
              "in progress"
          },
          "In Progress"
        ),

        h(
          "option",
          {
            value:
              "resolved"
          },
          "Resolved"
        ),

        h(
          "option",
          {
            value:
              "rejected"
          },
          "Rejected"
        )
      ),

      h(
        "select",
        {
          value: priority,

          onChange: (e) =>
            setPriority(
              e.target.value
            )
        },

        h(
          "option",
          { value: "all" },
          "All Priority"
        ),

        h(
          "option",
          {
            value: "low"
          },
          "Low"
        ),

        h(
          "option",
          {
            value: "medium"
          },
          "Medium"
        ),

        h(
          "option",
          {
            value: "high"
          },
          "High"
        ),

        h(
          "option",
          {
            value: "critical"
          },
          "Critical"
        )
      )
    ),

    loading
      ? h(
          "div",
          {
            className:
              "complaints-loading"
          },
          "Loading complaints..."
        )

      : h(
          "div",
          {
            className:
              "complaints-table-wrapper"
          },

          filtered.length
            ? h(
                "table",
                {
                  className:
                    "complaints-table"
                },

                h(
                  "thead",
                  null,

                  h(
                    "tr",
                    null,

                    h(
                      "th",
                      null,
                      "Complaint"
                    ),

                    h(
                      "th",
                      null,
                      "Citizen"
                    ),

                    h(
                      "th",
                      null,
                      "Category"
                    ),

                    h(
                      "th",
                      null,
                      "Priority"
                    ),

                    h(
                      "th",
                      null,
                      "Status"
                    ),

                    h(
                      "th",
                      null,
                      "Date"
                    ),

                    h(
                      "th",
                      null,
                      "Action"
                    )
                  )
                ),

                h(
                  "tbody",
                  null,

                  filtered.map(
                    (item) =>
                      h(
                        "tr",
                        {
                          key:
                            item._id
                        },

                        h(
                          "td",
                          null,

                          h(
                            "strong",
                            null,

                            item.complaintId ||
                              `CMP-${String(
                                item._id
                              ).slice(
                                -6
                              )}`
                          ),

                          h(
                            "p",
                            null,

                            item.description ||
                              "No description"
                          )
                        ),

                        h(
                          "td",
                          null,

                          item.citizenName ||
                            "Anonymous",

                          item.citizenEmail
                            ? h(
                                "small",
                                null,

                                item.citizenEmail
                              )
                            : null
                        ),

                        h(
                          "td",
                          null,

                          item.category ||
                            "Other"
                        ),

                        h(
                          "td",
                          null,

                          h(
                            "span",
                            {
                              className:
                                `complaint-priority ${
                                  String(
                                    item.priority ||
                                      "Medium"
                                  ).toLowerCase()
                                }`
                            },

                            item.priority ||
                              "Medium"
                          )
                        ),

                        h(
                          "td",
                          null,

                          h(
                            "select",
                            {
                              value:
                                item.status ||
                                "Submitted",

                              onChange:
                                (e) =>
                                  changeStatus(
                                    item,
                                    e.target
                                      .value
                                  )
                            },

                            h(
                              "option",
                              {
                                value:
                                  "Submitted"
                              },
                              "Submitted"
                            ),

                            h(
                              "option",
                              {
                                value:
                                  "Under Review"
                              },
                              "Under Review"
                            ),

                            h(
                              "option",
                              {
                                value:
                                  "In Progress"
                              },
                              "In Progress"
                            ),

                            h(
                              "option",
                              {
                                value:
                                  "Resolved"
                              },
                              "Resolved"
                            ),

                            h(
                              "option",
                              {
                                value:
                                  "Rejected"
                              },
                              "Rejected"
                            )
                          )
                        ),

                        h(
                          "td",
                          null,

                          formatDate(
                            item.createdAt
                          )
                        ),

                        h(
                          "td",
                          null,

                          h(
                            "button",
                            {
                              className:
                                "complaint-view-btn",

                              onClick:
                                () =>
                                  window.alert(
                                    item.description ||
                                      "No complaint details."
                                  )
                            },

                            "View"
                          )
                        )
                      )
                  )
                )
              )

            : h(
                "div",
                {
                  className:
                    "complaints-empty"
                },

                "No complaints found."
              )
        )
  );
};

export default Complaints;