import axios from "axios";

let roleChangeHandler = null;
export const setRoleChangeHandler = (callback) => {
  roleChangeHandler = callback;
};

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    // Ignore login request
    if (originalRequest.url?.includes("/login")) return Promise.reject(error);

    // Handle 403: soft forbidden
    if (error.response?.status === 403) {
      if (roleChangeHandler) roleChangeHandler();
      return Promise.reject({ ...error.response.data, isSoftForbidden: true });
    }

    // Handle 401 or "User not found"
    if (
      error.response?.status === 401 ||
      error.response?.data?.error === "User not found"
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    const { status, data } = error.response || {};
    let customError = {
      code: "UNKNOWN",
      message: "Unexpected error occurred.",
    };

    if (status === 404 && data?.error === "Resource not found") {
      customError = { code: "NOT_FOUND", message: "Resource not found." };
    } else if (status === 403) {
      customError = {
        code: "FORBIDDEN",
        message: "You don’t have permission.",
      };
    } else if (status === 500) {
      customError = {
        code: "SERVER_ERROR",
        message: "Server error. Try later.",
      };
    } else if (status === 422) {
      customError = {
        code: "VALIDATION_ERROR",
        message: data?.message || "Invalid input.",
        errors: data?.errors || null,
      };
    }

    return Promise.reject(customError);
  }
);

export { API };
export default API;
