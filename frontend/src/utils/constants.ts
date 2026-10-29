
export const API_BASE_URL_V1 = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS_V1 = {
  // Authentication
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  AUTH_ME: "/auth/me",


  // Students
  STUDENTS: "/students",

  // Companies
  COMPANIES: "/companies",

  // Placement Drives
  PLACEMENT_DRIVES: "/placement-drives",
  PLACEMENT_DRIVES_ANALYTICS: "/placement-drives/analytics",

  // Applications
  APPLICATIONS: "/applications",

  DASHBOARD: {
    SUMMARY: "/dashboard/summary",
  },

  // Interviews
  INTERVIEWS: "/interviews",
} as const;
