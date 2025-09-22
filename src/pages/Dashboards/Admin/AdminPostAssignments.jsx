import { useEffect, useState } from "react";
import authService from "../../../services/authService";
import {
  Container,
  Paper,
  Snackbar,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
import EmptyState from "../../../components/EmptyState";
import ErrorCard from "../../../components/ErrorCard";

function AdminPostAssignments() {
  const [posts, setPosts] = useState([]);
  const [editors, setEditors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState({});
  const [assignedEditors, setAssignedEditors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await authService.getPostsAdmin();
      setPosts(res.data || []);
    } catch (err) {
      setError("Failed to load posts.");
    }
    setLoading(false);
  };

  const fetchEditors = async (categoryId) => {
    if (editors[categoryId]) return;
    try {
      const res = await authService.getEditorsAdmin(categoryId)
      setEditors((prev) => ({ ...prev, [categoryId]: res.data.editors || [] }));
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to load posts.",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleAssignEditor = async (post, editorId) => {
    try {
      await authService.postAssignEditor(post,editorId)

      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, status: "under_review" } : p
        )
      );

      setAssignedEditors((prev) => ({ ...prev, [post.id]: editorId }));

      setSnackbar({
        open: true,
        message: "Editor assigned successfully.",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err.response?.data?.error || "Failed to assign editor. Try again.",
        severity: "error",
      });
    }
  };

  return (
    <Container maxWidth="lg">
      <Box>
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
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "white", textAlign: "center" , fontSize:{xs:15,md:20}}}
          >
            Assign Editors to Submitted Posts
          </Typography>
        </Box>

        <Box sx={{ px: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box display="flex" justifyContent="center" my={3}>
              <CircularProgress />
            </Box>
          ) : posts.length === 0 ? (
            <><ErrorCard message="No pending request found." />
            <EmptyState message="No pending post to assign editor found." />
            </>
          ) : (
            <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell>Post ID</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Assign Editor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>{post.id}</TableCell>

                      {/* Title with ellipsis and tooltip */}
                      <TableCell sx={{ maxWidth: 200 }}>
                        <Tooltip title={post.title}>
                          <Typography
                            noWrap
                            sx={{
                              maxWidth: "200px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {post.title}
                          </Typography>
                        </Tooltip>
                      </TableCell>

                      {/* Author Name */}
                      <TableCell sx={{ maxWidth: 150 }}>
                        <Tooltip title={post.author?.name || "Unknown"}>
                          <Typography
                            noWrap
                            sx={{
                              maxWidth: "150px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {post.author?.name || "Unknown"}
                          </Typography>
                        </Tooltip>
                      </TableCell>

                      {/* Category Name */}
                      <TableCell sx={{ maxWidth: 150 }}>
                        <Tooltip title={post.category?.name || "N/A"}>
                          <Typography
                            noWrap
                            sx={{
                              maxWidth: "150px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {post.category?.name || "N/A"}
                          </Typography>
                        </Tooltip>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            color:
                              post.status === "submitted"
                                ? "black"
                                : post.status === "under_review"
                                ? "blue"
                                : "red",
                          }}
                        >
                          {post.status === "submitted"
                            ? "Submitted"
                            : post.status === "under_review"
                            ? "Under Review"
                            : post.status}
                        </Typography>
                      </TableCell>

                      {/* Assign Editor */}
                      <TableCell sx={{ maxWidth: 200 }}>
                        {post.status === "submitted" ? (
                          <FormControl fullWidth size="small">
                            <InputLabel>Select Editor</InputLabel>
                            <Select
                              value={assignedEditors[post.id] || ""}
                              onOpen={() => fetchEditors(post.category_id)}
                              onChange={(e) =>
                                handleAssignEditor(post, e.target.value)
                              }
                            >
                              {editors[post.category_id]?.length === 0 ? (
                                <MenuItem disabled>No editors</MenuItem>
                              ) : (
                                editors[post.category_id]?.map((editor) => (
                                  <MenuItem key={editor.id} value={editor.id}>
                                    {editor.user?.name}
                                  </MenuItem>
                                ))
                              )}
                            </Select>
                          </FormControl>
                        ) : (
                          <Tooltip
                            title={
                              editors[post.category_id]?.find(
                                (e) => e.id === assignedEditors[post.id]
                              )?.user?.name || "Assigned"
                            }
                          >
                            <Typography
                              noWrap
                              sx={{
                                maxWidth: "200px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {editors[post.category_id]?.find(
                                (e) => e.id === assignedEditors[post.id]
                              )?.user?.name || "Assigned"}
                            </Typography>
                          </Tooltip>
                        )}
                        {success[post.id] && (
                          <Alert severity="success" sx={{ mt: 1 }}>
                            {success[post.id]}
                          </Alert>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default AdminPostAssignments;
