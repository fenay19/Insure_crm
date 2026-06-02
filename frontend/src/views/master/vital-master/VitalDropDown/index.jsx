import React, { useEffect, useState } from 'react';
import { Button, Menu, MenuItem, Checkbox, FormControlLabel, ListItemText } from '@mui/material';
import { get } from 'api/api';

const VitalDropdown = ({ onSelectionChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [allVitals, setAllVitals] = useState([]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggle = (option) => {
    const updatedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((item) => item !== option)
      : [...selectedOptions, option];

    setSelectedOptions(updatedOptions);
    onSelectionChange(updatedOptions); // Pass the updated options to the parent
  };
  useEffect(() => {
    (async () => {
      const response = await get('vital-master/');
      if (response?.data) {
        // Filter out duplicate `vital` values
        const uniqueVitals = Array.from(new Map(response.data.map((item) => [item.vital, item])).values());

        setAllVitals(uniqueVitals);
      }
    })();
  }, []);

  return (
    <div>
      <Button variant="outlined" onClick={handleClick}>
        Select Vital
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            width: '350px' // Set the desired width for the dropdown menu
          }
        }}
      >
        {allVitals?.map((option) => (
          <MenuItem key={option?.vital}>
            <FormControlLabel
              control={<Checkbox checked={selectedOptions.includes(option?.vital)} onChange={() => handleToggle(option?.vital)} />}
              label={<ListItemText primary={option?.vital} sx={{ fontSize: '0.9rem', margin: 0 }} />}
            />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default VitalDropdown;
