import React from "react";
import RequireAuth from "../routes/Guards/RequireAuth";
import { Outlet } from "react-router-dom";

/**
 * Wraps routes with RequireAuth for given roles
 * @param {string[]} roles - Allowed roles
 * @returns React element
 */
export function withAuth(roles) {
  return <RequireAuth allowedRoles={roles}><Outlet /></RequireAuth>;
}
