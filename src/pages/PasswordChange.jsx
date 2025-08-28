import { useState } from "react";
import axios from "../api/axios";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function PasswordChange() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const Navigate = useNavigate();

  const handleChangePassword = async () => {
    setError("");
    setSuccess("");
    

    if (!password || !confirmPassword) {
      setError("Please fill in both fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
try {
  const res = await axios.post("/change-password", { password });

  if (res.data.error) {
    setError(res.data.error); 
  } else {
    setSuccess(res.data.message || "Password updated successfully.");
    setPassword("");
    setConfirmPassword("");
  }
} catch (err) {
  if (err.response && err.response.data) {
    const apiError = err.response.data;
    setError(apiError.error || Object.values(apiError)[0]);
  } else {
    setError("Something went wrong, please try again.");
  }
}

    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Change Password
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <TextField
          fullWidth
          margin="normal"
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Box sx={{ mt: 2, position: "relative" }}>
          <Button
            variant="contained"
            fullWidth
            disabled={loading}
            onClick={handleChangePassword}
          >
            Confirm
          </Button>
          {loading && (
            <CircularProgress
              size={24}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                mt: "-12px",
                ml: "-12px",
              }}
            />
          )}

          <Button
            variant="contained"
            fullWidth
            onClick={()=>Navigate("/dashboard")}
            sx={{
                mt:"10px"
            }}
          >
            Go to Dashboard
          </Button>
          
        </Box>
      </Paper>
    </Container>
  );
}

export default PasswordChange;
