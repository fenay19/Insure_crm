import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Box, Typography } from '@mui/material';

export default function CurrentDate() {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval on unmount
  }, []);

  const datePart = format(currentDate, 'dd MMM yyyy'); // e.g., 20 Jun 2025
  const timePart = format(currentDate, 'hh:mm:ss a'); // e.g., 11:34:45 AM
  const weekdayPart = format(currentDate, 'EEE');

  return (
    <Box
      sx={{
        marginRight: '2rem !important',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start' // Left-align content
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontSize: { xs: '12px', sm: '12px', md: '14px', lg: '14px' },
          fontWeight: '500',
          color: '#fff',
          letterSpacing: '0.5px',
          lineHeight: '1.5'
        }}
      >
        {weekdayPart} {datePart}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontSize: { xs: '12px', sm: '14px', md: '14px', lg: '14px' },
          color: '#fff',
          fontWeight: 400,
          letterSpacing: '0.3px'
        }}
      >
        {timePart}
      </Typography>
    </Box>
  );
}
