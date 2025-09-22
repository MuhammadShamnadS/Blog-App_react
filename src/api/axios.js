import axios from "axios";

// Create Axios instance
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach access token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip login endpoints from retry logic
    if (originalRequest?.url?.includes("/login")) {
      return Promise.reject(error);
    }

    // Handle 401: unauthorized → force logout
    if (error.response?.status === 401) {
      if (originalRequest._retry) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(error);
      }
      originalRequest._retry = true;
    }
    if (error.response) {
      const { status, data } = error.response;

      let customError = {
        code: "UNKNOWN",
        message: "Unexpected error occurred. Please try again.",
      };

      if (status === 404 && data?.error === "Resource not found") {
        customError = {
          code: "NOT_FOUND",
          message: "The resource you are looking for is no longer available.",
        };
      } else if (status === 403) {
        customError = {
          code: "FORBIDDEN",
          message: "You don’t have permission to perform this action.",
        };
      } else if (status === 500) {
        customError = {
          code: "SERVER_ERROR",
          message: "Something went wrong on our side. Please try again later.",
        };
      } else if (status === 422) {
        customError = {
          code: "VALIDATION_ERROR",
          message: data?.message || "Invalid input. Please check your data.",
        };
      }

      return Promise.reject(customError);
    }

    return Promise.reject({
      code: "NETWORK_ERROR",
      message: "Network error. Please check your connection.",
    });
  }
);

export default instance;
