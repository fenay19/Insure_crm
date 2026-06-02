import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

function DashboardCard({ text }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 1, width: '100%' }}>
      <Card
        sx={{
          width: '100%',
          maxWidth: 180,
          borderRadius: 2,
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            backgroundColor: 'rgb(10, 141, 255)',
            p: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
            {text}
          </Typography>
        </Box>
        <CardContent>
    
        </CardContent>
      </Card>
    </Box>
  );
}

export default DashboardCard;
