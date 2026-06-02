import React, { useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Typography, Grid, TextField, Button, Divider } from '@mui/material';
import FilterControls from 'component/Filter';

const uData = [40, 30, 29];
const pData = [24, 13, 18];
const eData = [23, 40, 50];
const dayCare = [20, 30, 44];
const walkin = [15, 20, 22];
const RevenueChart = ({ title = '' }) => {
  const handleFilter = ({ fromDate, toDate, selectedMonth }) => {
    console.log({ fromDate, toDate, selectedMonth });
  };

  return (
    <Grid container direction="column" alignItems="center" sx={{ p: 2 }}>
      {/* Title */}
      <Grid container alignItems="center" justifyContent="space-between" sx={{ width: '100%', mb: 4 }}>
        {title && (
          <Typography component="div" className="card-header">
            {title}
          </Typography>
        )}

        {/* Controls for Date and Month */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FilterControls onFilter={handleFilter} />
        </Box>
      </Grid>
      <Divider sx={{ width: '100%', borderColor: '#bdbdbd', marginBottom: 5 }} />

      {/* Chart */}
      <Box sx={{ width: '100%', maxWidth: 1000, overflowX: 'auto' }}>
        <BarChart
          width={1000}
          height={300}
          series={[
            { data: pData, label: 'OPD', id: 'pvId', color: '#e0ffcd', stack: 'total' },
            { data: uData, label: 'IPD', id: 'uvId', color: '#fdffcd', stack: 'total' },
            { data: eData, label: 'EMR', id: 'emrId', color: '#ffebbb', stack: 'total' },
            { data: dayCare, label: 'DayCare', id: 'daycareId', color: '#b3e5fc', stack: 'total' },
            { data: walkin, label: 'Walkin', id: 'walkinId', color: '#ffcdd2', stack: 'total' }
          ]}
          barLabel={(item, context) => {
            // Show the value at the top of each bar
            return item.value?.toString();
          }}
          tooltip={{
            trigger: 'item', // Display tooltip on item hover
            formatter: ({ series, data, label }) => `<b>${series.label}</b>: ${data} on <b>${label}</b>`
          }}
        />
      </Box>
      <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
        Department
      </Typography>
    </Grid>
  );
};

export default RevenueChart;
