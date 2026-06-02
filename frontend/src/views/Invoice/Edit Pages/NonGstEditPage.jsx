import React, { useState, useEffect } from 'react';
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
  InputLabel,
  Select,
  FormControl,
  Autocomplete
} from '@mui/material';
import { Add, ArrowBack, Delete } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { get, put } from 'api/api';
import { gridSpacing } from 'config.js';

function initialFormState() {
  return {
    clientId: '',
    clientName: '',
    gstType: '',
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
        productAmount: ''
      }
    ],
    subTotal: '',
    discountType: 'percentage',
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

const NonGstEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState(initialFormState());
  const [errors, setErrors] = useState({});
  const [discountType, setDiscountType] = useState('percentage');
  const [clientData, setClientData] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState('');

  const handleDateChange = (value) => {
    setForm((prev) => ({ ...prev, date: value }));
  };

  const calculateSubtotal = (products) => products.reduce((acc, p) => acc + (parseFloat(p.productAmount) || 0), 0);

  const applyDiscountAndTotal = (draft) => {
    const subTotal = parseFloat(draft.subTotal) || 0;
    const discount = parseFloat(draft.discount) || 0;

    if (draft.discountType === 'percentage') {
      draft.discountAmount = ((subTotal * discount) / 100).toFixed(2);
    } else {
      draft.discountAmount = discount.toFixed(2);
    }

    draft.totalAmount = (subTotal - parseFloat(draft.discountAmount)).toFixed(2);
    const total = parseFloat(draft.totalAmount) || 0;
    draft.roundUp = (Math.ceil(total) - total).toFixed(2);
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
      setForm((prevForm) => ({
        ...prevForm,
        clientCity: '',
        clientState: '',
        clientCountry: ''
      }));
    }
  };

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;

    // Handle client selection
    if (name === 'clientId') {
      const selectedClient = clientData.find((client) => client._id === value);
      if (selectedClient) {
        setForm((prev) => ({
          ...prev,
          clientId: value,
          clientName: selectedClient.clientName,
          clientEmail: selectedClient.officialMailId,
          clientAddress: selectedClient.officeAddress,
          clientPincode: selectedClient.pincode,
          clientState: selectedClient.state,
          clientCity: selectedClient.city,
          clientCountry: selectedClient.country
        }));
      }
      return;
    }

    // Handle product fields
    if (index !== null) {
      setForm((prev) => {
        const draft = structuredClone(prev);
        if (!draft.products || !draft.products[index]) {
          return prev;
        }
        draft.products[index][name] = value;
        if (name === 'quantity' || name === 'rate') {
          const quantity = parseFloat(draft.products[index].quantity) || 0;
          const rate = parseFloat(draft.products[index].rate) || 0;
          draft.products[index].productAmount = quantity && rate ? (quantity * rate).toFixed(2) : '';
        }
        draft.subTotal = calculateSubtotal(draft.products).toFixed(2);
        applyDiscountAndTotal(draft);
        return draft;
      });
      return;
    }

    // Top-level fields
    setForm((prev) => {
      const draft = { ...prev, [name]: value };
      if (name === 'discount' || name === 'discountType') {
        applyDiscountAndTotal(draft);
      }
      if (name === 'clientPincode' && value.length === 6) {
        fetchPincodeDetails(value);
      }
      return draft;
    });
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
    const updatedSubTotal = calculateSubtotal(updatedProducts);
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
    const updatedSubTotal = calculateSubtotal(updatedProducts);
    setForm({
      ...form,
      products: updatedProducts,
      subTotal: updatedProducts.length ? updatedSubTotal.toFixed(2) : '',
      discount: '',
      totalAmount: '',
      roundUp: ''
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.totalAmount) {
      newErrors.totalAmount = 'Total Amount is Required';
    } else if (!/^\d+(\.\d{1,2})?$/.test(form.totalAmount)) {
      newErrors.totalAmount = 'Please Enter a Proper Amount';
    } else if (parseFloat(form.totalAmount) <= 0) {
      newErrors.totalAmount = 'Invalid Amount';
    }
    if (!form.clientName) newErrors.clientName = 'Client Name is Required';
    if (!form.date) newErrors.date = 'Date is Required';
    if (!form.clientEmail) {
      newErrors.clientEmail = 'Email is Required';
    } else if (!form.clientEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.clientEmail = 'Invalid Email';
    }
    if (!form.clientAddress) newErrors.clientAddress = 'Address is Required';
    if (!form.clientPincode) newErrors.clientPincode = 'Pincode is Required';
    if (!form.subTotal) newErrors.subTotal = 'Subtotal is Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const response = await put(`invoiceRegistration/${id}`, form);
    if (response.status === true) {
      toast.success('Non-GST Invoice updated successfully!');
      navigate('/invoice-management');
    } else {
      toast.error('Update failed!');
    }
  };

  useEffect(() => {
    const fetchNonGstData = async () => {
      const response = await get(`invoiceRegistration/${id}`);
      if (response.status === true) {
        setDiscountType(response.invoice.discountType || 'percentage');
        setForm({
          ...initialFormState(),
          ...response.invoice,
          selectedBankId: response.invoice.selectedBankId?._id || '',
          nameOnBankAccount: response.invoice.selectedBankId?.accountName || '',
          bankAccountNumber: response.invoice.selectedBankId?.accountNumber || '',
          bankName: response.invoice.selectedBankId?.bankName || '',
          branchName: response.invoice.selectedBankId?.branchName || '',
          ifscCode: response.invoice.selectedBankId?.IFSCcode || '',
          panCardNo: response.invoice.selectedBankId?.PanNo || ''
        });
        setSelectedBankId(response.invoice.selectedBankId?._id || '');
      }
    };
    const fetchClientDetails = async () => {
      const response = await get('admin-clientRegistration');
      if (response.status === 'true') {
        const filteredData = response.data.filter((client) => client.createdBy === localStorage.getItem('Id'));
        setClientData(filteredData);
      }
    };
    const fetchProductCategory = async () => {
      const response = await get('SubProductCategory');
      if (response.status === 'true') {
        setAllProducts(response.data);
      }
    };
    const fetchBankDetails = async () => {
      try {
        const response = await get('bankDetails');
        setBankOptions(response.data);
      } catch (err) {}
    };

    fetchBankDetails();
    fetchProductCategory();
    fetchClientDetails();
    fetchNonGstData();
  }, [id]);

  return (
    <>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5">Non-GST (Update)</Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/invoice-management')}>
              <ArrowBack />
            </Button>
          </Grid>
          <Card>
            <CardContent>
              <Box sx={{ overflowX: 'auto' }}>
                <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                  Client Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Autocomplete
                      options={clientData || []}
                      getOptionLabel={(option) => option.clientName || ''}
                      value={clientData.find((c) => c._id === form.clientId) || null}
                      onChange={(e, newValue) => {
                        if (newValue) {
                          setForm((prev) => ({
                            ...prev,
                            clientId: newValue._id,
                            clientName: newValue.clientName || '',
                            clientGst: newValue.gstNo || '',
                            clientEmail: newValue.officialMailId || '',
                            clientAddress: newValue.officeAddress || '',
                            clientPincode: newValue.pincode || '',
                            clientState: newValue.state || '',
                            clientCity: newValue.city || '',
                            clientCountry: newValue.country || ''
                          }));
                        } else {
                          setForm((prev) => ({
                            ...prev,
                            clientId: '',
                            clientName: '',
                            clientGst: '',
                            clientEmail: '',
                            clientAddress: '',
                            clientPincode: '',
                            clientState: '',
                            clientCity: '',
                            clientCountry: ''
                          }));
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
                        value={form.date ? new Date(form.date) : null}
                        onChange={handleDateChange}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      label="Email Id"
                      name="clientEmail"
                      value={form.clientEmail}
                      onChange={handleChange}
                      fullWidth
                      required
                      error={!!errors.clientEmail}
                      helperText={errors.clientEmail}
                    />
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
                  {form.products.map((productItem, index) => (
                    <Box key={index} margin={2} borderRadius={2} sx={{ backgroundColor: '#E1F3F3', padding: 1 }}>
                      <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} md={2}>
                          <TextField
                            select
                            label="Product"
                            name="product"
                            value={productItem.product}
                            onChange={(e) => handleChange(e, index)}
                            fullWidth
                            required
                          >
                            {allProducts.map((p) => (
                              <MenuItem key={p.productName} value={p.subProductName}>
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
                          />
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <TextField
                            label="Qty"
                            name="quantity"
                            value={productItem.quantity}
                            onChange={(e) => handleChange(e, index)}
                            fullWidth
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <TextField
                            label="Rate"
                            name="rate"
                            value={productItem.rate}
                            onChange={(e) => handleChange(e, index)}
                            fullWidth
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <TextField
                            label="Amount"
                            name="productAmount"
                            value={productItem.productAmount}
                            onChange={(e) => handleChange(e, index)}
                            fullWidth
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={1} display="flex" justifyContent="center" alignItems="center">
                          <IconButton color="inherit" onClick={() => handleAddProduct(index)}>
                            <Add />
                          </IconButton>
                          {form.products.length > 1 && (
                            <IconButton color="error" onClick={() => handleRemoveProduct(index)}>
                              <Delete />
                            </IconButton>
                          )}
                        </Grid>
                      </Grid>
                    </Box>
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
                              setForm((prev) => {
                                const updatedForm = {
                                  ...prev,
                                  discountType: e.target.value,
                                  discount: ''
                                };
                                applyDiscountAndTotal(updatedForm);
                                return updatedForm;
                              });
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
                        value={selectedBankId}
                        label="Select Bank"
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          setSelectedBankId(selectedId);
                          const selectedBank = bankOptions.find((bank) => bank._id === selectedId);
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
                            {bank.bankName} - {bank.accountName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  {[
                    { label: 'Name on Bank Account', name: 'nameOnBankAccount' },
                    { label: 'Bank Account Number', name: 'bankAccountNumber' },
                    { label: 'Bank Name', name: 'bankName' },
                    { label: 'Branch Name', name: 'branchName' },
                    { label: 'IFSC Code', name: 'ifscCode' },
                    { label: 'PAN Card Number', name: 'panCardNo' }
                  ].map((field) => (
                    <Grid item xs={12} sm={4} key={field.name}>
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
                  <Grid item xs={12}>
                    <Button variant="contained" onClick={handleSubmit}>
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
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

export default NonGstEditPage;
