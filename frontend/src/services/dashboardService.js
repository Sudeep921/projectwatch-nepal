import {
  getDashboardStats,
  getProjectStatusSummary,
  getProvinceSummary
} from "./api";

export const loadDashboard = async () => {
  const [
    stats,
    status,
    provinces
  ] = await Promise.all([
    getDashboardStats(),
    getProjectStatusSummary(),
    getProvinceSummary()
  ]);

  return {
    stats,
    status,
    provinces
  };
};