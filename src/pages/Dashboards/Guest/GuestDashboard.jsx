import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import authService from "../../../services/authService";
import { useNotifications } from "../../../NotificationsProvider";

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

const GuestPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { notifications } = useNotifications();
  

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await authService.getPostsByGuest();
        setPosts(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading)
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 2 }} />;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: "#2c2638",
          height: 80,
          p: 1,
          mb: 1,
          borderRadius: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "white", textAlign: "center" }}
        >
          Read Our Blogs
        </Typography>
          <div>
      <h2>Guest Notifications</h2>
      <ul>
        {notifications.map((n, i) => (
          <li key={i}>
            {n.author_name} published: {n.post_title}
          </li>
        ))}
      </ul>
    </div>
      </Box>

      {/* Posts Grid */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "center",
          mt: 3,
        }}
      >
        {posts.map((post) => (
          <Card
            key={post.id}
            sx={{
              flex: "1 1 calc(100% - 16px)",
              maxWidth: "100%",
              cursor: "pointer",
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.02)" },
              "@media (min-width: 600px)": {
                flex: "1 1 calc(50% - 24px)",
                maxWidth: "calc(50% - 24px)",
              },
              "@media (min-width: 900px)": {
                flex: "1 1 calc(33.33% - 24px)",
                maxWidth: "calc(33.33% - 24px)",
              },
            }}
          >
            {/* Image or Gradient */}
<Box
  sx={{
    position: "relative",
    width: "100%",
    height: 180,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      !post.media || post.media.length === 0
        ? "linear-gradient(135deg, #0c0c0cff, #7b02fcff)"
        : "transparent",
    color: "white",
    overflow: "hidden",
    textAlign: "center",
    px: 1,
  }}
>
  {/* Image or Gradient Title */}
  {post.media && post.media.length > 0 ? (
    <CardMedia
      component="img"
      image={`${STORAGE_URL}/${post.media[0].url}`}
      alt={post.title}
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  ) : (
    <Typography
      variant="h6"
      sx={{
        fontWeight: 600,
        textAlign: "center",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
      title={post.title}
    >
      {post.title}
    </Typography>
  )}

  {/* Overlay title for images */}
  {post.media && post.media.length > 0 && (
    <Typography
      variant="h6"
      sx={{
        position: "absolute",
        bottom: 8,
        left: 8,
        right: 8,
        color: "white",
        fontWeight: 600,
        textShadow: "0px 0px 6px rgba(0,0,0,0.7)",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
      title={post.title}
    >
      {post.title}
    </Typography>
  )}
</Box>


            {/* Card Content */}
            <CardContent
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                p: 2,
              }}
            >
              {/* Post title */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={post.title}
              >
                {post.title}
              </Typography>

              {/* Author */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={post.author?.name || "Deleted User"}
              >
                Author: {post.author?.name || "Deleted User"}
              </Typography>

              {/* Date */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </Typography>

              {/* Read Button */}
              <Button
                sx={{
                  color: "black",
                  fontWeight: 500,
                  alignSelf: "flex-start",
                  mt: "auto",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/dashboard/guest/post/${post.id}`);
                }}
              >
                READ
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default GuestPosts;
