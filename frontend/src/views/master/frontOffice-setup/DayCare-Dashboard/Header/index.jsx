import React from 'react';
import { Grid, Typography } from '@mui/material';
import DashboardCard from '../../../../../component/DashboardCard';


const daycareData = {
  dayCarePatients: 200,
  bedPosition: {
    totalBed: 100,
    vacant: 40,
    toBeDischarged: 10,
    occupied: 45,
    maintenance: 5
  },
  discharges: [100, 30, 40, 50, 20],
  revenue: 500,
  receipts: {
    cash: 300,
    credit: 200
  }
};

const DayCareHeader = () => {
  return (
    <Grid container spacing={2} mb={3}>
      {/* Card: No. of Day Care Patients */}
      <Grid item xs={12} sm={6} md={4} lg={2.5}>
        <DashboardCard title="No. of Day Care Patients" headerColor="#ff9800">
          <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 'bold', fontSize: '20px' }}>
            {daycareData.dayCarePatients}
          </Typography>
        </DashboardCard>
      </Grid>

      {/* Card: Day Care Bed Position */}
      <Grid item xs={12} sm={6} md={4} lg={3.5}>
        <DashboardCard title="Day Care Bed Position" headerColor="#4caf50">
          <Typography sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>Total Bed</Typography>
          <Typography sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>Vacant</Typography>
          <Typography sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>To Be Discharged</Typography>
          <Typography sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>Occupied</Typography>
          <Typography sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>Maintenance</Typography>
        </DashboardCard>
      </Grid>

      {/* Card: No. of Day Care Discharges */}
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <DashboardCard title="No. of Day Care Discharges" headerColor="#9c27b0">
          {daycareData.discharges?.map((item) => (
            <Typography key={item} variant="h4" sx={{ color: '#9c27b0', fontWeight: 'bold', fontSize: '20px' }}>
              {item}
            </Typography>
          ))}
        </DashboardCard>
      </Grid>

      {/* Card: Day Care Revenue */}
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <DashboardCard title="Day Care Revenue" headerColor="#03a9f4">
          <Typography variant="h4" sx={{ color: '#03a9f4', fontWeight: 'bold', fontSize: '20px' }}>
            ₹{daycareData.revenue}
          </Typography>
        </DashboardCard>
      </Grid>

      {/* Card: Receipts */}
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <DashboardCard title="Receipts" headerColor="#03a9f4">
          <Typography sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            Cash: <span style={{ color: '#4caf50' }}>₹{daycareData.receipts.cash}</span>
          </Typography>
          <Typography sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            Credit: <span style={{ color: '#4caf50' }}>₹{daycareData.receipts.credit}</span>
          </Typography>
        </DashboardCard>
      </Grid>
    </Grid>
  );
};

export default DayCareHeader;
