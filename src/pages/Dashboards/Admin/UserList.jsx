import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import authService from "../../../services/authService";
import EmptyState from "../../../components/EmptyState";
import ErrorCard from "../../../components/ErrorCard";
import SuccessCard from "../../../components/SucessCard";
import CustomPagination from "../../../components/Pagination";

function UserList({ role }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const res = await authService.getUsersByAdmin(role,page);
      setUsers(res.data.data); // safe fallback
      setCurrentPage(res.data.current_page || 1);
      setLastPage(res.data.last_page || 1);

    } catch (err) {
      console.error(err);
      setError("Failed to load pending users.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [role]);

  const toggleBlockUser = async (userId, currentStatus) => {
    setError("");
    setSuccess("");
    try {
      if (currentStatus === 0) {
        await authService.blockUser(userId);
        setSuccess("User blocked successfully");
      } else {
        await authService.unblockUser(userId);
        setSuccess("User activated successfully");
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, is_blocked: currentStatus === 0 ? 1 : 0 }
            : u
        )
      );
    } catch (err) {
      console.error(err);
      if (err.code === "NOT_FOUND") {
        setError("User not found or already deleted");
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      } else {
        setError("Failed to update user status");
      }
    }
  };

  return (
    <>
      {error && <ErrorCard message={error} />}
      {success && <SuccessCard message={success} />}

      {loading ? (
        <Box display="flex" justifyContent="center" my={3}>
          <CircularProgress />
        </Box>
      ) : users.length === 0 ? (
        <>
          <ErrorCard message={"No Users found"} />
          <EmptyState message="No Users" />
        </>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Box sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  {["ID", "Name", "Email", "Status", "Actions"].map(
                    (header) => (
                      <TableCell
                        key={header}
                        sx={{ whiteSpace: "nowrap", fontWeight: "bold" }}
                      >
                        {header}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 200,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <Tooltip title={user.name || ""}>
                        <span>{user.name}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 200,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <Tooltip title={user.email || ""}>
                        <span>{user.email}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          color: user.is_blocked === 1 ? "red" : "green",
                        }}
                      >
                        {user.is_blocked === 1 ? "Blocked" : "Active"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={
                          user.is_blocked === 1 ? "outlined" : "contained"
                        }
                        color={user.is_blocked === 1 ? "success" : "error"}
                        size="small"
                        onClick={() =>
                          toggleBlockUser(user.id, user.is_blocked)
                        }
                      >
                        {user.is_blocked === 1 ? "Activate" : "Block"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </TableContainer>
      )}

      <CustomPagination
        currentPage={currentPage}
        lastPage={lastPage}
        onPageChange={fetchUsers}
      />
    </>
  );
}

export default UserList;
