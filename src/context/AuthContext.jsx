import React, { createContext, useState, useEffect } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  // login
const login = async (username, password="") => {
  try {
    const res = await API.post("/login", { username, password });

    if (res.data?.token && res.data?.user) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
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


  // google login 
  const socialLogin = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
  };

  // logout
  const logout = async () => {
    try {
      await API.post("/logout"); 
    } catch (e) {
      console.warn("Logout API call failed:", e);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      window.location.href = "/login"; 
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, socialLogin, logout, setUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
