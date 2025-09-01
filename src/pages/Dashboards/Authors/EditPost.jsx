import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Alert,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import axios from "../../../api/axios";

const BASE_URL = "http://localhost:8000";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
    media: [], // new uploads
  });
  const [existingMedia, setExistingMedia] = useState([]); // already saved
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // fetch categories
  useEffect(() => {
    axios.get("/categories").then((res) => setCategories(res.data));
  }, []);

  // fetch post details
  useEffect(() => {
    axios.get(`/posts/${id}`).then((res) => {
      const post = res.data;
      setForm({
        title: post.title,
        content: post.content,
        category: post.category?.name || "",
        tags: post.tags?.map((t) => t.name).join(",") || "",
        media: [],
      });
      setExistingMedia(post.media || []);
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({
        ...prev,
        media: [...prev.media, ...Array.from(files)],
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const removeExistingMedia = async (mediaId) => {
    try {
      await axios.delete(`/media/${mediaId}`);
      setExistingMedia((prev) => prev.filter((m) => m.id !== mediaId));
    } catch {
      alert("Failed to delete media.");
    }
  };

  const removeNewMedia = (index) => {
    setForm((prev) => {
      const updated = [...prev.media];
      updated.splice(index, 1);
      return { ...prev, media: updated };
    });
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
    formData.append("status", "draft");

    tagsArray.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });

    if (form.media.length > 0) {
      form.media.forEach((file) => formData.append("media[]", file));
    }

    try {
      await axios.post(`/posts/${id}?_method=PUT`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Post updated successfully!");
      navigate(`/dashboard/posts/${id}`);
    } catch (err) {
      setError("Failed to update post.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Edit Post
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "grid", gap: 2, mt: 2 }}
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
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.name}>
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

        {/* Existing media */}
        <Typography variant="subtitle1">Current Media</Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {existingMedia.length > 0 ? (
            existingMedia.map((m) => (
              <Box
                key={m.id}
                sx={{
                  position: "relative",
                  width: 120,
                  height: 120,
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <img
                  src={`${BASE_URL}/storage/${m.url}`}
                  alt="media"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => removeExistingMedia(m.id)}
                  sx={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    background: "rgba(255,255,255,0.7)",
                  }}
                >
                  <Delete fontSize="small" color="error" />
                </IconButton>
              </Box>
            ))
          ) : (
            <Typography color="text.secondary">No media</Typography>
          )}
        </Box>

        {/* New media preview */}
        {form.media.length > 0 && (
          <>
            <Typography variant="subtitle1">New Uploads</Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {form.media.map((file, idx) => (
                <Box
                  key={idx}
                  sx={{
                    position: "relative",
                    width: 120,
                    height: 120,
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => removeNewMedia(idx)}
                    sx={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      background: "rgba(255,255,255,0.7)",
                    }}
                  >
                    <Delete fontSize="small" color="error" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </>
        )}

        {/* Add More Media */}
        <Button variant="outlined" component="label">
          Add More Media
          <input
            type="file"
            hidden
            multiple
            name="media"
            onChange={handleChange}
          />
        </Button>

        <Button type="submit" variant="contained">
          Update
        </Button>
      </Box>
    </Container>
  );
}

export default EditPost;
