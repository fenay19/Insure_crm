import React, { useState } from 'react';
import { Box, Chip, Typography, Dialog, DialogTitle, DialogContent, Button } from '@mui/material';

const ranges = Array.from({ length: 20 }, (_, i) => `${i * 10}-${(i + 1) * 10}`);

const SelectableChips = ({ data, setPatientVitalData = () => {}, setPatientSetedData } = {}) => {
  const [selectionState, setSelectionState] = useState({
    selectedParameters: {},
    selectedRangeCategory: null,
    selectedRangeValue: null,
    vitalName: ''
  });

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleCategoryClick = (category) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
    setSelectionState((prev) => ({
      ...prev,
      vitalName: data?.heading
    }));
  };

  const handleSubOptionClick = (category, index, value) => {
    setSelectionState((prev) => {
      const updatedSubOptions = prev.selectedParameters[category] ? [...prev.selectedParameters[category]] : [];
      const optionExists = updatedSubOptions.find((opt) => opt.index === index);
      if (optionExists) {
        return {
          ...prev,
          selectedParameters: {
            ...prev.selectedParameters,
            [category]: updatedSubOptions.filter((opt) => opt.index !== index)
          }
        };
      } else {
        return {
          ...prev,
          selectedParameters: {
            ...prev.selectedParameters,
            [category]: [...updatedSubOptions, { index, value }]
          }
        };
      }
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

  const handleSave = () => {
    if (data?.heading?.toLowerCase()?.trim() === 'respiratory rate (rr)') {
      setPatientVitalData((prev) => ({
        ...prev,
        respiratoryRate: [{ ...selectionState, unit: 'per min' }]
      }));
      setPatientSetedData((prev) => ({
        ...prev,
        respiratoryRate: [{ ...selectionState, unit: 'per min' }]
      }));
    } else if (data?.heading?.toLowerCase()?.trim() === 'pulse (radial)/heart rate') {
      setPatientVitalData((prev) => ({
        ...prev,
        pulseRate: [{ ...selectionState, unit: 'per min' }]
      }));
      setPatientSetedData((prev) => ({
        ...prev,
        pulseRate: [{ ...selectionState, unit: 'per min' }]
      }));
    }

    // Reset state after saving
    setSelectionState({
      selectedParameters: {},
      selectedRangeCategory: null,
      selectedRangeValue: null,
      vitalName: ''
    });
    setSelectedCategory(null);
  };

  return (
    <Box p={3} display="flex" flexDirection="column" gap={3}>
      <Box display="flex" flexDirection="row" border={1} borderRadius={2} borderColor={'#126078'} boxShadow= "0 1px 6px 1px #126078" gap={6} alignItems="flex-start" flexWrap="wrap">
        {/* Left Side - Ranges */}
        <Box
          display="grid"
          gridTemplateColumns="repeat(4, 1fr)"
          gap={1}
          flex={1}
          Width={200}
          // boxShadow={1}
          p={2}
          borderRadius={2}
          bgcolor="background.paper"
        >
          <Typography variant="h6" gridColumn="span 4" color="primary" mb={3}>
            Select Range
          </Typography>
          {ranges.map((range) => (
            <Chip
              key={range}
              label={range}
              clickable
              color={selectionState.selectedRangeCategory === range ? 'primary' : 'default'}
              variant={selectionState.selectedRangeCategory === range ? 'default' : 'outlined'}
              sx={{
                borderWidth: 2, // Increase border thickness
                borderColor: selectionState.selectedRangeCategory === range ? 'primary.main' : 'secondary.main',
                borderStyle: 'solid'
              }}
              onClick={() => handleRangeCategoryClick(range)}
            />
          ))}
        </Box>

        {/* Right Side - Categories and Sub-Options */}
       <Box flex={2} >
       <Box flex={2} minWidth={200}  p={2} borderRadius={2} bgcolor="background.paper" display="flex" flexDirection="column">
          <Typography variant="h6" color="primary">
            Select Parameters
          </Typography>
          <Box display="flex" gap={1} width={510} flexWrap="wrap" mt={3}>
            {data?.parameters?.map((param) => (
              <Chip
                key={param.name}
                label={param.name}
                clickable
                variant={selectedCategory === param.name ? 'default' : 'outlined'}
                sx={{
                  borderWidth: 2, // Increase border thickness
                  borderColor: selectedCategory === param.name ? 'primary.main' : 'secondary.main',
                  borderStyle: 'solid'
                }}
                onClick={() => handleCategoryClick(param.name)}
                color={selectedCategory === param.name ? 'primary' : 'default'}
              />
            ))}
          </Box>
          {selectedCategory && (
            <Box p={2} bgcolor="white" borderRadius={2} mt={2} display="flex" gap={1} flexWrap="wrap">
              {data?.parameters
                ?.find((param) => param?.name === selectedCategory)
                ?.options.map((option, index) => (
                  <Chip
                    key={index}
                    label={option}
                    clickable
                    variant={selectionState.selectedParameters[selectedCategory] ?.some((opt)=>opt.index === index) ?  'default' : 'outlined'}
                    sx={{
                      borderWidth: 2, // Increase border thickness
                      borderColor: selectionState.selectedParameters[selectedCategory]?.some((opt)=>opt.index === index)  ? 'primary.main' : 'secondary.main',
                      borderStyle: 'solid'
                    }}
                    color={
                      selectionState.selectedParameters[selectedCategory]?.some((opt) => opt.index === index) ? 'primary' : 'default'
                    }
                    onClick={() => handleSubOptionClick(selectedCategory, index, option)}
                  />
                ))}
            </Box>
          )}

          {/* Save Button Properly Aligned Below */}
        </Box>

        <Box display="flex" justifyContent="center" m={2}  >
            <Button variant="contained" color="primary" size="small" sx={{ borderRadius: 2, px: 3 }} onClick={handleSave}>
              Save
            </Button>
          </Box>
       </Box>
      </Box>
      

      {/* Dialog for Range Selection */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Select a Value</DialogTitle>
        <DialogContent>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {Array.from({ length: 10 }, (_, i) => parseInt(selectionState.selectedRangeCategory?.split('-')[0]) + i + 1).map((value) => (
              <Chip
                key={value}
                label={value}
                clickable
                variant={selectionState.selectedRangeValue === value ?  'default' : 'outlined'}
                sx={{
                  borderWidth: 2, // Increase border thickness
                  borderColor: selectionState.selectedRangeValue === value ? 'primary.main' : 'secondary.main',
                  borderStyle: 'solid'
                }}
                color={selectionState.selectedRangeValue === value ? 'primary' : 'default'}
                onClick={() => handleRangeValueClick(value)}
              />
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SelectableChips;
