const API_BASE_URL = "http://localhost:8000/api";

const apiRequest = async (endpoint, options = {}) => {
  const token =
    localStorage.getItem("projectwatch_token");

  const headers = {
    ...(options.headers || {})
  };

  if (
    options.body &&
    !(options.body instanceof FormData)
  ) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        headers
      }
    );

    let data = {};

    try {
      data = await response.json();
    } catch (error) {
      data = {};
    }

    if (!response.ok) {
      throw new Error(
        data.message ||
        `Server error: ${response.status}`
      );
    }

    return data;

  } catch (error) {
    console.error(
      "API REQUEST ERROR:",
      error
    );

    if (
      error.message ===
      "Failed to fetch"
    ) {
      throw new Error(
        "Backend server is not running. Please start ProjectWatch backend on port 8000."
      );
    }

    throw error;
  }
};


// ================================
// AUTH
// ================================

export const loginUser = (
  email,
  password
) =>
  apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password
    })
  });


export const registerUser = (
  userData
) =>
  apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData)
  });


export const getCurrentUser = () =>
  apiRequest("/auth/me");


// ================================
// PROJECTS
// ================================

export const getProjects = () =>
  apiRequest("/projects");


export const getProject = (id) =>
  apiRequest(`/projects/${id}`);


export const createProject = (
  projectData
) =>
  apiRequest("/projects", {
    method: "POST",
    body: JSON.stringify(projectData)
  });


export const updateProject = (
  id,
  projectData
) =>
  apiRequest(`/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(projectData)
  });


export const deleteProject = (id) =>
  apiRequest(`/projects/${id}`, {
    method: "DELETE"
  });


// ================================
// DASHBOARD
// ================================

export const getDashboardStats = () =>
  apiRequest("/dashboard/stats");


export const getProjectStatusSummary =
  () =>
    apiRequest(
      "/dashboard/project-status"
    );


export const getProvinceSummary = () =>
  apiRequest(
    "/dashboard/provinces"
  );


// ================================
// FIELD REPORTS
// ================================

export const getFieldReports = () =>
  apiRequest("/field-reports");


export const createFieldReport = (
  data
) =>
  apiRequest("/field-reports", {
    method: "POST",
    body: JSON.stringify(data)
  });


// ================================
// COMPLAINTS (admin/officer view)
// ================================

export const getComplaints = () =>
  apiRequest("/complaints");


export const createComplaint = (
  data
) =>
  apiRequest("/complaints", {
    method: "POST",
    body: JSON.stringify(data)
  });


export const updateComplaint = (
  id,
  data
) =>
  apiRequest(`/complaints/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });


// ================================
// PUBLIC COMPLAINT SUBMISSION
// (no login — citizen facing)
// ================================

export const submitPublicComplaint = (
  data
) =>
  apiRequest("/complaints", {
    method: "POST",
    body: JSON.stringify(data)
  });


// ================================
// EVIDENCE
// ================================

export const getEvidence = () =>
  apiRequest("/evidence");


export const uploadEvidence = (
  formData
) =>
  apiRequest("/evidence/upload", {
    method: "POST",
    body: formData
  });


export const createEvidence = (
  data
) =>
  apiRequest("/evidence", {
    method: "POST",
    body: JSON.stringify(data)
  });


// ================================
// VERIFICATION
// ================================

export const getVerifications = () =>
  apiRequest("/verifications");


export const createVerification = (
  data
) =>
  apiRequest("/verifications", {
    method: "POST",
    body: JSON.stringify(data)
  });


// ================================
// NOTIFICATIONS
// ================================

export const getNotifications = () =>
  apiRequest("/notifications");


export const getMyNotifications = () =>
  apiRequest("/notifications/mine");


export const createNotification = (
  data
) =>
  apiRequest("/notifications", {
    method: "POST",
    body: JSON.stringify(data)
  });


export const markNotificationAsRead = (
  id
) =>
  apiRequest(
    `/notifications/${id}/read`,
    {
      method: "PUT"
    }
  );


export const markNotificationRead = (
  id
) =>
  apiRequest(
    `/notifications/${id}/read`,
    {
      method: "PUT"
    }
  );


export const markAllNotificationsAsRead = () =>
  apiRequest(
    "/notifications/read-all",
    {
      method: "PUT"
    }
  );


export const deleteNotification = (
  id
) =>
  apiRequest(
    `/notifications/${id}`,
    {
      method: "DELETE"
    }
  );


// ================================
// ALERTS
// ================================

export const getAlerts = () =>
  apiRequest("/alerts");
export const resolveAlert =
  (id) =>
    apiRequest(
      `/alerts/${id}/resolve`,
      {
        method: "PUT"
      }
    );

export const generateAlerts =
  () =>
    apiRequest(
      "/alerts/generate",
      {
        method: "POST"
      }
    );

// ================================
// PUBLIC  (citizen facing, no login)
// ================================

export const getPublicProjects = (
  query = ""
) =>
  apiRequest(
    `/public/projects${query}`
  );


export const getPublicProject = (
  id
) =>
  apiRequest(
    `/public/projects/${id}`
  );


export const getPublicSummary = () =>
  apiRequest("/public/summary");


// ================================
// REPORTS
// ================================

export const getProjectReport = () =>
  apiRequest("/reports/projects");


// ================================
// AI
// ================================

export const analyzeEvidence = (
  evidenceId,
  reportedProgress
) =>
  apiRequest(
    `/ai/evidence/${evidenceId}`,
    {
      method: "POST",
      body: JSON.stringify({
        reportedProgress
      })
    }
  );


// ================================
// LOGOUT
// ================================

export const logoutUser = () => {
  localStorage.removeItem(
    "projectwatch_token"
  );

  localStorage.removeItem(
    "projectwatch_user"
  );
};