import React from 'react';
import { RadioGroup, FormControlLabel, Radio } from '@mui/material';

const FieldTypeSelector = ({ value, onChange }) => (
  <RadioGroup row value={value} onChange={(e) => onChange(e.target.value)}>
    <FormControlLabel value="single" control={<Radio />} label="Single" />
    <FormControlLabel value="multiple" control={<Radio />} label="Multiple" />
  </RadioGroup>
);

export default FieldTypeSelector;
