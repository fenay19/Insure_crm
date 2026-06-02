import React, { useState } from 'react';
import { Box, Typography, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { toast } from 'react-toastify';

const BloodOxygenSaturation = ({ setPatientVitalData,setPatientSetedData }) => {
  // Generate Ranges (80-85, 85-90, ..., 100)
  const ranges = Array.from({ length: 20 }, (_, i) => ({
    label: `${i * 10}-${(i + 1) * 10}`,
    min: i * 10,
    max: (i + 1) * 10
  }));

  // State for selected value & dialog
  const [selectedValue, setSelectedValue] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentValues, setCurrentValues] = useState([]);
  const [currentRange, setCurrentRange] = useState({ min: 0, max: 0 });

  // Open dialog when a range is selected
  const handleRangeClick = (range) => {
    setCurrentRange(range);
    setCurrentValues(Array.from({ length: range.max - range.min + 1 }, (_, i) => range.min + i)); // Generate values within range
    setDialogOpen(true);
  };

  // Handle selecting a specific value
  const handleValueSelect = (value) => {
    setSelectedValue(value);
    setDialogOpen(false);
  };

  // Save final data
  const handleSave = () => {
    if (selectedValue !== null) {
      const finalData = {
        vitalName: 'Blood Oxygen Saturation (SpO2)',
        range: selectedValue,
        unit: '%'
      };

      setPatientVitalData((prev) => ({
        ...prev,
        bloodOxygenSaturation: [finalData]
      }));
      setPatientSetedData((prev) => ({
        ...prev,
        bloodOxygenSaturation: [finalData]
      }));

      setSelectedValue(null);
    } else {
      toast.error('Please select a value before saving.');
    }
  };

  return (
    <Box
      sx={{
        width: '90%',
        maxWidth: 400,
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
      {/* Select Range */}
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        Select SpO₂ Range
      </Typography>
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={1} sx={{ mt: 2 }}>
        {ranges.map((range) => (
          <Chip
            key={range.label}
            label={range.label}
            clickable
            variant={selectedValue >= range.min && selectedValue <= range.max ? 'default' : 'outlined'}
            sx={{
              borderWidth: 2, // Increase border thickness
              borderColor: selectedValue >= range.min && selectedValue <= range.max ?'primary.main' : 'secondary.main',
              borderStyle: 'solid'
            }}
            color={selectedValue >= range.min && selectedValue <= range.max ? 'primary' : 'default'}
            onClick={() => handleRangeClick(range)}
          />
        ))}
      </Box>

      {/* Selected Value Display */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="body1">
          <strong>Selected SpO₂:</strong> {selectedValue !== null ? `${selectedValue} %` : 'Not Selected'}
        </Typography>
      </Box>

      {/* Save Button */}
      <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleSave} disabled={selectedValue === null}>
        Save
      </Button>

      {/* Dialog for Selecting Exact Value */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Select Exact SpO₂ Value</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Select a value between {currentRange.min} and {currentRange.max} %
          </Typography>
          <Box display="grid" gridTemplateColumns="repeat(5, 1fr)" gap={1}>
            {currentValues.map((value) => (
              <Chip
                key={value}
                label={value}
                clickable
                variant={selectedValue === value ? 'default' : 'outlined'}
                sx={{
                  borderWidth: 2, // Increase border thickness
                  borderColor: selectedValue === value ?'primary.main' : 'secondary.main',
                  borderStyle: 'solid'
                }}
                color={selectedValue === value ? 'primary' : 'default'}
                onClick={() => handleValueSelect(value)}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BloodOxygenSaturation;
