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
  FormControl,
  InputLabel,
  Select,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { Add, ArrowBack, Delete } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { get, put } from '../../../api/api';
import { gridSpacing } from 'config.js';

const GstEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState(initialFormState());
  const [errors, setErrors] = useState({});
  const [discountType, setDiscountType] = useState('');
  const [selectedValue, setSelectedValue] = useState('igst');
  const [clientData, setClientData] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState('');

  function initialFormState() {
    return {
      clientId: '',
      clientName: '',
      gstType: '',
      invoiceNumber: '',
      date: null,
      cgstIgstAmount: '',
      cgstIgstPercentage: '9',
      igstAmount: '',
      igstPercent: '18',
      clientEmail: '',
      clientGst: '',
      clientAddress: '',
      clientPincode: '',
      clientState: '',
      clientCity: '',
      clientCountry: '',
      grandTotal: '',
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
      sgstAmount: '',
      sgstPercentage: '9',
      discount: '',
      discountAmount: '',
      discountType: '',
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

  const handleDateChange = (value) => {
    setForm((prev) => ({ ...prev, date: value }));
  };

  const calculateSubtotal = (products) => products.reduce((acc, p) => acc + (parseFloat(p.productAmount) || 0), 0);

  // 4️⃣ called ONLY when tax % changes
  // your tax logic (as cleaned before)
  const applyTaxAndRound = (draft, taxType) => {
    const base = parseFloat(draft.totalAmount) || 0;

    if (taxType === 'igst') {
      const igst = (base * (parseFloat(draft.igstPercent) || 0)) / 100;
      draft.igstAmount = igst.toFixed(2);
      draft.cgstIgstAmount = '';
      draft.sgstAmount = '';

      draft.grandTotal = (base + igst).toFixed(2);
    }

    if (taxType === 'sgst_cgst') {
      const cgst = (base * (parseFloat(draft.cgstIgstPercentage) || 0)) / 100;
      const sgst = (base * (parseFloat(draft.sgstPercentage) || 0)) / 100;

      draft.cgstIgstAmount = cgst.toFixed(2);
      draft.sgstAmount = sgst.toFixed(2);
      draft.igstAmount = '';

      draft.grandTotal = (base + cgst + sgst).toFixed(2);
    }

    draft.roundUp = Math.round(parseFloat(draft.grandTotal) || 0);
  };

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (name === 'clientName') {
      const selectedClient = clientData.find((client) => client._id === value);
      if (selectedClient) {
        setForm((prev) => ({
          ...prev,
          clientName: selectedClient.clientName,
          clientGst: selectedClient.gstNo,
          clientEmail: selectedClient.officialMailId,
          clientAddress: selectedClient.officeAddress,
          clientPincode: selectedClient.pincode,
          clientState: selectedClient.state,
          clientCity: selectedClient.city,
          clientCountry: selectedClient.country
        }));
      }
    }

    // *** 2. PRODUCT-LEVEL fields ***
    if (index !== null) {
      setForm((prev) => {
        // Ensure `products` array exists and the index is valid
        const draft = structuredClone(prev);
        if (!draft.products || !draft.products[index]) {
          console.error(`Invalid product index: ${index}`);
          return prev; // Return previous state if invalid
        }

        draft.products[index][name] = value;

        // Auto-calculate `productAmount` if `quantity` or `rate` changes
        if (name === 'quantity' || name === 'rate') {
          const quantity = parseFloat(draft.products[index].quantity) || 0;
          const rate = parseFloat(draft.products[index].rate) || 0;
          draft.products[index].productAmount = quantity && rate ? (quantity * rate).toFixed(2) : '';
        }

        // Update `subTotal`
        draft.subTotal = calculateSubtotal(draft.products).toFixed(2);
        return draft;
      });
      return;
    }

    // *** 3. TOP-LEVEL fields ***
    setForm((prev) => {
      const draft = { ...prev, [name]: value };

      // a) Discount-related → update `totalAmount`
      if (name === 'discount' || name === 'discountType') {
        applyDiscountAndTotal(draft); // <--- recompute subtotal, discount, total
        applyTaxAndRound(draft, selectedValue); // <--- then recompute GST + roundUp
      }

      // b) Tax-related → update `roundUp`
      if (name === 'igstPercent' || name === 'cgstIgstPercentage' || name === 'sgstPercentage') {
        if (!draft.totalAmount) applyDiscountAndTotal(draft);

        applyTaxAndRound(draft, selectedValue); // ✅ pass selectedValue
      }

      return draft;
    });
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
    draft.roundUp = (Math.ceil(total) - total).toFixed(2);
  };

  const handleAddProduct = (index) => {
    const newProduct = {
      product: '',
      description: '',
      quantity: '',
      rate: '',
      gstPercentage: '',
      productAmount: ''
    };

    const updatedProducts = [...form.products];
    updatedProducts.splice(index + 1, 0, newProduct);

    setForm((prev) => {
      const draft = { ...prev, products: updatedProducts };
      draft.subTotal = calculateSubtotal(updatedProducts).toFixed(2);

      applyDiscountAndTotal(draft); // keep discount + total
      applyTaxAndRound(draft, selectedValue); // keep GST + roundUp
      return draft;
    });
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = [...form.products];
    updatedProducts.splice(index, 1);

    setForm((prev) => {
      const draft = { ...prev, products: updatedProducts };
      draft.subTotal = calculateSubtotal(updatedProducts).toFixed(2);

      applyDiscountAndTotal(draft); // keep discount + total
      applyTaxAndRound(draft, selectedValue); // keep GST + roundUp
      return draft;
    });
  };

  const handleTaxTypeChange = (e) => {
    const val = e.target.value; // "igst" or "sgst_cgst"
    setSelectedValue(val);
    setForm((prev) => {
      const draft = { ...prev };
      applyTaxAndRound(draft, val); // ⬅️ Recompute with the new tax type
      return draft;
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

    if (!form.clientName) {
      newErrors.clientName = 'Client Name is Required';
    }
    if (!form.date) {
      newErrors.date = 'Date is Required';
    }
    if (!form.clientGst) {
      newErrors.clientGst = 'GST is Required';
    } else if (!/^[0-9A-Z]{15}$/.test(form.clientGst)) {
      newErrors.clientGst = 'Invalid GST Number';
    }
    if (!form.clientEmail) {
      newErrors.clientEmail = 'Email is Required';
    } else if (!form.clientEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.clientEmail = 'Invalid Email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    const response = await put(`invoiceRegistration/${id}`, form);
    console.log('response updated is', response);
    toast.success('GST Invoice updated successfully!');
    navigate('/invoice-management');
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await get(`invoiceRegistration/${id}`);
      if (response.status === true) {
        console.log('response is data ', response);
        const data = response.invoice;
        setForm((prev) => {
          const draft = {
            ...prev,
            ...data,
            selectedBankId: response.invoice.selectedBankId._id,
            nameOnBankAccount: response.invoice.selectedBankId.accountName,
            bankAccountNumber: response.invoice.selectedBankId.accountNumber,
            bankName: response.invoice.selectedBankId.bankName,
            branchName: response.invoice.selectedBankId.branchName,
            ifscCode: response.invoice.selectedBankId.IFSCcode,
            panCardNo: response.invoice.selectedBankId.PanNo,
            igstPercent: data.igstPercent || 18
          };
          setDiscountType(data.discountType);

          // Make sure totalAmount is set first
          applyDiscountAndTotal(draft);
          // Then calculate taxes & grandTotal

          +applyTaxAndRound(draft, selectedValue); // ✅

          return draft;
        });
        setSelectedBankId(response.invoice.selectedBankId._id || '');
      }
    };
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

    const fetchBankDetails = async () => {
      try {
        const response = await get('bankDetails');
        console.log('response bank details is', response);
        setBankOptions(response.data);
      } catch (err) {
        console.log('err', err);
      }
    };

    fetchBankDetails();

    fetchProductCategory();
    fetchClientDetails();

    fetchData();
  }, [id]);

  useEffect(() => {
    setForm((prev) => {
      const draft = { ...prev };
      if (parseFloat(draft.totalAmount) > 0) {
        applyTaxAndRound(draft, selectedValue); // <-- always recalc when IGST ↔ SGST
      }
      return draft;
    });
  }, [selectedValue, form.totalAmount, form.igstPercent, form.cgstIgstPercentage, form.sgstPercentage]);

  return (
    <>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5">GST (Update)</Typography>
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
                    <TextField
                      select
                      label="Client Name"
                      name="clientId"
                      value={form.clientId}
                      onChange={(e) => {
                        const selectedClient = clientData.find((c) => c._id === e.target.value);
                        setForm((prev) => ({
                          ...prev,
                          clientId: e.target.value,
                          clientName: selectedClient?.clientName || '',
                          clientGst: selectedClient?.gstNo || '',
                          clientEmail: selectedClient?.officialMailId || '',
                          clientAddress: selectedClient?.officeAddress || '',
                          clientPincode: selectedClient?.pincode || '',
                          clientState: selectedClient?.state || '',
                          clientCity: selectedClient?.city || '',
                          clientCountry: selectedClient?.country || ''
                        }));
                      }}
                      fullWidth
                      required
                      error={!!errors.clientId}
                      helperText={errors.clientId}
                    >
                      {clientData?.map((client, index) => (
                        <MenuItem key={index} value={client._id}>
                          {client.clientName}
                        </MenuItem>
                      ))}
                    </TextField>
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

                  {/* Other Client Details */}
                  {[
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

                  <Grid sx={{ width: '100%' }}>
                    {/* Product Details */}
                    <Grid item xs={12} sx={{ mt: 2, ml: 2 }}>
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
                  </Grid>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    {[
                      { label: 'Subtotal', name: 'subTotal' },
                      { label: 'Discount Type', name: 'discountType' },
                      { label: discountType === 'percentage' ? 'Discount (%)' : 'Discount (₹)', name: 'discount' },
                      { label: 'Total', name: 'totalAmount' }
                      // { label: 'Round Up', name: 'roundUp' }
                    ].map((field) => (
                      <Grid item sx={{ width: '100%', ml: 2 }} md={2.4} key={field.name}>
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
                                  discount: '' // Reset discount field
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
                  </Grid>
                  <Grid container spacing={2} sx={{ mb: 2, ml: 2 }}>
                    {/* Tax Details */}
                    <Grid item xs={12} md={2}>
                      <RadioGroup
                        row
                        value={selectedValue}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setSelectedValue(newValue);

                          setForm((prev) => {
                            const draft = { ...prev };

                            // 🔑 update gstType based on radio
                            draft.gstType = newValue === 'igst' ? 'igst' : 'gst';

                            applyTaxAndRound(draft, newValue);
                            return draft;
                          });
                        }}
                        name="taxType"
                      >
                        <FormControlLabel value="igst" control={<Radio />} label="IGST" />
                        <FormControlLabel value="sgst_cgst" control={<Radio />} label="SGST/CGST" />
                      </RadioGroup>
                    </Grid>
                    {selectedValue === 'igst' && (
                      <>
                        <Grid item xs={12} md={2}>
                          <TextField
                            label="IGST (%)"
                            name="igstPercent"
                            value={form.igstPercent}
                            onChange={handleChange}
                            fullWidth
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={2.6}>
                          <TextField
                            label="IGST Amount"
                            name="igstAmount"
                            value={form.igstAmount}
                            onChange={handleChange}
                            fullWidth
                            required
                          />
                        </Grid>
                      </>
                    )}
                    {selectedValue === 'sgst_cgst' && (
                      <>
                        <Grid item xs={12} md={2}>
                          <TextField
                            label="CGST (%)"
                            name="cgstIgstPercentage"
                            value={form.cgstIgstPercentage}
                            onChange={handleChange}
                            fullWidth
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={2.6}>
                          <TextField
                            label="CGST Amount"
                            name="cgstIgstAmount"
                            value={form.cgstIgstAmount}
                            onChange={handleChange}
                            fullWidth
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <TextField
                            label="SGST (%)"
                            name="sgstPercentage"
                            value={form.sgstPercentage}
                            onChange={handleChange}
                            fullWidth
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <TextField
                            label="SGST Amount"
                            name="sgstAmount"
                            value={form.sgstAmount}
                            onChange={handleChange}
                            fullWidth
                            required
                          />
                        </Grid>
                      </>
                    )}
                  </Grid>
                  <Grid container spacing={2} sx={{ mb: 2, ml: 2 }}>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Grand Total"
                        name="grandTotal"
                        value={form.grandTotal}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Round Off"
                        name="roundUp"
                        value={form.roundUp}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                  </Grid>

                  {/* Bank Details */}
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

export default GstEditPage;
