import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ConfirmDialog from "../../../components/ConfirmDeleteCard";
import authService from "../../../services/authService";
import ErrorCard from "../../../components/ErrorCard";
import SuccessCard from "../../../components/SucessCard";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmptyState from "../../../components/EmptyState";
import CustomPagination from "../../../components/Pagination";

function CategoryUpdate() {
  const [category, setCategory] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editFieldError, setEditFieldError] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [tagToDeleteId, setTagToDeleteId] = useState(null);
      const [currentPage, setCurrentPage] = useState(1);
      const [lastPage, setLastPage] = useState(1);
  
  const navigate = useNavigate();

  const fetchCategory = async (page=1) => {
    setSuccess("");
    setError("");
    setLoading(true);
    try {
      const res = await authService.fetchCategories(page);
      setCategory(res.data.data);
                  setCurrentPage(res.data.current_page || 1);
      setLastPage(res.data.last_page || 1);
      
    } catch (err) {
      console.error(err);
      setError("Can't fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const createCategory = async () => {
     console.log("createCategory called");
    setSuccess("");
    setError("");
    setFieldError("");
    setLoading(true);

    try {
      await authService.setCategories({ name: newCategoryName });
      setSuccess("Category added successfully");
      await fetchCategory();
      setModalOpen(false);
      setNewCategoryName("");

    } catch (err) {
      console.log("sss",err)
      if (err?.errors?.name) {
        setFieldError(err?.errors.name[0]);
      } else if (err?.error) {
        setError(err?.error);
      } else {
        setError("Can't set categories");
      }
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (cat) => {
    setEditCategoryName(cat.name);
    setEditCategoryId(cat.id);
    setEditFieldError("");
    setEditModalOpen(true);
  };

  const openDeleteConfirm = (id) => {
    setTagToDeleteId(id);
    setDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setTagToDeleteId(null);
    setDeleteConfirmOpen(false);
  };

  const handleEditCategory = async () => {
    setSuccess("");
    setError("");
    setEditFieldError("");
    setLoading(true);

    try {
      await authService.editCategory(editCategoryId, { name: editCategoryName });
      setSuccess("Category updated successfully");
      await fetchCategory();
      setEditModalOpen(false);
    } catch (err) {
            console.log("sss",err.errors)
      if (err?.errors?.name) {
        setEditFieldError(err.errors.name[0]);
      } else if (err?.error) {
        setError(err.error);
      } else {
        setError("Can't edit category");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await authService.deleteCategory(tagToDeleteId);
      setSuccess("Category deleted successfully");
      await fetchCategory();
    } catch {
      setError("Can't delete category");
    } finally {
      setLoading(false);
      closeDeleteConfirm();
    }
  };

  return (
    <Container maxWidth="lg">
      <Box>
        <Box
          sx={{
            px: 2,
            bgcolor: "#2c2638",
            borderRadius: 2,
            py: 2,
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontWeight: "bold", color: "white", textAlign: "center", fontSize: { xs: 15, md: 20 }, ml: { xs: 0, sm: 25, lg: 60, md: 40 } }}
          >
            All Categories
          </Typography>
          <Button variant="text" onClick={() => setModalOpen(true)} sx={{ color: "#fff", gap: 1, fontSize: { xs: 10, md: 15 } }}>
            <AddBoxIcon /> Category
          </Button>
        </Box>

        {error && <ErrorCard message={error} />}
        {success && <SuccessCard message={success} />}

        {loading ? (
          <Box display="flex" justifyContent="center"><CircularProgress /></Box>
        ) : category.length === 0 ? (
          <>
            <ErrorCard message={"No categories found"} />
            <EmptyState message="No categories posts, add a new one" />
          </>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Box sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    {[
                      "ID",
                      "Category name",
                      "Actions",
                    ].map((header) => (
                      <TableCell
                        key={header}
                        sx={{ fontWeight: "bold", textAlign: "center" }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {category.map((cat) => (
                    <TableRow key={cat.id}>
                      {/* Title */}
                      <TableCell
                        sx={{
                          maxWidth: 200,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <Tooltip>
                          <span>{cat.id}</span>
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
                        <Tooltip title={cat?.name || ""}>
                          <span>{cat?.name}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                          <Button size="small" variant="contained" onClick={() => openEditModal(cat)}><EditIcon />Edit</Button>
                          <Button size="small" variant="contained" color="error" onClick={() => openDeleteConfirm(cat.id)}><DeleteIcon />Delete</Button>
                          <Button size="small" variant="contained" onClick={() => navigate(`/dashboard/admin/categories/${cat.id}/tags`, { state: { categoryName: cat.name } })}>
                            <VisibilityIcon />
                            Tags
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </TableContainer>
        )}
      </Box>

      {/* Add Category Dialog */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Category Name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            margin="normal"
            error={Boolean(fieldError)}
            helperText={fieldError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={createCategory}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Category Name"
            value={editCategoryName}
            onChange={(e) => setEditCategoryName(e.target.value)}
            margin="normal"
            error={Boolean(editFieldError)}
            helperText={editFieldError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditCategory}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this category?"
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteConfirm}
      />
                          <CustomPagination
        currentPage={currentPage}
        lastPage={lastPage}
        onPageChange={fetchCategory}
      />
    </Container>
    
  );
}

export default CategoryUpdate;
