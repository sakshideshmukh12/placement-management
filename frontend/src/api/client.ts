
import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL_V1 } from "../utils/constants";

if (!API_BASE_URL_V1) {
  throw new Error(
    "API_BASE_URL_V1 is not defined in the environment variables."
  );
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL_V1,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }
);
