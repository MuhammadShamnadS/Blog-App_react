import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import {
  Container,
  Paper,
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
  Button,
} from "@mui/material";
import authService from "../../../services/authService";

function EditorPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // fetch assigned posts
  const fetchPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await authService.getPostByEditors();
      setPosts(res.data.reviews || []);
    } catch (err) {
      setError("Failed to load posts.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          My Assigned Posts
        </Typography>

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
          <Alert severity="info">No posts assigned for review.</Alert>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {posts.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>{review.post?.title}</TableCell>
                    <TableCell>{review.post?.category?.name}</TableCell>
                    <TableCell>{review.post?.author?.name}</TableCell>
                    <TableCell>{review.status}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          navigate(`/dashboard/editor/reviews/${review.id}`)
                        }
                      >
                        View
                      </Button>
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

export default EditorPosts;
