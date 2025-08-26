import React from "react";
import { Navigate } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import ProtectedLayout from "../layouts/ProtectedLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import LoginPage from "../pages/LoginPage";
import DashboardRouter from "../pages/Dashboards/DashboardRouter";
import Dashboard from "../pages/Dashboards/Admin/AdminDashboard";
import RequireAuth from "../components/RequireAuth";

const routes = [
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <LoginPage /> },
      { path: "/login", element: <LoginPage /> },
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
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" /> },
];

export default routes;
