import React, {
  useEffect,
  useState
} from "react";

import {
  getPublicProjects
} from "../services/api";

import PublicMapComponent from
  "../components/PublicMap";

const PublicMapPage = () => {
  const [projects, setProjects] =
    useState([]);

  useEffect(() => {
    getPublicProjects()
      .then((data) => {
        setProjects(
          data.projects ||
          data.data ||
          []
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return React.createElement(
    "div",
    {
      className:
        "public-map-page"
    },

    React.createElement(
      "div",
      {
        className:
          "public-page-back"
      },

      React.createElement(
        "a",
        {
          href: "/"
        },
        "← Public Portal"
      )
    ),

    React.createElement(
      PublicMapComponent,
      {
        projects
      }
    )
  );
};

export default PublicMapPage;