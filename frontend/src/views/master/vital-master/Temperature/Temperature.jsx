import React, { useState } from 'react';
import { Box, Typography, FormGroup, FormControlLabel, Checkbox, TextField, Button } from '@mui/material';
import { toast } from 'react-toastify';

const Temperature = ({ setPatientVitalData,setPatientSetedData }) => {
  // State for selected measurement methods and temperature value
  const [selectedMethods, setSelectedMethods] = useState([]);
  const [temperatureValue, setTemperatureValue] = useState('');

  // Handle method selection
  const handleMethodChange = (event) => {
    const { value, checked } = event.target;
    setSelectedMethods((prev) => (checked ? [...prev, value] : prev.filter((method) => method !== value)));
  };

  // Handle temperature input change
  const handleInputChange = (event) => {
    setTemperatureValue(event.target.value);
  };

  // Save final data
  const handleSave = () => {
    if (selectedMethods.length === 0) {
      toast.error('Please select at least one measurement method.');
      return;
    }
    if (!temperatureValue || isNaN(temperatureValue)) {
      toast.error('Please enter a valid temperature value.');
      return;
    }

    const finalData = {
      vitalName: 'Temperature',
      methods: selectedMethods,
      value: `${temperatureValue} `,
      unit: `\u00B0F`
    };

    setPatientVitalData((prev) => ({
      ...prev,
      temperature: [finalData]
    }));
    setPatientSetedData((prev) => ({
      ...prev,
      temperature: [finalData]
    }));

    // Reset State
    setSelectedMethods([]);
    setTemperatureValue('');
    toast.success('Temperature saved successfully!');
  };

  return (
    <Box
      sx={{
        width: '90%',
        maxWidth: 500,
        textAlign: 'center',
        mt: 4,
        p: 4,
        borderRadius: 4,
        border:1,
        borderColor: "#126078",
        boxShadow: "0 1px 6px 1px #126078",
        bgcolor: '#fff',
        mx: 'auto'
      }}
    >
      {/* Title */}
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        Select Measurement Method(s)
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

      {/* Save Button */}
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={handleSave}
        disabled={selectedMethods.length === 0 || !temperatureValue}
      >
        Save
      </Button>
    </Box>
  );
};

export default Temperature;
