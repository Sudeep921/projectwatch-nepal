const API_BASE_URL =
  "http://localhost:8000/api";

const apiRequest = async (
  endpoint,
  options = {}
) => {
  const token =
    localStorage.getItem(
      "projectwatch_token"
    );

  const headers = {
    ...(options.headers || {})
  };

  if (
    options.body &&
    !(options.body instanceof FormData)
  ) {
    headers["Content-Type"] =
      "application/json";
  }

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers
    }
  );

  let data;

  try {
    data = await response.json();
  } catch (error) {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Something went wrong"
    );
  }

  return data;
};


/* =========================
   AUTH
========================= */

export const loginUser = (
  email,
  password
) => {
  return apiRequest(
    "/auth/login",
    {
      method: "POST",

      body: JSON.stringify({
        email,
        password
      })
    }
  );
};


export const registerUser = (
  userData
) => {
  return apiRequest(
    "/auth/register",
    {
      method: "POST",

      body: JSON.stringify(userData)
    }
  );
};


export const getCurrentUser = () => {
  return apiRequest("/auth/me");
};


/* =========================
   LOGOUT
========================= */

export const logoutUser = () => {
  localStorage.removeItem(
    "projectwatch_token"
  );

  localStorage.removeItem(
    "projectwatch_user"
  );
};


/* =========================
   PROJECTS
========================= */

export const getProjects = () => {
  return apiRequest("/projects");
};


export const getProject = (
  id
) => {
  return apiRequest(
    `/projects/${id}`
  );
};


export const createProject = (
  projectData
) => {
  return apiRequest(
    "/projects",
    {
      method: "POST",

      body: JSON.stringify(
        projectData
      )
    }
  );
};


export const updateProject = (
  id,
  projectData
) => {
  return apiRequest(
    `/projects/${id}`,
    {
      method: "PUT",

      body: JSON.stringify(
        projectData
      )
    }
  );
};


export const deleteProject = (
  id
) => {
  return apiRequest(
    `/projects/${id}`,
    {
      method: "DELETE"
    }
  );
};


/* =========================
   DASHBOARD
========================= */

export const getDashboardStats = () => {
  return apiRequest(
    "/dashboard/stats"
  );
};


export const getProjectStatusSummary =
  () => {
    return apiRequest(
      "/dashboard/project-status"
    );
  };


export const getProvinceSummary = () => {
  return apiRequest(
    "/dashboard/provinces"
  );
};


/* =========================
   FIELD REPORTS
========================= */

export const getFieldReports = () => {
  return apiRequest(
    "/field-reports"
  );
};


export const createFieldReport = (
  report
) => {
  return apiRequest(
    "/field-reports",
    {
      method: "POST",

      body: JSON.stringify(
        report
      )
    }
  );
};


/* =========================
   COMPLAINTS
========================= */

export const getComplaints = () => {
  return apiRequest(
    "/complaints"
  );
};


export const createComplaint = (
  complaint
) => {
  return apiRequest(
    "/complaints",
    {
      method: "POST",

      body: JSON.stringify(
        complaint
      )
    }
  );
};


/* =========================
   ALERTS
========================= */

export const getAlerts = () => {
  return apiRequest(
    "/alerts"
  );
};


/* =========================
   NOTIFICATIONS
========================= */

export const getNotifications = () => {
  return apiRequest(
    "/notifications"
  );
};


/* =========================
   PUBLIC
========================= */

export const getPublicProjects = () => {
  return apiRequest(
    "/public/projects"
  );
};


export const getPublicSummary = () => {
  return apiRequest(
    "/public/summary"
  );
};


/* =========================
   REPORTS
========================= */

export const getProjectReport = () => {
  return apiRequest(
    "/reports/projects"
  );
};


/* =========================
   AI
========================= */

export const analyzeEvidence = (
  evidenceId,
  reportedProgress
) => {
  return apiRequest(
    `/ai/evidence/${evidenceId}`,
    {
      method: "POST",

      body: JSON.stringify({
        reportedProgress
      })
    }
  );
};