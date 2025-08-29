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
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";

function AuthorPosts() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // form state
  const [form, setForm] = useState({
    id: null,
    title: "",
    content: "",
    category_id: "",
    tags: "",
    media: null,
  });

  // fetch posts
  const fetchPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/posts");
      setPosts(res.data);
    } catch (err) {
      setError("Failed to load posts.");
    }
    setLoading(false);
  };

  // fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories.");
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  // handle form input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // create or update post
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("category_id", form.category_id);
    formData.append("tags", form.tags); 
    if (form.media) {
      formData.append("media[]", form.media);
    }

    try {
      if (form.id) {
        // update
        await axios.post(`/posts/${form.id}?_method=PUT`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("Post updated successfully!");
      } else {
        // create
        await axios.post("/posts", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("Post created successfully!");
      }
      setForm({ id: null, title: "", content: "", category_id: "", tags: "", media: null });
      fetchPosts();
    } catch (err) {
      setError("Failed to save post.");
    }
  };

  // edit post
  const handleEdit = (post) => {
    setForm({
      id: post.id,
      title: post.title,
      content: post.content,
      category_id: post.category_id,
      tags: post.tags?.map((t) => t.name).join(",") || "",
      media: null,
    });
  };

  // delete post
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/posts/${id}`);
      setSuccess("Post deleted successfully!");
      fetchPosts();
    } catch (err) {
      setError("Failed to delete post.");
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          {form.id ? "Edit Post" : "Create Post"}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {/* Post Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "grid", gap: 2, mb: 4 }}
        >
          <TextField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <TextField
            label="Content"
            name="content"
            value={form.content}
            onChange={handleChange}
            multiline
            rows={4}
            required
          />
          <TextField
            select
            label="Category"
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            required
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Tags (comma separated)"
            name="tags"
            value={form.tags}
            onChange={handleChange}
          />
          <Button variant="outlined" component="label">
            Upload Media
            <input type="file" hidden name="media" onChange={handleChange} />
          </Button>
          <Button variant="contained" type="submit">
            {form.id ? "Update Post" : "Create Post"}
          </Button>
        </Box>

        {/* Posts List */}
        <Typography variant="h6" gutterBottom>
          My Posts
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" my={3}>
            <CircularProgress />
          </Box>
        ) : posts.length === 0 ? (
          <Alert severity="info">No posts found.</Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>{post.title}</TableCell>
                    <TableCell>{post.category?.name}</TableCell>
                    <TableCell>{post.status}</TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleEdit(post)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleDelete(post.id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
}

export default AuthorPosts;
