import React from "react";
import { Navigate } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import ProtectedLayout from "../layouts/ProtectedLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import LoginPage from "../pages/LoginPage";
import DashboardRouter from "../pages/Dashboards/DashboardRouter";
import Dashboard from "../pages/Dashboards/Admin/AdminDashboard";
import RequireAuth from "../components/RequireAuth";
import GoogleSuccess from "../pages/GoogleSuccessPage";
import GuestDashboard from "../pages/Dashboards/Guest/GuestDashboard";
import RegisterPage from "../pages/RegisterPage";

const routes = [
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <LoginPage /> },
      { path: "/login", element: <LoginPage /> },
      {path: "/google-success", element: <GoogleSuccess/>},
      {path: "/register",element:<RegisterPage/>}
    ],
  },
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardRouter /> },
          { path: "Home", element: <RequireAuth allowedRoles={["admin"]}><Dashboard /></RequireAuth> },
          {path: "Home", element: <RequireAuth allowedRoles={["guest"]}><GuestDashboard/></RequireAuth>}
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" /> },
];

export default routes;
