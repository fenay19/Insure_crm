import React, { useState } from 'react';
import { Grid, TextField, Button, MenuItem, Typography, Card, CardContent, Divider } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams } from 'react-router-dom';
const EditStaff = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    firstName: 'sahil',
    middleName: 'naushad',
    lastName: 'khan',
    email: 'sahil@gmail.com',
    altEmail: 'sahiltest@gmail.com',

    phoneNo: '1234567890',
    altphoneNo: '978546132',
    address: 'delhi',
    role: 'admin',
    gender: 'Male',
    dob: '2000-05-29',
    aniversaryDate: '2012-05-29',
    aadharNo: '09876543556',
    panNo: '09876543556',
    EmergancyContactPersonName: 'joan',
    EmergancyContactPersonNumber: '978546132',
    EmergancyContactPersonAddress: 'Nagpur'
  });
  const [errors, setErrors] = useState({});

  const dropdownOptions = {
    gender: ['Male', 'Female', 'Other'],
    productService: ['Product A', 'Service B'],
    role: ['admin', 'user'],
    country: ['India', 'USA', 'UK']
  };

  const validate = () => {
    const newErrors = {};
    const requiredFields = ['firstName', 'middleName', 'lastName', 'gender', 'phoneNo', 'email', 'address', 'EmergancyContactPersonNumber'];

    requiredFields.forEach((field) => {
      if (!form[field]) newErrors[field] = 'Required';
    });

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email';
    }
    if (form.altEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.altEmail)) {
      newErrors.altEmail = 'Invalid alt email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (validate()) {
      console.log('Submitted Data:', form);
      toast.success('Staff updated successfully');
    } else {
      toast.error('Please fill all required fields correctly');
    }
  };

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
    />
  );

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
    >
      {options.map((opt, i) => (
        <MenuItem key={i} value={opt}>
          {opt}
        </MenuItem>
      ))}
    </TextField>
  );

  return (
    <Card>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Grid item>
            <Typography variant="h6">Staff Form</Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" component={Link} to="/hr/Staff">
              <ArrowBackIcon /> Back
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 2 }} />

        {/* You can conditionally show prospects/clients table here based on leadCategory */}

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Row 1 */}
          <Grid item xs={12} md={4}>
            {renderTextField('First Name', 'firstName', true)}
          </Grid>
          <Grid item xs={12} md={4}>
            {renderTextField('Middle Name', 'middleName', true)}
          </Grid>
          <Grid item xs={12} md={4}>
            {renderTextField('Last Name', 'lastName', true)}
          </Grid>

          {/* Row 2 */}
          <Grid item xs={12} md={3}>
            {renderDropdown('Gender', 'gender', dropdownOptions.gender)}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderTextField('Phone No', 'phoneNo', true, 'number')}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderTextField('Alt Phone No', 'altphoneNo', true, 'number')}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderTextField('Email', 'email', true)}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderTextField('Alternate Email', 'altEmail', true, 'email')}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderTextField('DOB', 'dob', true, 'date')}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderTextField('Aniversary Date', 'aniversaryDate', false, 'date')}
          </Grid>

          {/* Row 3 */}
          <Grid item xs={12} md={3}>
            {renderTextField('Aadhar No', 'aadharNo')}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderTextField('Pan No', 'panNo', true)}
          </Grid>

          {/* Row 4 */}
          <Grid item xs={12} md={3}>
            {renderTextField('Address', 'address', true)}
          </Grid>

          <Grid item xs={12} md={3}>
            {renderTextField('Emergancy Contact Person Name', 'EmergancyContactPersonName', true)}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderTextField('Emergancy Contact Person Number', 'EmergancyContactPersonNumber', true, 'number')}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderTextField('Emergancy Contact Address', 'EmergancyContactPersonAddress', true)}
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Update
            </Button>
          </Grid>
        </Grid>
        <ToastContainer />
      </CardContent>
    </Card>
  );
};

export default EditStaff;
