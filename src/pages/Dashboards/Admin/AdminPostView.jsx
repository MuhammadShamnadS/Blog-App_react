import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Divider,
  Grid,
} from "@mui/material";
import { Snackbar, Alert } from "@mui/material";

const BASE_URL = "http://localhost:8000";

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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/admin/posts/${postId}`);
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
      const res = await axios.post(`/posts/${post.id}/publish`);
      setPost(res.data.post || post);
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

  const handleArchive = async () => {
    if (!post || !post.id) return;

    try {
      setSubmitting(true);
      setErrorMsg("");
      const res = await axios.post(`/posts/${post.id}/archive`);
      setPost(res.data.post || post);
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
      const res = await axios.delete(`/posts/${post.id}`);
      setSuccessMsg(res.data.message || "Post deleted successfully!");
      navigate("/dashboard/admin/posts");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Failed to delete post.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 5, p: 2 }}>
      <Paper sx={{ p: 3 }}>
        {/* Post Header */}
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: "bold",
            wordBreak: "break-word",
            mb: 1,
            fontSize: { xs: "1.8rem", md: "2.5rem" },
          }}
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
          </Paper>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Media */}
        {post.media && post.media.length > 0 && (
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <img
              src={`${BASE_URL}/storage/${post.media[0].url}`}
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
                setModalImage(`${BASE_URL}/storage/${post.media[0].url}`)
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
                  onClick={() => openScheduleDialog(post)}
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

          {post.status === "published" && (
            <>
              <Grid item xs={12} md={6}>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={submitting}
                  onClick={() => handleArchive(post)}
                >
                  Archive
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
