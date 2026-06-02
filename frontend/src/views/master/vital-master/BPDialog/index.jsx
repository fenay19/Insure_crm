import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Chip,
  Button
} from '@mui/material';

const BPDialog = ({ open, data, onClose, onSelectValue }) => {
  const [selectedChip, setSelectedChip] = useState(null);

  if (!data) return null;

  // Create a range of values based on the provided range string (e.g., "10-30")
  const [start, end] = data?.split('-')?.map(Number);
  const rangeValues = [];
  for (let i = start; i <= end; i++) {
    rangeValues.push(i);
  }

  const handleChipClick = (value) => {
    setSelectedChip(value); 
    onSelectValue(value); 
    onClose(); 
    
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{`${data} Range`}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          The selected  range is: <strong>{data}</strong>.
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginTop: 2 }}>
          {rangeValues.map((value) => (
            <Chip
              key={value}
              label={value}
              onClick={() => handleChipClick(value)}
              sx={{
                backgroundColor: selectedChip === value ? '#0288d1' : '#e0e0e0', // Blue when selected, gray when not
                color: selectedChip === value ? '#fff' : '#000',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: selectedChip === value ? '#0277bd' : '#bdbdbd' // Slightly darker gray on hover if not selected
                }
              }}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BPDialog;

