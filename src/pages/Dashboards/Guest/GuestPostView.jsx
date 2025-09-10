import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import IconButton from "@mui/material/IconButton";
import Slider from "react-slick";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Divider,
  Stack,
} from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";



// Slick carousel styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BASE_URL = "http://localhost:8000/storage";

const GuestPostView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [count,setCount]=useState("");
    const [commentsVisible, setCommentsVisible] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loadingComments, setLoadingComments] = useState(false);
    const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/guest/post/${id}`);
        const postData = res.data["0"] || null;
        const isLiked = res.data.is_liked || false;
        setPost(postData);
        setLiked(isLiked);
      } catch (err) {
        console.error(err);
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);
  const handleLikeToggle = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const res = await axios.post("/like/toggle", { post_id: id });
      setLiked(res.data.liked);
    } catch (err) {
      console.error(err);
    } finally {
      setLikeLoading(false);
    }
  };

    useEffect(() => {
    const fetchPostLike = async () => {
      try {
        const res = await axios.get(`/post/${id}/likes`);
        setCount(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load like.");
      } finally {
        setLoading(false);
      }
    };
    fetchPostLike();
  }, [id,handleLikeToggle]);

const fetchComments = async () => {
  setLoadingComments(true);
  try {
    const res = await axios.get(`/posts/${id}/comments`);
    setComments(res.data.comments || []);
  } catch (err) {
    console.error(err);
    setError("Failed to load comments.");
  } finally {
    setLoadingComments(false);
  }
};

const handleAddComment = async (parentId = null) => {
  if (!newComment.trim()) return;
  try {
    const res = await axios.post("/comments", {
      post_id: id,
      parent_id: parentId,
      content: newComment,
    });
    setNewComment("");
    fetchComments();
  } catch (err) {
    console.error(err);
    setError("Failed to add comment.");
  }
};
const handleDeleteComment = async (commentId) => {
  try {
    await axios.delete(`/comments/${commentId}`);
    fetchComments();
  } catch (err) {
    console.error(err);
    setError("Failed to delete comment.");
  }
};

const renderComments = (commentList) => {
  return commentList.map((c) => (
    <Box key={c.id} sx={{ mb: 2, pl: c.parent_id ? 4 : 0, borderLeft: c.parent_id ? "2px solid #ddd" : "none" }}>
      <Typography variant="subtitle2">
        {c.user?.name || "Unknown"} • {new Date(c.created_at).toLocaleString()}
      </Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>{c.content}</Typography>

      <Stack direction="row" spacing={1}>
        <Button size="small" onClick={() => handleAddComment(c.id)}>Reply</Button>
        {c.user_id === user?.id || user?.role === "admin" ? (
          <Button size="small" color="error" onClick={() => handleDeleteComment(c.id)}>Delete</Button>
        ) : null}
      </Stack>

      {c.replies && c.replies.length > 0 && renderComments(c.replies)}
    </Box>
  ));
};





  if (loading)
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 5 }} />;

  if (error)
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 5 }}>
        {error}
      </Typography>
    );

  if (!post)
    return (
      <Typography sx={{ textAlign: "center", mt: 5 }}>
        No post found.
      </Typography>
    );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 5, px: 2, fontFamily: "'Roboto', sans-serif" }}>
      {/* Back Button */}
      <Button variant="outlined" sx={{ mb: 3 }} onClick={() => navigate(-1)}>
        ← Back
      </Button>

      {/* Post Card */}
      <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, boxShadow: 3 }}>
        {/* Title & Like */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          mb={2}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              wordBreak: "break-word",
              fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
              fontFamily: "'Merriweather', serif",
            }}
          >
            {post.title}
          </Typography>

          <IconButton
            aria-label="like post"
            onClick={handleLikeToggle}
            disabled={likeLoading}
            sx={{
              color: liked ? "red" : "gray",
              alignSelf: { xs: "flex-start", sm: "center" },
            }}
          ><Typography sx={{
            color:"black"
          }}>
            {count?.likes ?? 0}
            </Typography>
            {liked ? <FavoriteIcon fontSize="large" /> : <FavoriteBorderIcon fontSize="large" />}
          </IconButton>
        </Stack>

        {/* Author & Date */}
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{
            mb: 3,
            wordBreak: "break-word",
            fontStyle: "italic",
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          By <strong>{post.author?.name || post.author?.username || "Unknown"}</strong> •{" "}
          {new Date(post.created_at).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </Typography>

        <Divider sx={{ mb: 4 }} />

        {/* Media Carousel */}
        {post.media && post.media.length > 0 && (
          <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
            <Slider {...sliderSettings} style={{ width: "100%" }}>
              {post.media.map((m) => (
                <Box key={m.id} sx={{ textAlign: "center" }}>
                  <img
                    src={`${BASE_URL}/${m.url}`}
                    alt={post.title}
                    style={{
                      maxWidth: "100%",
                      maxHeight: 500,
                      objectFit: "contain",
                      borderRadius: 12,
                      boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                      margin: "0 auto",
                    }}
                  />
                </Box>
              ))}
            </Slider>
          </Box>
        )}

        <Divider sx={{ mb: 4 }} />

        {/* Post Content */}
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: 16, md: 18 },
            lineHeight: 1.8,
            whiteSpace: "pre-line",
            wordBreak: "break-word",
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          {post.content}
        </Typography>
<Box mt={4}>
  <Button variant="outlined" onClick={() => { 
    setCommentsVisible(!commentsVisible);
    if (!commentsVisible) fetchComments();
  }}>
    {commentsVisible ? "Hide Comments" : "View Comments"}
  </Button>

  {commentsVisible && (
    <Box mt={2}>
      {/* Add Comment Input */}
      <Stack direction="row" spacing={1} mb={2}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <Button variant="contained" onClick={() => handleAddComment()}>Post</Button>
      </Stack>

      {loadingComments ? (
        <CircularProgress size={24} />
      ) : (
        renderComments(comments)
      )}
    </Box>
  )}
</Box>

      </Paper>
    </Box>
  );
};

export default GuestPostView;
