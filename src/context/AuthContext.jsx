import React, { createContext, useState } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    return storedUser && token ? JSON.parse(storedUser) : null;
  });

  // login
  const login = async (username, password) => {
    try {
      const res = await API.post("/login", { username, password });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        return res.data.user;
      } else {
        throw new Error(res.data.error || res.data.message || "Login failed");
      }
    } catch (err) {
      throw err.response?.data?.error || "Login failed";
    }
  };

  // logout
  const logout = async () => {
    try {
      await API.post("/logout");
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
