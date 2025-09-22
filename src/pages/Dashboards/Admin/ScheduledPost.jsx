import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
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
} from "@mui/material";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import authService from "../../../services/authService";
import ErrorCard from "../../../components/ErrorCard";
import EmptyState from "../../../components/EmptyState";

function ScheduledPost() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await authService.fetchScheduledPostAdmin();
      setPosts(res.data);
    } catch {
      setError("Failed to load scheduled posts.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
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
<>
<ErrorCard message={"No scheduled post found"}/>
<EmptyState message="No scheduled posts" />
</>
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
                      }}
                    >
                      {post.status.charAt(0).toUpperCase() +
                          post.status.slice(1)}
                    </Typography>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      <Button
                        variant="contained"
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
    </>
  );
}

export default ScheduledPost;
