import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import { Box, Typography, Snackbar, Alert, Container, Button, CircularProgress, Avatar, Grid, Paper } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import authService from "../../../services/authService";

function GuestAuthorCards() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  const fetchAuthors = async () => {
    setLoading(true);
    try {
      const res = await authService.getAuthorsByGuest();
      setAuthors(res.data);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to fetch authors", severity: "error" });
    } finally {
      setLoading(false);
    }
  };
  const toggleFollow = async (authorId) => {
    try {
      const res = await authService.followAuthors(authorId);
      setAuthors((prev) =>
        prev.map((author) =>
          author.id === authorId
            ? { ...author, is_followed: res.data.action === "followed" }
            : author
        )
      );

      setSnackbar({
        open: true,
        message: res.data.action === "followed" ? "Followed successfully" : "Unfollowed successfully",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Action failed", severity: "error" });
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  return (
    <Container maxWidth="lg" sx={{ }}>
      {/* Header */}
            <Paper elevation={8}
      sx={{
        height:"fit-content",
        pb:2
      }}>
      <Box
        sx={{
          bgcolor: "#2c2638",
          borderRadius: 2,
          py: 2,
          mb: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "white" }}>
          Authors
        </Typography>
      </Box>

<Box sx={{
    display: "flex",
    justifyContent: "center",
    px: 2,
}}>
      {/* Author Cards Grid */}
      <Grid container spacing={3}
          sx={{
      justifyContent: { xs: "center", md: "flex-start" }, 
    }}>
        {authors.map((author) => (
          <Grid
            item
            key={author.id}
            xs={12} 
            sm={6}  
            md={4}  
            lg={3}

          
          >
            <Paper elevation={2}
              sx={{
                width:200,
                bgcolor:"#202020ff",
                color:"White",
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                borderRadius: 3,
                boxShadow: 3,
                height: "100%",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.03)" },
              }}
            >
              <Avatar
                src={author.avatar || ""}
                alt={author.name || author.username}
                sx={{ width: 80, height: 80, mb: 2 }}
              />
<Typography
  variant="h6"
  sx={{
    mb: 2,
    width: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    wordBreak: "normal",
  }}
  title={author.name} // full name shown on hover
>
  {author.name}
</Typography>

              <Box sx={{
                display:"flex",
                flexDirection:"column",
                alignItems:"center",
                gap:2
              }}>
<Button
  variant="outlined"
  onClick={() => navigate(`/dashboard/guest/author/${author.id}/profile`)}
  sx={{ textTransform: "none", width: "150px", borderRadius: "20px", gap: 0.8, color: "black", bgcolor: "white",
    "&:hover": { transform: "scale(1.03)", bgcolor: "#2c2638", color: "white" },
  }}
>
  <VisibilityIcon /> View
</Button>
              
<Button
  variant={author.is_followed ? "outlined" : "outlined"}
  sx={{
    textTransform: "none",
    bgcolor:"white",
    borderRadius: "10px",
    width: "150px",
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
          </Grid>
        ))}
      </Grid>
      </Box>
      </Paper>
      
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

export default GuestAuthorCards;
