import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const AdminPosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [scheduleDialog, setScheduleDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [scheduleDate, setScheduleDate] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/posts/editor-approved");
      setPosts(res.data);
    } catch {
      setError("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id) => {
    try {
      await axios.post(`/posts/${id}/publish`);
      fetchPosts();
    } catch {
      setError("Failed to publish post.");
    }
  };

  const openScheduleDialog = (post) => {
    setSelectedPost(post);
    setScheduleDate("");
    setScheduleDialog(true);
  };

  const handleSchedule = async () => {
    if (!scheduleDate) {
      alert("Please select a date/time.");
      return;
    }
    try {
      await axios.post(`/posts/${selectedPost.id}/schedule`, {
        schedule_at: scheduleDate,
      });
      setScheduleDialog(false);
      fetchPosts();
    } catch {
      setError("Failed to schedule post.");
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Editor Approved Posts
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No posts found.
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.author?.name}</TableCell>
                  <TableCell>{post.category?.name}</TableCell>
                  <TableCell>{post.status}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        navigate(`/dashboard/admin/posts/${post.id}`)
                      }
                    >
                      View
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => openScheduleDialog(post)}
                      sx={{ ml: 1 }}
                    >
                      Schedule
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handlePublish(post.id)}
                      sx={{ ml: 1 }}
                    >
                      Publish
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Schedule Dialog */}
      <Dialog open={scheduleDialog} onClose={() => setScheduleDialog(false)}>
        <DialogTitle>Schedule Post</DialogTitle>
        <DialogContent>
          <TextField
            label="Schedule At"
            type="datetime-local"
            fullWidth
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScheduleDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSchedule}>
            Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPosts;
