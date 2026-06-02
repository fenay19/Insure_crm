import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
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
import { Link } from 'react-router-dom';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import { toast, ToastContainer } from 'react-toastify';
import { Add, Edit, Delete, Close } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import theme from 'themes/index';
import value from 'assets/scss/_themes-vars.module.scss';

// import {axiosInstance} from  "../../../api/api.js"
import { get, post, put, remove} from "../../../api/api.js"
import { useSelector } from 'react-redux';

const BankDetails = () => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState(initialForm()); // Fix: use initialForm() instead of data
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [isAdmin,setAdmin]=useState(false);
  const [bankDetailsPermission,setBankDetailsPermission]=useState({
      View: false,
      Add: false,
      Edit: false,
      Delete: false
    });
const systemRights = useSelector((state)=>state.systemRights.systemRights);
// todo : Get banking data list from axiosInstance
  useEffect(() => {
    const loginRole=localStorage.getItem('loginRole');
    if (loginRole === 'admin') {
      setAdmin(true);
    }
    if (systemRights?.actionPermissions?.["bank-details"]) {
      setBankDetailsPermission(systemRights.actionPermissions["bank-details"]);
    }
    const fetchBankDetails = async () => {
      try {
        // Use the correct endpoint (no leading slash if your baseURL already ends with /)
        const response = await get('bankDetails');
        // Defensive: fallback to response.data if response.data.data is undefined
        console.log("Bank Details: ", response.data)
        const bankData = response.data?.data || response.data || [];
        setData(bankData);
      } catch (error) {
        console.error('Error fetching bank details:', error);
        toast.error('Failed to fetch bank details');
      }
    };

    fetchBankDetails();
  }, [systemRights]);

// Add bank detail
const addBankDetail = async (formData) => {
  try {
    const response = await post('bankDetails', formData);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error adding bank detail:', error);
    toast.error('Failed to add bank detail');
    throw error;
  }
};

// Update bank detail
const updateBankDetail = async (id, formData) => {
  try {
    const response = await put(`bankDetails/${id}`, formData);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error updating bank detail:', error);
    toast.error('Failed to update bank detail');
    throw error;
  }
};

// Delete bank detail
const deleteBankDetail = async (id) => {
  try {
    await remove(`bankDetails/${id}`);
    toast.success('Bank detail deleted successfully!');
  } catch (error) {
    console.error('Error deleting bank detail:', error);
    toast.error('Failed to delete bank detail');
  }
};

  function initialForm() {
    return {
      accountName: '',
      accountNumber: '',
      bankName: '',
      branchName: '',
      IFSCcode: '',
      PanNo: '',
      UpiId: ''
    };
  }

  const validate = () => {
    const newErrors = {};
    if (!form.accountName) newErrors.accountName = 'Account Name is required';
    if (!form.accountNumber || !/^\d{9,18}$/.test(form.accountNumber))
      newErrors.accountNumber = 'Valid Account Number is required (9-18 digits)';
    if (!form.bankName) newErrors.bankName = 'Bank Name is required';
    if (!form.branchName) newErrors.branchName = 'Branch Name is required';
    if (!form.IFSCcode || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.IFSCcode))
      newErrors.IFSCcode = 'Invalid IFSC code';
    if (!form.PanNo || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.PanNo))
      newErrors.PanNo = 'Invalid PAN number';
    if (!form.UpiId || !/^[\w.-]+@[\w.-]+$/.test(form.UpiId))
      newErrors.UpiId = 'Invalid UPI ID';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpen = () => {
    setForm(initialForm());
    setErrors({});
    setEditIndex(null);
    setOpen(true);
  };

  const handleEdit = (index) => {
    setForm({ ...data[index] }); // Fix: always use a copy, not a reference
    setEditIndex(index);
    setOpen(true);
  };

  const handleDelete = async (index) => {
    const id = data[index]._id;
    await deleteBankDetail(id);
    setData(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async () => {
    if (validate()) {
      if (editIndex !== null) {
        try {
          const id = data[editIndex]._id;
          const updatedBank = await updateBankDetail(id, form);
          setData(prev => prev.map((item, idx) => idx === editIndex ? updatedBank : item));
          setOpen(false);
        } catch (error) {
          // Error handled in updateBankDetail
        }
      } else {
        try {
          const newBank = await addBankDetail(form);
          setData(prev => [...prev, newBank]);
          setOpen(false);
        } catch (error) {
          // Error handled in addBankDetail
        }
      }
    }
  };  

  return (
    <>
      <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Bank Details
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5">Bank Details</Typography>
            {(bankDetailsPermission?.Add===true || isAdmin) && <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
              Add Bank
            </Button>}
          </Grid>

          {/* Bank Table */}
        
            <Card>
              <CardContent>
                <Box sx={{ overflowX: 'auto' }}>
                  <Grid container spacing={2} sx={{ minWidth: '800px' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>SN</TableCell>
                          <TableCell>Account Name</TableCell>
                          <TableCell>Account Number</TableCell>
                          <TableCell>Bank</TableCell>
                          <TableCell>Branch</TableCell>
                          <TableCell>IFSC</TableCell>
                          <TableCell>UPI</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      {data?.length > 0 ? 
                      <TableBody>
                        {data?.map((entry, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{entry.accountName}</TableCell>
                            <TableCell>{entry.accountNumber}</TableCell>
                            <TableCell>{entry.bankName}</TableCell>
                            <TableCell>{entry.branchName}</TableCell>
                            <TableCell>{entry.IFSCcode}</TableCell>
                            <TableCell>{entry.UpiId}</TableCell>
                            <TableCell sx={{
                                display:'flex',
                                flexWrap: 'nowrap',   
                            }}>
                              {(bankDetailsPermission.Edit===true || isAdmin)  && <Button size="small" onClick={() => handleEdit(index)} sx={{
                                padding: '1px', // Reduced padding
                                minWidth: '24px', // Set minimum width
                                height: '24px',
                                mr: '5px',
                              }}>
                                <IconButton color='inherit' ><Edit /></IconButton>
                              </Button>}
                            {(bankDetailsPermission.Delete===true || isAdmin) && <Button color="error" onClick={() => handleDelete(index)} sx={{
                              padding: '1px', // Reduced padding
                              minWidth: '24px', // Set minimum width
                              height: '24px'
                            }}>
                              <IconButton color='inherit'><Delete /></IconButton>
                            </Button>}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      : <TableRow>
                              <TableCell colSpan={8} align="center">
                                No Data Found
                              </TableCell>
                            </TableRow> }
                    </Table>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
        </Grid>
      </Grid>

      {/* Modal Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {editIndex !== null ? 'Edit Bank Detail' : 'Add Bank Detail'}
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {[
              { label: 'Account Holder Name', name: 'accountName' },
              { label: 'Account Number', name: 'accountNumber' },
              { label: 'Bank Name', name: 'bankName' },
              { label: 'Branch Name', name: 'branchName' },
              { label: 'IFSC Code', name: 'IFSCcode' },
              { label: 'PAN Number', name: 'PanNo' },
              { label: 'UPI ID', name: 'UpiId' }
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
                  required
                />
              </Grid>
            ))}
            <Grid item xs={4}  >
                <TextField
                  label='QR Code'
                  name='QRCode'
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                  type='file'
                  fullWidth
                  inputProps={{ accept: 'image/*' }}
                  value={undefined} // Fix: do not control value for file input
                />
              </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button
            onClick={() => setOpen(false)}
            variant="contained"
            color="error"
            sx={{
              minWidth: '40px', // Adjust the button size to fit the icon
              padding: '2px', // Reduce padding around the icon
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

export default BankDetails;
