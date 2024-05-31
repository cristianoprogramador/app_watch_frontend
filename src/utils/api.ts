// src\utils\api.ts

import axios, { AxiosInstance } from "axios";
import { parseCookies } from "nookies";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const { "auth.token": token } = parseCookies();

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;

export const api = axiosInstance;
