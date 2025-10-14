import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { API, setRoleChangeHandler } from "../api/axios";
import authService from "../services/authService";
import RoleChangeModal from "../components/RoleChangeModal";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roleChangeOpen, setRoleChangeOpen] = useState(false);
  const navigate = useNavigate();

  // Show role change modal
  const showRoleChangeModal = () => setRoleChangeOpen(true);

  // Register role change handler with Axios
  useEffect(() => {
    setRoleChangeHandler(showRoleChangeModal);
    return () => setRoleChangeHandler(null);
  }, [showRoleChangeModal]);

  // Close role change modal & sync user role
  const handleRoleChangeClose = async () => {
    setRoleChangeOpen(false);
    await syncUserRole();
  };

  // Initialize user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  // Sync user role from backend
  const syncUserRole = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const res = await API.get("/me");
      if (res.data) {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        return res.data;
      }
    } catch (err) {
      console.error("Failed to sync user role:", err);
      logout();
      return null;
    }
  }, []);

  // login
  const login = async (username, password = "") => {
    try {
      const res = await authService.login(username, password);
      if (res.data?.token && res.data?.user) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        API.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
        return res.data.user;
      } else {
        const error = new Error(res.data.error || res.data.message || "Login failed");
        error.response = { data: res.data };
        throw error;
      }
    } catch (err) {
      if (err.response) throw err;
      const error = new Error(err?.message || "Login failed");
      error.response = { data: { error: err?.message || "Login failed" } };
      throw error;
    }
  };

  // social login
  const socialLogin = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
  };

  // logout
  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.warn("Logout failed:", e);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        socialLogin,
        fetchUser: syncUserRole,
        loading,
        syncUserRole,
        showRoleChangeModal,
      }}
    >
      {children}
      <RoleChangeModal open={roleChangeOpen} onClose={handleRoleChangeClose} />
    </AuthContext.Provider>
  );
};

export default AuthProvider;
