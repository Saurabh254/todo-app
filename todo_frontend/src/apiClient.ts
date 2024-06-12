import axios from "axios";
import applyCaseMiddleware from "axios-case-converter";
import { ACCESS_TOKEN_STORAGE_KEY } from "./constants";

export const apiClient = applyCaseMiddleware(
  axios.create({
    baseURL: "http://localhost:8080/api/v1/users",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN_STORAGE_KEY}`,
      "Content-Type": "application/json",
    },
  })
);

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
