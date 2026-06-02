import React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const SwitchBtn = ({ onClick }) => {
  return (
    <FormGroup>
      <FormControlLabel control={<Switch defaultChecked onClick={onClick} />} label="" />
    </FormGroup>
  );
};

export default SwitchBtn;
