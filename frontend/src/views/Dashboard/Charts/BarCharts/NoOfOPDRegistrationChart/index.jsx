import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Typography, Grid, Divider } from '@mui/material';
import FilterControls from 'component/Filter';

const uData = [10, 20, 30];
const pData = [30, 40, 10];
const xLabels = ['Today', 'Yesterday', 'Day Before'];

const NoOfOPDRegistrationChart = ({ title = '' }) => {
  // A lookup table for seriesId to label mapping
  const seriesLabelMap = {
    pvId: 'N',
    uvId: 'F'
  };

  const handleFilter = ({ fromDate, toDate, selectedMonth }) => {
    console.log(fromDate, toDate, selectedMonth);
  };

  return (
    <Grid container direction="column" alignItems="center" sx={{ p: 2 }}>
      {/* Title and Controls */}
      <Grid container alignItems="center" justifyContent="space-between" sx={{ width: '100%', mb: 4 }}>
        <Typography component="div" variant="h6" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FilterControls onFilter={handleFilter} />
        </Box>
      </Grid>

      {/* Divider with enhanced visibility */}
      <Divider sx={{ width: '100%', borderColor: '#757575', borderBottomWidth: 2, my: 2 }} />

      {/* Chart */}
      <Box sx={{ width: '100%', maxWidth: 1000, overflowX: 'auto' }}>
        <BarChart
          width={1000}
          height={300}
          series={[
            { data: pData, label: 'N', id: 'pvId', color: '#c9fdd7' },
            { data: uData, label: 'F', id: 'uvId', color: '#bbe4e9' }
          ]}
          xAxis={[{ data: xLabels, scaleType: 'band' }]}
          // Show the label inside the bars
          barLabel={(item) => {
            const label = seriesLabelMap[item.seriesId];
            return label;
          }}
          // Show value on top of the bars
          tooltip={{
            trigger: 'item',
            formatter: ({ series, data, label }) => `<b>${series.label}</b>: ${data} on <b>${label}</b>`
          }}
        />
      </Box>
    </Grid>
  );
};

export default NoOfOPDRegistrationChart;
