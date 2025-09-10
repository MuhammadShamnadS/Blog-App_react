import { useEffect, useState } from "react";
import axios from "../../../api/axios";
import {
  Container,
  Paper,
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
  Tooltip,
} from "@mui/material";

function AdminRoleRequests() {
  const [requests, setRequests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const handleApprove = (req) => {
    if (req.requested_role === "editor") {
      setSelectedRequest(req);
      setOpenDialog(true);
    } else {
      handleDecision(req.id, "approve");
    }
  };

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

      setSuccess(`Request ${action}d successfully.`);
    } catch (err) {
      setError("Failed to update request.");
    }
    setOpenDialog(false);
    setSelectedRequest(null);
    setSelectedCategory("");
  };

  const sortedRequests = [...requests].sort((a, b) => {
    if (a.status === "pending" && b.status !== "pending") return -1;
    if (a.status !== "pending" && b.status === "pending") return 1;
    return a.id - b.id;
  });

  return (
        <Container maxWidth="lg">
          <Box>
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
                sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}
              >
                Role Requests
              </Typography>
            </Box>
   

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : requests.length === 0 ? (
          <Alert severity="info">No requests found.</Alert>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Box sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    {["User ID", "Name", "Current Role", "Requested Role", "Status", "Actions"].map((header) => (
                      <TableCell key={header} sx={{ whiteSpace: "nowrap", fontWeight: "bold" }}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedRequests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>{req.user_id}</TableCell>

                      <TableCell sx={{ maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        <Tooltip title={req.user?.name || ""}>
                          <span>{req.user?.name}</span>
                        </Tooltip>
                      </TableCell>

                      <TableCell sx={{ whiteSpace: "nowrap" }}>{req.user?.role}</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>{req.requested_role}</TableCell>

                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            color:
                              req.status === "pending"
                                ? "orange"
                                : req.status === "approved"
                                ? "green"
                                : "red",
                          }}
                        >
                          {req.status}
                        </Typography>
                      </TableCell>

                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {req.status === "pending" && (
                          <Box display="flex" gap={1}>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              onClick={() => handleApprove(req)}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => handleDecision(req.id, "reject")}
                            >
                              Reject
                            </Button>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </TableContainer>
        )}
    </Box>
      
       

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
    </Container>
  );
}

export default AdminRoleRequests;
