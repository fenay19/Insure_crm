import React, { useState, useEffect, useCallback, forwardRef } from 'react';
import {
  Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Tooltip, Divider, FormControlLabel, Checkbox, Typography
} from '@mui/material';

import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DeleteBtn from 'component/buttons/DeleteBtn';
import EditBtn from 'component/buttons/EditBtn';
import ReactQuillOriginal, { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';
import 'react-quill/dist/quill.snow.css';

import { useGetIpdFormQuery, useAddIpdFormMutation, useUpdateIpdFormMutation, useDeleteIpdFormMutation } from 'services/endpoints/ipdFormSetup/ipdFormSetup.endpoints';

import { toast,ToastContainer} from 'react-toastify';

// Register the image resize module
Quill.register('modules/imageResize', ImageResize);

const CustomReactQuill = forwardRef(({ value, onChange, modules, formats }, ref) => (
  <div ref={ref}>
    <ReactQuillOriginal theme="snow" value={value} onChange={onChange} modules={modules} formats={formats} />
  </div>
));

const IPDformSetup = () => {
  const { data } = useGetIpdFormQuery();
  const [addForm, { isSuccess, isError }] = useAddIpdFormMutation();
  const [updateForm] = useUpdateIpdFormMutation();
  const [deleteForm] = useDeleteIpdFormMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [sections, setSections] = useState({});
  const [sectionContents, setSectionContents] = useState({});
  const [sectionContentsHindi, setSectionContentsHindi] = useState({});
  const [editFile, setEditFile] = useState(null);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [viewFile, setViewFile] = useState(null);
  const [customSectionModalOpen, setCustomSectionModalOpen] = useState(false);
  const [customSectionName, setCustomSectionName] = useState('');
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sectionToEdit, setSectionToEdit] = useState('');
  const [newSectionName, setNewSectionName] = useState('');


  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSections((prev) => ({ ...prev, [name]: checked }));

    // If checked and content doesn't exist, initialize it
    if (checked) {
      setSectionContents((prev) => {
        const newContents = { ...prev };
        if (prev[name] === undefined) {
          if (name === 'patientdemographics') {
            newContents[name] = `
              <div style="display: flex; justify-content: space-between; font-size: 14px;">
                 <div style="flex: 1; padding-right: 10px;">
                    <p><strong>Patient Name:</strong></p>
                    <p><strong>Age:</strong></p>
                    <p><strong>Sex:</strong></p>
                  </div>
                <div style="flex: 1; padding-right: 10px;">
                  <p><strong>Patient ID:</strong></p>
                  <p><strong>UHID:</strong></p>
                  <p><strong>Op No.:</strong></p>
                </div>
                <div style="flex: 1;">
                  <p><strong>Referred By:</strong></p>
                  <p><strong>Registration Time:</strong></p>
                  <p><strong>Reporting Time:</strong></p>
                </div>
            </div>
            <br/>
            `;
          } else {
            newContents[name] = '';
          }
        }
        return newContents;
      });

      setSectionContentsHindi((prev) => {
        const newHindiContents = { ...prev };
        if (prev[name] === undefined) {
          if (name === 'patientdemographics') {
            newHindiContents[name] = `
              <div style="display: flex; justify-content: space-between; font-size: 14px;">
                 <div style="flex: 1; padding-right: 10px;">
                    <p><strong>रोगी का नाम:</strong></p>
                    <p><strong>आयु:</strong></p>
                    <p><strong>लिंग:</strong></p>
                  </div>
                <div style="flex: 1; padding-right: 10px;">
                  <p><strong>रोगी आईडी:</strong></p>
                  <p><strong>UHID:</strong></p>
                  <p><strong>ओपी संख्या:</strong></p>
                </div>
                <div style="flex: 1;">
                  <p><strong>संदर्भित द्वारा:</strong></p>
                  <p><strong>पंजीकरण समय:</strong></p>
                  <p><strong>रिपोर्टिंग समय:</strong></p>
                </div>
            </div>
            <br/>
            `;
          } else {
            newHindiContents[name] = '';
          }
        }
        return newHindiContents;
      });
    }
  };

  const handleQuillChange = useCallback((key, value) => {
    setSectionContents(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleHindiQuillChange = useCallback((key, value) => {
    setSectionContentsHindi(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleAddCustomSection = () => {
    const trimmedName = customSectionName.trim();
    if (trimmedName && !sections.hasOwnProperty(trimmedName)) {
      setSections(prev => ({ ...prev, [trimmedName]: true }));
      setSectionContents(prev => ({ ...prev, [trimmedName]: '' }));
      setSectionContentsHindi(prev => ({ ...prev, [trimmedName]: '' }));
      setCustomSectionName('');
      setCustomSectionModalOpen(false);
    } else {
      toast.error('Section name is empty or already exists');
    }
  };

  const getModules = () => ({
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean']
    ],
    imageResize: {
      parchment: Quill.import('parchment')
    }
  });

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'link'
  ];

  const filteredData = data?.filter(row =>
    typeof row.fileName === 'string' &&
    row.fileName.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const resetForm = () => {
    setFileName('');
    setSections({});
    setSectionContents({});
    setSectionContentsHindi({});
    setCustomSectionName('');
    setEditFile(null);
  };

  const handleSave = async () => {
    const trimmedName = fileName.trim();
    if (!trimmedName) {
      toast.error('File name cannot be empty');
      return;
    }

    const nameExists = data?.some(item =>
      item.fileName?.toLowerCase() === trimmedName?.toLowerCase() &&
      (!editFile || item._id !== editFile._id)
    );

    if (nameExists) {
      toast.error('A file with this name already exists');
      return;
    }

    // Create the sectionContents object with only enabled sections
    const filteredSectionContents = {};
    Object.keys(sections).forEach(key => {
      if (sections[key]) {
        filteredSectionContents[key] = sectionContents[key] || '';
      }
    });

    // For Hindi contents, since it's not in your schema, you need to handle it separately
    // You might want to consider updating your schema to include this if needed
    const hindiContentKey = "hindi";
    const hindiSections = {};

    Object.keys(sections).forEach(key => {
      if (sections[key] && sectionContentsHindi[key]) {
        hindiSections[key] = sectionContentsHindi[key];
      }
    });

    // Add Hindi content as a single entry in sectionContents if any exist
    if (Object.keys(hindiSections).length > 0) {
      filteredSectionContents[hindiContentKey] = JSON.stringify(hindiSections);
    }

    const newFile = {
      fileName: trimmedName,
      sectionContents: filteredSectionContents
    };

    try {
      if (editFile) {
        await updateForm({
          id: editFile._id,
          updatedData: newFile
        });
        toast.success('Updated Successfully');
      } else {
        await addForm(newFile);
      }
      resetForm();
      setOpen(false);
    } catch (error) {
      console.error('Error saving file:', error);
      toast.error('Error saving file');
    }
  };

  const handleEdit = (file) => {
    setFileName(file.fileName);
    // Extract sections from the file's sectionContents
    const sectionKeys = Object.keys(file.sectionContents || {}).filter(key => key !== 'hindi');
    // Initialize sections state based on available keys
    const updatedSections = {};
    sectionKeys.forEach(key => {
      updatedSections[key] = true;
    });

    setSections(updatedSections);
    // Set content for non-hindi sections
    const newSectionContents = {};
    sectionKeys.forEach(key => {
      newSectionContents[key] = file.sectionContents[key] || '';
    });
    setSectionContents(newSectionContents);

    // Handle Hindi content if present
    const hindiContentString = file.sectionContents?.hindi || '{}';
    try {
      const hindiContent = JSON.parse(hindiContentString);
      setSectionContentsHindi(hindiContent);

      // Add any sections that only exist in Hindi to the sections state
      Object.keys(hindiContent).forEach(key => {
        if (!updatedSections[key]) {
          updatedSections[key] = true;
          newSectionContents[key] = '';  // Initialize English content as empty
        }
      });

      setSections(updatedSections);
    } catch (error) {
      console.error('Error parsing Hindi content:', error);
      setSectionContentsHindi({});
    }

    setEditFile(file);
    setOpen(true);
  };

  const handleView = (file) => {
    // Prepare file for viewing with Hindi content parsed
    const viewFileData = { ...file };
    // Parse Hindi content for viewing
    if (file.sectionContents?.hindi) {
      try {
        const hindiContent = JSON.parse(file.sectionContents.hindi);
        viewFileData.sectionContentsHindi = hindiContent;
      } catch (error) {
        console.error('Error parsing Hindi content for view:', error);
        viewFileData.sectionContentsHindi = {};
      }
    } else {
      viewFileData.sectionContentsHindi = {};
    }

    setViewFile(viewFileData);
    setViewOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (fileToDelete) {
      try {
        await deleteForm(fileToDelete._id);
        toast.success('Deleted successfully');
      } catch (error) {
        console.error('Error deleting file:', error);
        toast.error('Error deleting file');
      } finally {
        setConfirmDialogOpen(false);
        setFileToDelete(null);
      }
    }
  };

  const handleDelete = (file) => {
    setFileToDelete(file);
    setConfirmDialogOpen(true);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success('Saved Successfully');
    }
  }, [isSuccess, isError]);

  return (
    <Paper>
    <Box sx={{ p: 2 }}>
      <ToastContainer/>
      {/* Header with Add and Search */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add New Form +
        </Button>
        <TextField
          label="Search..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      <Divider sx={{ mb: 2 }} />

      {/* Forms Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Form Name</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData?.length > 0 ? (
              filteredData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.fileName}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View">
                      <IconButton color="primary" onClick={() => handleView(row)}>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton color="secondary" onClick={() => handleEdit(row)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDelete(row)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">No forms found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Form Dialog */}
      <Dialog
        open={open}
        onClose={() => { setOpen(false); resetForm(); }}
        fullWidth
        maxWidth="md"
        scroll="paper"
      >
        <DialogTitle>{editFile ? 'Edit Form' : 'Create New Form'}</DialogTitle>
        <DialogContent dividers sx={{ maxHeight: '70vh' }}>
          <TextField
            fullWidth
            label="Form Name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            margin="normal"
          />
          {/* Section Checkboxes */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', my: 2 }}>
            {Object.keys(sections).map((key) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    name={key}
                    checked={sections[key]}
                    onChange={handleCheckboxChange}
                  />
                }
                label={key.charAt(0).toUpperCase() + key.slice(1)}
              />
            ))}
            <Box sx={{ ml: 1 }}>
              <Typography variant="button ">Add Section</Typography>
              <IconButton
                onClick={() => setCustomSectionModalOpen(true)}
                color="primary"
                sx={{ mb: 0.5 }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
          {/* Section Editors */}
          {Object.entries(sections).map(([key, enabled]) => {
            if (!enabled) return null;

            return (
              <Box key={key} sx={{ mb: 4,border:'1px solid #ccc',p:2}}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                <Typography variant="h6">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Typography>
              <Box >
             <IconButton onClick={() => {
              setSectionToEdit(key);
              setNewSectionName(key);
              setRenameDialogOpen(true);
              }}>
              <EditBtn sx={{color: 'green'}} />
             </IconButton>
             <IconButton onClick={() => {
             setSectionToEdit(key);
             setDeleteDialogOpen(true);
              }}>
              <DeleteBtn sx={{ color:'red'}} />
             </IconButton>
        </Box>
      </Box>
       {/* English Editor */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                    English
                  </Typography>
                  {key === 'patientdemographics' ? (
                    <div dangerouslySetInnerHTML={{ __html: sectionContents[key] || '' }} />
                  ) : (
                    <CustomReactQuill
                      value={sectionContents[key] || ''}
                      onChange={(value) => handleQuillChange(key, value)}
                      modules={getModules()}
                      formats={formats}
                    />
                  )}
                </Box>

                {/* Hindi Editor */}
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Hindi
                  </Typography>
                  {key === 'patientdemographics' ? (
                    <div dangerouslySetInnerHTML={{ __html: sectionContentsHindi[key] || '' }} />
                  ) : (
                    <CustomReactQuill
                      value={sectionContentsHindi[key] || ''}
                      onChange={(value) => handleHindiQuillChange(key, value)}
                      modules={getModules()}
                      formats={formats}
                    />
                  )}
                </Box>
              </Box>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false); resetForm(); }} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            {editFile ? 'Save Changes' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Form Dialog */}
      <Dialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>View Form</DialogTitle>
        <DialogContent dividers>
          {viewFile && (
            <Box>
              <Typography variant="h5" sx={{ textAlign: 'center', mb: 3 }}>
                {viewFile.fileName}
              </Typography>
              {Object.entries(viewFile.sectionContents || {}).map(([key, value]) => {
                // Skip hindi and empty sections
                if (key === 'hindi' || !value) return null;
                const hindiValue = viewFile.sectionContentsHindi?.[key];
                return (
                  <Box key={key} sx={{ mb: 8 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Typography>

                    {/* English content */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>

                      </Typography>
                      <div dangerouslySetInnerHTML={{ __html: value }} />
                    </Box>

                    {/* Hindi content - only show if exists */}
                    {hindiValue && (
                      <Box>
                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>

                        </Typography>
                        <div dangerouslySetInnerHTML={{ __html: hindiValue }} />
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Custom Section Dialog */}
      <Dialog
        open={customSectionModalOpen}
        onClose={() => setCustomSectionModalOpen(false)}
      >
        <DialogTitle>Add Section</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Section Name"
            fullWidth
            value={customSectionName}
            onChange={(e) => setCustomSectionName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomSectionModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddCustomSection} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)}>
     <DialogTitle>Rename Section</DialogTitle>
    <DialogContent>
    <TextField
      label="New Section Name"
      fullWidth
      value={newSectionName}
      onChange={(e) => setNewSectionName(e.target.value)}
      margin="dense"
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
    <Button
      onClick={() => {
        const trimmed = newSectionName.trim();
        if (trimmed && trimmed !== sectionToEdit && !sections[trimmed]) {
          setSections((prev) => {
            const updated = { ...prev };
            delete updated[sectionToEdit];
            updated[trimmed] = true;
            return updated;
          });
          setSectionContents((prev) => {
            const updated = { ...prev };
            updated[trimmed] = updated[sectionToEdit];
            delete updated[sectionToEdit];
            return updated;
          });
          setSectionContentsHindi((prev) => {
            const updated = { ...prev };
            updated[trimmed] = updated[sectionToEdit];
            delete updated[sectionToEdit];
            return updated;
          });
          setRenameDialogOpen(false);
        } else if (sections[trimmed]) {
          toast.error("Section name already exists");
        }
      }}
      variant="contained">
      Rename
    </Button>
   </DialogActions>
 </Dialog>
    <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete the section "{sectionToEdit}"?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
        <Button
          onClick={() => {
            setSections((prev) => {
              const updated = { ...prev };
              delete updated[sectionToEdit];
              return updated;
            });
            setSectionContents((prev) => {
              const updated = { ...prev };
              delete updated[sectionToEdit];
              return updated;
            });
            setSectionContentsHindi((prev) => {
              const updated = { ...prev };
              delete updated[sectionToEdit];
              return updated;
            });
            setDeleteDialogOpen(false);
          }}
          variant="contained"
          color="error"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>


      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{fileToDelete?.fileName}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  </Paper>
  );
};

export default IPDformSetup;