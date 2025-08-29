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
  TableRow
} from "@mui/material";

function AdminRoleRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // fetch all requests (not only pending)
  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/pending-requests"); // 👈 use endpoint that returns ALL
      setRequests(res.data);
    } catch (err) {
      setError("Failed to load requests.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // handle approve/reject
  const handleDecision = async (id, action) => {
    try {
      await axios.post(`/role-decision/${id}`, { action });

      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: action === "approve" ? "approved" : "rejected" } : req
        )
      );

      setSuccess(`Request ${action}d successfully.`);
    } catch (err) {
      setError("Failed to update request.");
    }
  };

  // sort so pending requests are always shown first
  const sortedRequests = [...requests].sort((a, b) => {
    if (a.status === "pending" && b.status !== "pending") return -1;
    if (a.status !== "pending" && b.status === "pending") return 1;
    return a.id - b.id; // fallback to ID order
  });

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Role Requests
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {loading ? (
          <Box display="flex" justifyContent="center" my={3}>
            <CircularProgress />
          </Box>
        ) : requests.length === 0 ? (
          <Alert severity="info">No requests found.</Alert>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
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
                {sortedRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>{req.user_id}</TableCell>
                    <TableCell>{req.user?.name}</TableCell>
                    <TableCell>{req.user?.role}</TableCell>
                    <TableCell>{req.requested_role}</TableCell>
                    <TableCell>
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
                    <TableCell>
                      {req.status === "pending" && (
                        <Box display="flex" gap={1}>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleDecision(req.id, "approve")}
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
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
}

export default AdminRoleRequests;

