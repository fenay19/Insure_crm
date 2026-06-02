import React, { useState } from 'react';
import { Box, Typography, FormGroup, FormControlLabel, Checkbox, TextField, Button } from '@mui/material';
import { toast } from 'react-toastify';
import { put } from 'api/api';
import { useSelector } from 'react-redux';

const EditTemperature = ({ editData = {}, onClose = () => {}, getData }) => {
  // Initialize state with existing data
  const [selectedMethods, setSelectedMethods] = useState(editData?.methods || []);
  const [temperatureValue, setTemperatureValue] = useState(editData?.value || '');
  const patient = useSelector((state) => state.patient.selectedPatient);

  // Handle method selection
  const handleMethodChange = (event) => {
    const { value, checked } = event.target;
    setSelectedMethods((prev) => (checked ? [...prev, value] : prev.filter((method) => method !== value)));
  };

  // Handle temperature input change
  const handleInputChange = (event) => {
    setTemperatureValue(event.target.value);
  };

  // Save updated data
  const handleUpdate = async () => {
    if (selectedMethods.length === 0) {
      toast.error('Please select at least one measurement method.');
      return;
    }
    if (!temperatureValue || isNaN(temperatureValue)) {
      toast.error('Please enter a valid temperature value.');
      return;
    }
  
    const updatedData = {
       ... editData,
      methods: selectedMethods,
      value: `${temperatureValue} `,
      unit: `\u00B0F`
    };
  
    try {
      const res = await put(`form-setup/vital-master/update-single/${patient?.patientId?._id}/${editData?._id}`, updatedData);
  
      if (res?.status) {
        toast.success('Updated successfully!');
        getData(); // Fetch updated data
        onClose(); // Close the edit form/modal
      } else {
        toast.error('Failed to update.');
      }
    } catch (error) {
      console.error('Error updating vital:', error);
      toast.error('Failed to update vital.');
    }
  };
  

  return (
    <Box
      sx={{
        textAlign: 'center',
        mt: 4,
        p: 4,
        borderRadius: 4,
        boxShadow: 3,
        bgcolor: '#fff',
        mx: 'auto',
        width:600
      }}
    >
      {/* Title */}
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        Edit Temperature Details
      </Typography>

      {/* Checkboxes in Row */}
      <FormGroup row sx={{ justifyContent: 'center', mt: 2 }}>
        {['Oral', 'Axial', 'Rectal', 'Skin'].map((method) => (
          <FormControlLabel
            key={method}
            control={<Checkbox checked={selectedMethods.includes(method)} onChange={handleMethodChange} value={method} />}
            label={method}
          />
        ))}
      </FormGroup>

      {/* Temperature Input */}
      <TextField
        label="Enter Temperature"
        variant="outlined"
        fullWidth
        sx={{ mt: 3 }}
        value={temperatureValue}
        onChange={handleInputChange}
      />

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleUpdate} disabled={selectedMethods.length === 0 || !temperatureValue}>
          Update
        </Button>
      </Box>
    </Box>
  );
};

export default EditTemperature;
