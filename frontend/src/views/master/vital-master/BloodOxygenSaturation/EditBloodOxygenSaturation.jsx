import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { put } from 'api/api'; // Import API function
import { useSelector } from 'react-redux';

const ranges = Array.from({ length: 20 }, (_, i) => ({
  label: `${i * 10}-${(i + 1) * 10}`,
  min: i * 10,
  max: (i + 1) * 10
}));

const EditBloodOxygenSaturation = ({ editData = {}, onClose = () => {}, getData }) => {
  const patient = useSelector((state) => state.patient.selectedPatient);
  const [selectedValue, setSelectedValue] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentValues, setCurrentValues] = useState([]);
  const [currentRange, setCurrentRange] = useState({ min: 0, max: 0 });

  // Load existing data if available
  useEffect(() => {
    if (editData?.range) {
      setSelectedValue(editData.range);
    }
  }, [editData]);

  // Open dialog when selecting a range
  const handleRangeClick = (range) => {
    setCurrentRange(range);
    setCurrentValues(Array.from({ length: range.max - range.min + 1 }, (_, i) => range.min + i));
    setDialogOpen(true);
  };

  // Handle value selection
  const handleValueSelect = (value) => {
    setSelectedValue(value);
    setDialogOpen(false);
  };

  // Save updated data to API
  const handleSave = async () => {
    if (selectedValue !== null) {
      const updatedData = {
        vitalName: 'Blood Oxygen Saturation (SpO₂)',
        range: selectedValue,
        unit: '%'
      };

      try {
        const res = await put(
          `form-setup/vital-master/update-single/${patient?.patientId?._id}/${editData?._id}`,
          updatedData
        );

        if (res?.status) {
          toast.success('Updated successfully!');
          getData(); // Refresh data after update
          onClose();
        } else {
          toast.error('Failed to update.');
        }
      } catch (error) {
        console.error('Error updating SpO₂ record:', error);
        toast.error('An error occurred while updating.');
      }
    } else {
      toast.error('Please select a value before saving.');
    }
  };

  return (
   <>
     <Box
      sx={{
        width: '90%',
        maxWidth: 400,
        textAlign: 'center',
        mt: 4,
        p: 4,
        borderRadius: 4,
        boxShadow: 3,
        bgcolor: '#fff',
        mx: 'auto'
      }}
    >
      {/* Select Range */}
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        Edit SpO₂ Value
      </Typography>
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={1} sx={{ mt: 2 }}>
        {ranges.map((range) => (
          <Chip
            key={range.label}
            label={range.label}
            clickable
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
    <ToastContainer/>
   </>
  );
};

export default EditBloodOxygenSaturation;
