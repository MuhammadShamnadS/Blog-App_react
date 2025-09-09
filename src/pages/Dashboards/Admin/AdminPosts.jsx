import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function AdminPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tab, setTab] = useState(0); // 0 = Pending, 1 = All

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [scheduleDate, setScheduleDate] = useState("");

  const fetchPosts = async (tabValue) => {
    setLoading(true);
    setError("");
    try {
      const url = tabValue === 0 ? "/posts/editor-approved" : "/admin/posts";
      const res = await axios.get(url);
      setPosts(res.data);
    } catch {
      setError("Failed to load posts.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts(tab);
  }, [tab]); // refetch whenever tab changes

  const handlePublish = async (post) => {
    try {
      await axios.post(`/posts/${post.id}/publish`);
      setSuccess("Post published successfully!");
      fetchPosts(tab);
    } catch {
      setError("Failed to publish post.");
    }
  };

  const openScheduleDialog = (post) => {
    setSelectedPost(post);
    setScheduleDate("");
    setOpenDialog(true);
  };

  const handleSchedule = async () => {
    if (!scheduleDate) return;
    try {
      await axios.post(`/posts/${selectedPost.id}/schedule`, {
        schedule_at: scheduleDate,
      });
      setSuccess("Post scheduled successfully!");
      setOpenDialog(false);
      fetchPosts(tab);
    } catch {
      setError("Failed to schedule post.");
    }
  };

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box
        sx={{
          bgcolor: "#2c2638",
          borderRadius: 2,
          py: 2,
          mb: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "white" }}>
          Posts
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ px: 2 }}>
        <Tabs
          value={tab}
          onChange={(e, newVal) => setTab(newVal)}
          textColor="black"
          indicatorColor="primary"
          sx={{ mb: 2 }}
        >
          <Tab label="Pending Posts" />
          <Tab label="All Posts" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" my={3}>
            <CircularProgress />
          </Box>
        ) : posts.length === 0 ? (
          <Alert severity="info">
            {tab === 0 ? "No pending posts." : "No posts found."}
          </Alert>
        ) : (
          <TableContainer component={Paper} elevation={2}>
            <Table>
              <TableHead sx={{ bgcolor: "#fff" }}>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    {/* Title */}
                    <TableCell
                      sx={{
                        maxWidth: 250,
                        wordBreak: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: { xs: 14, md: 16 },
                          wordBreak: "break-word",
                        }}
                      >
                        {post.title}
                      </Typography>
                    </TableCell>

                    {/* Author */}
                    <TableCell
                      sx={{
                        maxWidth: 200,
                        wordBreak: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: { xs: 14, md: 16 },
                          wordBreak: "break-word",
                        }}
                      >
                        {post.author?.name || "Unknown"}
                      </Typography>
                    </TableCell>

                    {/* Category */}
                    <TableCell
                      sx={{
                        maxWidth: 150,
                        wordBreak: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: { xs: 14, md: 16 },
                          wordBreak: "break-word",
                        }}
                      >
                        {post.category?.name || "N/A"}
                      </Typography>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          color:
                            post.status === "editor_approved"
                              ? "black"
                              : post.status === "published"
                              ? "green"
                              : "red",
                        }}
                      >
                        {post.status === "editor_approved"
                          ? "Pending"
                          : post.status.charAt(0).toUpperCase() +
                            post.status.slice(1)}
                      </Typography>
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        {tab === 0 && (
                          <>
                            <Button
                              variant="contained"
                              size="small"
                              color="primary"
                              onClick={() => openScheduleDialog(post)}
                            >
                              Schedule
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              color="success"
                              onClick={() => handlePublish(post)}
                            >
                              Publish
                            </Button>
                          </>
                        )}
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            navigate(`/dashboard/admin/posts/${post.id}`)
                          }
                        >
                          View
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Schedule Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Schedule Post</DialogTitle>
        <DialogContent>
          <TextField
            label="Schedule At"
            type="datetime-local"
            fullWidth
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSchedule}
            disabled={!scheduleDate}
          >
            Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default AdminPosts;
