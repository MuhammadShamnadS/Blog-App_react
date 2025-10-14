import { useEffect, useState } from "react";
import authService from "../../../services/authService";
import {
  Box,
  Typography,
  Card,
  Grid,
  List,
  ListItem,
  Paper,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import PostAddIcon from "@mui/icons-material/PostAdd";
import CategoryIcon from "@mui/icons-material/Category";
import ListIcon from "@mui/icons-material/List";

function AdminDashboardPage() {
  const [stats, setStats] = useState({
    users: 0,
    posts: 0,
    categories: 0,
  });
  const [latestPosts, setLatestPosts] = useState([]);

  const fetchStats = async () => {
    try {
      const res = await authService.getAdminDashboardStats();
      setStats({
        users: res.data.users,
        posts: res.data.posts.length,
        categories: res.data.categories,
      });

      setLatestPosts(res.data.posts);
    } catch (error) {
      console.error("Error fetching stats or latest posts:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cardData = [
    {
      label: "Users",
      count: stats.users,
      icon: (
        <PeopleIcon sx={{ fontSize: { xs: 20, md: 40 }, color: "white" }} />
      ),
    },
    {
      label: "Posts",
      count: stats.posts,
      icon: (
        <PostAddIcon sx={{ fontSize: { xs: 20, md: 40 }, color: "white" }} />
      ),
    },
    {
      label: "Categories",
      count: stats.categories,
      icon: (
        <CategoryIcon sx={{ fontSize: { xs: 20, md: 40 }, color: "white" }} />
      ),
    },
  ];

  return (
    <Box
    sx={{
      m:2
    }}>
      <Typography
        sx={{ fontWeight: "bold", mb: 3, fontSize: { xs: 30, md: 40 } }}
      >
        Admin Dashboard
      </Typography>

      <Box
        sx={{
          m:2,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
        }}
      >
        {/* Cards Section */}
        <Box sx={{ flex: 3 }}>
          <Grid container sx={{ gap: { xs: 1, md: 5 } }}>
            {cardData.map((card) => (
              <Grid item xs={12} sm={6} md={4} key={card.label}>
                <Card
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    bgcolor: "#2c2638",
                    color: "white",
                    maxHeight: { xs: 80, md: 120 },
                    borderRadius: 3,
                    boxShadow: 3,
                    gap: { xs: 1, md: 5 },
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: { xs: -1, md: 0 },
                    }}
                  >
                    {card.icon}
                    <Typography sx={{ mt: 1, fontSize: { xs: 12, md: 15 } }}>
                      {card.label}
                    </Typography>
                  </Box>

                  <Typography
                    color="white"
                    sx={{ fontWeight: "bold", fontSize: { xs: 25, md: 30 } }}
                  >
                    {card.count}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        {/* Latest Posts */}

        <Box
          sx={{
            flex: 1,
            bgcolor: "#ffffffff",
            p: 1,
            borderRadius: 3,
            color: "black",
            mt: { xs: 0, md: -10 },
            maxWidth: 280,
            wordBreak: "break-word",
          }}
        >
          <Paper
            elevation={9}
            sx={{ p: 3, borderRadius: 3, bgcolor: "#fefefe" }}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
                mb: 2,
              }}
            >
              <ListIcon
                sx={{
                  color: "black",
                  fontSize: { xs: 20, md: 24 },
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  wordBreak: "break-word",
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                }}
              >
                Latest Posts
              </Typography>
            </Box>

            {/* List of Posts */}
            <List>
              {latestPosts.length ? (
                latestPosts.map((post) => (
                  <ListItem
                    key={post.id}
                    disablePadding
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      "&:hover": { bgcolor: "#f0f0f0" },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      wordBreak: "break-word",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: { xs: 14, md: 16 },
                        fontWeight: 500,
                        color: "#333",
                        wordBreak: "break-word",
                      }}
                    >
                      {post.title}
                    </Typography>

                    {/* Underline for each post */}
                    <Box
                      sx={{
                        height: "1px",
                        width: "100%",
                        maxWidth: 150,
                        bgcolor: "black",
                        mt: 0.5,
                      }}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" color="gray">
                  No posts available.
                </Typography>
              )}
            </List>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

export default AdminDashboardPage;
