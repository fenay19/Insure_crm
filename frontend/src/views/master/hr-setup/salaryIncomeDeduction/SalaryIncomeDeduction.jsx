import React, { useState, useEffect } from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Breadcrumb from 'component/Breadcrumb';
import Typography from '@mui/material/Typography';
import DeleteBtn from 'component/buttons/DeleteBtn';
import EditBtn from 'component/buttons/EditBtn';
import { Cancel, Save } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import {
  useAddEntryMutation,
  useGetEntryQuery,
  useUpdateEntryMutation,
  useDeleteEntryMutation,
} from 'services/endpoints/Entry/Entry';

import {
  useGetIncomeQuery,
} from 'services/endpoints/Income/income';


import {
  Box,
  Grid,
  Button,
  FormControl,
  InputLabel,
  TextField,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Table,
  Select,
  TableBody,
  MenuItem,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { toast } from 'react-toastify';
import value from 'assets/scss/_themes-vars.module.scss';

const SalaryIncomeDeduction = ({salaryIncomeHeadPermission,isAdmin}) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [employeeValue, setEmployeeValue] = useState('');
  const [employerValue, setEmployerValue] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [submittedData, setSubmittedData] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  const { data: incomeData = [], refetch: refetchIncome } = useGetIncomeQuery();
  

  const { data: fetchedData, refetch } = useGetEntryQuery();
  const [addEntry] = useAddEntryMutation();
  const [updateEntry] = useUpdateEntryMutation();
  const [deleteEntry] = useDeleteEntryMutation();

  // Refetch data every second from income
    useEffect(() => {
      const interval = setInterval(() => {
        refetchIncome();
      }, 1000);
      return () => clearInterval(interval);
    }, [refetchIncome]);

    

  useEffect(() => {
    if (Array.isArray(fetchedData?.data)) {
      setSubmittedData(fetchedData.data);
    } else if (Array.isArray(fetchedData)) {
      setSubmittedData(fetchedData);
    } else {
      setSubmittedData([]);
    }
  }, [fetchedData]);

  const handleAddClick = () => setOpenDialog(true);

  const handleCloseDialog = () => {
    setInputValue('');
    setSelectedItems([]);
    setEmployeeValue('');
    setEmployerValue('');
    setEditingId(null);
    setOpenDialog(false);
  };

  const handleInputChange = (event) => setInputValue(event.target.value);
  const handleEmployeeChange = (e) => setEmployeeValue(e.target.value);
  const handleEmployerChange = (e) => setEmployerValue(e.target.value);
  const handleSelectChange = (event) => {
    const { target: { value } } = event;
    setSelectedItems(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSubmit = async () => {
    if (!inputValue || !selectedItems.length || !employeeValue || !employerValue) {
      toast.error('Please fill in all fields before submitting.');
      return;
    }

    const requestData = {
      percentage: inputValue,
      selectedItems,
      employee: employeeValue,
      employer: employerValue,
    };

    try {
      if (editingId) {
        await updateEntry({ id: editingId, updatedData: requestData }).unwrap();
        toast.success("Updated Successfully");
      } else {
        const response = await addEntry(requestData).unwrap();
        setSubmittedData((prevData) => [response, ...prevData]);
        toast.success("Saved Successfully");
      }
      refetch();
      handleCloseDialog();
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Error: ${error.message || 'An error occurred.'}`);
    }
  };

  const handleView = (index) => {
    const data = submittedData[index];
    setViewData(data);
    setOpenViewDialog(true);
  };

  const handleEdit = (index) => {
    const data = submittedData[index];
    setInputValue(data.percentage);
    setSelectedItems(data.selectedItems);
    setEmployeeValue(data.employee);
    setEmployerValue(data.employer);
    setEditingId(data._id);
    setOpenDialog(true);
  };

  const confirmDelete = (index) => {
    setDeleteIndex(index);
    setDeleteConfirmDialogOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (deleteIndex !== null) {
      const idToDelete = submittedData[deleteIndex]?._id;
      try {
        await deleteEntry(idToDelete).unwrap();
        toast.success("Deleted Successfully");
        refetch();
      } catch (error) {
        console.error('Delete failed:', error);
        toast.error(`Delete failed: ${error.message || 'Unknown error'}`);
      }
      setDeleteConfirmDialogOpen(false);
      setDeleteIndex(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmDialogOpen(false);
    setDeleteIndex(null);
  };

  const handleSearchInputChange = (event) => setSearchInput(event.target.value);

  const filteredData = submittedData.filter((data) => {
    const combinedFields = `${data.percentage} ${data.selectedItems?.join(' ')} ${data.employee} ${data.employer}`;
    return combinedFields.toLowerCase().includes(searchInput.toLowerCase());
  });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box bgcolor="white" p={3} mt={2} borderRadius={2} boxShadow={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            {(salaryIncomeHeadPermission.Add===true || isAdmin) && <Button variant="contained" onClick={handleAddClick}>Add +</Button>}
            <TextField
              label="Search"
              variant="outlined"
              value={searchInput}
              onChange={handleSearchInputChange}
              size="small"
              sx={{ width: 250 }}
            />
          </Box>
          <Divider />
          {/* Add/Edit Dialog */}
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
            <DialogTitle>Enter Details</DialogTitle>
            <DialogContent>
              <Box display="flex" flexDirection="column" gap={2} backgroundColor="white" sx={{ padding: 2 }}>
                <Box display="flex" gap={2} sx={{ marginBottom: 2 }}>
                  <FormControl fullWidth>
                    <TextField
                      value={inputValue}
                      label="Enter Value"
                      onChange={handleInputChange}
                      variant="outlined"
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Selected</InputLabel>
                    <Select
                      multiple
                      value={selectedItems}
                      onChange={handleSelectChange}
                      input={<OutlinedInput label="Selected" />}
                      renderValue={(selected) => selected.join(' + ')}
                    >
                      {incomeData.map((option) => (
                        <MenuItem key={option._id} value={option.income}>
                          <Checkbox checked={selectedItems.indexOf(option.income) > -1} />
                          <ListItemText primary={option.income} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box display="flex" gap={2}>
                  <FormControl fullWidth>
                    <TextField
                      value={employeeValue}
                      onChange={handleEmployeeChange}
                      label="Employee Percentage"
                      variant="outlined"
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <TextField
                      value={employerValue}
                      onChange={handleEmployerChange}
                      label="Employer Percentage"
                      variant="outlined"
                    />
                  </FormControl>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <IconButton title="Cancel" onClick={handleCloseDialog} className="btnCancel">
                <Cancel />
              </IconButton>
              <IconButton title="Save" className="btnSave" sx={{ marginLeft: 2 }} onClick={handleSubmit} >
                <Save sx={{ width: 16, height: 18}} />
              </IconButton>
            </DialogActions>
          </Dialog>

          {/* View Dialog */}
          <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>View Details</DialogTitle>
            <DialogContent>
              {viewData && (
                <Box display="flex" flexDirection="column" gap={2} mt={2}>
                  <TextField label="Input Value" value={viewData.percentage} fullWidth InputProps={{ readOnly: true }} />
                  <TextField
                    label="Selected Items"
                    value={viewData.selectedItems?.join(' + ') || ''}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                  <TextField label="Employee Percentage" value={viewData.employee} fullWidth InputProps={{ readOnly: true }} />
                  <TextField label="Employer Percentage" value={viewData.employer} fullWidth InputProps={{ readOnly: true }} />
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
            </DialogActions>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteConfirmDialogOpen} onClose={handleCancelDelete}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>Are you sure you want to delete this entry? This action cannot be undone.</DialogContent>
            <DialogActions>
              <Button onClick={handleCancelDelete}>Cancel</Button>
              <Button onClick={handleDeleteConfirmed} color="error">Delete</Button>
            </DialogActions>
          </Dialog>

          {/* Table */}
          <Box mt={4} borderRadius={2} padding={2}>
            {filteredData.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#F0F2F8' }}>
                      <TableCell>Input Value</TableCell>
                      <TableCell>Selected Items</TableCell>
                      <TableCell>Employee Percentage</TableCell>
                      <TableCell>Employer Percentage</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.map((row, index) => (
                      <TableRow key={row._id || index}>
                        <TableCell>{row.percentage}</TableCell>
                        <TableCell>{row.selectedItems?.join(' + ')}</TableCell>
                        <TableCell>{row.employee}</TableCell>
                        <TableCell>{row.employer}</TableCell>
                        <TableCell>
                          <Tooltip title="View">
                            <IconButton onClick={() => handleView(index)}>
                              <VisibilityIcon sx={{ color: 'blue', width: '35px', height: '30px' }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            {(salaryIncomeHeadPermission.Edit===true || isAdmin) && <IconButton onClick={() => handleEdit(index)}>
                              <EditBtn sx={{ color: 'green' }} />
                            </IconButton>}
                          </Tooltip>
                          <Tooltip title="Delete">
                            {(salaryIncomeHeadPermission.Delete===true || isAdmin) && <IconButton onClick={() => confirmDelete(index)}>
                              <DeleteBtn sx={{ color: 'red' }} />
                            </IconButton>}
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box textAlign="center" mt={2} fontStyle="italic" color="gray">
                No entries to display.
              </Box>
            )}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SalaryIncomeDeduction;
