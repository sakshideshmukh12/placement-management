
import axios from "axios";

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

type ApiErrorResponse = {
  message?: unknown;
  error?: unknown;
};

export function normalizeApiError(error: unknown): ApiError {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const responseData = error.response?.data;

    const serverMessage =
      typeof responseData?.message === "string"
        ? responseData.message
        : typeof responseData?.error === "string"
          ? responseData.error
          : undefined;

    if (error.response) {
      return {
        message: serverMessage || "The request failed. Please try again.",
        status: error.response.status,
        code: error.code,
      };
    }

    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return {
        message: "The request timed out. Please try again.",
        code: error.code,
      };
    }

    if (error.request) {
      return {
        message: "Cannot connect to the server. Please check your connection.",
        code: error.code,
      };
    }

    return {
      message: "Unable to prepare the request. Please try again.",
      code: error.code,
    };
  }

  return {
    message: "An unexpected error occurred. Please try again.",
  };
}
