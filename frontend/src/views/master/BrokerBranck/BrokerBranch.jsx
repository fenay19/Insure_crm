import React, { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton
} from '@mui/material';
import Breadcrumb from 'component/Breadcrumb';
import { Link } from 'react-router-dom';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import theme from 'assets/scss/_themes-vars.module.scss';
import value from 'assets/scss/_themes-vars.module.scss';
import { toast, ToastContainer } from 'react-toastify';

// import { axiosInstance } from '../../../api/api.js';
import { get, post, put, remove } from '../../../api/api.js';
import { useSelector } from 'react-redux';

const BrokerBranch = () => {
  const [form, setForm] = useState(initialForm());
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isAdmin, setAdmin] = useState(false);

  const fetchBrokerBranch = async () => {
    try {
      const response = await get('brokerBranch');
      const BrokerData = response.data?.data || response.data || [];
      setData(BrokerData);
    } catch (error) {
      console.error('Error fetching broker branch details:', error);
      toast.error('Failed to fetch broker branch details');
    }
  };

  useEffect(() => {
    fetchBrokerBranch();
  }, []);

  // Add Broker Branch
  const addBrokerBranch = async (formData) => {
    try {
      const response = await post('brokerBranch', formData);
      toast.success('Branch added Successfully');
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error adding broker branch:', error);
      toast.error('Failed to add broker branch');
      throw error;
    }
  };

  // Update branch detail
  const updateBrokerBranch = async (id, formData) => {
    try {
      const response = await put(`brokerBranch/${id}`, formData);
      toast.success('Branch edited successfully!');
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error updating branch detail:', error);
      toast.error('Failed to update branch detail');
      throw error;
    }
  };

  // Delete bank detail
  const deleteBrokerBranch = async (id) => {
    try {
      await remove(`brokerBranch/${id}`);
      toast.success('Branch deleted successfully!');
    } catch (error) {
      console.error('Error deleting broker branch:', error);
      toast.error('Failed to delete broker branch');
    }
  };

  function initialForm() {
    return {
      branchId: '',
      branchCode: '',
      branchName: '',
      address: '',
      pinCode: '',
      mobile: '',
      email: ''
    };
  }

  const handleClose = () => {
    setErrors([]);
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const validate = () => {
    const newErrors = {};
    if (!form.branchCode) newErrors.branchCode = 'Branch Code is required';
    if (!form.branchName) newErrors.branchName = 'Branch Name is required';
    if (form.mobile.length > 0) {
      if (!form.mobile?.match(/^\d{10}$/)) newErrors.mobile = 'Enter valid 10-digit number';
    }

    if (form.email.length > 0) if (!form.email?.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) newErrors.email = 'Invalid email';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = (index) => {
    setForm({ ...data[index] }); // Fix: always use a copy, not a reference
    setEditIndex(index);
    setOpen(true);
  };

  const handleDelete = async (index) => {
    const id = data[index]._id;
    await deleteBrokerBranch(id);
    setData((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async () => {
    if (validate()) {
      if (editIndex !== null) {
        try {
          const id = data[editIndex]._id;
          const updateBranch = await updateBrokerBranch(id, form);
          setData((prev) => prev.map((item, idx) => (idx === editIndex ? updateBranch : item)));
          setOpen(false);
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          const newBrokerBranch = await addBrokerBranch(form);
          setData((prev) => [...prev, newBrokerBranch]);
          setOpen(false);
        } catch (error) {
          console.log(error);
        }
      }
    }
  };
  return (
    <>
      <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Masters
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Broker Branch
        </Typography>
      </Breadcrumb>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Broker Branch</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          Add Branch
        </Button>
      </Grid>

      {/* Table */}
      <Card>
        <CardContent>
          <Box sx={{ overflowX: 'auto' }}>
            <Grid container spacing={2} sx={{ minWidth: '800px' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>SN</TableCell>
                    <TableCell>Branch Name</TableCell>
                    <TableCell>Branch Code</TableCell>
                    <TableCell>Branch ID</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Mobile</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>PIN </TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                {data?.length > 0 ? (
                  <>
                    <TableBody>
                      {data?.map((entry, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{entry.branchName}</TableCell>
                          <TableCell>{entry.branchCode}</TableCell>
                          <TableCell>{entry.branchId}</TableCell>
                          <TableCell>{entry.email}</TableCell>
                          <TableCell>{entry.mobile}</TableCell>
                          <TableCell>{entry.address}</TableCell>
                          <TableCell>{entry.pinCode}</TableCell>
                          <TableCell
                            sx={{
                              display: 'flex',
                              flexWrap: 'nowrap'
                            }}
                          >
                            {/* {(bankDetailsPermission.Edit===true || isAdmin)  &&  */}
                            <Button
                              size="small"
                              onClick={() => handleEdit(index)}
                              sx={{
                                padding: '1px', // Reduced padding
                                minWidth: '24px', // Set minimum width
                                height: '24px',
                                mr: '5px'
                              }}
                            >
                              <IconButton color="inherit">
                                <Edit />
                              </IconButton>
                            </Button>
                            {/* } */}
                            {/* {(bankDetailsPermission.Delete===true || isAdmin) &&  */}
                            <Button
                              color="error"
                              onClick={() => handleDelete(index)}
                              sx={{
                                padding: '1px', // Reduced padding
                                minWidth: '24px', // Set minimum width
                                height: '24px'
                              }}
                            >
                              <IconButton color="inherit">
                                <Delete />
                              </IconButton>
                            </Button>
                            {/* } */}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </>
                ) : (
                  <>
                    <TableRow>
        <TableCell colSpan={10} align="center">
          No Data Found
        </TableCell>
      </TableRow>
                  </>
                )}
              </Table>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Modal Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {editIndex !== null ? 'Edit Broker Detail' : 'Add Broker Detail'}
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {[
              { label: 'Branch Id', name: 'branchId' },
              { label: 'Branch Code', name: 'branchCode', required: true },
              { label: 'Branch Name', name: 'branchName', required: true },
              { label: 'Address', name: 'address' },
              { label: 'PIN Code', name: 'pinCode' },
              { label: 'Mobile', name: 'mobile' },
              { label: 'Email', name: 'email' }
            ].map((field) => (
              <Grid item xs={4} key={field.name}>
                <TextField
                  label={field.label}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]}
                  fullWidth
                  required={field.required ? true : false}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button
            onClick={handleClose}
            variant="contained"
            color="error"
            sx={{
              minWidth: '40px', // Adjust the button size to fit the icon
              padding: '2px' // Reduce padding around the icon
            }}
          >
            <IconButton color="inherit">
              <CancelIcon /> {/* Cancel icon */}
            </IconButton>
          </Button>

          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              minWidth: '40px', // Adjust the button size to fit the icon
              padding: '2px', // Reduce padding around the icon
              backgroundColor: value.primaryLight
            }}
          >
            <IconButton color="inherit">
              {editIndex !== null ? <EditIcon /> : <SaveIcon />} {/* Conditional rendering of icons */}
            </IconButton>
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default BrokerBranch;
