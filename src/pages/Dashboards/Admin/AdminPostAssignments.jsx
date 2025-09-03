import { useEffect, useState } from "react";
import axios from "../../../api/axios";
import {
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

function AdminPostAssignments() {
  const [posts, setPosts] = useState([]);
  const [editors, setEditors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedEditor, setSelectedEditor] = useState("");
  const [category, setCategory] = useState(null);

  // fetch all submitted posts (including resubmitted ones)
  const fetchPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/admin/posts/submitted");
      setPosts(res.data || []);
    } catch (err) {
      setError("Failed to load posts.");
    }
    setLoading(false);
  };

  // fetch editors for a given category
  const fetchEditors = async (categoryId) => {
    try {
      const res = await axios.get(`/categories/${categoryId}/editors`);
      setCategory(res.data.category);
      setEditors(res.data.editors || []);
    } catch (err) {
      console.error("Failed to fetch editors", err);
      setEditors([]);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // open dialog for selecting editor
  const handleAssign = (post) => {
    setSelectedPost(post);
    setSelectedEditor("");
    fetchEditors(post.category_id);
    setOpenDialog(true);
  };

  // finalize assignment
  const handleConfirmAssign = async () => {
    try {
      await axios.post(`/admin/posts/${selectedPost.id}/assign-editor`, {
        editor_id: selectedEditor,
      });

      // update local UI state
      setPosts((prev) =>
        prev.map((p) =>
          p.id === selectedPost.id ? { ...p, status: "under_review" } : p
        )
      );

      setSuccess("Editor assigned successfully.");
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to assign editor. Try again."
      );
    } finally {
      setOpenDialog(false);
      setSelectedPost(null);
      setSelectedEditor("");
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Assign Editors to Submitted Posts
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {loading ? (
          <Box display="flex" justifyContent="center" my={3}>
            <CircularProgress />
          </Box>
        ) : posts.length === 0 ? (
          <Alert severity="info">No submitted posts available.</Alert>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Post ID</TableCell>
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
                    <TableCell>{post.id}</TableCell>
                    <TableCell>{post.title}</TableCell>
                    <TableCell>{post.author?.name}</TableCell>
                    <TableCell>{post.category?.name}</TableCell>
                    <TableCell>{post.status}</TableCell>
                    <TableCell>
                      {post.status === "submitted" && (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleAssign(post)}
                        >
                          Assign Editor
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Assign Editor dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Assign Editor</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Editor</InputLabel>
            <Select
              value={selectedEditor}
              onChange={(e) => setSelectedEditor(e.target.value)}
            >
              {editors.length === 0 ? (
                <MenuItem disabled>No editors available</MenuItem>
              ) : (
                editors.map((editor) => (
                  <MenuItem key={editor.id} value={editor.id}>
                    {editor.user?.name} ({category?.name})
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmAssign}
            disabled={!selectedEditor}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default AdminPostAssignments;
