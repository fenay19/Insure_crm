import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Typography, Grid, Divider } from '@mui/material';
import FilterControls from 'component/Filter';

const uData = [40, 30, 20, 30, 33, 44, 22, 11];
const pData = [24, 13, 56, 23, 43, 13, 21, 23];

const seriesLabelMap = {
  cId: 'C',
  oId: 'O'
};

const AmountModelStatsChart = ({ title = '' }) => {
  const handleFilter = ({ fromDate, toDate, selectedMonth }) => {
    console.log({ fromDate, toDate, selectedMonth });
  };

  return (
    <Grid container direction="column" alignItems="center" sx={{ p: 2 }}>
      {/* Title */}
      <Grid container alignItems="center" justifyContent="space-between" sx={{ width: '100%', mb: 4 }}>
        <Typography component="div" className="card-header">
          {title}
        </Typography>
        {/* Controls for Date and Month */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FilterControls onFilter={handleFilter} />
        </Box>
      </Grid>
      {/* Divider */}
      <Divider sx={{ width: '100%', borderColor: '#bdbdbd', marginBottom: 5 }} />
      {/* Chart */}
      <Box sx={{ width: '100%', maxWidth: 1000, overflowX: 'auto' }}>
        <BarChart
          width={1000}
          height={300}
          series={[
            { data: pData, label: 'Cash', id: 'cId', color: '#f8f398' },
            { data: uData, label: 'Online', id: 'oId', color: '#d1f6a4' }
          ]}
          barLabel={(item, context) => {
            const barLabel = seriesLabelMap[item.seriesId];
            return barLabel;
          }}
          tooltip={{
            trigger: 'item', // Display tooltip on item hover
            formatter: ({ series, data, label }) => `<b>${series.label}</b>: ${data} on <b>${label}</b>`
          }}
        />
      </Box>
      <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
        Mode
      </Typography>
    </Grid>
  );
};

export default AmountModelStatsChart;
