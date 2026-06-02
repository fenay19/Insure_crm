import React, { useState, useEffect, useCallback, forwardRef } from 'react';
import {
  Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Tooltip, Divider, Typography, Autocomplete
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import { toast, ToastContainer } from 'react-toastify';
import { Cancel, Save } from '@mui/icons-material'
import ReactQuillOriginal, { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';
import 'react-quill/dist/quill.snow.css';
import {
  useGetRadiologySectionQuery,
  useAddRadiologySectionMutation
} from 'services/endpoints/templates/templateSection';

import DeleteBtn from 'component/buttons/DeleteBtn';
import EditBtn from 'component/buttons/EditBtn';
import {
  useAddRaiologyTemplateMutation,
  useDeleteRadiologyTemplateMutation,
  useGetRadiologyTemplateQuery,
  useUpdateRadiologyTemplateMutation
} from 'services/endpoints/templates/templateRadiology';

Quill.register('modules/imageResize', ImageResize);

const CustomReactQuill = forwardRef(({ value, onChange, modules, formats }, ref) => (
  <div ref={ref}>
    <ReactQuillOriginal theme="snow" value={value} onChange={onChange} modules={modules} formats={formats} />
  </div>
));

const TemplateReport = () => {
  const { data } = useGetRadiologyTemplateQuery();
  const { data: sectionMaster = [], isLoading: sectionLoading } = useGetRadiologySectionQuery();
  const [addTemplate] = useAddRaiologyTemplateMutation();
  const [updateTemplate] = useUpdateRadiologyTemplateMutation();
  const [deleteTemplate] = useDeleteRadiologyTemplateMutation();
  const [addSectionToBackend] = useAddRadiologySectionMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [sections, setSections] = useState({});
  const [sectionContents, setSectionContents] = useState({});
  const [editFile, setEditFile] = useState(null);
  const [viewFile, setViewFile] = useState(null);
  const [customSectionModalOpen, setCustomSectionModalOpen] = useState(false);
  const [customSectionName, setCustomSectionName] = useState('');
  const [selectedSection, setSelectedSection] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');

  const handleQuillChange = useCallback((key, value) => {
    setSectionContents(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleAddCustomSection = async () => {
    const trimmedName = customSectionName.trim();
    if (trimmedName && !sections.hasOwnProperty(trimmedName)) {
      setSections(prev => ({ ...prev, [trimmedName]: true }));
      setSectionContents(prev => ({ ...prev, [trimmedName]: '' }));
      try {
        await addSectionToBackend({ section: trimmedName });
        toast.success('Section added');
      } catch (err) {
        console.error('Error adding section:', err);
        toast.error('Error adding section');
      }
      setCustomSectionName('');
      setCustomSectionModalOpen(false);
    } else {
      toast.error('Section name is empty or already exists');
    }
  };
  const handleEditOpen = (key) => {
    setSelectedSection(key);
    setNewSectionName(key);
    setOpenEditDialog(true);
  };
  const handleDeleteOpen = (key) => {
    setSelectedSection(key);
    setOpenDeleteDialog(true);
  };
  const handleRename = () => {
    const trimmed = newSectionName.trim();
    if (!trimmed) {
      toast.error("Section name cannot be empty");
      return;
    }
    if (sections[trimmed] && trimmed !== selectedSection) {
      toast.error("A section with this name already exists");
      return;
    }

    setSections(prev => {
      const updated = { ...prev };
      delete updated[selectedSection];
      updated[trimmed] = true;
      return updated;
    });

    setSectionContents(prev => {
      const updated = { ...prev };
      updated[trimmed] = updated[selectedSection];
      delete updated[selectedSection];
      return updated;
    });

    setOpenEditDialog(false);
  };
  const handleDeleteView = () => {
    setSections(prev => {
      const updated = { ...prev };
      delete updated[selectedSection];
      return updated;
    });

    setSectionContents(prev => {
      const updated = { ...prev };
      delete updated[selectedSection];
      return updated;
    });

    setOpenDeleteDialog(false);
  };
  const handleAddDropdownSection = () => {
    if (selectedSection && selectedSection.section && !sections.hasOwnProperty(selectedSection.section)) {
      const newSectionName = selectedSection.section;
      setSections(prev => ({ ...prev, [newSectionName]: true }));
      setSectionContents(prev => ({ ...prev, [newSectionName]: '' }));
      setSelectedSection(null);
    } else {
      toast.error('Section already added or invalid');
    }
  };
  const getModules = () => ({
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
    imageResize: {
      parchment: Quill.import('parchment')
    }
  });
  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'link', 'image'
  ];
  const filteredData = data?.filter(row =>
    typeof row.fileName === 'string' &&
    row.fileName.toLowerCase().includes(searchTerm?.toLowerCase())
  );
  const resetForm = () => {
    setFileName('');
    setSections({});
    setSectionContents({});
    setCustomSectionName('');
    setSelectedSection(null);
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
    if(nameExists) {
      toast.error('A file with this name already exists');
      return;
    }
    const newFile = {
      fileName,
      sectionContents
    };
    try {
      if (editFile) {
        await updateTemplate({
          id: editFile._id,
          updatedData: newFile
        });
        toast.success('Updated Successfully');
      } else {
        await addTemplate(newFile);
        toast.success('Saved Successfully');
      }
      resetForm();
      setOpen(false);
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };
  const handleEdit = (file) => {
    setFileName(file.fileName);
    const updatedSections = {};
    for (const key of Object.keys(file.sectionContents || {})) {
      updatedSections[key] = true;
    }
    setSections(updatedSections);
    setSectionContents(file.sectionContents || {});
    setEditFile(file);
    setOpen(true);
  };
  const handleView = (file) => {
    setViewFile(file);
    setViewOpen(true);
  };
  const handleDelete = async (file) => {
    try {
      await deleteTemplate(file._id);
      toast.success('Deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Error deleting file');
    }
  };
  return (
    <Box sx={{ p: 2 }}>
      <ToastContainer />
      <Box bgcolor="white" p={3} mt={2} borderRadius={2} boxShadow={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Button variant="contained" onClick={() => setOpen(true)}>Add New Report +</Button>
          <TextField label="Search..." variant="outlined" size="small" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </Box>
        <Divider sx={{ mb: 2 }} />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F0F2F8' }}>
                <TableCell>Report Name</TableCell>
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
                        <IconButton onClick={() => handleView(row)}>
                          <VisibilityIcon sx={{ height: 30, width: 30, color: "blue" }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleEdit(row)}>
                          <EditBtn sx={{color: 'green'}} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(row)}>
                          <DeleteBtn sx={{ color:'red'}} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">No files found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Create/Edit Modal */}
        <Dialog open={open} onClose={() => { setOpen(false); resetForm(); }} fullWidth maxWidth="md" scroll="paper">
          <DialogTitle>{editFile ? 'Edit File' : 'Create New Report'}</DialogTitle>
          <DialogContent dividers sx={{ maxHeight: '70vh' }}>
            <TextField fullWidth label="Report Name" value={fileName} onChange={(e) => setFileName(e.target.value)} margin="normal" />
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', my: 2 }}>
              <Button variant="outlined" onClick={() => setCustomSectionModalOpen(true)} startIcon={<AddIcon />}>
                Add Section
              </Button>
              <Autocomplete
                options={sectionMaster.filter(item => !sections.hasOwnProperty(item.section))}
                getOptionLabel={(option) => option?.section || ''}
                value={selectedSection}
                onChange={(e, newValue) => setSelectedSection(newValue)}
                renderInput={(params) => <TextField {...params} label="Select Section" size="small" sx={{ width: 250 }} />}
              />
              <Button onClick={handleAddDropdownSection} variant="contained">Add</Button>
            </Box>
              <Box sx={{display:'flex',gap:30,marginBottom:4,p:2}}>
                <Box>
                  <Typography><strong>Patient Name:</strong></Typography>
                  <Typography><strong>Referred By:</strong></Typography>
                  <Typography><strong>Age:</strong></Typography>
                </Box>
                <Box>
                  <Typography><strong>Date:</strong></Typography>
                  <Typography><strong>Radiology ID:</strong></Typography>
                  <Typography><strong>UHID:</strong></Typography>
                </Box>
                <Box>
                  <Typography><strong>OPD:</strong></Typography>
                  <Typography><strong>Reporting Time:</strong></Typography>
                  <Typography><strong>Request Time:</strong></Typography>
                </Box>
              </Box>
              {Object.entries(sections).map(([key, enabled]) => (
               enabled && (
            <Box key={key} mb={3} sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2 }}>         
              <Box sx={{display:'flex',justifyContent:'space-between'}}>
                <Typography variant="h6">{key}</Typography>
                  <Box sx={{display:'flex',alignItems:'center'}}>
                   <IconButton onClick={() => handleEditOpen(key)}>
                      <EditBtn sx={{ color: 'green'}}/>
                   </IconButton>
                   <IconButton onClick={() =>handleDeleteOpen(key)}>
                      <DeleteBtn sx={{ color: 'red'}} />
                  </IconButton>
                 </Box>
              </Box>
            <CustomReactQuill
              value={sectionContents[key] || ''}
              onChange={(value) => handleQuillChange(key, value)}
              modules={getModules()}
              formats={formats}
            />
          </Box>
        )
        ))}
        </DialogContent>
          <DialogActions>
            {/* <Button onClick={} color="primary">Cancel</Button> */}
            <IconButton title='Cancel' onClick={() => { setOpen(false); resetForm(); }} className='btnCancel'>
              <Cancel sx={{height:15,width:15}}/>
          </IconButton>
          <IconButton type="submit" title='save' className='btnSave' sx={{marginLeft:2}}  onClick={handleSave} color="success">
              <Save sx={{width:18,height:14}} />
          </IconButton>
            {/* <Button onClick={handleSave} color="primary" variant="contained">
              {editFile ? 'Save Changes' : 'Save'}
            </Button> */}
          </DialogActions>
        </Dialog>       
      {/* Rename Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Rename Section</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="New Section Name"
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <IconButton title='Cancel' onClick={() => setOpenEditDialog(false)} className='btnCancel'>
              <Cancel sx={{height:15,width:15}}/>
          </IconButton>
          <IconButton type="submit" title='save' className='btnSave' sx={{marginLeft:2}}  onClick={handleRename} color="success">
              <Save sx={{width:18,height:14}} />
          </IconButton>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Section</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete section "{selectedSection}"?</Typography>
        </DialogContent>
        <DialogActions>
          <IconButton title='Cancel' onClick={() => setOpenDeleteDialog(false)} className='btnCancel'>
              <Cancel sx={{height:15,width:15}}/>
          </IconButton>
          <IconButton onClick={handleDeleteView}>
              <DeleteBtn sx={{height:15}}/>
          </IconButton>
        </DialogActions>
       </Dialog>
        <Dialog open={viewOpen} onClose={() => setViewOpen(false)} fullWidth maxWidth="md">
          <DialogTitle>View Report</DialogTitle>
          <DialogContent dividers>
            {viewFile && (
              <Box>
                <Typography variant="h4" textAlign="center" mb={2}>{viewFile.fileName}</Typography>
                <Box sx={{display:'flex',gap:30,marginBottom:4,marginTop:4}}>
                <Box>
                  <Typography><strong>Patient Name:</strong></Typography>
                  <Typography><strong>Referred By:</strong></Typography>
                  <Typography><strong>Age:</strong></Typography>
                </Box>
                <Box>
                  <Typography><strong>Date:</strong></Typography>
                  <Typography><strong>Radiology ID:</strong></Typography>
                  <Typography><strong>UHID:</strong></Typography>
                </Box>
                <Box>
                  <Typography><strong>OPD:</strong></Typography>
                  <Typography><strong>Reporting Time:</strong></Typography>
                  <Typography><strong>Request Time:</strong></Typography>
                </Box>
              </Box>
                {Object.entries(viewFile.sectionContents || {}).map(([key, value]) => (
                  <Box key={key} mb={2}>
                    <Typography variant="h6">{key.charAt(0).toUpperCase() + key.slice(1)}</Typography>
                    <div dangerouslySetInnerHTML={{ __html: value }} />
                  </Box>
                ))}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewOpen(false)} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
        {/* Custom Section Modal */}
        <Dialog open={customSectionModalOpen} onClose={() => setCustomSectionModalOpen(false)}>
          <DialogTitle>Add Section</DialogTitle>
          <DialogContent>
            <TextField autoFocus margin="dense" label="Section Name" fullWidth value={customSectionName} onChange={(e) => setCustomSectionName(e.target.value)} />
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>setCustomSectionModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCustomSection} variant="contained">Add</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};
export default TemplateReport;
