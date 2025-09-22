import React, { useEffect, useState } from "react";
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
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import ConfirmDialog from "../../../components/ConfirmDeleteCard";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import authService from "../../../services/authService";
import ErrorCard from "../../../components/ErrorCard";
import SuccessCard from "../../../components/SucessCard";
import EmptyState from "../../../components/EmptyState";

function TagList() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTagName, setEditTagName] = useState("");
  const [editTagId, setEditTagId] = useState(null);
  const [editFieldError, setEditFieldError] = useState("");
  const [addTagModalOpen, setAddTagModalOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [tagFieldError, setTagFieldError] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [tagToDeleteId, setTagToDeleteId] = useState(null);

  const categoryName = location.state?.categoryName || "Tags";

  const fetchTags = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await authService.fetchTags(id);
      setTags(res.data);
    } catch {
      setError("Cannot fetch tags");
    } finally {
      setLoading(false);
    }
  };

  const openAddTagModal = () => {
    setNewTagName("");
    setTagFieldError("");
    setAddTagModalOpen(true);
  };

  const closeAddTagModal = () => {
    setNewTagName("");
    setTagFieldError("");
    setAddTagModalOpen(false);
  };

  const openDeleteConfirm = (tagId) => {
    setTagToDeleteId(tagId);
    setDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setTagToDeleteId(null);
    setDeleteConfirmOpen(false);
  };

  const handleAddTag = async () => {
    setTagFieldError("");
    setError("");
    setLoading(true);
    try {
      await authService.addTag(id, { name: newTagName });
      const updatedTags = await authService.fetchTags(id);
      setTags(updatedTags.data);
      setSuccess("Tag added successfully");
      closeAddTagModal();
    } catch (err) {
      if (err.response?.data?.errors?.name) {
        setTagFieldError(err.response.data.errors.name[0]);
      } else if (err.response?.data?.error) {
        setTagFieldError(err.response.data.error);
      } else {
        setTagFieldError("Cannot add tag");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [id]);

  const openEditModal = (tag) => {
    setEditTagName(tag.name);
    setEditTagId(tag.id);
    setEditFieldError("");
    setEditModalOpen(true);
  };

  const handleEditTag = async () => {
    setEditFieldError("");
    setError("");
    try {
      await authService.editTag(editTagId, { name: editTagName });
      setSuccess("Tag updated successfully");
      setEditModalOpen(false);
      fetchTags();
    } catch (err) {
      if (err.response?.data?.errors?.name) {
        setEditFieldError(err.response.data.errors.name[0]);
      } else if (err.response?.data?.error) {
        setEditFieldError(err.response.data.error);
      } else {
        setError("Cannot edit tag");
      }
    }
  };

  const handleConfirmDelete = async () => {
    setError("");
    setSuccess("");
    try {
      await authService.deleteTag(tagToDeleteId);
      setSuccess("Tag deleted successfully");
      fetchTags();
    } catch {
      setError("Cannot delete tag");
    } finally {
      closeDeleteConfirm();
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" , bgcolor:"#2c2638", height:60, p:2}}>
        <Button onClick={() => navigate("/dashboard/admin/category")} sx={{
          fontSize:{xs:10,md:20}, color:"white"
        }}><ArrowBackIcon/></Button>
        <Typography sx={{ fontWeight: "bold" , fontSize:{xs:20,md:25}, color:"white"}}>
          Tags under: {categoryName}
        </Typography>
        <Button onClick={openAddTagModal} sx={{
          color:"white"
        }}><AddIcon/>Tag</Button>
        
      </Box>

      {error && <ErrorCard message={error} />}
      {success && <SuccessCard message={success} />}

      {loading ? (
        <Box display="flex" justifyContent="center"><CircularProgress /></Box>
            ) : tags.length === 0 ? (
<>
<ErrorCard message={"No tags found"}/>
<EmptyState message="No tags found, add one" />
</>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {["ID", "Name", "Actions"].map((header) => (
                  <TableCell key={header} sx={{ fontWeight: "bold", textAlign: "center" }}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell align="center">{tag.id}</TableCell>
                  <TableCell align="center">{tag.name}</TableCell>
<TableCell align="center">
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      gap: 3,
    }}
  >
    <Button
      size="small"
      onClick={() => openEditModal(tag)}
      variant="contained"
    >
      <EditIcon sx={{ mr: 0.5 }} /> Edit
    </Button>
    <Button
      size="small"
      color="error"
      onClick={() => openDeleteConfirm(tag.id)}
      variant="contained"
    >
      <DeleteIcon/>
      Delete
    </Button>
  </Box>
</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Tag Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Tag</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Tag Name"
            value={editTagName}
            onChange={(e) => setEditTagName(e.target.value)}
            margin="normal"
            error={Boolean(editFieldError)}
            helperText={editFieldError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditTag}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Add Tag Modal */}
      <Dialog open={addTagModalOpen} onClose={closeAddTagModal} fullWidth maxWidth="sm">
        <DialogTitle>Add New Tag</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Tag Name"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            margin="normal"
            error={Boolean(tagFieldError)}
            helperText={tagFieldError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAddTagModal}>Cancel</Button>
          <Button variant="contained" onClick={handleAddTag}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this tag?"
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteConfirm}
      />
    </Container>
  );
}

export default TagList;
