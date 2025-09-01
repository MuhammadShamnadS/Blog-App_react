import { useState, useEffect } from "react";
import axios from "../../../api/axios";
import {
  Container,
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
    status: "draft",
    media: [],
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

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
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({
        ...prev,
        media: [...(prev.media || []), ...Array.from(files)],
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRemoveMedia = (index) => {
    setForm((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const tagsArray = form.tags
      ? form.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
      : [];

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("category", form.category);
    formData.append("status", form.status);

    tagsArray.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });

    if (form.media && form.media.length > 0) {
      form.media.forEach((file) => {
        formData.append("media[]", file);
      });
    }

    setLoading(true);
    try {
      const res = await axios.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Post created successfully!");
      setForm({
        title: "",
        content: "",
        category: "",
        tags: "",
        status: "draft",
        media: [],
      });
      // navigate to view page
      navigate(`/dashboard/posts/${res.data.post.id}`);
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(JSON.stringify(err.response.data.errors));
      } else {
        setError("Failed to create post.");
      }
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" mb={3}>
        Create New Post
      </Typography>

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

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "grid", gap: 2 }}
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
          rows={6}
          required
        />
        <TextField
          select
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>Type a new category...</em>
          </MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.name}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Or Enter New Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="e.g. Technology"
        />
        <TextField
          label="Tags (comma separated)"
          name="tags"
          value={form.tags}
          onChange={handleChange}
        />
        <Box>
          <Button variant="outlined" component="label">
            Upload Media
            <input
              type="file"
              hidden
              multiple
              name="media"
              onChange={handleChange}
            />
          </Button>
          {form.media && form.media.length > 0 && (
            <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
              {form.media.map((file, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    width: 80,
                    height: 80,
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  {file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Typography
                      variant="caption"
                      sx={{ p: 1, textAlign: "center", display: "block" }}
                    >
                      {file.name}
                    </Typography>
                  )}
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleRemoveMedia(index)}
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      minWidth: "unset",
                      p: "2px 6px",
                      fontSize: "0.7rem",
                    }}
                  >
                    ✕
                  </Button>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button variant="outlined" onClick={() => navigate("/dashboard/posts")}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Create Post"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default CreatePost;
