import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Avatar,
  Button,
  Paper,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import authService from "../../../services/authService";

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

function AuthorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchAuthorProfile = async () => {
    try {
      const res = await authService.getAuthorProfile(id);
      setAuthor(res.data);
    } catch (err) {
      if (err.code === "NOT_FOUND") {
        setDeleted(true);
        setAuthor(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthorFollow = async () => {
    try {
      const res = await authService.getAuthorFollow(id);
      setAuthor((prev) => ({
        ...prev,
        is_followed: res.data.is_followed,
      }));
    } catch (err) {
      if (err.code === "NOT_FOUND") {
        setDeleted(true);
        setAuthor(null);
      }
      setSnackbar({ open: true, message: "Failed to fetch follow status", severity: "error" });
    }
  };

  const toggleFollow = async (authorId) => {
    try {
      const res = await authService.followAuthors(authorId);
      setAuthor((prev) => ({
        ...prev,
        is_followed: res.data.action === "followed",
      }));

      setSnackbar({
        open: true,
        message: res.data.action === "followed" ? "Followed successfully" : "Unfollowed successfully",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({ open: true, message: "Action failed", severity: "error" });
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchAuthorProfile();
    fetchAuthorFollow();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (deleted) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
        <img
          src="/public/deleted.png"
          alt="Deleted"
          style={{ width: "200px", marginBottom: "20px" }}
        />
        <Typography variant="h6" color="text.secondary">
          This author is no longer available.
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Author Info */}
      <Paper elevation={4} sx={{ p: { xs: 2, md: 3 }, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {/* Avatar + Name */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
            <Avatar
              src={author?.avatar || ""}
              alt={author?.name || author?.username}
              sx={{ width: { xs: 50, md: 100 }, height: { xs: 50, md: 100 } }}
            />
            <Typography
              sx={{
                fontSize: { xs: 16, md: 30 },
                fontWeight: "bold",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: {xs:"200px",md:"1000px"},
              }}
              title={author?.name}
            >
              {author?.name}
            </Typography>
          </Box>

          <Button
            variant="outlined"
            sx={{
              textTransform: "none",
              borderRadius: "20px",
              px: 3,
              py: 1,
              minWidth: "120px",
              bgcolor: "white",
              color: "black",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              "&:hover": { transform: "scale(1.03)", bgcolor: "#2c2638", color: "white" },
            }}
            onClick={() => toggleFollow(author.id)}
          >
            {author.is_followed ? (
              <>
                <PersonRemoveIcon fontSize="small" /> Unfollow
              </>
            ) : (
              <>
                <PersonAddIcon fontSize="small" /> Follow
              </>
            )}
          </Button>
        </Box>
      </Paper>

      {/* Author's Posts Header */}
      <Box
        sx={{
          bgcolor: "#2c2638",
          height: 80,
          p: 1,
          mb: 2,
          borderRadius: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            textAlign: "center",
            color: "white",
            p: 1,
            m: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "90%",
          }}
          title={`${author?.name}'s Posts`}
        >
          {author?.name}'s Posts
        </Typography>
      </Box>

      {/* Posts */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "center",
          mt: 3,
        }}
      >
        {author?.posts?.length > 0 ? (
          author.posts.map((post) => (
            <Card
              key={post.id}
              sx={{
                flex: "1 1 calc(100% - 16px)",
                maxWidth: { xs: "100%", sm: "calc(50% - 16px)", md: "calc(33% - 24px)" },
                cursor: "pointer",
                borderRadius: 2,
                boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                height: 350,
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              {/* Media or fallback header */}
              <Box
                sx={{
                  position: "relative",
                  height: 150,
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                  overflow: "hidden",
                  background: post.media && post.media.length > 0 ? "none" : "linear-gradient(135deg, #2c2638, #4b3d5a)",
                }}
              >
                {post.media && post.media.length > 0 && (
                  <CardMedia
                    component="img"
                    image={`${STORAGE_URL}/${post.media[0].url}`}
                    alt={post.title}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}

                {/* Title overlay on header */}
                <Typography
                  variant="h6"
                  sx={{
                    position: "absolute",
                    bottom: 8,
                    left: 8,
                    right: 8,
                    color: "white",
                    fontWeight: 600,
                    textShadow: "0px 0px 6px rgba(0,0,0,0.7)",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={post.title} 
                >
                  {post.title}
                </Typography>
              </Box>

              {/* Card Content */}
              <CardContent
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  p: 2,
                }}
              >
                {/* Title in content */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={post.title}
                >
                  {post.title}
                </Typography>

                {/* Meta info */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={author?.name}
                >
                  author: {author?.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {new Date(post.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Typography>

                {/* Read Button */}
                <Button
                  sx={{
                    color: "black",
                    fontWeight: 500,
                    alignSelf: "flex-start",
                    mt: "auto",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/dashboard/guest/post/${post.id}`);
                  }}
                >
                  READ
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Box
            sx={{
              textAlign: "center",
              mt: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <img
              src="/public/vector.png"
              alt="No posts"
              style={{ width: "200px", marginBottom: "20px" }}
            />
            <Typography variant="h6" color="text.secondary">
              No posts available by this author yet.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default AuthorProfile;
