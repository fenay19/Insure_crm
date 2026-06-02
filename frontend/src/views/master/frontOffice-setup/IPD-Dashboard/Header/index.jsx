import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import { data } from '../data';
import DashboardCard from 'component/DashboardCard';

const IPDHeader = () => {
  return (
    <Box sx={{ padding: '16px', backgroundColor: '#f5f5f5' }}>
      <Grid container spacing={2}>
        {/* Card 1: Total Patients */}
        <Grid item xs={12} sm={6} md={4} lg={1.5}>
          <DashboardCard title="Total Patients" headerColor="#1976d2">
            <Typography variant="h4" sx={{ color: '#03a9f4', fontWeight: 'bold', fontSize: '20px' }}>
              {data.totalPatients}
            </Typography>
          </DashboardCard>
        </Grid>

        {/* Card 2: IPD Cash and Credit */}
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <DashboardCard title="No. of IPD" headerColor="#455a64">
            <Typography sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div>Cash:</div>
              <div style={{ color: '#4caf50' }}>₹{data.ipd.cash}</div>
            </Typography>
            <Typography sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div>Credit:</div>
              <div style={{ color: '#4caf50' }}>₹{data.ipd.credit}</div>
            </Typography>
          </DashboardCard>
        </Grid>

        {/* Card 3: Bed Position */}
        <Grid item xs={12} sm={6} md={4} lg={2.5}>
          <DashboardCard title="Bed Position" headerColor="#4caf50">
            <Typography sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div>Total Bed:</div>
              <div>{data.bedPosition.totalBed}</div>
            </Typography>
            <Typography sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div>Vacant:</div>
              <div style={{ color: '#4caf50' }}>{data.bedPosition.vacant}</div>
            </Typography>
            <Typography sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div>To Be Discharged:</div>
              <div style={{ color: '#ff9800' }}>{data.bedPosition.toBeDischarged}</div>
            </Typography>
            <Typography sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div>Occupied:</div>
              <div style={{ color: '#f44336' }}>{data.bedPosition.occupied}</div>
            </Typography>
            <Typography sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div>Maintenance:</div>
              <div style={{ color: '#9e9e9e' }}>{data.bedPosition.maintenance}</div>
            </Typography>
          </DashboardCard>
        </Grid>

        {/* Card 6: No. of Discharge */}
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <DashboardCard title="No. of Discharge" headerColor="#f44336">
            <Typography sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div>Discharge:</div> <div style={{ color: '#4caf50' }}>{data.discharge}</div>
            </Typography>
            <Typography sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div>Death:</div> <div style={{ color: '#f44336' }}>{data.death}</div>
            </Typography>
            <Typography sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div>Dama:</div> <div style={{ color: '#ff9800' }}>{data.dama}</div>
            </Typography>
          </DashboardCard>
        </Grid>

        {/* Card 4: IPD Revenue */}
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <DashboardCard title="IPD Revenue" headerColor="#03a9f4">
            <Typography variant="h4" sx={{ color: '#03a9f4', fontWeight: 'bold', fontSize: '20px' }}>
              ₹{data.ipdRevenue}
            </Typography>
          </DashboardCard>
        </Grid>
        {/* Card 5: Receipts */}
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <DashboardCard title="Receipts" headerColor="#ff9800">
            <Typography sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div>Cash:</div> <div style={{ color: '#4caf50' }}>₹{data.receipt.cash}</div>
            </Typography>
            <Typography sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div>Credit:</div> <div style={{ color: '#4caf50' }}>₹{data.receipt.credit}</div>
            </Typography>
          </DashboardCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default IPDHeader;
