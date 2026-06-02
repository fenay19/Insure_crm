import React from 'react';
import { Grid, Typography } from '@mui/material';
import DashboardCard from '../../../../../component/DashboardCard';
import { emergencyData } from '../data';



const EmergencyHeader = () => {
  return (
    <Grid container spacing={2}>
      {/* Card: No. of Emergency Patients */}
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <DashboardCard title="No. of Emergency Patients" headerColor="#ff5722">
          <Typography variant="h4" sx={{ color: '#ff5722', fontWeight: 'bold', fontSize: '20px' }}>
            {emergencyData.emergencyPatients}
          </Typography>
        </DashboardCard>
      </Grid>

      {/* Card: Emergency Bed Position */}
      <Grid item xs={12} sm={6} md={4} lg={2.5}>
        <DashboardCard title="Emergency Bed Position" headerColor="#8bc34a">
          <Typography sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            Total Bed: <b>{emergencyData.bedPosition.totalBed}</b>
          </Typography>
          <Typography sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            Vacant: <span style={{ color: '#8bc34a' }}>{emergencyData.bedPosition.vacant}</span>
          </Typography>
          <Typography sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            To Be Discharged: <span style={{ color: '#ff9800' }}>{emergencyData.bedPosition.toBeDischarged}</span>
          </Typography>
          <Typography sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            Occupied: <span style={{ color: '#f44336' }}>{emergencyData.bedPosition.occupied}</span>
          </Typography>
          <Typography sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            Maintenance: <span style={{ color: '#9e9e9e' }}>{emergencyData.bedPosition.maintenance}</span>
          </Typography>
        </DashboardCard>
      </Grid>

      {/* Card: No. of Emergency Discharges */}
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <DashboardCard title="No. of Emergency Discharges" headerColor="#9c27b0">
          <Typography sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            Discharge: <span style={{ color: '#4caf50' }}>{emergencyData.discharges.discharge}</span>
          </Typography>
          <Typography sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            Dama: <span style={{ color: '#4caf50' }}>{emergencyData.discharges.dama}</span>
          </Typography>
          <Typography sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            Death: <span style={{ color: '#4caf50' }}>{emergencyData.discharges.death}</span>
          </Typography>
          <Typography sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            Referral: <span style={{ color: '#4caf50' }}>{emergencyData.discharges.referral}</span>
          </Typography>
        </DashboardCard>
      </Grid>

      {/* Card: No of MLC */}
      <Grid item xs={12} sm={6} md={4} lg={1.5}>
        <DashboardCard title="No of MLC" headerColor="#03a9f6">
          <Typography variant="h4" sx={{ color: '#03a9f6', fontWeight: 'bold', fontSize: '20px' }}>
            {emergencyData.noOfMLC}
          </Typography>
        </DashboardCard>
      </Grid>

      {/* Card: Emergency Revenue */}
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <DashboardCard title="Emergency Revenue" headerColor="#2196f3">
          <Typography variant="h4" sx={{ color: '#2196f3', fontWeight: 'bold', fontSize: '20px' }}>
            ₹{emergencyData.revenue}
          </Typography>
        </DashboardCard>
      </Grid>

      {/* Card: Receipts */}
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <DashboardCard title="Receipts" headerColor="#4caf50">
          <Typography sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
            Cash: <span style={{ color: '#4caf50' }}>₹{emergencyData.receipts.cash}</span>
          </Typography>
          <Typography sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
            Credit: <span style={{ color: '#4caf50' }}>₹{emergencyData.receipts.credit}</span>
          </Typography>
        </DashboardCard>
      </Grid>
    </Grid>
  );
};

export default EmergencyHeader;
