import React from 'react';
import { Box, Alert, Typography } from '@mui/material';

const LiveSystem = () => {
  return (
    <Box display="flex" justifyContent="center" mt={6}>
      <Alert severity="info" sx={{ width: '100%', maxWidth: 700 }}>
        <Typography variant="body1">
          This feature is available only in the <strong>Live System</strong>. It is not accessible in the Demo module.
        </Typography>
      </Alert>
    </Box>
  );
};

export default LiveSystem;
