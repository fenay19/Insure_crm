import React, { useState, useEffect } from 'react';
import { Box, Chip, Typography, Dialog, DialogTitle, DialogContent, Button } from '@mui/material';
import { put } from 'api/api';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';

const ranges = Array.from({ length: 20 }, (_, i) => `${i * 10}-${(i + 1) * 10}`);

const EditSelectableChips = ({ data, onClose = () => {}, editData = {}, getData }) => {
  const [selectionState, setSelectionState] = useState({
    selectedParameters: {},
    selectedRangeCategory: null,
    selectedRangeValue: null,
    vitalName: '',
    unit: 'per min',
    _id: ''
  });
  const patient = useSelector((state) => state.patient.selectedPatient);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Populate state with editData if available, otherwise use data
  useEffect(() => {
    if (editData && Object.keys(editData).length > 0) {
      setSelectionState({
        vitalName: editData.vitalName || '',
        selectedParameters: editData.selectedParameters || {},
        selectedRangeCategory: editData.selectedRangeCategory || '',
        selectedRangeValue: editData.selectedRangeValue || null,
        unit: editData.unit || 'per min',
        _id: editData._id || ''
      });
    } else if (data) {
      setSelectionState({
        vitalName: data.vitalName || '',
        selectedParameters: data.selectedParameters || {},
        selectedRangeCategory: data.selectedRangeCategory || '',
        selectedRangeValue: data.selectedRangeValue || null,
        unit: data.unit || 'per min',
        _id: data._id || ''
      });
    }
  }, [editData, data]);

  const handleCategoryClick = (category) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  };

  const handleSubOptionClick = (category, index, value) => {
    setSelectionState((prev) => {
      const updatedSubOptions = prev.selectedParameters[category] ? [...prev.selectedParameters[category]] : [];
      const optionExists = updatedSubOptions.find((opt) => opt.index === index);

      return {
        ...prev,
        selectedParameters: {
          ...prev.selectedParameters,
          [category]: optionExists
            ? updatedSubOptions.filter((opt) => opt.index !== index) // Remove if exists
            : [...updatedSubOptions, { index, value }] // Add if not exists
        }
      };
    });
  };

  const handleRangeCategoryClick = (range) => {
    setSelectionState((prev) => ({ ...prev, selectedRangeCategory: range }));
    setOpenDialog(true);
  };

  const handleRangeValueClick = (value) => {
    setSelectionState((prev) => ({ ...prev, selectedRangeValue: value }));
    setOpenDialog(false);
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        vitalName: selectionState.vitalName,
        selectedParameters: selectionState.selectedParameters,
        selectedRangeCategory: selectionState.selectedRangeCategory,
        selectedRangeValue: selectionState.selectedRangeValue,
        unit: selectionState.unit,
        _id: selectionState._id
      };

      console.log('Sending data to API:', updatedData);

      const res = await put(`form-setup/vital-master/update-single/${patient?.patientId?._id}/${editData?._id}`, updatedData);

      console.log('API Response:', res); // Debugging

      if (res?.status) {
        toast.success(`Updated successfully!`);
        getData(); // Refresh data after successful update
      } else {
        toast.error(`Failed to update`);
      }
      onClose();
    } catch (error) {
      console.error('Error updating vital record:', error);
    }
  };

  return (
    <>
      <Box p={3} display="flex" flexDirection="column" gap={3}>
        <Box display="flex" gap={4} alignItems="flex-start" flexWrap="wrap">
          {/* Left Side - Ranges */}
          <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={1} flex={1} minWidth={200} mr={5}>
            <Typography variant="h6" gridColumn="span 3" mb={3}>
              Select Range
            </Typography>
            {ranges.map((range) => (
              <Chip
                key={range}
                label={range}
                clickable
                color={selectionState.selectedRangeCategory === range ? 'primary' : 'default'}
                onClick={() => handleRangeCategoryClick(range)}
              />
            ))}
          </Box>

          {/* Right Side - Categories and Sub-Options */}
          <Box flex={2} minWidth={300}>
            <Typography variant="h6">Select Parameters</Typography>
            <Box display="flex" gap={2} flexWrap="wrap" mt={3}>
              {data?.parameters?.map((param) => (
                <Chip
                  key={param.name}
                  label={param.name}
                  clickable
                  onClick={() => handleCategoryClick(param.name)}
                  color={selectedCategory === param.name ? 'primary' : 'default'}
                />
              ))}
            </Box>
            {selectedCategory && (
              <Box p={2} bgcolor="white" borderRadius={2} boxShadow={1} mt={2} display="flex" gap={1} flexWrap="wrap">
                {data?.parameters
                  .find((param) => param.name === selectedCategory)
                  .options.map((option, index) => (
                    <Chip
                      key={index}
                      label={option}
                      clickable
                      color={
                        selectionState.selectedParameters[selectedCategory]?.some((opt) => opt.index === index) ? 'secondary' : 'default'
                      }
                      onClick={() => handleSubOptionClick(selectedCategory, index, option)}
                    />
                  ))}
              </Box>
            )}
          </Box>
        </Box>

        {/* Save Button (Compact Alignment) */}
        <Box display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" size="small" onClick={handleSave}>
            Update
          </Button>
        </Box>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Select a Value</DialogTitle>
          <DialogContent>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {Array.from({ length: 10 }, (_, i) => parseInt(selectionState.selectedRangeCategory?.split('-')[0]) + i + 1).map((value) => (
                <Chip
                  key={value}
                  label={value}
                  clickable
                  color={selectionState.selectedRangeValue === value ? 'primary' : 'default'}
                  onClick={() => handleRangeValueClick(value)}
                />
              ))}
            </Box>
          </DialogContent>
        </Dialog>
      </Box>

      <ToastContainer />
    </>
  );
};

export default EditSelectableChips;
