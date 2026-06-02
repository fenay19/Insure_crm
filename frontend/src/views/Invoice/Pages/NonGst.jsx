import React, { useEffect, useState } from 'react';
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
  DialogTitle,
  InputLabel,
  Select,
  Autocomplete
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
import { get, post } from 'api/api';

const NonGst = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialFormState());
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [discountType, setDiscountType] = useState('');
  const [clientData, setClientData] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);

  function initialFormState() {
    return {
      gstType: 'non-gst',
      clientId: '',
      clientName: '',
      RecieptNo: '',
      invoiceNumber: '',
      date: null,
      clientEmail: '',
      clientAddress: '',
      clientPincode: '',
      clientState: '',
      clientCity: '',
      clientCountry: '',
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
      selectedBankId: '',
      nameOnBankAccount: '',
      bankAccountNumber: '',
      bankName: '',
      branchName: '',
      ifscCode: '',
      panCardNo: ''
    };
  }
  const [errors, setErrors] = useState({});

  const handleDateChange = (value) => {
    setForm((prev) => ({ ...prev, date: value }));
  };

  const fetchPincodeDetails = async (pincode) => {
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();

      if (data[0].Status === 'Success') {
        const { District, State, Country } = data[0].PostOffice[0];
        setForm((prevForm) => ({
          ...prevForm,
          clientCity: District || '',
          clientState: State || '',
          clientCountry: Country || ''
        }));
      } else {
        toast.error('Invalid pincode');
        setForm((prevForm) => ({
          ...prevForm,
          clientCity: '',
          clientState: '',
          clientCountry: ''
        }));
      }
    } catch (error) {
      toast.error('Error fetching pincode details');
      console.error('Error fetching pincode details:', error);
      setForm((prevForm) => ({
        ...prevForm,
        clientCity: '',
        clientState: '',
        clientCountry: ''
      }));
    }
  };

  const calculateSubtotal = (products) => {
    return products.reduce((acc, product) => {
      const amount = parseFloat(product.productAmount) || 0;
      return acc + amount;
    }, 0);
  };

  const applyDiscountAndTotal = (draft) => {
    const subTotal = parseFloat(draft.subTotal) || 0;
    const discount = parseFloat(draft.discount) || 0;

    // Calculate discount amount
    if (draft.discountType === 'percentage') {
      draft.discountAmount = ((subTotal * discount) / 100).toFixed(2);
    } else {
      draft.discountAmount = discount.toFixed(2);
    }

    // Calculate total amount after discount
    draft.totalAmount = (subTotal - parseFloat(draft.discountAmount)).toFixed(2);

    // Calculate round-up value
    const total = parseFloat(draft.totalAmount) || 0;
    // draft.roundUp = (Math.ceil(total) - total).toFixed(2);

    // Calculate total rounded-up value (actual rounded total)
    draft.roundUp = Math.ceil(total).toFixed(2);
  };

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    // Handle product-level fields
    if (index !== null) {
      setForm((prev) => {
        const draft = structuredClone(prev);
        draft.products[index][name] = value;

        // Auto-calculate productAmount
        if (name === 'quantity' || name === 'rate') {
          const quantity = parseFloat(draft.products[index].quantity) || 0;
          const rate = parseFloat(draft.products[index].rate) || 0;
          draft.products[index].productAmount = quantity && rate ? (quantity * rate).toFixed(2) : '';
        }

        // Update subtotal
        draft.subTotal = calculateSubtotal(draft.products).toFixed(2);
        return draft;
      });
      return;
    }

    // Handle top-level fields
    setForm((prev) => {
      const draft = { ...prev, [name]: value };

      // Update totalAmount for discount-related fields
      if (name === 'discount' || name === 'discountType') {
        applyDiscountAndTotal(draft);
      }
      return draft;
    });
  };

  const handleOpen = () => {
    setForm(initialFormState);
    setErrors({});
    setEditIndex(null);
    setOpen(true);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (localStorage.getItem('expired') === 'true') {
      toast.error('Subscription has ended. Please subscribe to continue working.');
      return;
    }
    console.log('gst form', form);
    const response = await post('invoiceRegistration', form);
    if (response.status === true) {
      console.log('response', response);
      toast.success('GST Invoice created successfully');
      navigate('/invoice-management');
    } else {
      console.error(response.message);
      toast.error(response.message);
    }
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.totalAmount) {
      newErrors.totalAmount = 'Amount is Required';
    } else if (!/^\d+(\.\d{1,2})?$/.test(form.totalAmount)) {
      newErrors.totalAmount = 'Please Enter a Proper Amount';
    } else if (parseFloat(form.totalAmount <= 0)) {
      newErrors.totalAmount = 'Invalid Amount';
    }

    if (!form.clientName) {
      newErrors.clientName = 'Client name is Required';
    }
    if (!form.date) {
      newErrors.date = 'Date is Required';
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
    if (!form.clientState) {
      newErrors.clientState = 'State is Required';
    }
    if (!form.clientCity) {
      newErrors.clientCity = 'City is Required';
    }
    if (!form.clientCountry) {
      newErrors.clientCountry = 'Country is Required';
    }

    form.products.forEach((product, index) => {
      if (!product.product) newErrors[`product_${index}`] = 'Product is Required';
      if (!product.description) newErrors[`description_${index}`] = 'Description is Required';
      if (!product.quantity) newErrors[`quantity_${index}`] = 'Quantity is Required';
      if (!product.rate) newErrors[`rate_${index}`] = 'Rate is Required';
      if (!product.productAmount) {
        newErrors[`productAmount_${index}`] = 'Amount is Required';
      } else if (!/^\d+(\.\d{1,2})?$/.test(product.productAmount)) {
        newErrors[`productAmount_${index}`] = 'Please Enter a Proper Amount';
      } else if (parseFloat(product.productAmount <= 0)) {
        newErrors[`productAmount_${index}`] = 'Invalid Amount';
      }
    });

    if (!form.subTotal) {
      newErrors.subTotal = 'Subtotal is Required';
    } else if (!/^\d+(\.\d{1,2})?$/.test(form.subTotal)) {
      newErrors.subTotal = 'Please Enter a Proper Subtotal';
    } else if (parseFloat(form.subTotal <= 0)) {
      newErrors.subTotal = 'Invalid Subtotal';
    }
    if (!form.discount) newErrors.discount = 'Discount is Required';
    if (!form.totalAmount) newErrors.totalAmount = 'Total Amount is Required';
    if (!form.roundUp) newErrors.roundUp = 'Round Up is Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBack = () => {
    navigate('/dashboard');
  };
  const handleAddProduct = (index) => {
    const newProduct = {
      product: '',
      description: '',
      quantity: '',
      rate: '',
      productAmount: ''
    };

    const updatedProducts = [...form.products];
    updatedProducts.splice(index + 1, 0, newProduct);

    const updatedSubTotal = updatedProducts.reduce((acc, curr) => {
      const amt = parseFloat(curr.productAmount || 0);
      return acc + amt;
    }, 0);

    setForm({
      ...form,
      products: updatedProducts,
      subTotal: updatedSubTotal.toFixed(2),
      discount: '',
      totalAmount: '',
      roundUp: ''
    });
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = [...form.products];
    updatedProducts.splice(index, 1);

    const updatedSubTotal = updatedProducts.reduce((acc, curr) => {
      const amount = parseFloat(curr.productAmount || 0);
      return acc + amount;
    }, 0);

    setForm({
      ...form,
      products: updatedProducts,
      subTotal: updatedSubTotal || '',
      discount: '',
      totalAmount: '',
      roundUp: ''
    });
  };

  useEffect(() => {
    setForm((pre) => ({ ...pre, date: new Date() }));
    const fetchClientDetails = async () => {
      const response = await get('admin-clientRegistration');
      if (response.status === 'true') {
        const filteredData = response.data.filter((client) => client.createdBy === localStorage.getItem('Id'));
        console.log('gst response client is', filteredData);
        setClientData(filteredData);
      }
    };
    const fetchProductCategory = async () => {
      const response = await get('SubProductCategory');
      console.log('product category is', response);
      if (response.status === 'true') {
        setAllProducts(response.data);
      }
    };
    const fetchInvoiceNo = async () => {
      const response = await get('invoiceRegistration');
      if (response.status === true) {
        const nonGstData = response.invoices.filter((item) => item.gstType === 'non-gst');
        const all_invoice_no = nonGstData.map((item) => item.invoiceNumber?.trim());
        const all_reciept_no = nonGstData.map((item) => item.RecieptNo?.trim());
        console.log('all recipet no', all_reciept_no);

        // Extract numeric part of valid invoice numbers like #10001
        const validNumbers = all_invoice_no.filter((num) => /^#\d+$/.test(num)).map((num) => parseInt(num.replace('#', '')));

        // Extract numeric part of valid receipt numbers like REC0001
        const validRecieptNo = all_reciept_no
          .filter((num) => /^REC\d{3}$/.test(num)) // Matches "REC0001", "REC0023"
          .map((num) => parseInt(num.replace('REC', '')));
        console.log('valid reciept no is', validRecieptNo);

        // Calculate next invoice number
        let nextNumber;
        if (validNumbers.length === 0) {
          nextNumber = `#1001`;
        } else {
          const maxNumber = Math.max(...validNumbers);
          nextNumber = `#${maxNumber + 1}`;
        }

        // Calculate next receipt number
        let nextRecieptNo;
        if (validRecieptNo.length === 0) {
          nextRecieptNo = `REC001`;
        } else {
          const maxReciept = Math.max(...validRecieptNo);
          const next = (maxReciept + 1).toString().padStart(3, '0'); // e.g., 24 → "0025"
          nextRecieptNo = `REC${next}`;
        }

        console.log('Next invoice number:', nextNumber);
        console.log('Next receipt number:', nextRecieptNo);

        // Update form state
        setForm((p) => ({
          ...p,
          invoiceNumber: nextNumber,
          RecieptNo: nextRecieptNo
        }));
      }
    };

    const fetchBankDetails = async () => {
      try {
        const response = await get('bankDetails');
        console.log('response bank details is', response);
        setBankOptions(response.data);
      } catch (err) {
        console.log('err', err);
      }
    };

    fetchInvoiceNo();
    fetchProductCategory();
    fetchClientDetails();
    fetchBankDetails();
  }, []);

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
          </Grid>
          {
            <Card>
              <CardContent>
                <Box sx={{ overflowX: 'auto' }}>
                  <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                    Client Details
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Autocomplete
                        options={clientData || []}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : option?.clientName || '')}
                        value={clientData.find((c) => c._id === form.clientId) || null}
                        onChange={(e, newValue) => {
                          if (newValue) {
                            setForm({
                              ...form,
                              clientId: newValue._id,
                              clientName: newValue.clientName || '',
                              clientGst: newValue.gstNo || '',
                              clientEmail: newValue.officialMailId || '',
                              clientAddress: newValue.officeAddress || '',
                              clientPincode: newValue.pincode || '',
                              clientState: newValue.state || '',
                              clientCity: newValue.city || '',
                              clientCountry: newValue.country || ''
                            });
                          } else {
                            setForm({
                              ...form,
                              clientId: '',
                              clientName: '',
                              clientGst: '',
                              clientEmail: '',
                              clientAddress: '',
                              clientPincode: '',
                              clientState: '',
                              clientCity: '',
                              clientCountry: ''
                            });
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Client Name"
                            required
                            error={!!errors.clientId}
                            helperText={errors.clientId}
                            fullWidth
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Invoice Number"
                        name="invoiceNumber"
                        value={form.invoiceNumber}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={!!errors.invoiceNumber}
                        helperText={errors.invoiceNumber}
                        InputProps={{ readOnly: true }} // already read-only
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Email Id"
                        name="clientEmail"
                        value={form.clientEmail}
                        fullWidth
                        InputProps={{ readOnly: true }} // prevent editing
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
                        />
                      </LocalizationProvider>
                    </Grid>

                    {[
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
                          fullWidth
                          InputProps={{ readOnly: true }} // disable editing
                        />
                      </Grid>
                    ))}

                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <Typography variant="h6" color="primary">
                        Product Details
                      </Typography>
                    </Grid>

                    {form?.products?.map((productItem, index) => (
                      <Grid container key={index} spacing={gridSpacing} margin={0}>
                        <Grid item xs={12} md={2}>
                          <TextField
                            select
                            label="Product"
                            name="product"
                            value={productItem.product}
                            onChange={(e) => handleChange(e, index)}
                            fullWidth
                            required
                            error={!!errors[`product_${index}`]}
                            helperText={errors[`product_${index}`]}
                          >
                            {allProducts.map((p, i) => (
                              <MenuItem key={i} value={p.subProductName}>
                                {p.subProductName}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>

                        <Grid item xs={12} md={3}>
                          <TextField
                            label="Description"
                            name="description"
                            value={productItem.description}
                            onChange={(e) => handleChange(e, index)}
                            fullWidth
                            required
                            error={!!errors[`description_${index}`]}
                            helperText={errors[`description_${index}`]}
                          ></TextField>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <TextField
                            label="Qty"
                            name="quantity"
                            value={productItem.quantity}
                            onChange={(e) => handleChange(e, index)}
                            fullWidth
                            required
                            error={!!errors[`quantity_${index}`]}
                            helperText={errors[`quantity_${index}`]}
                          ></TextField>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <TextField
                            label="Rate"
                            name="rate"
                            value={productItem.rate}
                            onChange={(e) => handleChange(e, index)}
                            fullWidth
                            required
                            error={!!errors[`rate_${index}`]}
                            helperText={errors[`rate_${index}`]}
                          ></TextField>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <TextField
                            label="Amount"
                            name="productAmount"
                            value={productItem.productAmount}
                            onChange={(e) => handleChange(e, index)}
                            fullWidth
                            required
                            error={!!errors[`productAmount_${index}`]}
                            helperText={errors[`productAmount_${index}`]}
                          ></TextField>
                        </Grid>
                        <Grid item xs={12} md={1} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                          <Button
                            size="small"
                            sx={{
                              padding: '3px', // Reduced padding
                              minWidth: '24px', // Set minimum width
                              height: '24px',
                              mr: '10px'
                            }}
                            onClick={() => handleAddProduct(index)}
                          >
                            <IconButton color="inherit">
                              <Add />
                            </IconButton>
                          </Button>
                          {form.products.length > 1 && (
                            <Button
                              size="small"
                              sx={{
                                padding: '3px', // Reduced padding
                                minWidth: '24px', // Set minimum width
                                height: '24px',
                                mr: '10px'
                              }}
                              onClick={() => handleRemoveProduct(index)}
                            >
                              <IconButton color="error">
                                <Delete />
                              </IconButton>
                            </Button>
                          )}
                        </Grid>
                      </Grid>
                    ))}

                    {[
                      { label: 'Subtotal', name: 'subTotal' },
                      { label: 'Discount Type', name: 'discountType' },
                      { label: discountType === 'percentage' ? 'Discount (%)' : 'Discount (₹)', name: 'discount' },
                      { label: 'Total', name: 'totalAmount' },

                      { label: 'Round Up', name: 'roundUp' }
                    ].map((field) => (
                      <Grid item xs={12} md={2.4} key={field.name}>
                        {field.name === 'discountType' ? (
                          <FormControl fullWidth>
                            <InputLabel>Discount Type</InputLabel>
                            <Select
                              name="discountType"
                              value={discountType}
                              onChange={(e) => {
                                setDiscountType(e.target.value);
                                setForm((prev) => ({
                                  ...prev,
                                  discountType: e.target.value,
                                  discount: '' // reset discount field
                                }));
                              }}
                            >
                              <MenuItem value="percentage">Percentage (%)</MenuItem>
                              <MenuItem value="value">Value (₹)</MenuItem>
                            </Select>
                          </FormControl>
                        ) : (
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
                        )}
                      </Grid>
                    ))}
                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <Typography variant="h6" color="primary">
                        Bank Details
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <FormControl fullWidth>
                        <InputLabel>Select Bank</InputLabel>
                        <Select
                          label="Select Bank"
                          onChange={(e) => {
                            const selectedBank = bankOptions.find((bank) => bank._id === e.target.value);
                            if (selectedBank) {
                              setForm((prev) => ({
                                ...prev,
                                selectedBankId: selectedBank._id,
                                nameOnBankAccount: selectedBank.accountName,
                                bankAccountNumber: selectedBank.accountNumber,
                                bankName: selectedBank.bankName,
                                branchName: selectedBank.branchName,
                                ifscCode: selectedBank.IFSCcode,
                                panCardNo: selectedBank.PanNo
                              }));
                            }
                          }}
                        >
                          {bankOptions?.map((bank) => (
                            <MenuItem key={bank._id} value={bank._id}>
                              {bank.accountName} - {bank.bankName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Name on Bank Account"
                        name="nameOnBankAccount"
                        fullWidth
                        value={form.nameOnBankAccount}
                        error={!!errors.nameOnBankAccount}
                        helperText={errors.nameOnBankAccount}
                        placeholder="Bank Holder Name"
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Bank Account Number"
                        name="bankAccountNumber"
                        value={form.bankAccountNumber}
                        InputProps={{ readOnly: true }}
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
                        InputProps={{ readOnly: true }}
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
                        InputProps={{ readOnly: true }}
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
                        InputProps={{ readOnly: true }}
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
                        InputProps={{ readOnly: true }}
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default NonGst;
