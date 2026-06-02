import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  IconButton,
  CardContent,
  Divider,
  Box,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import { FaTrash } from 'react-icons/fa';
import { get, post, put } from '../../api/api';

const UpdateClient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [logoPreview, setLogoPreview] = useState('');
  const [form, setForm] = useState(initialState());
  const [errors, setErrors] = useState({});
  const [clients, setClients] = useState([]);
    const[positionData,setPositionData]=useState([]);
    const[departmentData,setDepartmentData]=useState([]);
    const[isRole,setRole]=useState('');

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
// Fetch all positions from backend
  const fetchPositions = async () => {
    try {
      const response = await get('position');
      console.log('Position data: ', response.data)
      setPositionData(response.data);
    } catch (error) {
      console.error(error);
    }
  };


   // Fetch all departments from backend
    const fetchDepartments = async () => {
      try {
        const response = await get('department');
        console.log("Department data:", response.data)
        setDepartmentData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
  useEffect(() => {
    const role=localStorage.getItem('loginRole')
    setRole(role);
    fetchClientTypes();
    fetchClientData();
    fetchPositions();
    fetchDepartments();
  }, []);

  const fetchClientTypes = async () => {
    const res = await get('typeOfClient');
    if (res.data && res.status === 'true') {
      setClients(res.data.map(item => ({ id: item._id, typeOfClient: item.typeOfClient })));
    }
  };

  const fetchClientData = async () => {
    try {
      const role=localStorage.getItem('loginRole');
      if(role==='admin'){
        const res = await get(`admin-clientRegistration/${id}`);
        if (res.data && res.status === 'true') {
          setForm(res.data);
          if (res.data.logo) {
            setLogoPreview(res.data.logo);
          }
        } else {
          toast.error('Failed to fetch client data');
        }
      }else if(role==='super-admin'){
        const res = await get(`clientRegistration/${id}`);
        if (res.data && res.status === 'true') {
          setForm(res.data);
          if (res.data.logo) {
            setLogoPreview(res.data.logo);
          }
        } else {
          toast.error('Failed to fetch client data');
        }
      }
      
    } catch (error) {
      toast.error('Error fetching client data');
    }
  };

  let pincodeTimeout = null; // Declare a timeout variable outside the function

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
    clearTimeout(pincodeTimeout); // Clear the previous timeout
    setForm({ ...form, [name]: value }); // Update the pincode value in the form

    if (value.match(/^\d{6}$/)) {
      // Set a timeout to call the fetch function after the user finishes typing
      pincodeTimeout = setTimeout(() => {
        fetchPincodeDetails(value); // Fetch pincode details when valid pincode is entered
      }, 500); // 500ms debounce time
    }
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
    setForm(prevForm => ({
      ...prevForm,
      contactPerson: [...prevForm.contactPerson, {
        name: '',
        department: '',
        position: '',
        email: '',
        phone: ''
      }]
    }));
  };

  const removeContact = (index) => {
    const updatedContacts = [...form.contactPerson];
    updatedContacts.splice(index, 1);
    setForm({ ...form, contactPerson: updatedContacts });
  };

  const handleDeleteLogo = () => {
    setForm({ ...form, logo: null });
    setLogoPreview('');
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const phoneRegex = /^\d{10}$/;
    const pincodeRegex = /^[0-9]{6}$/;

    if (!form.clientName) newErrors.clientName = 'Client Name is required';
    if (!form.officialPhoneNo || !phoneRegex.test(form.officialPhoneNo)) newErrors.officialPhoneNo = 'Valid Official Phone No required';
    if (form.altPhoneNo && !phoneRegex.test(form.altPhoneNo)) newErrors.altPhoneNo = 'Must be 10 digits';
    if (!form.officialMailId || !emailRegex.test(form.officialMailId)) newErrors.officialMailId = 'Valid Official Email is required';
    if (form.altMailId && !emailRegex.test(form.altMailId)) newErrors.altMailId = 'Invalid email format';
    if (!form.emergencyContactPerson) newErrors.emergencyContactPerson = 'Required';
    if (!form.emergencyContactNo || !phoneRegex.test(form.emergencyContactNo)) newErrors.emergencyContactNo = '10-digit number required';
    if (!form.website) newErrors.website = 'Required';
    if (!form.officeAddress) newErrors.officeAddress = 'Required';
    if(isRole==='super-admin' && !form.clientType) newErrors.clientType='Required';
    if (!form.startDate) newErrors.startDate = 'Start Date is required';
    if (!form.endDate) newErrors.endDate = 'End Date is required';
    if (form.startDate && form.endDate && new Date(form.startDate) > new Date(form.endDate)) {
      newErrors.startDate = 'Start Date cannot be later than End Date';
      newErrors.endDate = 'End Date cannot be earlier than Start Date';
    }
    if (!form.pincode || !pincodeRegex.test(form.pincode)) newErrors.pincode = 'Valid Pincode required';
    if (!form.city) newErrors.city = 'Required';
    if (!form.state) newErrors.state = 'Required';
    if (!form.country) newErrors.country = 'Required';

    form.contactPerson.forEach((person, index) => {
      if (!person.name) newErrors[`contactPerson.${index}.name`] = 'Name required';
      if (!person.department) newErrors[`contactPerson.${index}.department`] = 'Department required';
      if (!person.position) newErrors[`contactPerson.${index}.position`] = 'Position required';
      if (!emailRegex.test(person.email)) newErrors[`contactPerson.${index}.email`] = 'Invalid email';
      if (!phoneRegex.test(person.phone)) newErrors[`contactPerson.${index}.phone`] = '10-digit phone required';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const clientPayload = { ...form };
        console.log('Client Payload:', clientPayload);
        const role=localStorage.getItem('loginRole');
        if (role === 'admin') {
          const clientResponse = await put(`admin-clientRegistration/${id}`, clientPayload);
          if (clientResponse.data && clientResponse.success === true) {
            for (const contact of form.contactPerson) {
              if (contact.name && contact.department && contact.position && contact.email && contact.phone) {
                await post('contactPerson', contact);
              }
            }
            toast.success('Client updated successfully!');
          } else {
            toast.error(clientResponse.data.message || 'Failed to update client');
          }
        }
        else if(role==='super-admin'){
          const clientResponse = await put(`clientRegistration/${id}`, clientPayload);
          if (clientResponse.data && clientResponse.success === true) {
            for (const contact of form.contactPerson) {
              if (contact.name && contact.department && contact.position && contact.email && contact.phone) {
                await post('contactPerson', contact);
              }
            }
            toast.success('Client updated successfully!');
          } else {
            toast.error(clientResponse.data.message || 'Failed to update client');
          }
        }
        
      } catch (error) {
        toast.error('Error submitting form');
        console.error(error);
      }
    } else {
      toast.error('Please fix the form errors.');
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

  return (
    <>
      <Breadcrumb>
        <Typography component={Link} to="/" variant="subtitle2" color="inherit">Home</Typography>
        <Typography variant="subtitle2" color="primary">Client</Typography>
      </Breadcrumb>

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5">Client Update</Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/client')}>
              <ArrowBack />
            </Button>
          </Grid>

          <Card>
            <CardContent>
              <Grid container spacing={2}>
                {/* Client Info Fields */}
                {[
                  { label: 'Client Name', name: 'clientName' },
                  { label: 'Official Phone No.', name: 'officialPhoneNo' },
                  { label: 'Alternate Phone No.', name: 'altPhoneNo' },
                  { label: 'Official Mail ID', name: 'officialMailId' },
                  { label: 'Alternate Mail ID', name: 'altMailId' },
                  { label: 'Emergency Contact Person', name: 'emergencyContactPerson' },
                  { label: 'Emergency Contact No.', name: 'emergencyContactNo' },
                  { label: 'Website', name: 'website' },
                  { label: 'GST No.', name: 'gstNo' },
                  { label: 'PAN No.', name: 'panNo' },
                  { label: 'Pincode', name: 'pincode' },
                  { label: 'City', name: 'city' },
                  { label: 'State', name: 'state' },
                  { label: 'Country', name: 'country' },
                ].map(field => (
                  <Grid item xs={12} sm={3} key={field.name}>
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

                {isRole==='super-admin' && <Grid item xs={12} sm={3}>
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
                </Grid>}

                <Grid item xs={12} sm={isRole==='admin'?6:3}>
                  <TextField type="file" label="Logo" name="logo" onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
                  {logoPreview && (
                    <Box mt={1} position="relative">
                      <img src={logoPreview} alt="Logo" style={{ width: 80 }} />
                      <IconButton size="small" onClick={handleDeleteLogo} sx={{ position: 'absolute', top: -8, left: -8 }}>
                        <FaTrash size={12} />
                      </IconButton>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    type="date"
                    label="Start Date"
                    name="startDate"
                    value={form.startDate ? new Date(form.startDate).toISOString().slice(0, 10) : ''}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.startDate}
                    helperText={errors.startDate}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="date"
                    label="End Date"
                    name="endDate"
                    value={form.endDate ? new Date(form.endDate).toISOString().slice(0, 10) : ''}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.endDate}
                    helperText={errors.endDate}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Divider sx={{ my: 2 }} />
          <Typography variant="h5" gutterBottom>Contact Person</Typography>
          <Card>
            <CardContent>
              {form.contactPerson.map((person, idx) => (
                <Grid container spacing={2} key={idx}>
                  {['name','email', 'phone'].map((field) => (
                    <Grid item xs={12} sm={2} key={field}>
                      <TextField
                        label={field.charAt(0).toUpperCase() + field.slice(1)}
                        name={`contactPerson.${idx}.${field}`}
                        value={person[field]}
                        onChange={(e) => handleContactChange(idx, field, e.target.value)}
                        error={!!errors[`contactPerson.${idx}.${field}`]}
                        helperText={errors[`contactPerson.${idx}.${field}`] || ''}
                        fullWidth
                        required
                      />
                    </Grid>
                  ))}
                  <Grid item xs={12} sm={2}>
                  <TextField
                    select
                    label="Department"
                    value={person.department}
                    onChange={(e) => handleContactChange(idx,'department', e.target.value)} // Pass 'department' as the field
                    error={!!errors[`contactPerson.${idx}.department`]}
                    helperText={errors[`contactPerson.${idx}.department`] || ''}
                    fullWidth
                    required
                  >
                    {departmentData?.map((option) => (
                      <MenuItem key={option._id} value={option.department}>
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
                    onChange={(e) => handleContactChange(idx,'position',e.target.value)} // Pass 'position' as the field
                    error={!!errors[`contactPerson.${idx}.position`]}
                    helperText={errors[`contactPerson.${idx}.position`] || ''}
                    fullWidth
                    required
                  >
                    {positionData?.map((value) => (
                      <MenuItem key={value._id} value={value.position}>
                        {value.position}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                  <Grid item xs={12} sm={2} mb={2}>
                    <IconButton onClick={addContact} color="primary">
                      <AddIcon fontSize='large' />
                    </IconButton>
                    <IconButton onClick={() => removeContact(idx)} disabled={form.contactPerson.length === 1} color="error">
                      <DeleteIcon fontSize='large'/>
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Box mt={2}>
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

export default UpdateClient;
