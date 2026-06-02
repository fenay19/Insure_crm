import React, { useState } from 'react';
import { Box, Slider, Typography, Grid } from '@mui/material';

const painMarks = Array.from({ length: 11 }, (_, i) => ({ value: i, label: `${i}` }));

const painLevelLabels = [
  { value: 0, text: 'No Pain' },
  { value: 3, text: 'Mild' },
  { value: 6, text: 'Moderate' },
  { value: 7, text: 'Severe' },
  { value: 9, text: 'Very Severe' },
  { value: 10, text: 'Worst Pain' }
];

const PainScale = ({ painLevel, setPainLevel, setOpenChiefComplaintData=()=>{} }) => {
  const handleChange = (_, newValue) => {
    const painType = painLevelLabels.find((p) => p.value >= newValue)?.text || 'Unknown';
    setPainLevel(newValue);
    setOpenChiefComplaintData((prev) => {
      return { ...prev, painScore: newValue, painType };
    });
  };
  return (
    <Box
      sx={{
        width: 350,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: '#fff',
        textAlign: 'center',
        my: '1rem'
      }}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Select Your Pain Level
      </Typography>
      <Slider
        value={painLevel}
        onChange={handleChange}
        step={1}
        marks={painMarks}
        min={0}
        max={10}
        valueLabelDisplay="on"
        sx={{
          height: 8,
          '& .MuiSlider-track': {
            border: 'none',
            background: `linear-gradient(90deg,
              #4CAF50 0%,
              #8BC34A 20%,
              #CDDC39 30%,
              #FFEB3B 40%,
              #FFC107 50%,
              #FF9800 60%,
              #FF5722 70%,
              #E53935 80%,
              #D32F2F 90%,
              #B71C1C 100%)`
          },
          '& .MuiSlider-thumb': {
            width: 24,
            height: 24,
            backgroundColor: '#fff',
            border: '2px solid currentColor',
            '&:hover': {
              boxShadow: '0 0 0 8px rgba(0,0,0,0.16)'
            }
          }
        }}
      />
      <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
        {painLevelLabels.map(({ value, text }) => (
          <Grid item key={value}>
            <Typography variant="caption" fontWeight={value === 0 ? 'bold' : 'medium'}>
              {text}
            </Typography>
          </Grid>
        ))}
      </Grid>
      <Typography variant="h6" fontWeight="bold" mt={2} color="primary">
        Selected Level: {painLevel} - {painLevelLabels.find((p) => p.value >= painLevel)?.text || 'Unknown'}
      </Typography>
    </Box>
  );
};

export default PainScale;
