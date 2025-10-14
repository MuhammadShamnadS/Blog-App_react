import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import ErrorCard from "../../../components/ErrorCard";
import SuccessCard from "../../../components/SucessCard";
import authService from "../../../services/authService";
import EmptyState from "../../../components/EmptyState";
import CustomPagination from "../../../components/Pagination";

function RoleRequestHistory() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
  const navigate = useNavigate();

  const fetchRequests = async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const res = await authService.roleRequestsHistoryAdmin(page);
      setRequests(res.data.data || [] );
            setCurrentPage(res.data.current_page || 1);
      setLastPage(res.data.last_page || 1);
    } catch (err) {
      setError("Failed to load requests history.");
    }
    setLoading(false);
  };


  useEffect(() => {
    fetchRequests();
  }, []);


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
          <Button onClick={() => navigate(-1)}>
            Back
          </Button>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}
          >
            Role Requests History
          </Typography>
        </Box>

        {error && <ErrorCard message={error} />}
        {success && <SuccessCard message={success} />}

        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : requests.length === 0 ? (
          <EmptyState message="No role request historyfound." />
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Box sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    {[
                      "User ID",
                      "Name",
                      "Current Role",
                      "Requested Role",
                      "Status",
                    ].map((header) => (
                      <TableCell
                        key={header}
                        sx={{ whiteSpace: "nowrap", fontWeight: "bold" }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {req.user_id}
                      </TableCell>

                      <TableCell
                        sx={{
                          maxWidth: 200,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <Tooltip title={req.user?.name || ""}>
                          <span>{req.user?.name}</span>
                        </Tooltip>
                      </TableCell>

                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {req.user?.role}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {req.requested_role}
                      </TableCell>

                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                          }}
                        >
                          {req.status}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </TableContainer>
        )}
      </Box>
                    <CustomPagination
        currentPage={currentPage}
        lastPage={lastPage}
        onPageChange={fetchRequests}
      />
    </Container>
    
  );
}

export default RoleRequestHistory;
