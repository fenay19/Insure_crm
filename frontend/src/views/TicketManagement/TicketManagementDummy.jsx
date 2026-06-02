import React, { useState } from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  Typography,
  Button,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const TicketManagementDummy = () => {
  const [form, setForm] = useState({
    clientName: '',
    phoneNumber: '',
    product: '',
    serviceType: '',
    installDate: null,
    expiryDate: null,
    description: '',
    urgency: ''
  });

  const [errors, setErrors] = useState({});

  const clients = ['Client A', 'Client B'];
  const products = ['Product X', 'Product Y'];
  const serviceTypes = ['Installation', 'Repair'];
  const urgencyLevels = ['Low', 'Medium', 'High'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleDateChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.clientName) newErrors.clientName = 'Client Name is required';
    if (!form.phoneNumber) newErrors.phoneNumber = 'Phone Number is required';
    if (!form.product) newErrors.product = 'Product is required';
    if (!form.serviceType) newErrors.serviceType = 'Service Type is required';
    if (!form.installDate) newErrors.installDate = 'Installation Date is required';
    if (!form.expiryDate) newErrors.expiryDate = 'Service Expiry Date is required';
    if (!form.description) newErrors.description = 'Description is required';
    if (!form.urgency) newErrors.urgency = 'Urgency is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    console.log('Submitted:', form);
    alert('Service details submitted successfully!');
  };

  return (
    <Card sx={{ maxWidth: 1000, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Service Entry Form
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={2}>
            {/* Client Name */}
            <Grid item xs={12} md={4}>
              <TextField
                select
                label="Client Name"
                name="clientName"
                value={form.clientName}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.clientName}
                helperText={errors.clientName}
              >
                {clients.map((client, i) => (
                  <MenuItem key={i} value={client}>
                    {client}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Phone Number */}
            <Grid item xs={12} md={4}>
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
              />
            </Grid>

            {/* Product */}
            <Grid item xs={12} md={4}>
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
            </Grid>

            {/* Service Type */}
            <Grid item xs={12} md={4}>
              <TextField
                select
                label="Service Type"
                name="serviceType"
                value={form.serviceType}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.serviceType}
                helperText={errors.serviceType}
              >
                {serviceTypes.map((type, i) => (
                  <MenuItem key={i} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Install Date */}
            <Grid item xs={12} md={4}>
              <DatePicker
                label="Date of Installation"
                value={form.installDate}
                onChange={(value) => handleDateChange('installDate', value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!errors.installDate}
                    helperText={errors.installDate}
                  />
                )}
              />
            </Grid>

            {/* Expiry Date */}
            <Grid item xs={12} md={4}>
              <DatePicker
                label="Service Expiry Date"
                value={form.expiryDate}
                onChange={(value) => handleDateChange('expiryDate', value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!errors.expiryDate}
                    helperText={errors.expiryDate}
                  />
                )}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                required
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>

            {/* Urgency */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Urgency"
                name="urgency"
                value={form.urgency}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.urgency}
                helperText={errors.urgency}
              >
                {urgencyLevels.map((level, i) => (
                  <MenuItem key={i} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleSubmit}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </CardContent>
    </Card>
  );
};

export default TicketManagementDummy;
