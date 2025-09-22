import React, { useEffect, useState } from "react";
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import authService from "../../../services/authService";

// Add `tab` as prop
function AllPosts({ tab }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await authService.fetchPostAdmin();
      setPosts(res.data);
    } catch {
      setError("Failed to load posts.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" my={3}>
          <CircularProgress />
        </Box>
      ) : posts.length === 0 ? (
        <Alert severity="info">No posts found.</Alert>
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

                  <TableCell>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() =>
                          navigate(
                            `/dashboard/admin/posts/${post.id}?tab=${tab}`
                          )
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
    </>
  );
}

export default AllPosts;

