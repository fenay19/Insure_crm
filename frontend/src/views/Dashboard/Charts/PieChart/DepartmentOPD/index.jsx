import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Card, CardContent, CardHeader, Divider, Grid, Typography, IconButton, useMediaQuery } from '@mui/material';

// material-ui icons
import FilterAltIcon from '@mui/icons-material/FilterAlt';

// third-party
import Chart from 'react-apexcharts';
import FilterControls from 'component/Filter';

const DepartmentOpdPieChart = ({ chartData }) => {
  const theme = useTheme();
  const chartRef = useRef(null);
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  const matchDownXs = useMediaQuery(theme.breakpoints.down('sm'));

  // State to toggle the filter controls visibility
  const [showFilter, setShowFilter] = useState(false);

  const toggleFilter = () => {
    setShowFilter((prev) => !prev);
  };

  useEffect(() => {
    // Give the container time to render
    setTimeout(() => {
      chartRef?.current?.chart?.windowResizeHandler();
    }, 100);
  }, []);

  return (
    <Card sx={{ position: 'relative', overflow: 'visible' }}>
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 10
        }}
      >
        <IconButton onClick={toggleFilter} color="primary" sx={{ fontSize: '2rem' }}>
          {/* <FilterAltIcon sx={{ fontSize: '2rem' }} /> */}
        </IconButton>
      </Box>
      {showFilter && (
        <Box
          sx={{
            position: 'absolute',
            top: 56, // Below the icon
            right: 16,
            zIndex: 10,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[3],
            borderRadius: 1,
            p: 2,
            width: 520 // Adjust width for FilterControls
          }}
        >
          <FilterControls />
        </Box>
      )}
      <CardHeader
        title={
          <Typography component="div" className="card-header">
            {chartData?.head}
          </Typography>
        }
      />
      {/* <Divider /> */}
      <CardContent>
        <Grid container spacing={2} direction={matchDownMd && !matchDownXs ? 'row' : 'column'}>
          <Grid item xs={12} sm={7} md={12} sx={{ minHeight: 300 }}>
            <Chart ref={chartRef} {...chartData} />
          </Grid>
          <Grid item sx={{ display: { md: 'block', sm: 'none' } }}>
            {/* <Divider /> */}
          </Grid>
          <Grid
            item
            container
            direction={matchDownMd && !matchDownXs ? 'column' : 'row'}
            justifyContent="space-around"
            alignItems="center"
            xs={12}
            sm={5}
            md={12}
          >
            <Grid item>
              <Grid container direction="column">
                <Typography variant="h6"> {chartData?.head} </Typography>
                <Typography variant="subtitle1" sx={{ color: theme.palette.primary.main }}>
                  {/* + 16.85% */}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

DepartmentOpdPieChart.propTypes = {
  chartData: PropTypes.object
};

export default DepartmentOpdPieChart;
