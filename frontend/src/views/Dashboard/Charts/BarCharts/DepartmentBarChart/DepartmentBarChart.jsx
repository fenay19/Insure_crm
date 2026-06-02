import { BarChart } from '@mui/x-charts/BarChart';
import { Typography, Box } from '@mui/material';
import React from 'react';

const DepartmentBarChart = ({ data = [] }) => {
  if (!data.length) return null;

  return (
    <>
      <Typography variant="h5" align="left" sx={{ mb: 2, fontWeight: 600 }}>
        Department Wise Data
      </Typography>
      <Box sx={{ width: '100%', height: 290 }}>
        <BarChart
          height={290}
          series={[
            {
              data: data.map((d) => d.count),
              label: 'Policy Count'
            }
            // {
            //   data: data.map((d) => d.totalAmount),
            //   label: 'Total Amount'
            // }
          ]}
          xAxis={[{ data: data.map((d) => d.department), scaleType: 'band' }]}
          margin={{ top: 50, bottom: 30, left: 100, right: 10 }}
        />
      </Box>
    </>
  );
};

export default DepartmentBarChart;
