import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Typography, Grid, Divider } from '@mui/material';
import FilterControls from 'component/Filter';

const ReusableBarChart = ({ title = '', seriesData = [], xLabels = [], seriesLabelMap = {}, colors = [], onFilter }) => {
  const handleFilter = (filterData) => {
    if (onFilter) {
      onFilter(filterData);
    }
  };

  return (
    <Grid container direction="column" alignItems="center" sx={{ p: 2 }}>
      {/* Title and Filter Controls */}
      <Grid container alignItems="center" justifyContent="space-between" sx={{ width: '100%', mb: 4 }}>
        {title && (
          <Typography component="div" className="card-header">
            {title}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 2 }}>{/* <FilterControls onFilter={handleFilter} /> */}</Box>
      </Grid>
      <Divider sx={{ width: '100%', borderColor: '#bdbdbd', marginBottom: 5 }} />

      {/* Chart */}
      <Box sx={{ width: '100%', maxWidth: 1000, overflowX: 'auto' }}>
        <BarChart
          width={1000}
          height={300}
          series={seriesData.map((data, index) => ({
            data,
            label: Object.keys(seriesLabelMap)[index] || '',
            id: Object.keys(seriesLabelMap)[index] || `series${index}`,
            color: colors[index] || '#ccc'
          }))}
          xAxis={[{ data: xLabels, scaleType: 'band' }]}
          //   barLabel={(item) => seriesLabelMap[item.seriesId] || ''}
          tooltip={{
            trigger: 'item',
            formatter: ({ series, data, label }) => `<b>${series.label}</b>: ${data} on <b>${label}</b>`
          }}
        />
      </Box>
    </Grid>
  );
};

export default ReusableBarChart;
