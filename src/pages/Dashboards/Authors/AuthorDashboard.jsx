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
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import authService from "../../../services/authService";

function AuthorPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  // fetch posts
  const fetchPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await authService.fetchPostsByAuthors();
      setPosts(res.data);
    } catch (err) {
      setError("Failed to load posts.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // create new post
  const handleCreate = () => {
    navigate("/dashboard/author/posts/create");
  };

  // edit post
  const handleEdit = (id) => {
    navigate(`/dashboard/author/posts/${id}/edit`);
  };

  // delete post
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await authService.deletePostByAuthors(id);
      setSuccess("Post deleted successfully!");
      fetchPosts();
    } catch (err) {
      setError("Failed to delete post.");
    }
  };

  return (
    <Container maxWidth="lg">
      <Box>
        <Box
          sx={{
            px: 2,
            bgcolor: "#2c2638",
            borderRadius: 2,
            py: 2,
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontWeight: "bold",
              color: "white",
              textAlign: "center",
              fontSize: { xs: 15, md: 20 },
              ml: { xs: 0, sm: 25, lg: 60, md: 40 },
            }}
          >
            My Posts
          </Typography>
          <Button variant="contained" onClick={handleCreate}>
            Create new Post
          </Button>
        </Box>

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

        {/* Posts List */}
        {loading ? (
          <Box display="flex" justifyContent="center" my={3}>
            <CircularProgress />
          </Box>
        ) : posts.length === 0 ? (
          <Alert severity="info">You don’t have any posts. Create one!</Alert>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Box sx={{ overflowX: "auto" }}></Box>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  {["Title", "Category", "Current Status", "Actions"].map(
                    (header) => (
                      <TableCell
                        key={header}
                        sx={{ whiteSpace: "nowrap", fontWeight: "bold" }}
                      >
                        {header}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    {/* Title */}
                    <TableCell
                      sx={{
                        maxWidth: 200,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <Tooltip title={post.title || ""}>
                        <span>{post.title}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 200,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <Tooltip title={post.status || ""}>
                        <span>{post.category?.name}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{post.status}</TableCell>
                    <TableCell align="right">
                      <Box display="flex" gap={1} flexWrap="wrap">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            navigate(`/dashboard/author/posts/${post.id}`)
                          }
                        >
                          View
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleEdit(post.id)}
                          disabled={
                            !["draft", "editor_rejected"].includes(post.status)
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
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
      </Box>
    </Container>
  );
}

export default AuthorPosts;
