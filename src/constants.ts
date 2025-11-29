export const ECOMMERCE_CORE_URL = import.meta.env.VITE_API_ECOMMERCE_CORE_URL;
export const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;
import axios from "axios";

export const coreAxiosInstance = axios.create({
  baseURL: ECOMMERCE_CORE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

coreAxiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
 
 
 