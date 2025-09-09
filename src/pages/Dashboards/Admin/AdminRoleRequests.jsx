import { useEffect, useState } from "react";
import axios from "../../../api/axios";
import {
  Container,
  Paper,
  Snackbar,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

function AdminRoleRequests() {
  const [requests, setRequests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tab, setTab] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/pending-requests");
      setRequests(res.data);
    } catch (err) {
      setError("Failed to load requests.");
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchCategories();
  }, []);

  const handleDecision = async (id, action, category_id = null) => {
    try {
      await axios.post(`/role-decision/${id}`, {
        action,
        ...(category_id ? { category_id } : {}),
      });

      setRequests((prev) =>
        prev.map((req) =>
          req.id === id
            ? { ...req, status: action === "approve" ? "approved" : "rejected" }
            : req
        )
      );

      setSnackbar({
        open: true,
        message: `Request ${action}d successfully.`,
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to update request.",
        severity: "error",
      });
    }

    setOpenDialog(false);
    setSelectedRequest(null);
    setSelectedCategory("");
  };

  const handleApprove = (req) => {
    if (req.requested_role === "editor") {
      setSelectedRequest(req);
      setOpenDialog(true);
    } else {
      handleDecision(req.id, "approve");
    }
  };

  const displayedRequests =
    tab === 0 ? requests.filter((r) => r.status === "pending") : requests;

  return (
    <Container maxWidth="lg">
      <Box>
        {/* Header and Tabs */}
        <Box
          sx={{
            bgcolor: "#2c2638",
            borderRadius: 2,
            py: 2,
            mb: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "white",
              textAlign: "center",
            }}
          >
            Role Requests
          </Typography>
        </Box>
        <Box
          sx={{
            px: 2,
          }}
        >
          {/* Tabs */}
          <Tabs
            value={tab}
            onChange={(e, newValue) => setTab(newValue)}
            textColor="black"
            indicatorColor="primary"
            sx={{
              mb: 1,
            }}
          >
            <Tab label="Pending Requests" />
            <Tab label="All Requests" />
          </Tabs>
          {loading ? (
            <Box display="flex" justifyContent="center" my={3}>
              <CircularProgress />
            </Box>
          ) : displayedRequests.length === 0 ? (
            <Alert severity="info">
              {tab === 0 ? "No pending requests." : "No requests found."}
            </Alert>
          ) : (
            <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableHead sx={{ bgcolor: "#ffffffff" }}>
                  <TableRow>
                    <TableCell>User ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Current Role</TableCell>
                    <TableCell>Requested Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedRequests.map((req) => (
                    <TableRow key={req.id}>
                      {/* User ID */}
                      <TableCell
                        sx={{
                          maxWidth: 100,
                          wordBreak: "break-word",
                          whiteSpace: "normal",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: { xs: 14, md: 16 },
                            wordBreak: "break-word",
                          }}
                        >
                          {req.user_id}
                        </Typography>
                      </TableCell>

                      {/* Name */}
                      <TableCell
                        sx={{
                          maxWidth: 200,
                          wordBreak: "break-word",
                          whiteSpace: "normal",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: { xs: 14, md: 16 },
                            wordBreak: "break-word",
                          }}
                        >
                          {req.user?.name || "Unknown"}
                        </Typography>
                      </TableCell>

                      {/* Current Role */}
                      <TableCell
                        sx={{
                          maxWidth: 150,
                          wordBreak: "break-word",
                          whiteSpace: "normal",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: { xs: 14, md: 16 },
                            wordBreak: "break-word",
                          }}
                        >
                          {req.user?.role || "N/A"}
                        </Typography>
                      </TableCell>

                      {/* Requested Role */}
                      <TableCell
                        sx={{
                          maxWidth: 150,
                          wordBreak: "break-word",
                          whiteSpace: "normal",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: { xs: 14, md: 16 },
                            wordBreak: "break-word",
                          }}
                        >
                          {req.requested_role}
                        </Typography>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            color:
                              req.status === "pending"
                                ? "black"
                                : req.status === "approved"
                                ? "green"
                                : "red",
                          }}
                        >
                          {req.status === "pending"
                            ? "Pending"
                            : req.status === "approved"
                            ? "Approved"
                            : "Rejected"}
                        </Typography>
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        {req.status === "pending" && (
                          <Box display="flex" gap={2} flexWrap="wrap">
                            <Button
                              variant="text"
                              color="success"
                              size="small"
                              onClick={() => handleApprove(req)}
                            >
                              <DoneIcon />
                              Approve
                            </Button>
                            <Button
                              variant="text"
                              color="error"
                              size="small"
                              onClick={() => handleDecision(req.id, "reject")}
                            >
                              <CloseIcon />
                              Reject
                            </Button>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>

      {/* Dialog for category */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Assign Category for Editor</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={() =>
              handleDecision(selectedRequest.id, "approve", selectedCategory)
            }
            disabled={!selectedCategory}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
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

export default AdminRoleRequests;
