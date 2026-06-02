import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  MenuItem,
  IconButton,
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
  Dialog,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { Link, Navigate } from 'react-router-dom';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import { Add, ArrowBack, Save as SaveIcon, Edit, Delete, Close as CloseIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import value from 'assets/scss/_themes-vars.module.scss';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Gst = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialFormState());
  const [data, setData] = useState([
    {
      clientName: 'Erza',
      invoiceNumber: '1234',
      clientGst: '27ABCDE1234F1Z5',
      totalAmount: 34567
    }
  ]);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  function initialFormState() {
    return {
      invoiceNumber: '1234',
      date: null,
      invoiceCategory: 'gst',
      taxType: 'IGST',
      clientDetails: {
        clientName: '',
        clientGst: '',
        clientEmail: '',
        clientAddress: '',
        clientPincode: '',
        clientState: '',
        clientCity: '',
        clientCountry: ''
      },
      products: [
        {
          product: '',
          description: '',
          quantity: '',
          rate: '',
          gstPercentage: '',
          productAmount: ''
        }
      ],
      subTotal: '',
      discount: '',
      discountAmount: '',
      totalAmount: '',
      roundUp: '',
      nameOnBankAccount: '',
      bankAccountNumber: '',
      bankName: '',
      branchName: '',
      ifscCode: '',
      panCardNo: ''
    };
  }

  const products = ['Product X', 'Product Y'];
  const [errors, setErrors] = useState({});

  const handleDateChange = (value) => {
    setForm((prev) => ({ ...prev, date: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpen = () => {
    setForm(initialFormState);
    setErrors({});
    setEditIndex(null);
    setOpen(true);
  };

  const handleEdit = (index) => {
    setForm(data[index]);
    setEditIndex(index);
    setOpen(true);
  };

  const handleSubmit = () => {
    if (validate()) {
      const updatedData = [...data];
      if (editIndex !== null) {
        updatedData[editIndex] = form;
        toast.success('GST updated successfully!');
      } else {
        updatedData.push(form);
        toast.success('GST added successfully!');
      }
      setData(updatedData);
      setOpen(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.amount) {
      newErrors.amount = 'Amount is Required';
    } else if (!/^\d+(\.\d{1,2})?$/.test(form.amount)) {
      newErrors.amount = 'Please Enter a Proper Amount';
    } else if (parseFloat(form.amount <= 0)) {
      newErrors.amount = 'Invalid Amount';
    }

    if (!form.clientName) {
      newErrors.clientName = 'Client name is Required';
    }
    if (!form.date) {
      newErrors.date = 'Date is Required';
    }
    if (!form.clientGst) {
      newErrors.clientGst = 'Gst is Required';
    } else if (!/^\d+(\.\d{1,2})?$/.test(form.clientGst)) {
      newErrors.clientGst = 'Please Enter a Proper Number';
    } else if (parseFloat(form.clientGst <= 0)) {
      newErrors.clientGst = 'Enter Positive Values';
    }
    if (!form.clientEmail) {
      newErrors.clientEmail = 'Email is Required';
    } else if (!form.clientEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.clientEmail = 'Email is Invalid';
    }

    if (!form.clientAddress) newErrors.clientAddress = 'Address is Required';
    if (!form.clientPincode) {
      newErrors.clientPincode = 'Pincode is Required';
    } else if (!/^\d{6}$/.test(form.clientPincode)) {
      newErrors.clientPincode = 'Pincode must be a 6-digit number';
    }
    if (!form.clientState) newErrors.clientState = 'State is Required';
    if (!form.clientCity) newErrors.clientCity = 'City is Required';
    if (!form.clientCountry) newErrors.clientCountry = 'Country is Required';
    if (!form.description) newErrors.description = 'Description is Required';
    if (!form.quantity) newErrors.quantity = 'Quantity is Required';
    if (!form.rate) newErrors.rate = 'Rate Required';
    if (!form.gstPercentage) newErrors.gstPercentage = 'Gst% is Required';
    if (!form.productAmount) {
      newErrors.productAmount = 'Amount is Required';
    } else if (!/^\d+(\.\d{1,2})?$/.test(form.productAmount)) {
      newErrors.productAmount = 'Please Enter a Proper Amount';
    } else if (parseFloat(form.productAmount <= 0)) {
      newErrors.productAmount = 'Invalid Amount';
    }
    if (!form.subTotal) {
      newErrors.subTotal = 'Amount is Required';
    } else if (!/^\d+(\.\d{1,2})?$/.test(form.subTotal)) {
      newErrors.subTotal = 'Please Enter a Proper Amount';
    } else if (parseFloat(form.subTotal <= 0)) {
      newErrors.subTotal = 'Invalid Amount';
    }
    if (!form.discount) newErrors.discount = 'Required';
    if (!form.discountAmount) newErrors.discountAmount = 'Required';
    if (!form.totalAmount) newErrors.totalAmount = 'Required';
    if (!form.roundUp) newErrors.roundUp = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <>
      {/* <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Non-GST
        </Typography>
      </Breadcrumb> */}

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          between
          <Grid container justifyContent="space-" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5">GST</Typography>
            <Button variant="contained" startIcon={<Add />} onClick={handleOpen}></Button>
          </Grid>
          {
            // data.length > 0 &&
            <Card>
              <CardContent>
                <Box sx={{ overflowX: 'auto' }}>
                  <Grid container spacing={2} sx={{ minWidth: '800px' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>SN</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Invoice Number</TableCell>
                          <TableCell>GST</TableCell>
                          <TableCell>Total Amount</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.map((entry, index) => (
                          <TableRow key={[index]}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{entry.clientName}</TableCell>
                            <TableCell>{entry.invoiceNumber}</TableCell>
                            <TableCell>{entry.clientGst}</TableCell>
                            <TableCell>{entry.totalAmount}</TableCell>
                            <TableCell>
                              <TableCell sx={{ verticalAlign: 'middle', borderBottom: 'none' }}>
                                <Box sx={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center', gap: 1 }}>
                                  <IconButton size="small" color="primary" onClick={() => handleEdit(index)} sx={{ padding: '4px' }}>
                                    <Edit fontSize="small" />
                                  </IconButton>
                                  <IconButton size="small" color="error" sx={{ padding: '4px' }}>
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Box>
                              </TableCell>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          }
        </Grid>
      </Grid>
      <ToastContainer />
    </>
  );
};

export default Gst;
