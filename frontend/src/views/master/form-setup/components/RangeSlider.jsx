import React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

const marks = [
  {
    value: 0,
    label: '0%'
  },
  {
    value: 20,
    label: ''
  },
  {
    value: 40,
    label: ''
  },
  {
    value: 60,
    label: ''
  },
  {
    value: 80,
    label: ''
  },
  {
    value: 100,
    label: '100%'
  }
];

function valuetext(value) {
  return `${value}`;
}

export default function RangeSlider() {
  return (
    <Box sx={{ width: 300 }} mt={3}>
      <Slider
        aria-label="Range"
        defaultValue={0}
        getAriaValueText={valuetext}
        step={20} 
        min={0} 
        max={100} 
        valueLabelDisplay="auto"
        marks={marks}
      />
    </Box>
  );
}
