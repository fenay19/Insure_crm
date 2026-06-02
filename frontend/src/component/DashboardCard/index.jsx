import React from 'react';
import { Box, Typography } from '@mui/material';

const cardStyles = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '220px'
};

const headerStyles = (color) => ({
  backgroundColor: color,
  color: '#fff',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
  padding: '15px 0',
  fontWeight: 'bold',
  textAlign: 'center',
  fontSize: '1.25rem'
});

const contentStyles = {
  padding: '16px',
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  alignItems: 'center'
};

const DashboardCard = ({ title, headerColor, children }) => {
  return (
    <Box sx={cardStyles}>
      <Box sx={headerStyles(headerColor)}>
        <Typography variant="h6" sx={{ color: 'white' }}>
          {title}
        </Typography>
      </Box>
      <Box sx={contentStyles}>{children}</Box>
    </Box>
  );
};

export default DashboardCard;
