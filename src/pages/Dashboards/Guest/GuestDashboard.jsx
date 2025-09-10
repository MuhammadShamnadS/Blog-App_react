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
import FavoriteIcon from "@mui/icons-material/Favorite";
import axios from "../../../api/axios";

const BASE_URL = "http://localhost:8000/storage";

const GuestPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("/guest/posts");
        setPosts(Array.isArray(res.data) ? res.data : []);
        console.log(res);
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
      <Box sx={{
        bgcolor:"#2c2638",
        height:80,
        p:1,
        mb:1,
        borderRadius:2
      }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, mb: 4, textAlign: "center" , color:"white",p:1,m:1}}
      >
        Read Our Blogs
      </Typography>
</Box>
      {/* Posts Grid */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "center",
          mt:3
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
              boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
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
            {/* Image wrapper */}
            <Box
              sx={{
                width: "100%",
                height: 180,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f5f5f5",
                overflow: "hidden",
              }}
            >
              {post.media && post.media.length > 0 ? (
                <CardMedia
                  component="img"
                  image={`${BASE_URL}/${post.media[0].url}`}
                  alt={post.title}
                  sx={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: "italic" }}
                >
                  No Image
                </Typography>
              )}
            </Box>

            {/* Content */}
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {post.title}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{  }}
              >author : 
                {post.author.name}
              </Typography>
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

<Button
  sx={{ color: "Black", fontWeight: 500 }}
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
