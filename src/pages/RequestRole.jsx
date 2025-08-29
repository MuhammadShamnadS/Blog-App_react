import { useEffect, useState } from "react";
import axios from "../api/axios";
import {
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

function RequestRole() {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [requestStatus, setRequestStatus] = useState(null);
  const [requestedRole, setRequestedRole] = useState("");  
  const navigate = useNavigate();

  //handle only role change in dropdown
  const handleSelectChange = (event) => {
    setRole(event.target.value);
  };

  const statusfetch = async () => {
    try {
      const res = await axios.get("/requeststatus");

      if (res.data.error) {
        setError(res.data.error);
      } else {
        setRequestStatus(res.data.status);       
        setRequestedRole(res.data.requested_role); 
      }
    } catch (err) {
      if (err.response && err.response.data) {
        const apiError = err.response.data;
        setError(apiError.error || Object.values(apiError)[0]);
      } else {
        setError("Something went wrong, please try again.");
      }
    }
  };

  useEffect(() => {
    statusfetch();
  }, []); 

  //handle API submission
  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!role) {
      setError("Please select a role first.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/role-request", { requested_role: role });

      if (res.data.error) {
        setError(res.data.error);
      } else {
        setSuccess(res.data.message || "Role change requested successfully.");
        setRequestStatus("pending");   
        setRequestedRole(role);        
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
          Request for Role Change
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {/* Status banner */}
        {requestStatus && (
          <Alert 
            severity={requestStatus === "pending" ? "info" : 
                      requestStatus === "approved" ? "success" : "warning"} 
            sx={{ mb: 2 }}
          >
            Your request for role <strong>{requestedRole}</strong> is currently{" "}
            <strong>{requestStatus}</strong>.
          </Alert>
        )}

        <FormControl fullWidth sx={{ mt: 2 }} disabled={requestStatus === "pending"}>
          <InputLabel>Select a Role</InputLabel>
          <Select value={role} label="Role" onChange={handleSelectChange}>
            <MenuItem value="author">Author</MenuItem>
            <MenuItem value="editor">Editor</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ mt: 3, position: "relative" }}>
          <Button
            variant="contained"
            fullWidth
            disabled={loading || requestStatus === "pending"} // 🔹 disable if pending
            onClick={handleSubmit}
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
            variant="outlined"
            fullWidth
            onClick={() => navigate("/dashboard")}
            sx={{ mt: "10px" }}
          >
            Go to Dashboard
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default RequestRole;
