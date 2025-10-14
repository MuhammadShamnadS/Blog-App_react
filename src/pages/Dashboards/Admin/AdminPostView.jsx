import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import authService from "../../../services/authService";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Grid,
  Divider,
  Snackbar,
  Alert,
  Container,
} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDialog from "../../../components/ConfirmDeleteCard";
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
const AdminViewPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentTab = queryParams.get("tab") || 0;
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
  const [expandedReplies, setExpandedReplies] = useState({});
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [postToDeleteId, setPostToDeleteId] = useState(null);
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


  const fetchComments = async () => {
    if (post.status !== "published" && post.status !== "archived") return;
    setLoadingComments(true);
    try {
      const res = await authService.getCommentsAdim(post.id);
      setComments(res.data?.comments || []);
    } catch (err) {
      setError("Failed to load comments.");
    } finally {
      setLoadingComments(false);
    }
  };


  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await authService.deleteComment(commentId);
      fetchComments();
    } catch (err) {
      setError("Failed to delete comment.");
    }
  };

  const openDeleteConfirm = (postid) => {
    setPostToDeleteId(postid);
    setDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setPostToDeleteId(null);
    setDeleteConfirmOpen(false);
  };


  const handlePublish = async () => {
    if (!post?.id) return;
    try {
      setSubmitting(true);
      setErrorMsg("");
      const res = await authService.publishPostAdmin(post.id);
      setPost((prev) => ({ ...prev, ...(res.data.post || {}) }));
      setSuccessMsg(res.data.message || "Post published successfully!");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to publish post.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFeature = async () => {
    if (!post?.id) return;
    try {
      setSubmitting(true);
      setErrorMsg("");
      const res = await authService.toggleFeaturePostAdmin(post.id, {
        featured: post.featured ? 0 : 1,
      });
      setPost((prev) => ({ ...prev, ...(res.data.post || {}) }));
      setSuccessMsg(res.data.message || "Feature status updated!");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to update feature status.");
    } finally {
      setSubmitting(false);
    }
  };


  const handleArchive = async () => {
    if (!post?.id) return;
    try {
      setSubmitting(true);
      setErrorMsg("");
      const res = await authService.archievePostAdmin(post.id);
      setPost((prev) => ({ ...prev, ...(res.data.post || {}) }));
      setSuccessMsg(res.data.message || "Post archived successfully!");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to archive post.");
    } finally {
      setSubmitting(false);
    }
  };


  const handleDelete = async () => {
    if (!post?.id) return;
    try {
      setSubmitting(true);
      setErrorMsg("");
      const res = await authService.deletePostAdmin(postToDeleteId);
      setSuccessMsg(res.data.message || "Post deleted successfully!");
      navigate(`/dashboard/admin/posts?tab=${currentTab}`);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to delete post.");
    } finally {
      setSubmitting(false);
    }
  };


  const handleUnarchive = async () => {
    if (!post?.id) return;
    try {
      setSubmitting(true);
      setErrorMsg("");
      const res = await authService.unarchivePostAdmin(post.id);
      setPost((prev) => ({ ...prev, ...(res.data.post || {}) }));
      setSuccessMsg(res.data.message || "Post unarchived successfully!");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to unarchive post.");
    } finally {
      setSubmitting(false);
    }
  };


  const handleSchedule = async () => {
    if (!post?.id || !scheduleDate) return;
    try {
      setSubmitting(true);
      setErrorMsg("");
      const res = await authService.schedulePostAdmin(post.id, scheduleDate);
      setPost((prev) => ({ ...prev, ...(res.data.post || {}) }));
      setSuccessMsg(res.data.message || "Post scheduled successfully!");
      closeScheduleDialog();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to schedule post.");
    } finally {
      setSubmitting(false);
    }
  };


  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const renderComments = (commentList) => {
    return commentList.map((c) => (
      <Paper key={c.id} elevation={1} sx={{ p: 2, mb: 2 }}>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <PersonIcon fontSize="large" sx={{ color: "#1976d2" }} />
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {c.user?.name || "Deleted User"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(c.created_at).toLocaleString()}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {c.content}
        </Typography>
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
          {c.replies?.length > 0 && (
            <Button
              size="small"
              sx={{ fontSize: "12px" }}
              onClick={() => toggleReplies(c.id)}
            >
              {expandedReplies[c.id] ? "Hide Replies" : "Show Replies"}
            </Button>
          )}
        </Stack>
        {expandedReplies[c.id] && c.replies?.length > 0 && (
          <Box sx={{ mt: 2, pl: 4, borderLeft: "2px solid #eee" }}>
            {renderComments(c.replies)}
          </Box>
        )}
      </Paper>
    ));
  };

  if (loading)
    return
  (
    <CircularProgress sx={{ display: "block", mx: "auto", mt: 5 }}
    />
  );

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
    <Container maxWidth="lg">
      <Box
        sx={{
          bgcolor: "#2c2638",
          borderRadius: 2,
          py: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{

            fontSize: { xs: 15, md: 20 },
            fontWeight: "bold",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: { xs: "300px", md: "1000px" },
            color: "white",

          }}
        >
          {post.author?.name}'s Post
        </Typography>
      </Box>
      <Box sx={{ maxWidth: 900, mx: "auto", p: 2 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" sx={{
            fontWeight: "bold", overflow: "hidden",
            overflowWrap: 'break-word',
            whiteSpace: 'pre-line', textAlign: "center", mb: 1, fontSize: { xs: 15, md: 30 }
          }}>
            {post.title}
          </Typography>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{
              fontWeight: "bold",
              textAlign: "initial",
              mb: 1,
              fontSize: { xs: 8, md: 15 },
            }}
          >
            <span style={{ whiteSpace: "nowrap" }}>By </span>
            <span style={{ wordBreak: "break-word" }}>
              {post.author?.name || "Unknown Author"}
            </span>
            <div>{new Date(post.created_at).toLocaleDateString()}</div>
          </Typography>




          {post.media?.length > 0 && (
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
          <Typography variant="body1" sx={{ fontSize: 18, whiteSpace: "pre-line", lineHeight: 1.8, wordBreak: "break-word" }}>
            {post.content}
          </Typography>

          {(post.status === "published" || post.status === "archived") && (
            <Box mt={4}>
              <Button
                variant="text"
                sx={{ fontSize: "14px", gap: 1 }}
                onClick={() => {
                  setCommentsVisible(!commentsVisible);
                  if (!commentsVisible) fetchComments();
                }}
              >
                <CommentIcon fontSize="small" />
                {commentsVisible ? "Hide Comments" : "View Comments"}
              </Button>
              {commentsVisible && (
                <Box mt={2}>
                  {loadingComments ? (
                    <CircularProgress size={20} />
                  ) : comments.length > 0 ? (
                    renderComments(comments)
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No comments yet.
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          )}

          <Divider sx={{ my: 2 }} />
          {/* Action Buttons */}
          <Grid container spacing={2} sx={{ mt: 4 }}>
            {post.status === "editor_approved" && (
              <>
                <Grid item xs={12} md={4}>
                  <Button variant="contained" fullWidth disabled={submitting} onClick={handlePublish}>
                    Publish
                  </Button>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button variant="contained" fullWidth disabled={submitting} onClick={openScheduleDialog}>
                    Schedule
                  </Button>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button variant="contained" fullWidth color="error" disabled={submitting} onClick={() => openDeleteConfirm(post.id)}>
                    Delete
                  </Button>
                </Grid>
              </>
            )}

            {post.status === "scheduled" && (
              <>
                <Grid item xs={12} md={4}>
                  <Button
                    variant="contained"
                    fullWidth disabled={submitting}
                    onClick={openScheduleDialog}>
                    Re-Schedule
                  </Button>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    variant="contained"
                    fullWidth disabled={submitting}
                    onClick={handlePublish}>
                    Publish
                  </Button>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    variant="contained"
                    fullWidth color="error"
                    disabled={submitting}
                    onClick={() => openDeleteConfirm(post.id)}>
                    Delete
                  </Button>
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
                    onClick={handleUnarchive}
                  >
                    Unarchive
                  </Button>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Button
                    variant="contained"
                    fullWidth
                    color="error"
                    disabled={submitting}
                    onClick={() => openDeleteConfirm(post.id)}
                  >
                    Delete
                  </Button>
                </Grid>
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
                  <Button variant="contained" fullWidth disabled={submitting} onClick={handleArchive}>
                    Archive
                  </Button>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button variant="contained" fullWidth color="error" disabled={submitting} onClick={() => openDeleteConfirm(post.id)}>
                    Delete
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
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
              <Button onClick={handleSchedule} disabled={submitting} variant="contained">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
        {/* Snackbars */}
        <Snackbar open={!!successMsg} autoHideDuration={3000} onClose={() => setSuccessMsg("")} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
          <Alert onClose={() => setSuccessMsg("")} severity="success" sx={{ width: "100%" }}>
            {successMsg}
          </Alert>
        </Snackbar>
        <Snackbar open={!!errorMsg} autoHideDuration={4000} onClose={() => setErrorMsg("")} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
          <Alert onClose={() => setErrorMsg("")} severity="error" sx={{ width: "100%" }}>
            {errorMsg}
          </Alert>
        </Snackbar>
        {/* Modal Image */}
        {modalImage && (
          <Box
            onClick={() => setModalImage(null)}
            sx={{ position: "fixed", inset: 0, bgcolor: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 }}
          >
            <Box sx={{ position: "relative" }}>
              <img src={modalImage} alt="Large Preview" style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: 8 }} />
              <Button
                onClick={() => setModalImage(null)}
                sx={{ position: "absolute", top: -10, right: -10, minWidth: "auto", width: 32, height: 32, borderRadius: "50%", bgcolor: "error.main", color: "white" }}
              >
                ✕
              </Button>
            </Box>
          </Box>
        )}
      </Box>
      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this post?"
        onConfirm={handleDelete}
        onCancel={closeDeleteConfirm}
      />
    </Container>
  );
};
export default AdminViewPost;  