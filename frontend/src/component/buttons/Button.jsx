import React from 'react';
import Button from '@mui/material/Button';

const ReusableButton = ({
  text = 'Click Me',
  onClick,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  disabled = false,
  startIcon,
  endIcon,
  sx = {}
}) => {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      color={color}
      size={size}
      disabled={disabled}
      startIcon={startIcon}
      endIcon={endIcon}
      sx={sx}
    >
      {text}
    </Button>
  );
};

export default ReusableButton;
