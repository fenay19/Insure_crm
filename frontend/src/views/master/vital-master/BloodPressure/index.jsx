import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { toast } from 'react-toastify';

const BloodPressure = ({ setPatientVitalData, setPatientSetedData }) => {
  // Generate Ranges (0-10, 10-20, ..., 190-200)
  const ranges = Array.from({ length: 20 }, (_, i) => ({
    label: `${i * 10}-${(i + 1) * 10}`,
    min: i * 10,
    max: (i + 1) * 10
  }));

  // State for category, selected values, and dialog
  const [selectedCategory, setSelectedCategory] = useState('systolic');
  const [selectedValues, setSelectedValues] = useState({ systolic: null, diastolic: null });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentValues, setCurrentValues] = useState([]);
  const [currentRange, setCurrentRange] = useState({ min: 0, max: 0 });

  // Handle category change
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Open dialog when a range is selected
  const handleRangeClick = (range) => {
    setCurrentRange(range);
    setCurrentValues(Array.from({ length: range.max - range.min + 1 }, (_, i) => range.min + i)); // Generate values within range
    setDialogOpen(true);
  };

  // Handle selecting a specific value
  const handleValueSelect = (value) => {
    setSelectedValues((prev) => ({
      ...prev,
      [selectedCategory]: value
    }));
    setDialogOpen(false);
  };

  // Save final data
  const handleSave = () => {
    if (selectedValues.systolic !== null && selectedValues.diastolic !== null) {
      const finalData = {
        vitalName: 'Blood Pressure (BP)',
        ranges: selectedValues,
        unit: 'mm Hg'
      };

      setPatientVitalData((prev) => ({
        ...prev,
        bloodPressure: [finalData]
      }));
      setPatientSetedData((prev) => ({
        ...prev,
        bloodPressure: [finalData]
      }));
      setSelectedValues({ systolic: null, diastolic: null });
    } else {
      toast.error('Please select both Systolic and Diastolic values before saving.');
    }
  };

  return (
    <Box
      sx={{
        width: '90%',
        maxWidth: 600,
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
      {/* Select Category: Systolic or Diastolic */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        Select Category
      </Typography>
      <RadioGroup row value={selectedCategory} onChange={handleCategoryChange}>
        <FormControlLabel value="systolic" control={<Radio />} label="Systolic" />
        <FormControlLabel value="diastolic" control={<Radio />} label="Diastolic" />
      </RadioGroup>

      {/* Select Range */}
      <Typography variant="h6" sx={{ mt: 3, fontWeight: 'bold' }}>
        Select {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
      </Typography>
      <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={1} sx={{ mt: 1 }}>
        {ranges.map((range) => (
          <Chip
            key={range.label}
            label={range.label}
            clickable
            variant={selectedValues[selectedCategory] >= range.min && selectedValues[selectedCategory] <= range.max ? 'default' : 'outlined'}
            sx={{
              borderWidth: 2, // Increase border thickness
              borderColor: selectedValues[selectedCategory] >= range.min && selectedValues[selectedCategory] <= range.max ?'primary.main' : 'secondary.main',
              borderStyle: 'solid'
            }}
            color={selectedValues[selectedCategory] >= range.min && selectedValues[selectedCategory] <= range.max ? 'primary' : 'default'}
            onClick={() => handleRangeClick(range)}
          />
        ))}
      </Box>

      {/* Selected Values Display */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="body1">
          <strong>Systolic:</strong> {selectedValues.systolic !== null ? `${selectedValues.systolic} mm Hg` : 'Not Selected'}
        </Typography>
        <Typography variant="body1">
          <strong>Diastolic:</strong> {selectedValues.diastolic !== null ? `${selectedValues.diastolic} mm Hg` : 'Not Selected'}
        </Typography>
      </Box>

      {/* Save Button */}
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={handleSave}
        disabled={selectedValues.systolic === null || selectedValues.diastolic === null}
      >
        Save
      </Button>

      {/* Dialog for Selecting Exact Value */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Select Exact {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Value</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Select a value between {currentRange.min} and {currentRange.max} mm Hg
          </Typography>
          <Box display="grid" gridTemplateColumns="repeat(5, 1fr)" gap={1}>
            {currentValues.map((value) => (
              <Chip
                key={value}
                label={value}
                clickable
                variant={selectedValues[selectedCategory] === value ? 'default' : 'outlined'}
                sx={{
                  borderWidth: 2, // Increase border thickness
                  borderColor: selectedValues[selectedCategory] === value ?'primary.main' : 'secondary.main',
                  borderStyle: 'solid'
                }}
                color={selectedValues[selectedCategory] === value ? 'primary' : 'default'}
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

export default BloodPressure;
