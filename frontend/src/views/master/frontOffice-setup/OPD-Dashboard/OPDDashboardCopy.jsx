import React, { useEffect, useState, useCallback } from 'react';
import { Card, Box, Grid, Divider } from '@mui/material';
import TimeSlots from './components/TimeSlots';
import DashboardHeader from './components/Header';
import { dashboardcardData } from './data';
import StatusBoxes from './components/StatusBoxes';

const OPDDashboard = () => {
  const [isDoctorAvailable, setIsDoctorAvailable] = useState('Unavailable');
  const [doctorData, setDoctorData] = useState({});

  const handleSelectedDoctorAvailability = useCallback((dr) => {
    setIsDoctorAvailable(dr);
  }, []);

  useEffect(() => {
    const doctor = dashboardcardData?.find(({ id }) => id === isDoctorAvailable?.id);
    if (doctor) {
      setDoctorData(doctor);
    }
  }, [isDoctorAvailable?.id]);

  return (
    <>
      <Box>
        <DashboardHeader
          handleSelectedDoctorAvailability={handleSelectedDoctorAvailability}
          drData={doctorData}
          isDoctorAvailable={isDoctorAvailable}
        />
      </Box>

      {/* Second Section - Additional Appointment and Revenue Cards */}
      {isDoctorAvailable?.value === 'Available' && (
        <>
          {/* Time Slots */}
          <Card sx={{ padding: { xs: 2, sm: 3, md: 5 }, marginTop: '3rem' }}>
            <Grid container spacing={2}>
              {/* TimeSlots Section */}
              <Grid item xs={12} md={8} sx={{ marginBottom: { xs: 3, md: 0 } }}>
                <TimeSlots />
              </Grid>

              {/* StatusBoxes Section */}
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  margin: 'auto',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <StatusBoxes />
              </Grid>
            </Grid>
          </Card>
        </>
      )}
    </>
  );
};

export default OPDDashboard;
