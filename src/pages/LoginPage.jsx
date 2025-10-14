import React, { useState, useContext } from "react";
import authService from "../services/authService";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Paper,
  TextField,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import LoginIcon from "@mui/icons-material/Login";

const LoginPage = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { login } = useContext(AuthContext);
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      if (isRegister) {
        clearErrors();
        await authService.registerUser(data);
        alert("Registration successful! Please login.");
        setIsRegister(false);
      } else {
        await login(data.username, data.password);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        const apiErrors = err.response.data;

        if (apiErrors.error) {
          setError("root", {
            type: "server",
            message: apiErrors.error,
          });
        } else if (apiErrors.errors) {
          // Handle validation field errors
          Object.keys(apiErrors.errors).forEach((field) => {
            setError(field, {
              type: "server",
              message: apiErrors.errors[field][0],
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        margin: -2,
        pt: 2,
      }}
    >
      {/* Header */}
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "#2c2638",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          borderBottom: "solid",
          borderWidth: "0.5px",
          borderColor: "#ffffff21",
        }}
      >
        <Toolbar>
          <Typography
            color="white"
            variant="h6"
            noWrap
            sx={{
              bgcolor: "#2c2638",

              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            Blog Management System
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 10,
          pb: 4,
          bgcolor: "#2c2638",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            px: { xs: 2, md: 1 },
            p: 2,
          }}
        >
          <img
            src="/public/blopapp.png"
            alt="Blog Management Illustration"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Box>

        {/* Right Form Section */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderLeft: "solid",
            borderColor: "#f8f8f828",
            borderWidth: "1px",
          }}
        >
          <Box
            sx={{
              p: 5,
              maxWidth: 450,
              width: "100%",
              borderRadius: 3,
              bgcolor: "#2c2638",
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              align="center"
              sx={{
                color: "white",
              }}
            >
              {isRegister ? "Create an account" : "Login"}
            </Typography>

            {errors.root?.message && (
              <Alert severity="error" sx={{ my: 2 }}>
                {errors.root.message}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 1 }}
            >
              {isRegister && (
                <>
                  <TextField
                    label="Full Name"
                    fullWidth
                    margin="normal"
                    {...register("name", { required: "Name is required" })}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    sx={{
                      "& .MuiOutlinedInput-input": {
                        color: "#ffffffc7",
                      },
                      "& .MuiInputLabel-root": {
                        color: "#ffffffc7",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#ffffffc7",
                      },
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#453c5aff",
                        "& fieldset": {
                          borderColor: "#ffffff4d",
                        },
                        "&:hover fieldset": {
                          borderColor: "#ffffff",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#ffffff",
                        },
                      },
                      "& input:-webkit-autofill": {
                        WebkitBoxShadow: "0 0 0 1000px #453c5aff inset",
                        WebkitTextFillColor: "#ffffffc7",
                      },
                    }}
                  />

                  <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    {...register("email", { required: "Email is required" })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={{
                      "& .MuiOutlinedInput-input": {
                        color: "#ffffffc7",
                      },
                      "& .MuiInputLabel-root": {
                        color: "#ffffffc7",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#ffffffc7",
                      },
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#453c5aff",
                        "& fieldset": {
                          borderColor: "#ffffff4d",
                        },
                        "&:hover fieldset": {
                          borderColor: "#ffffff",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#ffffff",
                        },
                      },
                      "& input:-webkit-autofill": {
                        WebkitBoxShadow: "0 0 0 1000px #453c5aff inset",
                        WebkitTextFillColor: "#ffffffc7",
                      },
                    }}
                  />
                </>
              )}

              <TextField
                label="Username"
                fullWidth
                margin="normal"
                {...register("username", { required: "Username is required" })}
                error={!!errors.username}
                helperText={errors.username?.message}
                sx={{
                  "& .MuiOutlinedInput-input": {
                    color: "#ffffffc7",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#ffffffc7",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#ffffffc7",
                  },
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#453c5aff",
                    "& fieldset": {
                      borderColor: "#ffffff4d",
                    },
                    "&:hover fieldset": {
                      borderColor: "#ffffff",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#ffffff",
                    },
                  },
                  "& input:-webkit-autofill": {
                    WebkitBoxShadow: "0 0 0 1000px #453c5aff inset",
                    WebkitTextFillColor: "#ffffffc7",
                  },
                }}
              />

              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                {...register("password", { required: "Password is required" })}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{
                  "& .MuiOutlinedInput-input": {
                    color: "#ffffffc7",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#ffffffc7",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#ffffffc7",
                  },
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#453c5aff",
                    "& fieldset": {
                      borderColor: "#ffffff4d",
                    },
                    "&:hover fieldset": {
                      borderColor: "#ffffff",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#ffffff",
                    },
                  },
                  "& input:-webkit-autofill": {
                    WebkitBoxShadow: "0 0 0 1000px #453c5aff inset",
                    WebkitTextFillColor: "#ffffffc7",
                  },
                }}
              />

              <Button
                size="small"
                sx={{ textTransform: "none", color: "white" }}
                onClick={() => navigate("/password-reset")}
              >
                Forgot Password?
              </Button>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  borderRadius: "50px",
                  backgroundColor: "#6d54b5",
                  color: "white",
                  "&:hover": { backgroundColor: "#6c54b579" },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : isRegister ? (
                  "Register"
                ) : (
                  <>
                    Login <LoginIcon sx={{ ml: 1 }} />
                  </>
                )}
              </Button>
            </Box>

            <Divider
              sx={{
                my: 3,
                color: "white",
                "&::before, &::after": { borderColor: "white" },
              }}
            >
              OR
            </Divider>

            <Button
              fullWidth
              variant="contained"
              onClick={() =>
              (
                authService.loginWithGoogle())
              }
              sx={{
                borderRadius: "50px",
                backgroundColor: "#6d54b5",
                color: "white",
                gap: "10px",
                "&:hover": { backgroundColor: "#6c54b579" },
              }}
            >
              <GoogleIcon />
              Continue with Google
            </Button>

            <Box textAlign="center" sx={{ mt: 2 }}>
              <Button
                type="button"
                variant="text"
                onClick={toggleForm}
                sx={{ color: "white", fontWeight: "bold" }}
              >
                {isRegister
                  ? "Already have an account? Login"
                  : "Don't have an account? Register"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: "#2c2638",
          borderTop: "solid",
          borderWidth: "0.5px",
          borderColor: "#ffffff13",
          textAlign: "center",
          p: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "white",
          }}
        >
          © {new Date().getFullYear()} Blog Management System
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
