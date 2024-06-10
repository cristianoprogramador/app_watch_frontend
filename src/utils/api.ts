// src\utils\api.ts

import axios, { AxiosInstance } from "axios";
import { parseCookies } from "nookies";
import i18n from "../i18n";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const { "auth.token": token } = parseCookies();

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  config.headers["Accept-Language"] = i18n.language;

  return config;
});

export default axiosInstance;

export const api = axiosInstance;
