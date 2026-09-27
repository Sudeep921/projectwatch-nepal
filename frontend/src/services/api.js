const API_BASE_URL =
  "http://localhost:8000/api";

// ========================================
// API REQUEST
// ========================================

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

  // ======================================
  // JSON CONTENT TYPE
  // ======================================

  if (
    options.body &&
    !(options.body instanceof FormData)
  ) {
    headers["Content-Type"] =
      "application/json";
  }

  // ======================================
  // JWT AUTHORIZATION
  // ======================================

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  try {
    const response =
      await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
          ...options,
          headers
        }
      );

    let data = {};

    try {
      data =
        await response.json();
    } catch (error) {
      data = {};
    }

    if (!response.ok) {
      const error =
        new Error(
          data.message ||
          `Server error: ${response.status}`
        );

      error.status =
        response.status;

      throw error;
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


// ========================================
// AUTH
// ========================================

// LOGIN

export const loginUser = async (
  email,
  password
) => {
  const data =
    await apiRequest(
      "/auth/login",
      {
        method: "POST",

        body:
          JSON.stringify({
            email,
            password
          })
      }
    );

  const authData =
    data?.data ||
    data;

  const token =
    authData?.token ||
    authData?.accessToken;

  const user =
    authData?.user ||
    data?.user ||
    null;

  if (token) {
    localStorage.setItem(
      "projectwatch_token",
      token
    );
  }

  if (user) {
    localStorage.setItem(
      "projectwatch_user",
      JSON.stringify(user)
    );
  }

  return {
    ...authData,
    token,
    user
  };
};


// REGISTER

export const registerUser = (
  userData
) =>
  apiRequest(
    "/auth/register",
    {
      method: "POST",

      body:
        JSON.stringify(
          userData
        )
    }
  );


// CURRENT USER

export const getCurrentUser = () =>
  apiRequest(
    "/auth/me"
  );


// ========================================
// PROJECTS
// ========================================

export const getProjects = () =>
  apiRequest(
    "/projects"
  );


export const getProject = (
  id
) =>
  apiRequest(
    `/projects/${id}`
  );


export const createProject = (
  projectData
) =>
  apiRequest(
    "/projects",
    {
      method: "POST",

      body:
        JSON.stringify(
          projectData
        )
    }
  );


export const updateProject = (
  id,
  projectData
) =>
  apiRequest(
    `/projects/${id}`,
    {
      method: "PUT",

      body:
        JSON.stringify(
          projectData
        )
    }
  );


export const deleteProject = (
  id
) =>
  apiRequest(
    `/projects/${id}`,
    {
      method: "DELETE"
    }
  );


// ========================================
// SEARCH PROJECTS
// ========================================

export const searchProjects = (
  params = {}
) => {
  const query =
    new URLSearchParams(
      params
    ).toString();

  return apiRequest(
    `/projects/search?${query}`
  );
};


// ========================================
// PROJECT TIMELINE
// ========================================

export const getProjectTimeline = (
  id
) =>
  apiRequest(
    `/projects/${id}/timeline`
  );


// ========================================
// PROJECT OVERVIEW
// ========================================

export const getProjectOverview = (
  id
) =>
  apiRequest(
    `/projects/${id}`
  );


// ========================================
// USERS
// ========================================

export const getUsers = () =>
  apiRequest(
    "/users"
  );


// ========================================
// MY SETTINGS
// ========================================

export const getMySettings = () =>
  apiRequest(
    "/users/settings"
  );


export const updateMySettings = (
  settings
) =>
  apiRequest(
    "/users/settings",
    {
      method: "PUT",

      body:
        JSON.stringify(
          settings
        )
    }
  );


// ========================================
// UPDATE USER STATUS
// ========================================

export const updateUserStatus = (
  id,
  isActive
) =>
  apiRequest(
    `/users/${id}/status`,
    {
      method: "PUT",

      body:
        JSON.stringify({
          isActive
        })
    }
  );


// ========================================
// UPDATE USER ROLE
// ========================================

export const updateUserRole = (
  id,
  role
) =>
  apiRequest(
    `/users/${id}/role`,
    {
      method: "PUT",

      body:
        JSON.stringify({
          role
        })
    }
  );


// ========================================
// AUDIT / SYSTEM
// ========================================

export const getAuditLogs = () =>
  apiRequest(
    "/audit"
  );


export const getSystemHealth = () =>
  apiRequest(
    "/health"
  );


export const checkApiHealth = () =>
  apiRequest(
    "/health"
  );


// ========================================
// DASHBOARD
// ========================================

export const getDashboardStats = () =>
  apiRequest(
    "/dashboard/stats"
  );


export const getProjectStatusSummary = () =>
  apiRequest(
    "/dashboard/project-status"
  );


export const getProvinceSummary = () =>
  apiRequest(
    "/dashboard/provinces"
  );


// ========================================
// FIELD REPORTS
// ========================================

export const getFieldReports = () =>
  apiRequest(
    "/field-reports"
  );


export const createFieldReport = (
  data
) =>
  apiRequest(
    "/field-reports",
    {
      method: "POST",

      body:
        JSON.stringify(data)
    }
  );


export const updateFieldReport = (
  id,
  data
) =>
  apiRequest(
    `/field-reports/${id}`,
    {
      method: "PUT",

      body:
        JSON.stringify(data)
    }
  );


export const deleteFieldReport = (
  id
) =>
  apiRequest(
    `/field-reports/${id}`,
    {
      method: "DELETE"
    }
  );


// ========================================
// COMPLAINTS
// ========================================

export const getComplaints = () =>
  apiRequest(
    "/complaints"
  );


export const createComplaint = (
  data
) =>
  apiRequest(
    "/complaints",
    {
      method: "POST",

      body:
        JSON.stringify(data)
    }
  );


export const updateComplaint = (
  id,
  data
) =>
  apiRequest(
    `/complaints/${id}`,
    {
      method: "PUT",

      body:
        JSON.stringify(data)
    }
  );


export const updateComplaintStatus = (
  id,
  status,
  response = ""
) =>
  apiRequest(
    `/complaints/${id}/status`,
    {
      method: "PUT",

      body:
        JSON.stringify({
          status,
          response
        })
    }
  );


// ========================================
// PUBLIC COMPLAINT
// ========================================

export const submitPublicComplaint = (
  data
) =>
  apiRequest(
    "/complaints",
    {
      method: "POST",

      body:
        JSON.stringify(data)
    }
  );


// ========================================
// EVIDENCE
// ========================================

export const getEvidence = () =>
  apiRequest(
    "/evidence"
  );


export const uploadEvidence = (
  formData
) =>
  apiRequest(
    "/evidence/upload",
    {
      method: "POST",

      body: formData
    }
  );


export const createEvidence = (
  data
) =>
  apiRequest(
    "/evidence",
    {
      method: "POST",

      body:
        JSON.stringify(data)
    }
  );


// ========================================
// REVIEW EVIDENCE
// ========================================

export const reviewEvidence = (
  id,
  status,
  reviewNote = ""
) =>
  apiRequest(
    `/evidence/${id}/review`,
    {
      method: "PUT",

      body:
        JSON.stringify({
          status,
          reviewNote
        })
    }
  );


// ========================================
// ANALYZE EVIDENCE
// ========================================

export const analyzeEvidence = (
  id,
  projectProgress,
  reportedProgress
) =>
  apiRequest(
    `/evidence/${id}/analyze`,
    {
      method: "POST",

      body:
        JSON.stringify({
          projectProgress,
          reportedProgress
        })
    }
  );


// ========================================
// VERIFICATION
// ========================================

export const getVerifications = () =>
  apiRequest(
    "/verifications"
  );


export const createVerification = (
  data
) =>
  apiRequest(
    "/verifications",
    {
      method: "POST",

      body:
        JSON.stringify(data)
    }
  );


// ========================================
// REVIEW VERIFICATION
// ========================================

export const reviewVerification = (
  id,
  status,
  note = ""
) =>
  apiRequest(
    `/verifications/${id}/review`,
    {
      method: "PUT",

      body:
        JSON.stringify({
          status,
          note
        })
    }
  );


// ========================================
// NOTIFICATIONS
// ========================================

export const getNotifications = () =>
  apiRequest(
    "/notifications"
  );


export const getMyNotifications = () =>
  apiRequest(
    "/notifications/mine"
  );


// ========================================
// UNREAD NOTIFICATION COUNT
// ========================================

export const getUnreadNotificationCount =
  async () => {

    const data =
      await getMyNotifications();

    const notifications =
      Array.isArray(data)
        ? data
        : data?.notifications ||
          data?.data ||
          [];

    return notifications.filter(
      (notification) =>
        !notification.isRead
    ).length;
  };


// ========================================
// CREATE NOTIFICATION
// ========================================

export const createNotification = (
  data
) =>
  apiRequest(
    "/notifications",
    {
      method: "POST",

      body:
        JSON.stringify(data)
    }
  );


// ========================================
// MARK NOTIFICATION READ
// ========================================

export const markNotificationRead = (
  id
) =>
  apiRequest(
    `/notifications/${id}/read`,
    {
      method: "PUT"
    }
  );


export const markNotificationAsRead = (
  id
) =>
  markNotificationRead(id);


// ========================================
// MARK ALL NOTIFICATIONS READ
// ========================================

export const markAllNotificationsRead =
  () =>
    apiRequest(
      "/notifications/read-all",
      {
        method: "PUT"
      }
    );


export const markAllNotificationsAsRead =
  () =>
    markAllNotificationsRead();


// ========================================
// DELETE NOTIFICATION
// ========================================

export const deleteNotification = (
  id
) =>
  apiRequest(
    `/notifications/${id}`,
    {
      method: "DELETE"
    }
  );


// ========================================
// ALERTS
// ========================================

export const getAlerts = () =>
  apiRequest(
    "/alerts"
  );


export const resolveAlert = (
  id
) =>
  apiRequest(
    `/alerts/${id}/resolve`,
    {
      method: "PUT"
    }
  );


export const generateAlerts = () =>
  apiRequest(
    "/alerts/generate",
    {
      method: "POST"
    }
  );


// ========================================
// PUBLIC PROJECTS
// ========================================

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
  apiRequest(
    "/public/summary"
  );


// ========================================
// GENERATE PROJECT CODE
// ========================================

export const generateProjectCode =
  () =>
    apiRequest(
      "/projects/generate-code"
    );


// ========================================
// REPORTS
// ========================================

export const getProjectReport = () =>
  apiRequest(
    "/reports/projects"
  );


// ========================================
// LOGOUT
// ========================================

export const logoutUser = () => {

  localStorage.removeItem(
    "projectwatch_token"
  );

  localStorage.removeItem(
    "projectwatch_user"
  );
};


// ========================================
// DEFAULT EXPORT
// ========================================

export default apiRequest;