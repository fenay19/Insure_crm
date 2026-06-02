import { Box, Grid } from '@mui/material';
import React from 'react';
import TotalAppointmentGraph from './TotalAppointmentGraph';
import RevenueChart from './RevenueChart';
import NumberOfRegistrationGraph from './NumberOfRegistrationGraph';

function ParentCharts() {
  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
     
          <TotalAppointmentGraph />
        
    
          <RevenueChart />
  
       
          <NumberOfRegistrationGraph />
      
    </Box>
  );
}

export default ParentCharts;
