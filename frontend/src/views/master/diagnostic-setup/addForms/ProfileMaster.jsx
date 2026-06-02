import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  AccordionDetails,
  Accordion,
  AccordionSummary
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ProfileMasterAddForm from './profileMasterForms/ProfileMasterAddForm';
import ProfileMasterEditForm from './profileMasterForms/ProfileMasterEditForm';
import Loader from 'component/Loader/Loader';
import { ToastContainer, toast } from 'react-toastify';

import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

import { useDeletePathologyProfileTestsMutation, useGetPathologyProfileTestsQuery } from 'services/endpoints/pathology/pathologyTest';

export default function ProfileMaster() {
  const { data: profileData = [], isLoading: loader, refetch } = useGetPathologyProfileTestsQuery();
  const [deletePathologyProfile, { isSuccess, isError }] = useDeletePathologyProfileTestsMutation();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const openAddModal = () => setAddModalOpen(true);
  const closeAddModal = () => setAddModalOpen(false);

  const openEditModal = (profile) => {
    setSelectedProfile(profile);
    setEditModalOpen(true);
  };
  const closeEditModal = () => {
    setSelectedProfile(null);
    setEditModalOpen(false);
  };

  const openDeleteModal = (profile) => {
    setSelectedProfile(profile);
    setDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setSelectedProfile(null);
    setDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    try {
      await deletePathologyProfile(selectedProfile?._id);
    } catch (error) {
      toast.error(error.response?.data?.msg || 'An error occurred during deletion.');
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success('Profile deleted Successfully');
      closeDeleteModal();
      refetch();
    }

    if (isError) {
      toast.error('Failed to delete');
    }
  }, [isSuccess, isError, refetch]);

  const filteredProfiles = profileData.filter((profile) => profile.profileName.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Paper>
      <Grid container justifyContent="space-between" alignItems="center" padding={2}>
        <Grid item>
          <Button variant="contained" color="primary" onClick={openAddModal}>
            Add Profile
          </Button>
        </Grid>
        <Grid item>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Profiles"
          />
        </Grid>
      </Grid>

      {loader && <Loader />}

      <TableContainer>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Profile Name</TableCell>
              <TableCell align="center">Number of Tests</TableCell>
              <TableCell align="center">Created At</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProfiles.map((profile) => (
              <Row key={profile._id} row={profile} onEdit={() => openEditModal(profile)} onDelete={() => openDeleteModal(profile)} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Profile Dialog */}
      <Dialog open={isAddModalOpen} onClose={closeAddModal} fullWidth maxWidth="md">
        <DialogContent>
          <ProfileMasterAddForm handleClose={closeAddModal} fetchProfileData={refetch} />
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditModalOpen} onClose={closeEditModal} fullWidth maxWidth="md">
        <DialogContent>
          <ProfileMasterEditForm handleClose={closeEditModal} profileData={selectedProfile} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onClose={closeDeleteModal}>
        <DialogContent>
          <Typography>Are you sure you want to delete the profile "{selectedProfile?.profileName}"?</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-start' }}>
          <Button onClick={handleDelete} color="primary">
            Delete
          </Button>
          <Button onClick={closeDeleteModal} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Paper>
  );
}

function Row({ row, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (sectionId) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  console.log("ROWWWW DATA",row)

  return (
    <>
      <TableRow
        sx={{
          borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.05)' } // Add hover effect for table row
        }}
      >
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
          {row.profileName}
        </TableCell>
        <TableCell align="center">{row.mainTests?.length || 0}</TableCell>
        <TableCell align="center">{new Date(row?.createdAt).toLocaleDateString('en-IN', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Kolkata',
})}</TableCell>
        <TableCell align="center">
          <IconButton onClick={onEdit} color="primary" sx={{ marginRight: 1 }}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={onDelete} color="error">
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* Profile Details Expansion */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="main-tests">
                <TableHead>
                  <TableRow>
                    <TableCell>Test Name</TableCell>
                    <TableCell>Test Code</TableCell>
                    <TableCell>Machine Name</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell>Formula</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(row.mainTests || []).map((test) => (
                    <TableRow key={test._id}>
                      <TableCell>{test.testId?.testName}</TableCell>
                      <TableCell>{test.testId?.testCode}</TableCell>
                      <TableCell>{test.testId?.machineName}</TableCell>
                      <TableCell>{test.testId?.unit}</TableCell>
                      <TableCell>{test.testId?.formula}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>

            {/* Sections */}
            {row.sections && row.sections.length > 0 && (
              <Box sx={{ marginTop: 2 }}>
                {row.sections.map((section) => (
                  <Accordion key={section._id} sx={{ marginBottom: 1 }}>
                    <AccordionSummary
                      expandIcon={openSections[section._id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      sx={{
                        backgroundColor: '#f5f5f5',
                        borderRadius: 1,
                        '&:hover': { backgroundColor: '#e0e0e0' } // Hover effect on section
                      }}
                      onClick={() => toggleSection(section._id)}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {section.subheading}
                      </Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                      <Table size="small" aria-label="section-tests">
                        <TableHead>
                          <TableRow>
                            <TableCell>Test Name</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {section.tests?.map((test) => (
                            <TableRow key={test._id}>
                              <TableCell>{test.testId?.testName}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
