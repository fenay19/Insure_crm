import React, { useState, useEffect, useCallback } from 'react';
import { Grid, TextField, Button, Typography, Card, IconButton, CardContent, Divider, Box, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { get, put } from '../../../api/api';
import { Field } from 'formik';
import Prefix from '../Prefix/Prefix';

const EditCustomerGroup = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState());
  const [positionData, setPositionData] = useState([]);
  const [errors, setErrors] = useState({});
  const [prefixData, setPrefixData] = useState([]);
  const [clients, setClients] = useState([]);

  function initialState() {
    return {
      customerGroupId: '',
      customerGroupName: '',
      subCustomerGroupName: '',
      prefix: '',
      customerName: '',
      incarporatoionDate: '',
      email: '',
      mobile: '',
      panNo: '',
      adhaarNo: '',
      DLNo: '',
      gstNo: '',
      address: '',
      pincode: '',
      city: '',
      state: '',
      createdBy: localStorage.getItem('Id') || '',
      companyId: localStorage.getItem('companyId') || '',
      contactPerson: [
        {
          name: '',
          department: '',
          address: '',
          phone: '',
          email: ''
        }
      ]
    };
  }

  // Fetch dropdown and lead details
  const fetchDropdownData = async () => {
    try {
      const [prefixData, positionData] = await Promise.all([get('prefix'), get('position')]);
      setPrefixData(prefixData.allPrefix || []);
      setPositionData(positionData.data || []);
      // console.log('Prefix List data', incotermsData);
    } catch (err) {
      console.error('Dropdown load error:', err);
    }
  };

  const fetchCustomerGroupById = async () => {
    try {
      const res = await get(`customerGroup/${id}/`);
      if (res.success) {
        const customerData = res.data;
        console.log('Pol ', customerData);
        setForm((prev) => ({
          ...prev,
          customerData,
          customerGroupId: customerData?.customerGroupId || '',
          email: customerData?.email || '',
          mobile: customerData?.mobile || '',
          gstNo: customerData?.gstNo || '',
          panNo: customerData?.panNo || '',
          adhaarNo: customerData?.adhaarNo || '',
          DLNo: customerData?.DLNo || '',
          address: customerData?.address || '',
          pincode: customerData?.pincode || '',
          city: customerData?.city || '',
          state: customerData?.state || '',
          contactPerson: customerData?.contactPerson || '',
          customerGroupName: customerData?.customerGroupName || '',
          subCustomerGroupName: customerData?.subCustomerGroupName || '',
          customerName: customerData?.customerName || false,
          incarporatoionDate: customerData?.incarporatoionDate?.split('T')[0] || '',
          prefix: customerData?.prefix?._id ? String(customerData?.prefix._id) : customerData?.prefix ? String(customerData?.prefix) : '',
          position: customerData?.position?._id
            ? String(customerData?.position._id)
            : customerData?.position
              ? String(customerData?.position)
              : ''
        }));
      }
    } catch (err) {
      console.error('Failed to fetch lead details:', err);
    }
  };

  useEffect(() => {
    fetchCustomerGroupById();
    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    // Live validation
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      if (name === 'mobile') {
        if (!/^\d{10}$/.test(value)) {
          newErrors.mobile = 'Enter valid 10-digit number';
        } else {
          delete newErrors.mobile;
        }
      }

      if (name === 'email') {
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
          newErrors.email = 'Invalid email';
        } else {
          delete newErrors.email;
        }
      }

      if (name === 'customerGroupName') {
        if (!value.trim()) {
          newErrors.customerGroupName = 'Group Name is required';
        } else {
          delete newErrors.customerGroupName;
        }
      }

      return newErrors;
    });
  };

  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...form.contactPerson];
    updatedContacts[index][field] = value;
    setForm({ ...form, contactPerson: updatedContacts });
  };

  const validateForm = () => {
    const newErrors = {};

    // Only required fields
    if (!form.customerGroupName) newErrors.customerGroupName = 'Group Name is required';

    if (!form.mobile?.match(/^\d{10}$/)) newErrors.mobile = 'Enter valid 10-digit number';

    if (!form.email?.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) newErrors.email = 'Invalid email';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors');
      return;
    }
    try {
      const role = localStorage.getItem('loginRole');
      console.log(role, form);
      if (role === 'admin') {
        console.log('await called ');
        const res = await put(`customerGroup/${id}`, form);
        if (res.data) {
          toast.success('Customer updated');
          setForm(initialState());
          // setLogoPreview('');
          setErrors({});
        } else {
          toast.error(res.message || 'Failed to submit');
        }
      } else {
        toast.warning('You are notAuthorised');
      }
      navigate('/master/customer-group');
    } catch (e) {
      console.error(e);
      toast.error('Submission error');
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Grid item>
              <Typography variant="h6">Edit Customer Group</Typography>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
                <ArrowBackIcon /> Back
              </Button>
            </Grid>
          </Grid>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={2}>
              <TextField
                label="Customer ID"
                name="customerGroupId"
                value={form.customerGroupId}
                onChange={handleChange}
                error={!!errors.customerGroupId}
                helperText={errors.customerGroupId}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                label="Customer Group Name"
                name="customerGroupName"
                value={form.customerGroupName}
                onChange={handleChange}
                error={!!errors.customerGroupName}
                helperText={errors.customerGroupName}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                label="SUB Customer Name"
                name="subCustomerGroupName"
                value={form.subCustomerGroupName}
                onChange={handleChange}
                error={!!errors.subCustomerGroupName}
                helperText={errors.subCustomerGroupName}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                select
                label="prefix"
                name="prefix"
                value={form.prefix}
                onChange={handleChange}
                error={!!errors.prefix}
                helperText={errors.prefix}
                fullWidth
              >
                {prefixData.map((type) => (
                  <MenuItem key={type._id} value={type._id}>
                    {type.prefix}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                label="Customer Name"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                error={!!errors.customerName}
                helperText={errors.customerName}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                type="date"
                label="Date of Encarporation"
                name="incarporatoionDate"
                value={form.incarporatoionDate}
                onChange={handleChange}
                error={!!errors.incarporatoionDate}
                helperText={errors.incarporatoionDate}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            {[
              { label: 'Email', name: 'email' },
              { label: 'Mobile', name: 'mobile', maxLength: 10 },
              { label: 'PAN No.', name: 'panNo', maxLength: 11 },
              { label: 'Adhaar.', name: 'adhaarNo', maxLength: 12 },
              { label: 'Driving License No', name: 'DLNo' },
              { label: 'GST No.', name: 'gstNo', maxLength: 15 },
              { label: 'Address.', name: 'address' },
              { label: 'Pincode', name: 'pincode', maxLength: 6 },
              { label: 'City', name: 'city' },
              { label: 'State', name: 'state' }
            ].map((field) => (
              <Grid item xs={12} sm={3} key={field.name}>
                <TextField
                  name={field.name}
                  label={field.label}
                  value={form[field.name]}
                  onChange={handleChange}
                  required={field.required || false}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]}
                  fullWidth
                  inputProps={{
                    maxLength: field.maxLength
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h5" gutterBottom>
        Contact Person
      </Typography>
      <Card>
        <CardContent>
          {form.contactPerson.map((person, index) => (
            <Grid container spacing={2} key={index} mb={2}>
              {['name', 'address', 'phone', 'email'].map((field) => (
                <Grid item xs={12} sm={2} key={field}>
                  <TextField
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={person[field]}
                    onChange={(e) => handleContactChange(index, field, e.target.value)}
                    error={!!errors[`contactPerson.${index}.${field}`]}
                    helperText={errors[`contactPerson.${index}.${field}`]}
                    fullWidth
                  />
                </Grid>
              ))}
              <Grid item xs={12} sm={3}>
                <TextField
                  select
                  label="Designation"
                  name="department"
                  value={person.position}
                  onChange={(e) => handleContactChange(index, 'position', e.target.value)}
                  error={!!errors[`contactPerson.${index}.position`]}
                  helperText={errors[`contactPerson.${index}.position`]}
                  fullWidth
                >
                  {positionData?.map((value) => (
                    <MenuItem key={value._id} value={value._id}>
                      {value.position}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          ))}
        </CardContent>
      </Card>
      <Grid item xs={12} sm={3}>
        <Box mt={3}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Update
          </Button>
          <Button variant="contained" color="warning" sx={{ ml: 2 }} onClick={() => navigate('/master/customer-group')}>
            Cancel
          </Button>
        </Box>
      </Grid>
    </>
  );
};

export default EditCustomerGroup;
