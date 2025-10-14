import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Typography,
  CssBaseline,
  IconButton,
  Button,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, Outlet } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import { AuthContext } from "../context/AuthContext";

const drawerWidth = 220;
const headerHeight = 55;

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { user, fetchUser } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const links = React.useMemo(() => {
    if (!user) return [];

    const navItems = {
      admin: [
        { label: "Home", path: "/dashboard" },
        { label: "Users", path: "/dashboard/admin/users" },
        { label: "Role Requests", path: "/dashboard/admin/pending-request" },
        { label: "Assign Editors", path: "/dashboard/admin/post" },
        { label: "Posts", path: "/dashboard/admin/posts" },
        { label: "Category", path: "/dashboard/admin/category" },
      ],
      guest: [
        { label: "Home", path: "/dashboard" },
        ...(user?.is_manual === 0
          ? [{ label: "Change Password", path: "/dashboard/password-change" }]
          : []),
        { label: "Request Role", path: "/dashboard/guest/request-role" },
        { label: "Authors", path: "/dashboard/guest/authors" },
                { label: "Search", path: "/dashboard/guest/post/search" },

        

      ],
      author: [
        ...(user?.is_manual === 0
          ? [{ label: "Change Password", path: "/dashboard/password-change" }]
          : []),
        { label: "Posts", path: "/dashboard/author/posts" },
      ],
      editor: [
        ...(user?.is_manual === 0
          ? [{ label: "Change Password", path: "/dashboard/password-change" }]
          : []),
        { label: "Posts", path: "/dashboard/editor/posts" },
      ],
    };

    return navItems[user.role] || [];
  }, [user]);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const drawerContent = (
    <Box sx={{ bgcolor: "#2c2638", p: 2, height: "100%" }}>
      <Typography
        variant="h6"
        color="white"
        sx={{ mb: 2, textAlign: "center", fontFamily: "'Righteous', cursive" }}
      >
        Navigation
      </Typography>
      <List>
        {links.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{
                borderRadius: 1,
                color: "white",
                "&:hover": { bgcolor: "#3c3455" },
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />

      {/* Header */}
      <Box
        position="fixed"
        sx={{
          bgcolor: "#2c2638",
          width: "100vw",
          height: headerHeight,
          p: 1,
          zIndex: 1200,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>
          <Typography
            color="white"
            sx={{
              fontFamily: "'Edu NSW ACT Hand Pre', cursive",
              fontWeight: "400",
              fontSize:{xs:15, md:20},
              ml:{xs:8, md:0},
              mt:{xs:1, md:0}
            }}
          >
            Blog Management System
          </Typography>

          {isMobile ? (
            <IconButton color="inherit" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {links.map((item) => (
                <Button
                  key={item.label}
                  color="inherit"
                  onClick={() => navigate(item.path)}
                  sx={{
                    textTransform: "none",
                    fontFamily: "'Righteous', cursive",
                    color: "white",
                  }}
                >
                  {item.label}
                </Button>
              ))}

              <LogoutButton />
            </Box>
          )}
        </Box>
      </Box>

      {/* Sidebar Drawer (Mobile) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            bgcolor: "#2c2638",
            color: "white",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: `${headerHeight + 16}px`,
          bgcolor: "#f9f9f9",
          minHeight: "70vh",
          maxWidth: "100vw",
        }}
      >
        <Outlet />
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          mt: "auto",
          bgcolor: "#2c2638",
          color: "white",
          textAlign: "center",
          borderTop: "1px solid #ddd",
          p: 2,
        }}
      >
        <Typography variant="body2" sx={{ fontFamily: "'Righteous', cursive" }}>
          © {new Date().getFullYear()} Blog Management System
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
