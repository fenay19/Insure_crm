import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography
} from '@mui/material';

const OpenForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    contactNo: '',
    designation: '',
    department: '',
    typeOfEmployee: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: 'auto',
        mt: 5,
        p: 3,
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: 3
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
        Employee Details Form
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Contact No."
          name="contactNo"
          value={formData.contactNo}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Designation"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Department</InputLabel>
          <Select
            name="department"
            value={formData.department}
            onChange={handleChange}
          >
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="Engineering">Engineering</MenuItem>
            <MenuItem value="Sales">Sales</MenuItem>
            <MenuItem value="Marketing">Marketing</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Type of Employee</InputLabel>
          <Select
            name="typeOfEmployee"
            value={formData.typeOfEmployee}
            onChange={handleChange}
          >
            <MenuItem value="Full-Time">Full-Time</MenuItem>
            <MenuItem value="Part-Time">Part-Time</MenuItem>
            <MenuItem value="Contract">Contract</MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default OpenForm;
