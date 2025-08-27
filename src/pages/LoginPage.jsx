import React, { useState, useContext } from "react";
import API from "../api/axios";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Divider,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      if (isRegister) {
        clearErrors(); 
        await API.post("/register", data);
        alert("Registration successful! Please login.");
        setIsRegister(false);
      } else {
        await login(data.username, data.password);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        const apiErrors = err.response.data;

        // handle invalid login error
        if (apiErrors.error) {
          setError("root", {
            type: "server",
            message: apiErrors.error,
          });
        } else {
          // attach field-level validation errors (for registration)
          Object.keys(apiErrors).forEach((field) => {
            setError(field, {
              type: "server",
              message: apiErrors[field][0],
            });
          });
        }
      } else {
        setError("root", {
          type: "server",
          message: "Server error, please try again",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsRegister(!isRegister);
    clearErrors();
  };

  return (
    <Grid container sx={{ height: "95vh", width: "100vw", m: 0 }}>
      {/* Left side */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          background: "linear-gradient(to right, #1976d2, #42a5f5)",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          px: { xs: 3, sm: 4, md: 8 },
          py: 4,
          textAlign: "center",
        }}
      >
        <Box sx={{ maxWidth: 400, mx: 8 }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Blog Management System
          </Typography>
        </Box>
      </Grid>

      {/* Right side */}
      <Grid
        item
        xs={10}
        md={6}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: { xs: 2, sm: 5, md: 8 },
          py: 1,
          bgcolor: "#fff",
        }}
      >
        <Paper
          elevation={20}
          sx={{
            borderRadius: "15px",
            bgcolor: "#e4e3e3ff",
            p: 4,
            width: "100%",
            maxWidth: 400,
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            align="center"
            color="Black"
          >
            {isRegister ? "Sign Up" : "Sign In"}
          </Typography>

          {/* show root-level errors */}
          {errors.root?.message && (
            <Alert severity="error" sx={{ my: 2 }}>
              {errors.root.message}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mb: "10px", mt: "-10px" }}
          >
            {isRegister && (
              <>
                <TextField
                  fullWidth
                  label="Name"
                  margin="normal"
                  {...register("name", { required: "Name is required" })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />

                <TextField
                  fullWidth
                  label="Email"
                  margin="normal"
                  {...register("email", { required: "Email is required" })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </>
            )}

            <TextField
              fullWidth
              label="Username"
              margin="normal"
              {...register("username", { required: "Username is required" })}
              error={!!errors.username}
              helperText={errors.username?.message}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              {...register("password", { required: "Password is required" })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 2,
                borderRadius: "100px",
                background: "primary",
                color: "white",
                "&:hover": { backgroundColor: "#0d8cc7d8" },
                fontWeight: 600,
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : isRegister ? (
                "Register"
              ) : (
                "Login"
              )}
            </Button>
          </Box>

          <Divider>or</Divider>

          <Box sx={{ height: "60px" }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                window.location.href =
                  "http://localhost:8000/api/auth/google/redirect";
              }}
              sx={{
                marginTop: "10px",
                borderRadius: "100px",
                background: "primary",
                color: "white",
                mb: "3px",
                "&:hover": { backgroundColor: "#0d8cc7d8" },
                fontWeight: 600,
              }}
            >
              Continue with Google
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ textAlign: "center" }}>
            <Button
              type="button"
              variant="text"
              onClick={toggleForm}
              sx={{
                color: "primary.main",
                "&:hover": { backgroundColor: "#d8d8d8" },
                fontWeight: 300,
              }}
            >
              {isRegister
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
