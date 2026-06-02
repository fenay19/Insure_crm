import PropTypes from 'prop-types';
import React, { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useMediaQuery
} from '@mui/material';

// third-party
import Chart from 'react-apexcharts';

// custom components
import FilterControls from 'component/Filter';

const DoctorOPDPieChart = ({ chartData, onChange }) => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  const matchDownXs = useMediaQuery(theme.breakpoints.down('sm'));

  const [selectedDepartment, setSelectedDepartment] = useState('select');

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
    onChange(event.target.value);
  };

  return (
    <Card>
      {/* Card Header with FilterControls */}
      <CardHeader
        title={
          <Typography component="div" className="card-header">
            Doctor OPD
          </Typography>
        }
        action={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* FilterControls inside CardHeader */}
            <FilterControls />
          </Box>
        }
      />
      <Divider />
      <CardContent>
        {/* Dropdown Section */}
        <Box sx={{ minWidth: 200, mb: 3, display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div>
            <Typography variant="h6" gutterBottom>
              Select Department
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="department-dropdown-label">Department</InputLabel>
              <Select
                labelId="department-dropdown-label"
                id="department-dropdown"
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                label="Department"
              >
                <MenuItem value="select">Select</MenuItem>
                <MenuItem value="Cardiology">Cardiology</MenuItem>
                <MenuItem value="Neurology">Neurology</MenuItem>
                <MenuItem value="Orthopedics">Orthopedics</MenuItem>
                <MenuItem value="Pediatrics">Pediatrics</MenuItem>
              </Select>
            </FormControl>
          </div>
          {selectedDepartment && selectedDepartment !== 'select' && (
            <Typography variant="body1" sx={{ mt: 2 }}>
              Selected Department: <strong>{selectedDepartment}</strong>
            </Typography>
          )}
        </Box>

        {/* Chart Section */}
        <Grid container spacing={2} direction={matchDownMd && !matchDownXs ? 'row' : 'column'}>
          <Grid item xs={12} sm={7} md={8}>
            <Chart {...chartData} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

DoctorOPDPieChart.propTypes = {
  chartData: PropTypes.object.isRequired // Added 'isRequired' for better prop validation
};

export default DoctorOPDPieChart;
