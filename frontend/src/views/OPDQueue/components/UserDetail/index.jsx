import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { useSelector } from 'react-redux';

const UserDetail = () => {
  const selectedUser = useSelector((state) => state.patient.selectedPatient);

  const details = [
    { label: 'Patient Name', value: `${selectedUser?.patientFirstName || ''} ${selectedUser?.patientLastName || ''}` },
    { label: 'DOB', value: selectedUser?.dob ? new Date(selectedUser.dob).toLocaleDateString('en-GB') : 'NA' },
    { label: 'Age', value: selectedUser?.age || 'NA' },
    { label: 'Gender', value: selectedUser?.gender || 'NA' },
    { label: 'Mobile Number', value: selectedUser?.mobile_no || 'NA' },
    { label: 'Marital Status', value: selectedUser?.maritalStatus || 'NA' },
    { label: 'UHID', value: selectedUser?.uhid || 'NA' },
    { label: 'OP.No.', value: selectedUser?.opd_regNo || 'NA' },
    { label: 'Aadhar No.', value: selectedUser?.aadhar_no || 'NA' },
    { label: 'ABHA Number', value: selectedUser?.abhaNumber || 'NA' },
    { label: 'Patient Payee', value: selectedUser?.patientPayee || 'NA' },
    { label: 'Package Type', value: selectedUser?.packageType || 'NA' },
    { label: 'Referred By', value: selectedUser?.referredBy || 'NA' },
    { label: 'Marketing Community', value: selectedUser?.marketingCommunity || 'NA' },
    // { label: 'Address', value: selectedUser?.address || 'NA' }
  ];

  return (
    <Box display="flex" justifyContent="center" mb={5} sx={{ backgroundColor: '#f0f7fa', padding: '2rem' }}>
    <Paper
      elevation={4}
      sx={{
        boxShadow: 4, // Soft shadow for depth
        padding: '20px',
        borderRadius: '12px', // Smooth rounded corners
        border: '2px solid #126078', // Solid teal border
        transition: 'all 0.3s ease-in-out',
        
          backgroundColor: 'rgb(205, 241, 252)' // Slightly darker teal on hover for effect
        
      }}
    >
      {selectedUser && (
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#2c3e50',
            mb: 3,
            textTransform: 'capitalize',
            textDecoration: 'underline'
          }}
        >
          {selectedUser?.patientFirstName} {selectedUser?.patientLastName}
        </Typography>
      )}
  
      <Grid container spacing={2} >
        {details.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1, // Adds spacing between label and value
                color: '#333',
                padding: '3px',
                borderRadius: '5px',
               
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#555', fontSize: '0.8rem' }}>
                {item.label}:
              </Typography>
              <Typography variant="body2" sx={{ color: '#333' , fontSize: '0.8rem' }}>
                {item.value}
              </Typography>
            </Box>
            
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#333', padding: '3px', borderRadius: '5px' }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#555', fontSize: '0.8rem' }}>
          Address:
        </Typography>
        <Typography variant="body2" sx={{ color: '#333' , fontSize: '0.8rem' }}>
          {selectedUser?.address || 'NA'}
        </Typography>
      </Box>
    </Paper>
  </Box>
  );
};

export default UserDetail;
