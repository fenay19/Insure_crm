import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import OPDDashboard from '../OPD-Dashboard';
import IPDDashboard from '../IPD-Dashboard';
import EmergencyDashboard from '../Emergency-Dashboard';
import DayCareDashboard from '../DayCare-Dashboard';
import { TextField } from '@mui/material';
import DateMonthFilter from './DateMonthFilter/DateMonthFilter';

export default function FrontOfficeDashboards() {
  const [selectedDashboard, setSelectedDashboard] = useState('OPD');

  const handleButtonClick = (dashboard) => {
    setSelectedDashboard(dashboard);
  };

  const [filter, setFilter] = useState(null);

  const handleFilterChange = (filterData) => {
    console.log('Filter Applied:', filterData);
    setFilter(filterData);
  };

  return (
    <>
      {/* Header with Card containing buttons */}
      <Card sx={{ padding: '16px', marginBottom: '16px' }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '16px'
              }}
            >
              {['Dashboard', 'OPD', 'IPD', 'Emergency', 'Walkin', 'Daycare'].map((dashboard) => (
                <>
                  <Button
                    key={dashboard}
                    onClick={() => handleButtonClick(dashboard)}
                    variant={selectedDashboard === dashboard ? 'contained' : 'outlined'}
                    sx={{
                      width: { xs: '100%', sm: '150px', md: '120px' },
                      textAlign: 'center'
                    }}
                  >
                    {dashboard}
                  </Button>
                </>
              ))}
            </Box>
            <DateMonthFilter onFilterChange={handleFilterChange} />
          </Box>
        </CardContent>
      </Card>

      {/* Dashboard Component Rendering */}
      <Box sx={{ p: 3 }}>
        {selectedDashboard === 'OPD' && <OPDDashboard filterDate={filter}/>}
        {selectedDashboard === 'IPD' && <IPDDashboard />}
        {selectedDashboard === 'Emergency' && <EmergencyDashboard />}
        {selectedDashboard === 'Walkin' && <DayCareDashboard />}
        {selectedDashboard === 'Daycare' && <DayCareDashboard />}
      </Box>
    </>
  );
}
