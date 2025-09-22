import React, { Suspense, lazy } from "react";
import { Outlet } from "react-router-dom";
import { withAuth } from "../helpers/withAuth";
import PublicLayout from "./Guards/PublicRoute";
import ProtectedLayout from "./Guards/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import LoginPage from "../pages/LoginPage";
import DashboardRouter from "../pages/Dashboards/DashboardRouter";
import RequireAuth from "./Guards/RequireAuth";
import GoogleSuccess from "../pages/GoogleSuccessPage";
import PasswordResetPage from "../pages/PasswordResetPage";
import PasswordChange from "../pages/PasswordChange";
import Loadable from "../components/Loadable";
import RoleRequestHistory from "../pages/Dashboards/Admin/AdminViewRoleRequestHistory";
const Dashboard = lazy(() => import("../pages/Dashboards/Admin/AdminDashboard"));
const GuestDashboard = lazy(() => import ("../pages/Dashboards/Guest/GuestDashboard"));
const RequestRole = lazy(() => import ( "../pages/RequestRole"));
const AdminRoleRequests = lazy(() => import("../pages/Dashboards/Admin/AdminRoleRequests"));
const AdminPostAssignments = lazy(() => import("../pages/Dashboards/Admin/AdminPostAssignments"));
const AdminPosts = lazy(() => import("../pages/Dashboards/Admin/AdminPosts"));
const AdminPostView = lazy(() => import("../pages/Dashboards/Admin/AdminPostView"));
const CategoryUpdate = lazy(() => import("../pages/Dashboards/Admin/CategoryUpdate"));
const TagList = lazy(() => import("../pages/Dashboards/Admin/TagList"));
const NotFound = lazy(() => import("../pages/NotFoundPage"));
const AuthorPosts = lazy(() => import("../pages/Dashboards/Authors/AuthorDashboard"));
const ViewPost = lazy(() => import("../pages/Dashboards/Authors/ViewPost"));
const EditPost = lazy(() => import("../pages/Dashboards/Authors/EditPost"));
const CreatePost = lazy(() => import("../pages/Dashboards/Authors/CreatePost"));
const EditorPosts = lazy(() => import("../pages/Dashboards/Editors/EditorPost"));
const EditorViewPost = lazy(() => import("../pages/Dashboards/Editors/EditorViewPost"));
const GuestPostView = lazy(() => import("../pages/Dashboards/Guest/GuestPostView"));
const GuestAuthorCards = lazy(() => import("../pages/Dashboards/Guest/AuthorList"));
const AuthorProfile = lazy(() => import("../pages/Dashboards/Guest/AuthorProfile"));


const routes = [
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <LoginPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/google-success", element: <GoogleSuccess /> },
      { path: "/password-reset", element: <PasswordResetPage /> },
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

          {
            path: "admin",
            element: withAuth(["admin"]),
            children: [
              { path: "home", element: <Loadable><Dashboard /></Loadable> },
              { path: "post", element: <Loadable><AdminPostAssignments /></Loadable> },
              { path: "category", element: <Loadable><CategoryUpdate /></Loadable> },
              { path: "posts", element: <Loadable><AdminPosts /></Loadable> },
              { path: "posts/:postId", element: <Loadable><AdminPostView /></Loadable> },
              { path: "categories/:id/tags", element: <Loadable><TagList /></Loadable> },
              { path: "pending-request", element: <Loadable><AdminRoleRequests /></Loadable> },
              { path: "role-request-history", element: <Loadable><RoleRequestHistory /></Loadable> },
            ],
          },

          {
            path: "guest",
            element: withAuth(["guest"]),
            children: [
              { path: "home", element: <Loadable><GuestDashboard /></Loadable> },
              { path: "request-role", element: <RequestRole /> },
              { path: "post/:id", element: <Loadable><GuestPostView /></Loadable> },
              { path: "authors", element: <Loadable><GuestAuthorCards /></Loadable> },
              { path: "author/:id/profile", element: <Loadable><AuthorProfile /></Loadable> },
            ],
          },

          {
            path: "author",
            element: withAuth(["author"]),
            children: [
              { path: "posts", element: <Loadable><AuthorPosts /></Loadable> },
              { path: "posts/create", element: <Loadable><CreatePost /></Loadable> },
              { path: "posts/:id/edit", element: <Loadable><EditPost /></Loadable> },
              { path: "posts/:id", element: <Loadable><ViewPost /></Loadable> },
            ],
          },

          {
            path: "editor",
            element: withAuth(["editor"]),
            children: [
              { path: "posts", element: <Loadable><EditorPosts /></Loadable> },
              { path: "reviews/:reviewId", element: <Loadable><EditorViewPost /></Loadable> },
            ],
          },

          { path: "password-change", element: <RequireAuth allowedRoles={["editor", "guest", "author"]}><PasswordChange /></RequireAuth> },
          { path: "*", element: <Loadable><NotFound /></Loadable> },
        ],
      },
    ],
  },

  { path: "*", element: <Loadable><NotFound /></Loadable> },
];

export default routes;
