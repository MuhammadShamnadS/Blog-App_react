import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "../../../api/axios";

import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Divider,
  Stack,
  Grid,
} from "@mui/material";
import { Snackbar, Alert } from "@mui/material";
import authService from "../../../services/authService";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

import CommentIcon from "@mui/icons-material/Comment";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";


const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

const AdminViewPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalImage, setModalImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentTab = queryParams.get("tab") || 0;
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const openScheduleDialog = () => setScheduleDialogOpen(true);
  const closeScheduleDialog = () => setScheduleDialogOpen(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await authService.getPostViewAdmin(postId);
        setPost(res.data);
      } catch {
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

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

  const handlePublish = async () => {
    if (!post || !post.id) return;

    try {
      setSubmitting(true);
      setErrorMsg("");
      const res = await authService.publishPostAdmin(post.id);
      setPost((prev) => ({
        ...prev,
        ...(res.data.post || {}),
      }));
      setSuccessMsg(res.data.message || "Post published successfully!");
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err.response?.data?.message ||
          "Failed to publish post. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleFeature = async () => {
    if (!post || !post.id) return;
    try {
      setSubmitting(true);
      setErrorMsg("");
      const res = await authService.toggleFeaturePostAdmin(post.id, {
        featured: post.featured ? 0 : 1,
      });
      setPost((prev) => ({
        ...prev,
        ...(res.data.post || {}),
      }));
      setSuccessMsg(res.data.message || "Feature status updated!");
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err.response?.data?.message || "Failed to update feature status."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleArchive = async () => {
    if (!post || !post.id) return;

    try {
      setSubmitting(true);
      setErrorMsg("");
      const res = await authService.archievePostAdmin(post.id);
      setPost((prev) => ({
        ...prev,
        ...(res.data.post || {}),
      }));
      setSuccessMsg(res.data.message || "Post archived successfully!");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Failed to archive post.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!post || !post.id) return;
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      setSubmitting(true);
      setErrorMsg("");
      const res = await authService.deletePostAdmin(post.id);
      setSuccessMsg(res.data.message || "Post deleted successfully!");
      navigate(`/dashboard/admin/posts?tab=${currentTab}`);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Failed to delete post.");
    } finally {
      setSubmitting(false);
    }
  };

const fetchComments = async () => {
  if (post.status !== "published" && post.status !== "archived") return;
  setLoadingComments(true);
  try {
    const res = await authService.getCommentsAdim(post.id);
setComments(res.data || []);

  } catch (err) {
    console.error(err);
    setError("Failed to load comments.");
  } finally {
    setLoadingComments(false);
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

  const handleSchedule = async () => {
    if (!post || !post.id || !scheduleDate) return;

    try {
      setSubmitting(true);
      setErrorMsg("");
      const res = await authService.schedulePostAdmin(post.id, scheduleDate);

      setPost((prev) => ({
        ...prev,
        ...(res.data.post || {}),
      }));
      setSuccessMsg(res.data.message || "Post scheduled successfully!");
      closeScheduleDialog();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Failed to schedule post.");
    } finally {
      setSubmitting(false);
    }
  };
  const renderComments = (commentList) => {
  return commentList.map((c) => (
    <Paper key={c.id} elevation={1} sx={{ p: 2, mb: 2 }}>
      {/* Comment Header */}
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <PersonIcon fontSize="large" sx={{ color: "#1976d2" }} />
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            {c.user?.name || "Unknown"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
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
      <Typography variant="body1" sx={{ mb: 1 }}>
        {c.content}
      </Typography>

      {/* Delete Action */}
      <Stack direction="row" spacing={1}>
        <Button
          size="small"
          startIcon={<DeleteIcon />}
          color="error"
          sx={{ fontSize: "12px" }}
          onClick={() => handleDeleteComment(c.id)}
        >
          Delete
        </Button>
      </Stack>
    </Paper>
  ));
};


  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 5, p: 2 }}>
      <Paper sx={{ p: 3 }}>
        {/* Post Header */}
        <Typography
          variant="h3"
          component="h1"
            sx={{ fontWeight: "bold", color: "white", textAlign: "center" , fontSize:{xs:15,md:20}, ml:{xs:0,sm:25,lg:60,md:40}}}

        >
          {post.title}
        </Typography>

        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
          By {post.author?.name || "Unknown Author"} •{" "}
          {new Date(post.created_at).toLocaleDateString()}
        </Typography>

        {post.editor_review && (
          <Paper
            elevation={1}
            sx={{ bgcolor: "#f5f5f5", borderRadius: 2, p: 2, mb: 2 }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              Editor Feedback
            </Typography>
            <Typography
              variant="body2"
              sx={{ mb: 1, wordBreak: "break-word", whiteSpace: "pre-line" }}
            >
              {post.editor_review.feedback || "No feedback provided."}
            </Typography>
            <Typography variant="body2" sx={{ fontStyle: "italic" }}>
              <strong>Decision:</strong> {post.editor_review.status || "N/A"}
            </Typography>
            {loadingComments ? (
  <CircularProgress size={20} />
) : comments.length > 0 ? (
  renderComments(comments)
) : (
  <Typography variant="body2" color="text.secondary">
    No comments yet.
  </Typography>
)}

          </Paper>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Media */}
        {post.media && post.media.length > 0 && (
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <img
              src={`${STORAGE_URL}/${post.media[0].url}`}
              alt="Post Media"
              style={{
                width: "100%",
                maxHeight: 400,
                objectFit: "contain",
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                cursor: "pointer",
              }}
              onClick={() =>
                setModalImage(`${STORAGE_URL}/${post.media[0].url}`)
              }
            />
          </Box>
        )}

        {/* Content */}
        <Typography
          variant="body1"
          sx={{
            fontSize: 18,
            whiteSpace: "pre-line",
            lineHeight: 1.8,
            wordBreak: "break-word",
          }}
        >
          {post.content}
        </Typography>

        {/* Action Buttons */}
        <Grid container spacing={2} sx={{ mt: 4 }}>
          {post.status === "editor_approved" && (
            <>
              <Grid item xs={12} md={4}>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={submitting}
                  onClick={handlePublish}
                  sx={{ bgcolor: "#2c2638", "&:hover": { bgcolor: "#1f1b2c" } }}
                >
                  Publish
                </Button>
              </Grid>

              <Grid item xs={12} md={4}>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={submitting}
                  onClick={openScheduleDialog}
                >
                  Schedule
                </Button>
              </Grid>

              <Grid item xs={12} md={4}>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={submitting}
                  color="error"
                  onClick={() => handleDelete(post)}
                >
                  Delete
                </Button>
              </Grid>
            </>
          )}

          {post.status === "scheduled" && (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  sx={{
                    color: "black",
                    mb: 2,
                  }}
                >
                  Scheduled at : {post.schedule_at}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 3,
                  }}
                >
                  <Box>
                    <Button
                      variant="contained"
                      fullWidth
                      disabled={submitting}
                      onClick={openScheduleDialog}
                    >
                      Re-Schedule
                    </Button>
                  </Box>

                  <Box item xs={12} md={6}>
                    <Button
                      variant="contained"
                      fullWidth
                      disabled={submitting}
                      onClick={handlePublish}
                    >
                      Publish
                    </Button>
                  </Box>

                  <Box item xs={12} md={6}>
                    <Button
                      variant="contained"
                      fullWidth
                      disabled={submitting}
                      color="error"
                      onClick={() => handleDelete(post)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              </Box>
            </>
          )}

          {post.status === "published" && (
            <>
              <Grid item xs={12} md={4}>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={submitting}
                  onClick={handleFeature}
                  sx={{ bgcolor: post.featured ? "grey.600" : "success.main" }}
                >
                  {post.featured ? "Unfeature" : "Feature"}
                </Button>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={submitting}
                  onClick={() => handleArchive(post)}
                >
                  Archive
                </Button>
              </Grid>

              <Grid item xs={12} md={4}>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={submitting}
                  color="error"
                  onClick={() => handleDelete(post)}
                >
                  Delete
                </Button>
                {(post.status === "published" || post.status === "archived") && (
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
        {/* Add Comment Input */}
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
        </Stack>
      </Box>
    )}
  </Box>
)}

              </Grid>
            </>
          )}

          {post.status === "archived" && (
            <>
              <Grid item xs={12} md={6}>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={submitting}
                  onClick={handlePublish}
                >
                  Publish
                </Button>
              </Grid>

              <Grid item xs={12} md={6}>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={submitting}
                  color="error"
                  onClick={() => handleDelete(post)}
                >
                  Delete
                </Button>
              </Grid>
            </>
          )}
          {/* Schedule Dialog */}
          <Dialog open={scheduleDialogOpen} onClose={closeScheduleDialog}>
            <DialogTitle>Schedule Post</DialogTitle>
            <DialogContent>
              <TextField
                label="Select Date & Time"
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={closeScheduleDialog} disabled={submitting}>
                Cancel
              </Button>
              <Button
                onClick={handleSchedule}
                disabled={submitting}
                variant="contained"
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Paper>
      {/* Success Snackbar */}
      <Snackbar
        open={!!successMsg}
        autoHideDuration={3000}
        onClose={() => setSuccessMsg("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccessMsg("")}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMsg}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!errorMsg}
        autoHideDuration={4000}
        onClose={() => setErrorMsg("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setErrorMsg("")}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMsg}
        </Alert>
      </Snackbar>

      {/* Modal Image Preview */}
      {modalImage && (
        <Box
          onClick={() => setModalImage(null)}
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <Box sx={{ position: "relative" }}>
            <img
              src={modalImage}
              alt="Large Preview"
              style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: 8 }}
            />
            <Button
              onClick={() => setModalImage(null)}
              sx={{
                position: "absolute",
                top: -10,
                right: -10,
                minWidth: "auto",
                width: 32,
                height: 32,
                borderRadius: "50%",
                bgcolor: "error.main",
                color: "white",
              }}
            >
              ✕
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AdminViewPost;
