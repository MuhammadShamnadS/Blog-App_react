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
import ForgotPasswordPage from "../pages/Password-restpage";
import PasswordChange from "../pages/PasswordChange";
import RequestRole from "../pages/RequestRole";
import AdminRoleRequests from "../pages/Dashboards/Admin/AdminRoleRequests";



const routes = [
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <LoginPage /> },
      { path: "/login", element: <LoginPage /> },
      {path: "/google-success", element: <GoogleSuccess/>},
      {path: "/password-reset",element:<ForgotPasswordPage/>},

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
          { path: "Passwordchange", element: <RequireAuth allowedRoles={["editor","guest","author"]}><PasswordChange/></RequireAuth>},
          {path: "Home", element: <RequireAuth allowedRoles={["guest"]}><GuestDashboard/></RequireAuth>},
          {path :"requestrole", element: <RequireAuth allowedRoles={["guest","author","editor"]}><RequestRole></RequestRole></RequireAuth>},
          {path: "pending-request", element: <RequireAuth allowedRoles={["admin"]}><AdminRoleRequests></AdminRoleRequests></RequireAuth>},

        
        
        
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" /> },
];

export default routes;
