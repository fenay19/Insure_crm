import React, { useState, useEffect } from 'react';
import { get, post } from '../../api/api';
import {
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Divider,
  MenuItem,
  IconButton,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';

const AddCompany = () => {
  const [form, setForm] = useState({
    companyName: '',
    phoneNo: '',
    network: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
    country: '',
    notes: '',
    contacts: []
  });
  const [wantContact, setWantContact] = useState(false);
  const [errors, setErrors] = useState({});
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);
  const [deptOptions, setDeptOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // fetch on mount
  useEffect(() => {
    fetchDropDownOptions();
    fetchDesignationOptions();
    fetchDeptOptions();
  }, []);

  // get newtwork data
  const fetchDropDownOptions = async () => {
    try {
      setIsLoading(true);
      const response = await get('network');
      if (response.status === 'true') {
        console.log('add-newtwork data:', response.data);
        setDropdownOptions(response.data.map((item) => item.networkName));
      } else {
        toast.error('Failed to load networks');
      }
    } catch (error) {
      console.error('Error fetching networks:', error);
      toast.error('Error loading networks');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDesignationOptions = async () => {
    try {
      const response = await get('position');
      if (response.status === 'true') {
        setDesignationOptions(response.data.map((item) => item.position));
      } else {
        toast.error('Failed to load designations');
      }
    } catch (error) {
      toast.error('Error loading designations');
    }
  };
  const fetchDeptOptions = async () => {
    try {
      const response = await get('department');
      if (response.status === 'true') {
        setDeptOptions(response.data.map((item) => item.department));
      } else {
        toast.error('Failed to load departments');
      }
    } catch (error) {
      toast.error('Error loading departments');
    }
  };

  //todo: pincode
  useEffect(() => {
    const fetchPincodeDetails = async () => {
      if (form.pincode.length === 6) {
        try {
          const response = await fetch(`https://api.postalpincode.in/pincode/${form.pincode}`);
          const data = await response.json();
          if (data[0].Status === 'Success') {
            const details = data[0].PostOffice[0];
            setForm((prev) => ({
              ...prev,
              city: details.District || prev.city,
              state: details.State || prev.state,
              country: details.Country || prev.country
            }));
          }
        } catch (error) {
          console.error('Error fetching pincode details:', error);
        }
      }
    };

    fetchPincodeDetails();
  }, [form.pincode]);

  const validate = () => {
    const newErrors = {};
    const requiredFields = ['companyName', 'phoneNo', 'address', 'pincode', 'city', 'state', 'country'];

    requiredFields.forEach((field) => {
      if (!form[field]) newErrors[field] = 'Required';
    });

    // Improved email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // if (form.email && !emailRegex.test(form.email)) {
    //   newErrors.email = 'Invalid email format';
    // }

    // if (form.altEmail && !emailRegex.test(form.altEmail)) {
    //   newErrors.altEmail = 'Invalid email format';
    // }

    // Validate contacts if any
    if (wantContact && form.contacts.length > 0) {
      form.contacts.forEach((contact, index) => {
        if (contact.email && !emailRegex.test(contact.email)) {
          if (!newErrors.contacts) newErrors.contacts = {};
          if (!newErrors.contacts[index]) newErrors.contacts[index] = {};
          newErrors.contacts[index].email = 'Invalid email format';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...form.contacts];
    if (!updatedContacts[index]) {
      updatedContacts[index] = {};
    }
    updatedContacts[index][field] = value;
    setForm((prev) => ({ ...prev, contacts: updatedContacts }));
  };

  const addContact = () => {
    setForm((prev) => ({
      ...prev,
      contacts: [...(prev.contacts || []), { name: '', email: '', designation: '', dept: '', phone: '' }]
    }));
  };

  const removeContact = (indexToRemove) => {
    const updatedContacts = form.contacts.filter((_, i) => i !== indexToRemove);
    setForm((prev) => ({ ...prev, contacts: updatedContacts }));
  };

  // new handle submit data
  const handleSubmit = async () => {
    if (localStorage.getItem('expired') === 'true') {
      toast.error('Subscription has ended. Please subscribe to continue working.');
      return;
    }
    if (validate()) {
      try {
        setIsLoading(true);
        const response = await post('prospect', form);

        if (response.status === 'true') {
          toast.success('Company created successfully!');

          // POST contacts to /api/contact if any
          // if (form.contacts && form.contacts.length > 0) {
          //   for (const contact of form.contacts) {
          //     const contactPayload = {
          //       companyName: form.companyName,
          //       name: contact.name,
          //       email: contact.email,
          //       designation: contact.designation,
          //       phone: contact.phone,
          //       department: contact.dept
          //     };
          //     try {
          //       const contactRes = await post('contact', contactPayload);
          //       if (contactRes.status === 'true' || contactRes.status === true) {
          //         console.log('Contact API response:', contactRes);
          //         toast.success(`Contact "${contact.name}" added successfully!`);
          //       } else {
          //         toast.error(`Failed to add contact "${contact.name}": ${contactRes.error || 'Unknown error'}`);
          //       }
          //     } catch (err) {
          //       console.error('Error posting contact:', err);
          //       toast.error(`Error adding contact "${contact.name}"`);
          //     }
          //   }
          // }

          setForm({
            email: '',
            companyName: '',
            phoneNo: '',
            network: '',
            address: '',
            pincode: '',
            city: '',
            state: '',
            country: '',
            notes: '',
            contacts: []
          });
          setWantContact(false);
          setErrors({});
        } else {
          toast.error(`Failed to create company: ${response.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error('Something went wrong while submitting the form');
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error('Please fill all required fields correctly');
    }
  };

  // const handleSubmit = async () => {
  //   if (validate()) {
  //     try {
  //       setIsLoading(true);
  //       console.log('Submitting company form:', form);
  //       const response = await post('prospect', form);

  //       if (response.status === 'true') {
  //         console.log('Company created successfully:', response.data);
  //         toast.success('Company created successfully!');
  //         // Reset the form
  //         setForm({
  //           email: '',
  //           companyName: '',
  //           phoneNo: '',
  //           network: '',
  //           address: '',
  //           pincode: '',
  //           city: '',
  //           state: '',
  //           country: '',
  //           notes:'',
  //           contacts: []

  //         });
  //         setWantContact(false);
  //         setErrors({});
  //       } else {
  //         toast.error(`Failed to create company: ${response.error || 'Unknown error'}`);
  //       }
  //     } catch (error) {
  //       console.error('Error submitting form:', error);
  //       toast.error('Something went wrong while submitting the form');
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   } else {
  //     toast.error('Please fill all required fields correctly');
  //   }
  // };

  // handle submit data new contacts

  const renderDropdown = (label, name, options) => (
    <TextField
      select
      label={label}
      name={name}
      value={form[name] || ''}
      onChange={handleChange}
      fullWidth
      required
      error={!!errors[name]}
      helperText={errors[name]}
      disabled={isLoading}
    >
      {options.map((opt, i) => (
        <MenuItem key={i} value={opt}>
          {opt}
        </MenuItem>
      ))}
    </TextField>
  );

  const renderRichTextEditor = (name, label) => (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', marginBottom: '4px' }}>{label}</label>
      <ReactQuill
        value={form[name] || ''}
        onChange={(value) => setForm((prev) => ({ ...prev, [name]: value }))}
        theme="snow"
        readOnly={isLoading}
      />
      {errors[name] && <div style={{ color: 'red', fontSize: '0.8rem' }}>{errors[name]}</div>}
    </div>
  );

  const renderTextField = (label, name, required = false, type = 'text') => (
    <TextField
      label={label}
      name={name}
      type={type}
      value={form[name] || ''}
      onChange={handleChange}
      fullWidth
      required={required}
      error={!!errors[name]}
      helperText={errors[name]}
      InputLabelProps={['date', 'file'].includes(type) ? { shrink: true } : {}}
      inputProps={type === 'file' ? { accept: '*' } : {}}
      disabled={isLoading}
    />
  );
  console.log('designation:', designationOptions);
  console.log('department:', deptOptions);
  return (
    <Card>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Grid item>
            <Typography variant="h6">Add Prospect Information</Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" component={Link} to="/prospects">
              <ArrowBackIcon /> Back
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={4}>
            {renderTextField('Company Name', 'companyName', true)}
          </Grid>
          <Grid item xs={12} md={4}>
            {renderTextField('Phone No', 'phoneNo', true)}
          </Grid>
          <Grid item xs={12} md={4}>
            {renderTextField('Date of Incorporation', 'dateOfIncorporation', false, 'date')}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderDropdown('Network', 'network', dropdownOptions)}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderTextField('Address', 'address', true)}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderTextField('Pincode', 'pincode', true)}
          </Grid>
          <Grid item xs={12} md={4}>
            {renderTextField('City', 'city', true)}
          </Grid>
          <Grid item xs={12} md={4}>
            {renderTextField('State', 'state', true)}
          </Grid>
          <Grid item xs={12} md={4}>
            {renderTextField('Country', 'country', true)}
          </Grid>
          <Grid item xs={12}>
            {renderRichTextEditor('notes', 'Notes')}
          </Grid>

          <Grid item xs={12} ml={0.5}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={wantContact}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setWantContact(checked);
                    if (checked && (!form.contacts || form.contacts.length === 0)) {
                      addContact();
                    }
                  }}
                  disabled={isLoading}
                />
              }
              label="Add Contacts"
            />
          </Grid>

          {wantContact &&
            form.contacts &&
            form.contacts.map((contact, index) => (
              <React.Fragment key={index}>
                {/* Contact form fields */}
                <Grid item xs={12} md={2}>
                  <TextField
                    label="Name"
                    value={contact.name || ''}
                    onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                    fullWidth
                    error={errors.contacts && errors.contacts[index] && !!errors.contacts[index].name}
                    helperText={errors.contacts && errors.contacts[index] && errors.contacts[index].name}
                    disabled={isLoading}
                  />
                </Grid>
                <Grid item xs={12} md={2.5}>
                  <TextField
                    label="Email"
                    value={contact.email || ''}
                    onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                    fullWidth
                    error={errors.contacts && errors.contacts[index] && !!errors.contacts[index].email}
                    helperText={errors.contacts && errors.contacts[index] && errors.contacts[index].email}
                    disabled={isLoading}
                  />
                </Grid>
                <Grid item xs={12} md={2.5}>
                  <TextField
                    select
                    label="Designation"
                    value={contact.designation || ''}
                    onChange={(e) => handleContactChange(index, 'designation', e.target.value)}
                    fullWidth
                    disabled={isLoading}
                  >
                    {designationOptions.map((opt, i) => (
                      <MenuItem key={i} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={2.5}>
                  <TextField
                    select
                    label="Department"
                    value={contact.dept || ''}
                    onChange={(e) => handleContactChange(index, 'dept', e.target.value)}
                    fullWidth
                    disabled={isLoading}
                  >
                    {deptOptions.map((opt, i) => (
                      <MenuItem key={i} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={1.5}>
                  <TextField
                    label="Phone"
                    value={contact.phone || ''}
                    onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                    fullWidth
                    disabled={isLoading}
                  />
                </Grid>

                <Grid item xs={12} md={0.5} container justifyContent="flex-start">
                  <IconButton color="primary" onClick={addContact} aria-label="add contact" disabled={isLoading}>
                    <AddIcon fontSize="large" />
                  </IconButton>
                </Grid>

                <Grid item xs={12} md={0.5} container justifyContent="flex-end">
                  <IconButton onClick={() => removeContact(index)} color="error" aria-label="delete" disabled={isLoading}>
                    <DeleteIcon fontSize="large" />
                  </IconButton>
                </Grid>
              </React.Fragment>
            ))}

          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isLoading}>
              <SaveIcon sx={{ mr: 1 }} />
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
          </Grid>
        </Grid>
        <ToastContainer position="top-right" autoClose={5000} />
      </CardContent>
    </Card>
  );
};

export default AddCompany;
