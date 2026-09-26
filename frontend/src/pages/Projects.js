import React, {
  useEffect,
  useMemo,
  useState
} from "react";


import {
  useNavigate
} from "react-router-dom";

import {
  getProjects
} from "../services/api";

import ProjectFilters from
  "../components/ProjectFilters";

import ProjectTable from
  "../components/ProjectTable";
import {
  updateProject,
  deleteProject
} from "../services/api";

const h = React.createElement;

const Projects = () => {
  const navigate =
    useNavigate();

  const [
    projects,
    setProjects
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    search,
    setSearch
  ] = useState("");

  const [
    province,
    setProvince
  ] = useState(
    "All Provinces"
  );

  const [
    status,
    setStatus
  ] = useState(
    "All Status"
  );

  const [
    risk,
    setRisk
  ] = useState(
    "All Risk"
  );

  const load =
    async () => {
      try {
        setLoading(true);

        const data =
          await getProjects();

        setProjects(
          data.projects ||
            data.data ||
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

  const filtered =
    useMemo(
      () =>
        projects.filter(
          (p) => {
            const text =
              `${p.name || ""} ${
                p.projectCode ||
                ""
              } ${
                p.district || ""
              }`.toLowerCase();

            return (
              (!search ||
                text.includes(
                  search.toLowerCase()
                )) &&
              (
                province ===
                  "All Provinces" ||
                p.province ===
                  province
              ) &&
              (
                status ===
                  "All Status" ||
                p.status ===
                  status
              ) &&
              (
                risk ===
                  "All Risk" ||
                p.riskLevel ===
                  risk
              )
            );
          }
        ),
      [
        projects,
        search,
        province,
        status,
        risk
      ]
    );

  return h(
    "div",
    {
      className:
        "page projects-page"
    },

   h(
  "div",
  {
    className:
      "page-heading projects-heading"
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
      "PROJECT MANAGEMENT"
    ),

    h(
      "h1",
      null,
      "Government Projects"
    ),

    h(
      "p",
      null,
      "Monitor, verify and manage government development projects across Nepal."
    )
  ),

  h(
    "button",
    {
      className:
        "primary-button",
      onClick: () =>
        navigate(
          "/admin/projects/new"
        )
    },
    "+ Add New Project"
  )
),

    h(
      ProjectFilters,
      {
        search,
        setSearch,
        province,
        setProvince,
        status,
        setStatus,
        risk,
        setRisk,
        onClear: () => {
          setSearch("");
          setProvince(
            "All Provinces"
          );
          setStatus(
            "All Status"
          );
          setRisk(
            "All Risk"
          );
        }
      }
    ),

    loading
      ? h(
          "div",
          {
            className:
              "page-loading"
          },
          "Loading projects..."
        )
      : h(
          ProjectTable,
          {
            projects: filtered
          }
        )
  );
};

export default Projects;