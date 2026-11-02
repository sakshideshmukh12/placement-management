
import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL_V1 } from "../utils/constants";

if (!API_BASE_URL_V1) {
  throw new Error(
    "VITE_API_BASE_URL is not defined in the environment variables."
  );
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL_V1,
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

// Attach the token only to requests handled by this API client.
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    if (
      token &&
      config.url &&
      !/^https?:\/\//i.test(config.url)
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }
);

// Handle expired or invalid authentication consistently.
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  }
);
