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
import { Radio, RadioGroup, FormControlLabel, FormLabel, FormControl } from '@mui/material';

const NonGst = () => {
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
      clientName: '',
      invoiceNumber: '1234',
      date: null,
      amount: '',
      clientGst: '',
      clientEmail: '',
      clientAddress: '',
      clientPincode: '',
      clientState: '',
      clientCity: '',
      clientCountry: '',
      product: '',
      description: '',
      quantity: '',
      rate: '',
      gstPercentage: '',
      productAmount: '',
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
        toast.success('NON-GST updated successfully!');
      } else {
        updatedData.push(form);
        toast.success('NON-GST added successfully!');
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
    // if (!form.nameOnBankAccount) newErrors.nameOnBankAccount = 'Name on Bank Account is Required';
    // if (!form.bankAccountNumber) newErrors.bankAccountNumber = 'Bank Account Number is Required';
    // if (!form.bankName) newErrors.bankName = 'Bank Name is Required';
    // if (!form.branchName) newErrors.branchName = 'Branch Name is Required';
    // if (!form.ifscCode) newErrors.ifscCode = 'IFSC Code is Required';
    // if (!form.panCardNo) newErrors.panCardNo = 'PAN Card Number is Required';

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
          <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5">Non-GST</Typography>
            <Button variant="contained" startIcon={<Add />} onClick={handleOpen}></Button>
          </Grid>
          {
            <Card>
              <CardContent>
                <Box sx={{ overflowX: 'auto' }}>
                  <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                    Client Details
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Invoice Number"
                        name="invoiceNumber"
                        value={form.invoiceNumber}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ readOnly: true }}
                      />
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Date"
                          value={form.date}
                          onChange={handleDateChange}
                          slotProps={{
                            textField: {
                              fullWidth: true
                            }
                          }}
                          renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} fullWidth />}
                        />
                      </LocalizationProvider>
                    </Grid>

                    {[
                      { label: 'Client Name', name: 'clientName' },
                      { label: 'GST', name: 'clientGst' },
                      { label: 'Email Id', name: 'clientEmail' },
                      { label: 'Address', name: 'clientAddress' },
                      { label: 'Pincode', name: 'clientPincode' },
                      { label: 'State', name: 'clientState' },
                      { label: 'City', name: 'clientCity' },
                      { label: 'Country', name: 'clientCountry' }
                    ].map((field) => (
                      <Grid item xs={12} md={field.name === 'clientAddress' ? 9 : 3} key={field.name}>
                        <TextField
                          label={field.label}
                          name={field.name}
                          value={form[field.name]}
                          onChange={handleChange}
                          fullWidth
                          required
                          error={!!errors[field.name]}
                          helperText={errors[field.name]}
                        />
                      </Grid>
                    ))}

                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <Typography variant="h6" color="primary">
                        Product Details
                      </Typography>
                    </Grid>

                    {/* <Grid item xs={12} md={2}>
                      <TextField
                        select
                        label="Product"
                        name="product"
                        value={form.product}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!errors.product}
                        helperText={errors.product}
                      >
                         {products.map((p, i) => (
                          <MenuItem key={i} value={p}>
                            {p}
                          </MenuItem>
                        ))} 
                      </TextField>
                    </Grid> */}

                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        fullWidth
                        required
                      ></TextField>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField label="Qty" name="quantity" value={form.quantity} onChange={handleChange} fullWidth required></TextField>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField label="Rate" name="rate" value={form.rate} onChange={handleChange} fullWidth required></TextField>
                    </Grid>
                    {/* <Grid item xs={12} md={3}>
                      <TextField
                        label="Gst%"
                        name="gstPercentage"
                        value={form.gstPercentage}
                        onChange={handleChange}
                        fullWidth
                        required
                      ></TextField>
                    </Grid> */}
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Amount"
                        name="productAmount"
                        value={form.productAmount}
                        onChange={handleChange}
                        fullWidth
                        required
                      ></TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <Button variant="contained" sx={{ backgroundColor: value.primaryLight }}>
                        Add
                      </Button>
                    </Grid>

                    {[
                      { label: 'Subtotal', name: 'subTotal' },
                      { label: 'Discount(%)', name: 'discount' },
                      { label: 'Discount Amount', name: 'discountAmount' },
                      { label: 'Total', name: 'totalAmount' },
                      { label: 'Round Up', name: 'roundUp' }
                    ].map((field) => (
                      <Grid item xs={12} md={2} key={field.name}>
                        <TextField
                          label={field.label}
                          name={field.name}
                          value={form[field.name]}
                          onChange={handleChange}
                          fullWidth
                          required
                          error={!!errors[field.name]}
                          helperText={errors[field.name]}
                        />
                      </Grid>
                    ))}
                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <Typography variant="h6" color="primary">
                        Bank Details
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Name on Bank Account"
                        name="nameOnBankAccount"
                        fullWidth
                        value={form.nameOnBankAccount}
                        onChange={handleChange}
                        error={!!errors.nameOnBankAccount}
                        helperText={errors.nameOnBankAccount}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Bank Account Number"
                        name="bankAccountNumber"
                        value={form.bankAccountNumber}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.bankAccountNumber}
                        helperText={errors.bankAccountNumber}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Bank Name"
                        name="bankName"
                        value={form.bankName}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.bankName}
                        helperText={errors.bankName}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Branch Name"
                        name="branchName"
                        value={form.branchName}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.branchName}
                        helperText={errors.branchName}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="IFSC Code"
                        name="ifscCode"
                        value={form.ifscCode}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.ifscCode}
                        helperText={errors.ifscCode}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="PAN Card Number"
                        name="panCardNo"
                        value={form.panCardNo}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.panCardNo}
                        helperText={errors.panCardNo}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Button variant="contained" onClick={handleSubmit}>
                        Submit
                      </Button>
                    </Grid>
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

export default NonGst;
