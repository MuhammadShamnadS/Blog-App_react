// src/NotificationProvider.jsx
import { createContext, useContext, useEffect, useState } from "react";
import makeEcho from "../echo";
import API from "./api/axios"

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch current user (adjust endpoint if needed)
    API
      .get("/me", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const u = res.data;
        console.log("u",u);
        setUser(u);

        // Start Echo after we know the user
        const Echo = makeEcho();

        Echo.private(`App.Models.User.${u.id}`).notification((notification) => {
          console.log("New notification:", notification);
          setNotifications((prev) => [notification, ...prev]);
        });
      });
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, user }}>
      {children}
    </NotificationContext.Provider>
  );
}

// Custom hook for easier usage
export function useNotifications() {
  return useContext(NotificationContext);
}
