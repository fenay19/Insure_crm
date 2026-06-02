import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Modal,
  TextField,
  Divider,
  CircularProgress
} from '@mui/material';
import DeleteBtn from 'component/buttons/DeleteBtn'
import EditBtn from 'component/buttons/EditBtn'
import { Cancel, Save } from '@mui/icons-material'
import {
  useGetRadiologySectionQuery,
  useAddRadiologySectionMutation,
  useUpdateRadiologySectionMutation,
  useDeleteRadiologySectionMutation
} from 'services/endpoints/templates/templateSection';
import { ToastContainer,toast } from 'react-toastify';

const TemplateSection = () => {
  const { data: fetchedSections = [], isLoading, isError } = useGetRadiologySectionQuery();
  const [sections, setSections] = useState(fetchedSections);
  const [addSection] = useAddRadiologySectionMutation();
  const [updateSection] = useUpdateRadiologySectionMutation();
  const [deleteSection] = useDeleteRadiologySectionMutation();
  const [open, setOpen] = useState(false);
  const [sectionName, setSectionName] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setSectionName('');
    setEditMode(false);
    setEditingId(null);
    setOpen(false);
  };

  const handleAddSection = async () => {
    if (sectionName.trim()) {
      try {
        const result = await addSection({ section: sectionName }).unwrap();
        console.log("Added Section:", result);
        setSections([...sections, { _id: result._id, section: sectionName }]);
        handleClose();
        toast.success("Saved Successfully");
      } catch (error) {
        console.error('Failed to add section:', error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSection(id).unwrap();
      setSections(sections.filter((sec) => sec._id !== id)); 
      toast.success("Deleted Successfully");
    } catch (error) {
      console.error('Failed to delete section:', error);
    }
  };
  const handleEdit = (id, currentName) => {
    console.log('Editing section with ID:', id);
    setEditMode(true);
    setSectionName(currentName);
    setEditingId(id);
    setOpen(true);
  };
  const handleSaveEdit = async () => {
    if (sectionName.trim()) {
      if (!editingId) {
        console.log('EditingId at save:', editingId);
        toast.error('Section ID is missing');
        return;
      }
  
      try {
        await updateSection({ id: editingId, updatedData: { section: sectionName } }).unwrap();   
        const updatedSections = sections.map((sec) =>
          sec._id === editingId ? { ...sec, section: sectionName } : sec
        );
        setSections(updatedSections);
        handleClose();
        toast.success("Section updated successfully!");
      } catch (error) {
        console.error('Failed to update section:', error);
        toast.error("Failed to update section!");
      }
    }
  };
  useEffect(() => {
    if (!isLoading && !isError) {
      setSections(fetchedSections);
    }
  }, [fetchedSections, isLoading, isError]);

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <ToastContainer/>
      <Paper elevation={3} sx={{ p: 3, width: '100%', maxWidth: 'full', mx: 'auto', backgroundColor: '#ffffff' }}>
        <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2 }}>
          Add Section
        </Button>
        <Divider sx={{ mb: 2 }} />
        {isLoading ? (
          <Box display="flex" justifyContent="center" my={3}><CircularProgress /></Box>
        ) : isError ? (
          <Typography color="error">Failed to load sections.</Typography>
        ) : (
          <TableContainer component={Paper} elevation={1}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F0F2F8' }}>
                  <TableCell>SN</TableCell>
                  <TableCell>Section</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sections.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No sections added.
                    </TableCell>
                  </TableRow>
                ) : (
                  sections.map((section, index) => (
                    <TableRow key={section._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{section.section}</TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => handleEdit(section._id, section.section)}>
                            <EditBtn sx={{ color: 'green' }} />
                        </IconButton>
                        <IconButton onClick={() =>handleDelete(section._id)}>
                            <DeleteBtn sx={{ color: 'red' }} />
                        </IconButton> 
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Modal for adding/updating section */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          width: 400,
          borderRadius: 2
        }}>
          <Typography variant="h6" gutterBottom>
            {editMode ? 'Edit Section' : 'Add Section'}
          </Typography>
          <TextField
            fullWidth
            label="Section Name"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            margin="normal"
          />
          <Box mt={2} display="flex" justifyContent="flex-end">
            <IconButton title='Cancel' onClick={handleClose} className='btnCancel'>
              <Cancel />
            </IconButton>
            <IconButton type="submit" title='save' className='btnSave' sx={{marginLeft:2}}  onClick={editMode?handleSaveEdit:handleAddSection} color="success">
                <Save sx={{width:18,height:18}} />
            </IconButton>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default TemplateSection;
