// PendingPosts.jsx
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
  Tooltip,
} from "@mui/material";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import authService from "../../../services/authService";
import ErrorCard from "../../../components/ErrorCard";
import EmptyState from "../../../components/EmptyState";
import CustomPagination from "../../../components/Pagination";

function FeaturedPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

  const fetchPosts = async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const res = await authService.fetchFeaturedPostAdmin(page);
      setPosts(res.data.data || []);
            setCurrentPage(res.data.current_page || 1);
      setLastPage(res.data.last_page || 1);
    } catch {
      setError("Failed to load featured posts.");
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
          <ErrorCard message={"No featured post found"} />
          <EmptyState message="No featured posts" />
        </>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Box sx={{ overflowX: "auto" }}></Box>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                {[
                  "Title",
                  "Author name",
                  "Category",
                  "Current Status",
                  "Actions",
                ].map((header) => (
                  <TableCell
                    key={header}
                    sx={{ whiteSpace: "nowrap", fontWeight: "bold" }}
                  >
                    {header}
                  </TableCell>
                ))}
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

                  {/* Author */}
                  <TableCell
                    sx={{
                      maxWidth: 200,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <Tooltip title={post.author?.name || ""}>
                      <span>{post.author?.name}</span>
                    </Tooltip>
                  </TableCell>

                  {/* Category */}
                  <TableCell
                    sx={{
                      maxWidth: 200,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <Tooltip >

                      <span>{post.category?.name}</span>
                    </Tooltip>
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
                    <CustomPagination
        currentPage={currentPage}
        lastPage={lastPage}
        onPageChange={fetchPosts}
      />
    </>
  );
}

export default FeaturedPosts;
