import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  CircularProgress,
  Box,
} from "@mui/material";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const PasswordResetPage = () => {
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate=useNavigate();

  // Step 1 - Send OTP
  const handleSendOtp = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await axios.post("/forget-password", { email });
      setSuccess(res.data.message);
      setStep(2);
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

  // Step 2 - Verify OTP
  const handleVerifyOtp = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await axios.post("/verify-otp", { email, otp });
      setSuccess(res.data.message);
      setStep(3);
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

  // Step 3 - Reset Password
  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await axios.post("/reset-password", { email, otp, password });
      setSuccess(res.data.message);
      setStep(1);
      setEmail("");
      setOtp("");
      setPassword("");
      setConfirmPassword("");
      navigate("/login");
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
      <Paper elevation={20} sx={{ p: 4, mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Password Reset
        </Typography>

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

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Box sx={{ mt: 2, position: "relative"}}>
              <Button
                variant="contained"
                fullWidth
                disabled={loading}
                onClick={handleSendOtp}
                sx={{
                    mb:"10px"
                }}
              >
                Send OTP
              </Button>
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{ position: "absolute", top: "50%", left: "50%", mt: "-12px", ml: "-12px" }}
                />
              )}



              <Button
  variant="contained"
  fullWidth
  onClick={() => navigate("/login")}
>
  Back to Login
</Button>
            </Box>
          </>
        )}
        {/* Step 2: Verify OTP */}
        {step === 2 && (
          <>
            <TextField
              fullWidth
              margin="normal"
              label="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <Box sx={{ mt: 2, position: "relative" }}>
              <Button
                variant="contained"
                fullWidth
                disabled={loading}
                onClick={handleVerifyOtp}
                sx={
                    {
                        mb:"10px"
                    }
                }
              >
                Verify OTP
              </Button>
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{ position: "absolute", top: "50%", left: "50%", mt: "-12px", ml: "-12px" }}
                />
              )}


                            <Button
                variant="contained"
                fullWidth
                disabled={loading}
                onClick={handleSendOtp}
              >
                Resend OTP
              </Button>
            </Box>
          </>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <>
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
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Box sx={{ mt: 2, position: "relative" }}>
              <Button
                variant="contained"
                fullWidth
                disabled={loading}
                onClick={handleResetPassword}
              >
                Reset Password
              </Button>
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{ position: "absolute", top: "50%", left: "50%", mt: "-12px", ml: "-12px" }}
                />
              )}
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default PasswordResetPage;
