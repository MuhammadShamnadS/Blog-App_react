import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Chip,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import authService from "../../../services/authService";

function CreatePost() {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    setError,
    register,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      title: "",
      content: "",
      category: "",
      status: "draft",
      media: [],
      tags: [], // ✅ managed by RHF only
    },
  });

  const watchedCategory = watch("category");

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await authService.getAvailableCategories();
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories.");
      }
    };
    fetchCategories();
  }, []);

  // Fetch tags whenever category changes
  useEffect(() => {
    if (!watchedCategory) {
      setTags([]);
      return;
    }

    const selectedCategory = categories.find(
      (c) => c.name === watchedCategory
    );
    if (!selectedCategory) return;

    const fetchTags = async () => {
      try {
        const res = await authService.getAvailableTagsUnderACategories(
          selectedCategory.id
        );
        setTags(res.data);
      } catch (err) {
        console.error("Failed to load tags.");
      }
    };
    fetchTags();
  }, [watchedCategory, categories]);

  const handleMediaChange = (e, fieldOnChange, currentMedia) => {
    const files = Array.from(e.target.files);
    fieldOnChange([...currentMedia, ...files]);
  };

  const handleRemoveMedia = (index, fieldOnChange, currentMedia) => {
    const updated = currentMedia.filter((_, i) => i !== index);
    fieldOnChange(updated);
  };

  const onSubmit = async (data) => {
    setGlobalError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("category", data.category);
      formData.append("status", data.status);

      data.tags.forEach((tag, index) => {
        formData.append(`tags[${index}]`, tag);
      });

      data.media.forEach((file) => {
        formData.append("media[]", file);
      });

      const res = await authService.createPost(formData);
      reset();
      setTags([]);
      navigate(`/dashboard/author/posts/${res.data.post.id}`);
    } catch (err) {
      console.log(err);
      const backendErrors = err.errors;
      if (backendErrors) {
        Object.entries(backendErrors).forEach(([field, messages]) => {
          setError(field, { type: "server", message: messages.join(" ") });
        });
      } else {
        setGlobalError("Failed to create post.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      {/* Header */}
      <Box
        sx={{
          px: 2,
          bgcolor: "#2c2638",
          borderRadius: 2,
          py: 2,
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <IconButton onClick={() => navigate(-1)} sx={{ color: "white" }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography
          sx={{
            fontWeight: "bold",
            color: "white",
            fontSize: { xs: 16, md: 20 },
          }}
        >
          Create Post
        </Typography>
      </Box>

      {/* Form Card */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        {globalError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {globalError}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "grid", gap: 3 }}
        >
          {/* Title */}
          <TextField
            label="Title"
            fullWidth
            {...register("title", { required: "Title is required" })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          {/* Content */}
          <TextField
            label="Content"
            multiline
            rows={4}
            fullWidth
            {...register("content", {
              required: "Content is required", minLength: {
                value: 10,
                message: "Content must be at least 10 characters long",
              },
              maxLength: {
                value: 500,
                message: "Content cannot exceed 500 characters",
              },
            })}
            error={!!errors.content}
            helperText={errors.content?.message}
          />

          {/* Category */}
          <Controller
            name="category"
            control={control}
            rules={{ required: "Category is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Category"
                fullWidth
                error={!!errors.category}
                helperText={errors.category?.message}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          {/* Tags */}
          {tags.length > 0 && (
            <Controller
              name="tags"
              control={control}
              rules={{
                validate: (value) =>
                  (value && value.length > 0) ||
                  "At least one tag must be selected",
              }}
              render={({ field }) => (
                <Box>
                  <Typography variant="subtitle1" mb={1}>
                    Select Tags
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {tags.map((tag) => {
                      const isSelected = field.value?.includes(tag.name);

                      return (
                        <Chip
                          key={tag.id}
                          label={tag.name}
                          clickable
                          onClick={() => {
                            let newValue;
                            if (isSelected) {
                              newValue = field.value.filter(
                                (t) => t !== tag.name
                              );
                            } else {
                              newValue = [...(field.value || []), tag.name];
                            }
                            field.onChange(newValue);
                          }}
                          color={isSelected ? "primary" : "default"}
                          sx={{
                            borderRadius: "16px",
                            fontSize: "0.85rem",
                          }}
                        />
                      );
                    })}
                  </Box>

                  {/* Frontend validation error only */}
                  {errors.tags && (
                    <Typography
                      variant="body2"
                      color="error"
                      sx={{ mt: 1, fontSize: "0.85rem" }}
                    >
                      {errors.tags.message}
                    </Typography>
                  )}
                </Box>
              )}
            />
          )}

          {/* Media */}
          <Controller
            name="media"
            control={control}
            render={({ field }) => (
              <Box>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadFileIcon />}
                >
                  Upload Media
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={(e) =>
                      handleMediaChange(e, field.onChange, field.value)
                    }
                  />
                </Button>
                {field.value.length > 0 && (
                  <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
                    {field.value.map((file, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: "relative",
                          width: 100,
                          height: 100,
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
                            sx={{
                              p: 1,
                              textAlign: "center",
                              display: "block",
                            }}
                          >
                            {file.name}
                          </Typography>
                        )}
                        <Button
                          size="small"
                          color="error"
                          onClick={() =>
                            handleRemoveMedia(
                              index,
                              field.onChange,
                              field.value
                            )
                          }
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
            )}
          />

          {/* Actions */}
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              onClick={() => navigate("/dashboard/author/posts")}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Create Post"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default CreatePost;
