import React, { useState, useEffect, useCallback } from 'react';
import { Grid, TextField, Button, Typography, Card, IconButton, CardContent, Divider, Box, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { get, post } from '../../api/api';

const AddClient = () => {
  const navigate = useNavigate();
  const [logoPreview, setLogoPreview] = useState('');
  const [form, setForm] = useState(initialState());
  const [errors, setErrors] = useState({});
  const [clients, setClients] = useState([]);
  const [positionData, setPositionData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [isRole, setRole] = useState('');
  function initialState() {
    return {
      clientName: '',
      officialPhoneNo: '',
      altPhoneNo: '',
      officialMailId: '',
      altMailId: '',
      emergencyContactPerson: '',
      emergencyContactNo: '',
      website: '',
      gstNo: '',
      panNo: '',
      logo: null,
      officeAddress: '',
      pincode: '',
      city: '',
      state: '',
      country: '',
      clientType: '',
      startDate: '',
      endDate: '',
      createdBy: localStorage.getItem('Id') || '',
      companyId: localStorage.getItem('companyId') || '',
      contactPerson: [
        {
          name: '',
          department: '',
          position: '',
          email: '',
          phone: ''
        }
      ]
    };
  }

  let pincodeTimeout = null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      if (name === 'logo') {
        setForm({ ...form, logo: files[0] });
        setLogoPreview(URL.createObjectURL(files[0]));
      }
      return;
    }

    if (name === 'pincode') {
      clearTimeout(pincodeTimeout);
      setForm({ ...form, [name]: value });

      if (value.match(/^\d{6}$/)) {
        pincodeTimeout = setTimeout(() => {
          fetchPincodeDetails(value);
        }, 500);
      }
      return;
    }

    if (name === 'startDate') {
      let newForm = { ...form, startDate: value };

      if (value) {
        const start = new Date(value);
        const end = new Date(start);
        end.setFullYear(start.getFullYear() + 1); // add 1 year
        newForm.endDate = end.toISOString().split('T')[0]; // yyyy-mm-dd format
      }

      setForm(newForm);
      return;
    }

    if (name.includes('.')) {
      const [key, index, field] = name.split('.');
      const updatedContacts = [...form.contactPerson];
      updatedContacts[parseInt(index)][field] = value;
      setForm({ ...form, contactPerson: updatedContacts });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...form.contactPerson];
    updatedContacts[index][field] = value;
    setForm({ ...form, contactPerson: updatedContacts });
  };

  const addContact = () => {
    setForm((prevForm) => ({
      ...prevForm,
      contactPerson: [
        ...prevForm.contactPerson,
        {
          name: '',
          department: '',
          position: '',
          email: '',
          phone: ''
        }
      ]
    }));
  };

  const removeContact = (index) => {
    const updatedContacts = [...form.contactPerson];
    updatedContacts.splice(index, 1);
    setForm({ ...form, contactPerson: updatedContacts });

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      Object.keys(updatedErrors).forEach((key) => {
        if (key.startsWith(`contactPerson.${index}`)) {
          delete updatedErrors[key];
        }
      });
      return updatedErrors;
    });
  };

  const handleDeleteLogo = () => {
    setForm({ ...form, logo: null });
    setLogoPreview('');
  };

  const validateForm = () => {
    const newErrors = {};

    // Only required fields
    if (!form.clientName) newErrors.clientName = 'Client Name is required';

    if (!form.officialPhoneNo?.match(/^\d{10}$/)) newErrors.officialPhoneNo = 'Enter valid 10-digit number';

    if (!form.officialMailId?.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) newErrors.officialMailId = 'Invalid email';

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
      if (role === 'admin') {
        const res = await post('admin-clientRegistration', form);
        if (res.status === true) {
          toast.success('Client registered');
          setForm(initialState());
          setLogoPreview('');
          setErrors({});
        } else {
          toast.error(res.message || 'Failed to submit');
        }
      } else if (role === 'super-admin') {
        const res = await post('clientRegistration', form);
        if (res.status === true) {
          toast.success('Client registered');
          setForm(initialState());
          setLogoPreview('');
          setErrors({});
        } else {
          toast.error(res.message || 'Failed to submit');
        }
      }
      navigate('/client');
    } catch (e) {
      console.error(e);
      toast.error('Submission error');
    }
  };

  const fetchPincodeDetails = async (pincode) => {
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();

      if (data[0].Status === 'Success') {
        const { District, State, Country } = data[0].PostOffice[0];
        setForm((prevForm) => ({
          ...prevForm,
          city: District || '',
          state: State || '',
          country: Country || ''
        }));
      } else {
        toast.error('Invalid pincode');
        setForm((prevForm) => ({
          ...prevForm,
          city: '',
          state: '',
          country: ''
        }));
      }
    } catch (error) {
      toast.error('Error fetching pincode details');
      console.error('Error fetching pincode details:', error);
      setForm((prevForm) => ({
        ...prevForm,
        city: '',
        state: '',
        country: ''
      }));
    }
  };

  const fetchClientTypes = async () => {
    const res = await get('typeOfClient');
    if (res.status === 'true') {
      setClients(res.data.map((item) => ({ id: item._id, typeOfClient: item.typeOfClient })));
    }
  };

  // Fetch all positions from backend
  const fetchPositions = async () => {
    try {
      const response = await get('position');
      setPositionData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch all departments from backend
  const fetchDepartments = async () => {
    try {
      const response = await get('department');
      console.log('Department data:', response.data);
      setDepartmentData(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    console.log('🍪 Cookies:', document.cookie);
  }, []);

  useEffect(() => {
    const role = localStorage.getItem('loginRole');
    setRole(role);
    fetchClientTypes();
    fetchPositions();
    fetchDepartments();
  }, []);

  return (
    <>
      <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary">
          Client
        </Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5">Client Registration</Typography>
            <Button variant="contained" onClick={() => navigate('/client')}>
              <ArrowBack />
            </Button>
          </Grid>

          <Card>
            <CardContent>
              <Grid container spacing={2}>
                {[
                  { label: 'Client Name', name: 'clientName', required: true },
                  { label: 'Official Phone No.', name: 'officialPhoneNo', required: true },
                  { label: 'Alternate Phone No.', name: 'altPhoneNo' },
                  { label: 'Official Mail ID', name: 'officialMailId', required: true },
                  { label: 'Alternate Mail ID', name: 'altMailId' },
                  { label: 'Emergency Contact Person', name: 'emergencyContactPerson' },
                  { label: 'Emergency Contact No.', name: 'emergencyContactNo' },
                  { label: 'Website', name: 'website' },
                  { label: 'GST No.', name: 'gstNo' },
                  { label: 'PAN No.', name: 'panNo' },
                  { label: 'Pincode', name: 'pincode' },
                  { label: 'City', name: 'city' },
                  { label: 'State', name: 'state' },
                  { label: 'Country', name: 'country' }
                ].map((field) => (
                  <Grid item xs={12} sm={3} key={field.name}>
                    <TextField
                      label={field.label}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      error={!!errors[field.name]}
                      helperText={errors[field.name]}
                      fullWidth
                      required={field.required || false} // 👈 only show star for required fields
                    />
                  </Grid>
                ))}

                {isRole === 'super-admin' && (
                  <Grid item xs={12} sm={3}>
                    <TextField
                      select
                      label="Client Type"
                      name="clientType"
                      value={form.clientType}
                      onChange={handleChange}
                      error={!!errors.clientType}
                      helperText={errors.clientType}
                      fullWidth
                      required
                    >
                      {clients.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.typeOfClient}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                )}

                <Grid item xs={12} sm={isRole === 'admin' ? 6 : 3}>
                  <TextField type="file" label="Logo" name="logo" onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
                  {logoPreview && (
                    <Box position="relative" mt={2}>
                      <img src={logoPreview} alt="Logo" style={{ width: 100, borderRadius: 4 }} />
                      <IconButton onClick={handleDeleteLogo} sx={{ position: 'absolute', top: -8, left: -8, background: 'white' }}>
                        <FaTrash size={12} />
                      </IconButton>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} sm={7}>
                  <TextField
                    label="Office Address"
                    name="officeAddress"
                    value={form.officeAddress}
                    onChange={handleChange}
                    error={!!errors.officeAddress}
                    helperText={errors.officeAddress}
                    fullWidth
                  />
                </Grid>

                {isRole !== 'admin' && (
                  <>
                    <Grid item xs={12} sm={2.5}>
                      <TextField
                        type="date"
                        name="startDate"
                        label="Start Date"
                        value={form.startDate}
                        onChange={handleChange}
                        error={!!errors.startDate}
                        helperText={errors.startDate}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={2.5}>
                      <TextField
                        type="date"
                        name="endDate"
                        label="End Date"
                        value={form.endDate}
                        onChange={handleChange}
                        error={!!errors.endDate}
                        helperText={errors.endDate}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </>
                )}
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
                  {['name', 'email', 'phone'].map((field) => (
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
                  <Grid item xs={12} sm={2}>
                    <TextField
                      select
                      label="Department"
                      value={person.department}
                      onChange={(e) => handleContactChange(index, 'department', e.target.value)}
                      error={!!errors[`contactPerson.${index}.department`]}
                      helperText={errors[`contactPerson.${index}.department`]}
                      fullWidth
                    >
                      {departmentData?.map((option) => (
                        <MenuItem key={option} value={option.department}>
                          {option.department}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <TextField
                      select
                      label="Position"
                      value={person.position}
                      onChange={(e) => handleContactChange(index, 'position', e.target.value)}
                      error={!!errors[`contactPerson.${index}.position`]}
                      helperText={errors[`contactPerson.${index}.position`]}
                      fullWidth
                    >
                      {positionData?.map((value) => (
                        <MenuItem key={value} value={value.position}>
                          {value.position}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={1} display="flex" alignItems="center">
                    <IconButton color="primary" onClick={addContact}>
                      <AddIcon fontSize="large" />
                    </IconButton>
                    <IconButton color="error" onClick={() => removeContact(index)} disabled={form.contactPerson.length === 1}>
                      <DeleteIcon fontSize="large" />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Box mt={3}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <ToastContainer />
    </>
  );
};

export default AddClient;
