import { useEffect, useState } from 'react';
import { TextField, Button, MenuItem, Popover, Box } from '@mui/material';

const HeightWeightDropdown = ({ label = '', setPatientVitalData = () => {}, setPatientSetedData = () => {}, bmi = 0 }) => {
  console.log(bmi);

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const options = Array.from({ length: 251 }, (_, i) => i);

  const filteredOptions = options.filter((num) => num.toString().includes(search));

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const minBmi = 10;
  const maxBmi = 40;
  let scaledBmi = ((bmi - minBmi) / (maxBmi - minBmi)) * 100;
  scaledBmi = Math.max(0, Math.min(100, scaledBmi));

  // Determine BMI Category
  let bmiCategory = 'N/A';
  let bmiColor = '#333';

  if (bmi < 18.5) {
    bmiCategory = 'Underweight';
    bmiColor = '#2196F3';
  } else if (bmi >= 18.5 && bmi < 25) {
    bmiCategory = 'Normal';
    bmiColor = '#4CAF50';
  } else if (bmi >= 25 && bmi < 30) {
    bmiCategory = 'Overweight';
    bmiColor = '#FFC107';
  } else if (bmi >= 30) {
    bmiCategory = 'Obese';
    bmiColor = '#F44336';
  }

  const handleSave = () => {
    if (selected === null) return;

    const key = label.toLowerCase() === 'height' ? 'height' : 'weight';
    const unit = label.toLowerCase() === 'height' ? 'cm' : 'kg';

    const newVital = {
      [key]: selected,
      vitalName: label, // Assigning the label as vitalName
      unit: unit // Assigning the correct unit
    };

    setPatientVitalData((prev) => ({
      ...prev,
      [key]: prev[key] ? [...prev[key], newVital] : [newVital]
    }));

    setPatientSetedData((prev) => ({
      ...prev,
      [key]: prev[key] ? [...prev[key], newVital] : [newVital]
    }));

    // Reset state
    setSelected(null);
    setSearch('');
    handleClose();
  };

  return (
    <Box width={200} my={2} p={1} border={1} borderRadius={2} borderColor={'#126078'} sx={{ boxShadow: '0 1px 6px 1px #126078' }}>
      <Button variant="outlined" fullWidth onClick={handleClick} sx={{ mb: 2 }}>
        {selected !== null ? `${label}: ${selected} ${label === 'Height' ? 'cm' : 'kg'}` : `Select ${label}`}
      </Button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        sx={{ width: 350 }}
      >
        <Box
          p={2}
          width={250}
          border={2}
          borderRadius={3}
          borderColor={'#126078'}
          sx={{ boxShadow: '0 1px 6px 1px rgba(18, 96, 120, 0.6)' }}
        >
          <TextField placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} size="small" sx={{ mb: 1 }} />
          <Box sx={{ maxHeight: 250, overflowY: 'auto' }}>
            {filteredOptions.map((num) => (
              <MenuItem
                key={num}
                onClick={() => {
                  setSelected(num);
                  handleClose(); // Close the dropdown immediately after selection
                }}
              >
                {num}
              </MenuItem>
            ))}
          </Box>
        </Box>
      </Popover>
      <Button variant="contained" fullWidth sx={{ mt: 1 }} onClick={handleSave} disabled={selected === null}>
        Save
      </Button>
    </Box>
  );
};

export default HeightWeightDropdown;
