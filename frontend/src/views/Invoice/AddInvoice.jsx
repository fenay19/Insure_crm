import React, { useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Card,
  CardContent,
  Divider,
  Checkbox,
  IconButton,
  Box
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import value from 'assets/scss/_themes-vars.module.scss';

const AddInvoice = () => {
  const [form, setForm] = useState(initialFormState);
  const [invoiceCategory, setInvoiceCategory] = useState();

  function initialFormState() {
    return {
      invoiceNumber: '',
      date: null,
      invoiceCategory: '',
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (value) => {
    setForm((prev) => ({ ...prev, date: value }));
  };

  const invoiceFields = () => {
    return (
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
                  // InputLabelProps={{ shrink: true }}
                  // inputProps={{ readOnly: true }}
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
                    // error={!!errors[field.name]}
                    // helperText={errors[field.name]}
                  />
                </Grid>
              ))}

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6" color="primary">
                  Product Details
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  select
                  label="Product"
                  name="product"
                  value={form.product}
                  onChange={handleChange}
                  fullWidth
                  required
                  //   error={!!errors.product}
                  //   helperText={errors.product}
                >
                  {products.map((p, i) => (
                    <MenuItem key={i} value={p}>
                      {p}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={8}>
                <TextField
                  label="Description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  fullWidth
                  required
                ></TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField label="Qty" name="quantity" value={form.quantity} onChange={handleChange} fullWidth required></TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField label="Rate" name="rate" value={form.rate} onChange={handleChange} fullWidth required></TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Gst%"
                  name="gstPercentage"
                  value={form.gstPercentage}
                  onChange={handleChange}
                  fullWidth
                  required
                ></TextField>
              </Grid>
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
                <Grid item xs={12} md={3} key={field.name}>
                  <TextField
                    label={field.label}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    fullWidth
                    required
                    // error={!!errors[field.name]}
                    // helperText={errors[field.name]}
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
                  //   error={!!errors.nameOnBankAccount}
                  //   helperText={errors.nameOnBankAccount}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Bank Account Number"
                  name="bankAccountNumber"
                  value={form.bankAccountNumber}
                  onChange={handleChange}
                  fullWidth
                  //   error={!!errors.bankAccountNumber}
                  //   helperText={errors.bankAccountNumber}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Bank Name"
                  name="bankName"
                  value={form.bankName}
                  onChange={handleChange}
                  fullWidth
                  //   error={!!errors.bankName}
                  //   helperText={errors.bankName}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Branch Name"
                  name="branchName"
                  value={form.branchName}
                  onChange={handleChange}
                  fullWidth
                  //   error={!!errors.branchName}
                  //   helperText={errors.branchName}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="IFSC Code"
                  name="ifscCode"
                  value={form.ifscCode}
                  onChange={handleChange}
                  fullWidth
                  //   error={!!errors.ifscCode}
                  //   helperText={errors.ifscCode}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="PAN Card Number"
                  name="panCardNo"
                  value={form.panCardNo}
                  onChange={handleChange}
                  fullWidth
                  //   error={!!errors.panCardNo}
                  //   helperText={errors.panCardNo}
                />
              </Grid>

              <Grid item xs={12}>
                <Button variant="contained">Submit</Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center">
                  <IconButton component={Link} to="/invoice-management" color="primary">
                    <ArrowBackIcon />
                  </IconButton>
                  <Typography variant="h6">Add Invoice</Typography>
                </Box>
                <RadioGroup row value={invoiceCategory} onChange={(e) => setInvoiceCategory(e.target.value)}>
                  <FormControlLabel value="gst" control={<Radio />} label="GST" />
                  <FormControlLabel value="nonGst" control={<Radio />} label="NON-GST" />
                </RadioGroup>
              </Box>
              {invoiceCategory === 'gst' && <Typography variant="h5">GST</Typography> && invoiceFields()}
              {invoiceCategory === 'nonGst' && invoiceFields()}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <ToastContainer />
    </>
  );
};
export default AddInvoice;
