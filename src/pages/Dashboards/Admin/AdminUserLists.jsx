import React, { useState, useEffect } from "react";
import { Container, Box, Typography, Tabs, Tab } from "@mui/material";
import { useSearchParams, useLocation } from "react-router-dom";
import UserList from "./UserList";


function AdminUserList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const roles = ["guest", "editor", "author"];
  const roleFromUrl = searchParams.get("role");
  const stateRole = location.state?.role;
  const initialRole = roleFromUrl || stateRole || "guest";
  const [role, setRole] = useState(initialRole);
  const tabIndex = roles.indexOf(role);

  const handleTabChange = (e, newIndex) => {
    const newRole = roles[newIndex];
    setRole(newRole);
    setSearchParams({ role: newRole });
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          bgcolor: "#2c2638",
          borderRadius: 2,
          py: 2,
          mb: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
            fontSize: { xs: 15, md: 20 },
          }}
        >
          Posts
        </Typography>
      </Box>

      <Box sx={{ px: 2 }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          textColor="black"
          indicatorColor="primary"
          sx={{ mb: 2 }}
        >
          {roles.map((r) => (
            <Tab key={r} label={r.charAt(0).toUpperCase() + r.slice(1)} />
          ))}
        </Tabs>

        {/* Pass role instead of tab index */}
        <UserList role={role} />
      </Box>

    </Container>

  );
}

export default AdminUserList;
