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
  TextField,
} from "@mui/material";
import { useContext } from "react";
import ReplyIcon from "@mui/icons-material/Reply";
import DeleteIcon from "@mui/icons-material/Delete";
import { AuthContext } from "../../../context/AuthContext";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import SendIcon from "@mui/icons-material/Send";
import CommentIcon from "@mui/icons-material/Comment";
import PersonIcon from "@mui/icons-material/Person";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import authService from "../../../services/authService";
import ErrorCard from "../../../components/ErrorCard";

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

const GuestPostView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [count, setCount] = useState("");
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const { user } = useContext(AuthContext);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyInputs, setReplyInputs] = useState({});
  const [repliesVisibleFor, setRepliesVisibleFor] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");


  const handlePostUnavailable = () => {
    setErrorMessage("The post you are looking for is no longer available.");
    setTimeout(() => navigate(-1), 3000);
  };


  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await authService.getSinglePostsByGuest(id);
        const postData = res.data["0"] || null;
        const isLiked = res.data.is_liked || false;
        setPost(postData);
        setLiked(isLiked);
        fetchPostLike();
      } catch (err) {
        console.error(err);
        setError("Post unavailable.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const fetchPostLike = async () => {
    try {
      const res = await authService.getLikes(id);
      setCount(res.data);
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

    const handleLikeToggle = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const res = await authService.postLikes(id);
      setLiked(res.data.liked);
      fetchPostLike();
    } catch (err) {
      if (err.code === "NOT_FOUND") {
        handlePostUnavailable();
      } else {
        setError(err.message || "Failed to like post.");
      }
    } finally {
      setLikeLoading(false);
    }
  };

  

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const res = await authService.getComments(id);
      setComments(res.data.comments || []);
    } catch (err) {
      setError("Failed to load comments.");
    } finally {
      setLoadingComments(false);
    }
  };

 const handleAddComment = async (parentId = null, content = null) => {
    const commentContent = content ?? newComment;
    if (!commentContent.trim()) return;

    try {
      await authService.postComments(id, parentId, commentContent);
      setNewComment("");
      fetchComments();
    } catch (err) {
      if (err.code === "NOT_FOUND") {
        handlePostUnavailable();
      } else {
        setError(err.message || "Failed to add comment.");
      }
    }
  };

  

  const handleDeleteComment = async (commentId) => {
    try {
      await authService.deleteComment(commentId);
      fetchComments();
    } catch (err) {
      console.error(err);
      setError("Failed to delete comment.");
    }
  };

 const renderComments = (commentList) => {
  return commentList.map((c) => (
    <Paper
      key={c.id}
      elevation={1}
      sx={{
        p: 2,
        mb: 2,
        wordBreak: "break-word",
        overflowWrap: "anywhere",
      }}
    >
      {/* Comment Header: Avatar + User + Timestamp */}
      <Box display="flex" alignItems="center" gap={1} mb={1} flexWrap="wrap">
        <PersonIcon fontSize="large" sx={{ color: "#1976d2" }} />
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
            title={c.user?.name || "Unknown"}
          >
            {c.user?.name || "Unknown"}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
          >
            {new Date(c.created_at).toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </Typography>
        </Box>
      </Box>

      {/* Comment Content */}
      <Typography
        variant="body1"
        sx={{
          mb: 1,
          wordBreak: "break-word",
          overflowWrap: "anywhere",
          whiteSpace: "pre-line",
        }}
      >
        {c.content}
      </Typography>

      {/* Comment Actions */}
      <Stack
        direction="row"
        spacing={1}
        mb={1}
        flexWrap="wrap"
      >
        {c.parent_id === null && (
          <Button
            size="small"
            startIcon={<ReplyIcon />}
            sx={{ fontSize: "12px", color: "#1976d2" }}
            onClick={() =>
              setReplyingTo(replyingTo === c.id ? null : c.id)
            }
          >
            Reply
          </Button>
        )}

        {(c.user_id === user?.id || user?.role === "admin") && (
          <Button
            size="small"
            startIcon={<DeleteIcon />}
            color="error"
            sx={{ fontSize: "12px" }}
            onClick={() => handleDeleteComment(c.id)}
          >
            Delete
          </Button>
        )}
      </Stack>

      {/* Replies toggle */}
      {c.replies && c.replies.length > 0 && (
        <Button
          size="small"
          startIcon={
            repliesVisibleFor === c.id ? (
              <ArrowDropUpIcon />
            ) : (
              <ArrowDropDownIcon />
            )
          }
          sx={{ fontSize: "12px", color: "gray", textTransform: "none" }}
          onClick={() =>
            setRepliesVisibleFor(repliesVisibleFor === c.id ? null : c.id)
          }
        >
          {repliesVisibleFor === c.id
            ? "Hide Replies"
            : `Show Replies (${c.replies.length})`}
        </Button>
      )}

      {/* Reply Input */}
      {c.parent_id === null && replyingTo === c.id && (
        <Stack direction="row" spacing={1} mt={1} alignItems="center" flexWrap="wrap">
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            value={replyInputs[c.id] || ""}
            onChange={(e) =>
              setReplyInputs((prev) => ({ ...prev, [c.id]: e.target.value }))
            }
            placeholder="Write your reply..."
            sx={{
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "black" },
              "& .MuiOutlinedInput-input": { padding: "10px" },
            }}
          />
          <Button
            variant="text"
            color="primary"
            onClick={() => {
              handleAddComment(c.id, replyInputs[c.id]);
              setReplyingTo(null);
              setReplyInputs((prev) => ({ ...prev, [c.id]: "" }));
            }}
          >
            <SendIcon />
          </Button>
        </Stack>
      )}

      {/* Render Replies */}
      {repliesVisibleFor === c.id && c.replies.length > 0 && (
        <Box mt={2} ml={{ xs: 0, sm: 4 }}>
          {renderComments(c.replies)}
        </Box>
      )}
    </Paper>
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
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        mt: 5,
        px: 2,
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, boxShadow: 3 }}>
        <Button
          variant="text"
          sx={{ mb: 3, color: "black" }}
          onClick={() => navigate(-1)}
        >
          <ArrowBackIosIcon /> Back
        </Button>
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
          >
            <Typography
              sx={{
                color: "black",
              }}
            >
              {count?.likes ?? 0}
            </Typography>
            {liked ? (
              <FavoriteIcon fontSize="large" />
            ) : (
              <FavoriteBorderIcon fontSize="large" />
            )}
          </IconButton>
        </Stack>

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
          By{" "}
          <strong>
            {post.author?.name || post.author?.username || "Unknown"}
          </strong>{" "}
          •{" "}
          {new Date(post.created_at).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </Typography>

        <Divider sx={{ mb: 4 }} />

        {post.media && post.media.length > 0 && (
          <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
            <Slider {...sliderSettings} style={{ width: "100%" }}>
              {post.media.map((m) => (
                <Box key={m.id} sx={{ textAlign: "center" }}>
                  <img
                    src={`${STORAGE_URL}/${m.url}`}
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
          <Button
            variant="text"
            sx={{
              fontSize: "12px",
              gap: 1,
              color: "black",
            }}
            onClick={() => {
              setCommentsVisible(!commentsVisible);
              if (!commentsVisible) fetchComments();
            }}
          >
            <CommentIcon />
            {commentsVisible ? "Hide Comments" : "View Comments"}
          </Button>

          {commentsVisible && (
            <Box mt={2}>

              <Stack direction="row" spacing={1} mb={2}>
                <TextField
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderColor: "black",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "black",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "black",
                    },
                    "& .MuiOutlinedInput-input": {
                      padding: "10px",
                    },
                  }}
                />

                <Button variant="text" onClick={() => handleAddComment()}>
                  <SendIcon />
                </Button>
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
      {errorMessage && <ErrorCard message={errorMessage} />}
    </Box>
  );
};

export default GuestPostView;
