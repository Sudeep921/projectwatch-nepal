import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  getEvidence,
  getProjects,
  uploadEvidence,
  reviewEvidence,
  deleteEvidence
} from "../services/api";

const h = React.createElement;

const Evidence = () => {
  const [evidence, setEvidence] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [reviewFilter, setReviewFilter] = useState("all");
  const [file, setFile] = useState(null);
  const [selectedProject, setSelectedProject] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [evidenceResponse, projectResponse] =
        await Promise.all([
          getEvidence(),
          getProjects()
        ]);

      const evidenceData =
        evidenceResponse?.evidence ||
        evidenceResponse?.data ||
        [];

      const projectData =
        projectResponse?.projects ||
        projectResponse?.data ||
        [];

      setEvidence(
        Array.isArray(evidenceData)
          ? evidenceData
          : []
      );

      setProjects(
        Array.isArray(projectData)
          ? projectData
          : []
      );
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
        "Failed to load evidence."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const projectName = (item) => {
    if (
      item.project &&
      typeof item.project === "object"
    ) {
      return (
        item.project.name ||
        item.project.projectName ||
        item.project.projectCode ||
        "Unknown Project"
      );
    }

    const project = projects.find(
      (p) =>
        String(p._id) ===
        String(item.project)
    );

    return (
      project?.name ||
      project?.projectName ||
      project?.projectCode ||
      "Unknown Project"
    );
  };

  const reviewStatus = (item) =>
    String(
      item.reviewStatus ||
      item.status ||
      "Pending"
    ).toLowerCase();

  const filtered = useMemo(() => {
    const q = search
      .trim()
      .toLowerCase();

    return evidence.filter((item) => {
      const name =
        String(
          item.fileName ||
          item.filename ||
          item.name ||
          ""
        ).toLowerCase();

      const desc =
        String(
          item.description ||
          ""
        ).toLowerCase();

      const pName =
        projectName(item).toLowerCase();

      const matchesSearch =
        !q ||
        name.includes(q) ||
        desc.includes(q) ||
        pName.includes(q);

      const itemProject =
        item.project &&
        typeof item.project === "object"
          ? item.project._id
          : item.project;

      const matchesProject =
        projectFilter === "all" ||
        String(itemProject) ===
          String(projectFilter);

      const matchesReview =
        reviewFilter === "all" ||
        reviewStatus(item) ===
          reviewFilter;

      return (
        matchesSearch &&
        matchesProject &&
        matchesReview
      );
    });
  }, [
    evidence,
    projects,
    search,
    projectFilter,
    reviewFilter
  ]);

  const handleUpload = async () => {
    if (!file) {
      window.alert(
        "Please select a file first."
      );
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append(
        "file",
        file
      );

      if (selectedProject) {
        formData.append(
          "project",
          selectedProject
        );
      }

      if (description.trim()) {
        formData.append(
          "description",
          description.trim()
        );
      }

      await uploadEvidence(
        formData
      );

      setFile(null);
      setSelectedProject("");
      setDescription("");

      const input =
        document.getElementById(
          "evidence-file-input"
        );

      if (input) {
        input.value = "";
      }

      await loadData();

      window.alert(
        "Evidence uploaded successfully."
      );
    } catch (err) {
      window.alert(
        err.message ||
        "Evidence upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleReview = async (
    item,
    status
  ) => {
    try {
      await reviewEvidence(
        item._id,
        status
      );

      await loadData();
    } catch (err) {
      window.alert(
        err.message ||
        "Review update failed."
      );
    }
  };

  const handleDelete = async (
    item
  ) => {
    if (
      !window.confirm(
        "Delete this evidence?"
      )
    ) {
      return;
    }

    try {
      await deleteEvidence(
        item._id
      );

      setEvidence((current) =>
        current.filter(
          (x) =>
            x._id !== item._id
        )
      );
    } catch (err) {
      window.alert(
        err.message ||
        "Delete failed."
      );
    }
  };

  const formatDate = (value) => {
    if (!value) return "—";

    try {
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
    } catch {
      return "—";
    }
  };

  if (loading) {
    return h(
      "div",
      {
        className:
          "evidence-page"
      },
      h(
        "div",
        {
          className:
            "page-loading"
        },
        "Loading evidence..."
      )
    );
  }

  return h(
    "div",
    {
      className:
        "evidence-page"
    },

    h(
      "div",
      {
        className:
          "evidence-header"
      },

      h(
        "div",
        null,

        h(
          "h1",
          null,
          "Evidence"
        ),

        h(
          "p",
          null,
          "Manage project photos, documents and field evidence."
        )
      ),

      h(
        "button",
        {
          className:
            "evidence-refresh-btn",
          onClick: loadData
        },
        "↻ Refresh"
      )
    ),

    error
      ? h(
          "div",
          {
            className:
              "evidence-error"
          },
          error
        )
      : null,

    h(
      "div",
      {
        className:
          "evidence-upload-card"
      },

      h(
        "h2",
        null,
        "Upload Evidence"
      ),

      h(
        "div",
        {
          className:
            "evidence-upload-grid"
        },

        h(
          "input",
          {
            id:
              "evidence-file-input",
            type: "file",
            onChange: (e) =>
              setFile(
                e.target.files?.[0] ||
                null
              )
          }
        ),

        h(
          "select",
          {
            value:
              selectedProject,
            onChange: (e) =>
              setSelectedProject(
                e.target.value
              )
          },

          h(
            "option",
            { value: "" },
            "Select Project"
          ),

          projects.map(
            (project) =>
              h(
                "option",
                {
                  key:
                    project._id,
                  value:
                    project._id
                },
                project.name ||
                  project.projectName ||
                  project.projectCode
              )
          )
        ),

        h(
          "input",
          {
            type: "text",
            value:
              description,
            onChange: (e) =>
              setDescription(
                e.target.value
              ),
            placeholder:
              "Evidence description"
          }
        ),

        h(
          "button",
          {
            className:
              "evidence-upload-btn",
            onClick:
              handleUpload,
            disabled:
              uploading
          },
          uploading
            ? "Uploading..."
            : "Upload Evidence"
        )
      )
    ),

    h(
      "div",
      {
        className:
          "evidence-filters"
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
            "Search evidence..."
        }
      ),

      h(
        "select",
        {
          value:
            projectFilter,
          onChange: (e) =>
            setProjectFilter(
              e.target.value
            )
        },

        h(
          "option",
          { value: "all" },
          "All Projects"
        ),

        projects.map(
          (project) =>
            h(
              "option",
              {
                key:
                  project._id,
                value:
                  project._id
              },
              project.name ||
                project.projectName ||
                project.projectCode
            )
        )
      ),

      h(
        "select",
        {
          value:
            reviewFilter,
          onChange: (e) =>
            setReviewFilter(
              e.target.value
            )
        },

        h(
          "option",
          { value: "all" },
          "All Reviews"
        ),

        h(
          "option",
          { value: "pending" },
          "Pending"
        ),

        h(
          "option",
          { value: "approved" },
          "Approved"
        ),

        h(
          "option",
          { value: "rejected" },
          "Rejected"
        )
      )
    ),

    h(
      "div",
      {
        className:
          "evidence-grid"
      },

      filtered.map(
        (item) =>
          h(
            "div",
            {
              key:
                item._id,
              className:
                "evidence-card"
            },

            h(
              "div",
              {
                className:
                  "evidence-card-icon"
              },
              "📎"
            ),

            h(
              "div",
              {
                className:
                  "evidence-card-body"
              },

              h(
                "strong",
                null,
                item.fileName ||
                  item.filename ||
                  item.name ||
                  "Evidence File"
              ),

              h(
                "span",
                null,
                projectName(item)
              ),

              h(
                "p",
                null,
                item.description ||
                  "No description"
              ),

              h(
                "small",
                null,
                formatDate(
                  item.createdAt ||
                  item.uploadedAt
                )
              ),

              h(
                "span",
                {
                  className:
                    `evidence-review-status ${reviewStatus(
                      item
                    )}`
                },
                reviewStatus(item)
              ),

              h(
                "div",
                {
                  className:
                    "evidence-actions"
                },

                h(
                  "button",
                  {
                    onClick: () =>
                      handleReview(
                        item,
                        "approved"
                      )
                  },
                  "Approve"
                ),

                h(
                  "button",
                  {
                    onClick: () =>
                      handleReview(
                        item,
                        "rejected"
                      )
                  },
                  "Reject"
                ),

                h(
                  "button",
                  {
                    className:
                      "danger",
                    onClick: () =>
                      handleDelete(
                        item
                      )
                  },
                  "Delete"
                )
              )
            )
          )
      )
    ),

    !filtered.length
      ? h(
          "div",
          {
            className:
              "evidence-empty"
          },
          "No evidence found."
        )
      : null
  );
};

export default Evidence;