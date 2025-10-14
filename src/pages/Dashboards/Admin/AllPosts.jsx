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
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import authService from "../../../services/authService";
import CustomPagination from "../../../components/Pagination";

// Add `tab` as prop
function AllPosts({ tab }) {
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
      const res = await authService.fetchPostAdmin(page);
      setPosts(res.data.data || []);
            setCurrentPage(res.data.current_page || 1);
      setLastPage(res.data.last_page || 1);
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
        <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Box sx={{ overflowX: "auto"}}>
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
          </Box>
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

export default AllPosts;

