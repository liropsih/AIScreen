import { getAuthToken, onAuthError } from "@/service/Auth";
import { onError } from "@/service/Toast";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  config => {
    // можно перенести в экземпляр api
    config.headers.Authorization = getAuthToken();
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      if (error.response.status === 401) {
        onAuthError(error.response.data?.message);
      }
    } else if (error.request) {
      onError("Server is not responding");
    } else {
      onError(`Request error: ${error.message || "Unknown"}`);
    }
    return Promise.reject(error);
  },
);

export default api;
