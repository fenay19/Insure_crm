import React from 'react';
import { Box, Typography } from '@mui/material';

const StatusBoxes = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3,
        flexDirection: { xs: 'row', sm: 'row', md: 'row', lg: 'column' },
        justifyContent: 'space-between',
        marginTop: { xs: '2rem', lg: '0' },
        margin: 'auto'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            width: '20px',
            height: '20px',
            backgroundColor: '#ff9999',
            borderRadius: '50%',
            marginRight: 1
          }}
        />
        <Typography>Checked</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            width: '20px',
            height: '20px',
            backgroundColor: '#80dfff',
            borderRadius: '50%',
            marginRight: 1
          }}
        />
        <Typography>Booked and Paid</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            width: '20px',
            height: '20px',
            backgroundColor: '#424874',
            borderRadius: '50%',
            marginRight: 1
          }}
        />
        <Typography>Booked but not Paid</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            width: '20px',
            height: '20px',
            backgroundColor: '#388e3c',
            borderRadius: '50%',
            marginRight: 1
          }}
        />
        <Typography>Vacant</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            width: '20px',
            height: '20px',
            backgroundColor: '#9ba6a5',
            borderRadius: '50%',
            marginRight: 1
          }}
        />
        <Typography>Appointment Booked</Typography>
      </Box>
    </Box>
  );
};

export default StatusBoxes;
