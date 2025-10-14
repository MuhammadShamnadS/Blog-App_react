import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import makeEcho from "./echo";
import API from "./api/axios";
import { Snackbar, Alert } from "@mui/material";
import { AuthContext } from "./context/AuthContext";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [snack, setSnack] = useState({ open: false, message: "" });
  const navigate = useNavigate();
  const [echoInstance, setEchoInstance] = useState(null);


  useEffect(() => {
    if (echoInstance) {
      echoInstance.disconnect && echoInstance.disconnect();
      setEchoInstance(null);
    }

    if (user && user.role === "guest") {
      const Echo = makeEcho();
      Echo.private(`App.Models.User.${user.id}`).notification((notification) => {
        console.log("Realtime notification:", notification);
        setNotifications((prev) => [notification, ...prev]);
        setSnack({
          open: true,
          message: notification.author_name
            ? `New post by ${notification.author_name}`
            : "New notification received!",
        });
      });
      setEchoInstance(Echo);
    }

    return () => {
      if (echoInstance) echoInstance.disconnect && echoInstance.disconnect();
    };
  }, [user]);

  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
  }

  async function subscribeToPush() {
    try {
      if (!("serviceWorker" in navigator)) return false;

      if (Notification.permission !== "granted") {
        await Notification.requestPermission();
      }

      const registration = await navigator.serviceWorker.register("/public/sw.js");

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY),
      });

      await API.post("/webpush/subscribe", subscription);
      console.log("Push subscription stored:", subscription);
      return true;
    } catch (err) {
      console.error("Push subscription failed:", err);
      return false;
    }
  }

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const handler = (event) => {
        if (event.data?.action === "navigate" && event.data.url) {
          navigate(event.data.url);
        }
      };
      navigator.serviceWorker.addEventListener("message", handler);
      return () => {
        navigator.serviceWorker.removeEventListener("message", handler);
      };
    }
  }, [navigate]);


  const handleClose = () => setSnack({ ...snack, open: false });

  return (
    <NotificationContext.Provider value={{ notifications, user, subscribeToPush }}>
      {children}

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="info" sx={{ width: "100%" }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
