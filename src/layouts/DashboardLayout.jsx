import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  CssBaseline,
  ListItemButton,
  IconButton,
  useTheme,
  useMediaQuery,
  Drawer,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, Outlet } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import { AuthContext } from "../context/AuthContext";

const drawerWidth = 220;

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
        { label: "Role Requests", path: "/dashboard/pending-request" },
        { label: "Assign Editors", path: "/dashboard/admin/post" },
        { label: "Posts", path: "/dashboard/admin/approved-posts" },
      ],
      guest: [
        { label: "Home", path: "/dashboard" },
        ...(user?.is_manual === 0
          ? [{ label: "Change Password", path: "/dashboard/Passwordchange" }]
          : []),
        { label: "Request Role", path: "/dashboard/requestrole" },
      ],
      author: [
        ...(user?.is_manual === 0
          ? [{ label: "Change Password", path: "/dashboard/Passwordchange" }]
          : []),
        { label: "Posts", path: "/dashboard/posts" },
      ],
      editor: [
        ...(user?.is_manual === 0
          ? [{ label: "Change Password", path: "/dashboard/Passwordchange" }]
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
    <Box
      sx={{
        bgcolor: "#2c2638",
        p: 2,
        height: "100%",
        borderRadius: { xs: 0, md: 6 },
      }}
    >
      <Typography
        variant="h6"
        color="white"
        sx={{ mb: 2, textAlign: "center" }}
      >
        Navigation
      </Typography>
      <List>
        {links.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                borderRadius: 3,
                color: "white",
                bgcolor: "transparent",
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
      <AppBar position="fixed" sx={{ bgcolor: "#2c2638" }}>
        <Toolbar
          sx={{ display: "flex", justifyContent: "space-between", px: 3 }}
        >
          {isMobile && (
            <IconButton color="inherit" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            color="white"
            sx={{
              marginLeft: { xs: 0, md: 65 },
              fontSize: { xs: 15, md: 20 },
            }}
          >
            Blog Management System
          </Typography>

          <LogoutButton />
        </Toolbar>
      </AppBar>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        {/* Sidebar */}
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          <Box
            sx={{
              width: drawerWidth,
              bgcolor: "#ffffffff",
              borderRadius: 2,
              // p: 2,
              ml: 2,
              mt: 10,
              height: "100vh",
            }}
          >
            {drawerContent}
          </Box>
        )}

        {!isMobile && (
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              marginTop: "80px",
              borderColor: "black",
              width: "10px",
            }}
          />
        )}

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mx: 2,
            bgcolor: "#ffffffff",
            borderRadius: 3,
            boxShadow: 2,
            minHeight: "70vh",
            maxWidth: "100vw",
            alignSelf: "center",
          }}
        >
          <Outlet />
        </Box>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          mt: 2,
          bgcolor: "#2c2638",
          color: "white",
          textAlign: "center",
          borderTop: "1px solid #ddd",
          p: 2,
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} Blog Management System
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
