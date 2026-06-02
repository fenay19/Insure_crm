import React from 'react';
import PatientTable from '../UserTable';
import ConsultantRelatedInformationCards from 'views/master/frontOffice-setup/OPD-Dashboard/components/ConsultantRelatedInformationCards/ConsultantRelatedInformationCards';
import DashboardCard from 'views/master/frontOffice-setup/OPD-Dashboard/components/DashboardCards/DashboardCard';
import DrInformationCard from 'views/master/frontOffice-setup/OPD-Dashboard/components/DoctorInformationCard/DrInformationCard';
import { Box, Grid } from '@mui/material';

import ParentCharts from 'views/master/frontOffice-setup/OPD-Dashboard/components/Graphs/ParentCharts';
const Dashboard = () => {
  // const patient = useSelector((state) => state.patient.selectedPatient);
  const loginData = JSON.parse(localStorage.getItem('loginData'));

  return (
   
    <Box sx={{ flexGrow: 1, mb: 2, px: 2 }}>
    <Grid container spacing={1}>
      {/* Doctor card - 4 of 12 columns on large screens */}
      <Grid item xs={12} md={7}>
        <DrInformationCard drInfo={{ consultantId: loginData?.refId }} />
      </Grid>
  
      {/* Dashboard cards container - 8 of 12 columns on large screens */}
      <Grid item xs={12} md={5}>
        <Grid container >
          <Grid item xs={12} sm={4}>
            <DashboardCard text="OPD" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <DashboardCard text="IPD" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <DashboardCard text="EMERGENCY" />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  
    <Box mt={3}>
      <ConsultantRelatedInformationCards drInfo={{ consultantId: loginData?.refId }} />
    </Box>
    <Grid >
  </Grid>
    <PatientTable />
    <ParentCharts/>
  </Box>
   
  );
};

export default Dashboard;
