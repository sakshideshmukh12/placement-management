
import type { AxiosRequestConfig } from "axios";
import { apiClient } from "./client";

export const http = {
  async get<TResponse>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    const response = await apiClient.get<TResponse>(url, config);
    return response.data;
  },

  async post<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    const response = await apiClient.post<TResponse>(url, body, config);
    return response.data;
  },

  async put<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    const response = await apiClient.put<TResponse>(url, body, config);
    return response.data;
  },

  async patch<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    const response = await apiClient.patch<TResponse>(url, body, config);
    return response.data;
  },

  async delete<TResponse = void>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    const response = await apiClient.delete<TResponse>(url, config);
    return response.data;
  },
};
