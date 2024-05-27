// src\utils\api.ts

import axios, { AxiosInstance } from "axios";
import { parseCookies } from "nookies";

const baseURL = "http://localhost:3000";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: baseURL,
});

axiosInstance.interceptors.request.use((config) => {
  const { "auth.token": token } = parseCookies();

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
    // config.headers["Authorization"] = `${token}`;
  }
  return config;
});

export default axiosInstance;

export const api = axiosInstance;
