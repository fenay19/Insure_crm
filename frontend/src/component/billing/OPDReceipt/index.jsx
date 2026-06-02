import React from 'react';
import { Card, CardContent, Typography, Box, Divider, Grid } from '@mui/material';
import { AccessTime, CalendarToday, LocalHospital, Payment, ConfirmationNumber } from '@mui/icons-material';

const OPDReceipt = () => {
  return (
    <Card sx={{ maxWidth: 420, mx: 'auto', mt: 4, p: 2, boxShadow: 6, borderRadius: 3, overflow: 'hidden' }}>
      {/* Header with Hospital Name */}
      <Box
  sx={{
    backgroundImage: "linear-gradient(135deg, #2196f3 20%, #90caf9 100%)",
    color: "#fff",
    textAlign: "center",
    py: 3,
    borderRadius: "12px 12px 0 0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 420, // Adjust width
    mx: "auto", // Center horizontally
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)", // Soft shadow for depth
  }}
>
  <Typography 
    variant="h5" 
    sx={{ fontWeight: "bold", textShadow: "1px 1px 3px rgba(0,0,0,0.2)" }}
  >
    <LocalHospital sx={{ verticalAlign: "middle", mr: 1, fontSize: 30 }} /> City Hospital
  </Typography>
  <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.95 }}>
    123, Health Street, City
  </Typography>
</Box>



      <CardContent>
        {/* Token Number */}
        <Box textAlign="center" my={2} p={2} sx={{ bgcolor: '#fce4ec', borderRadius: 2, boxShadow: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#d81b60' }}>
            <ConfirmationNumber sx={{ verticalAlign: 'middle', mr: 1 }} /> Token No: 600
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Doctor & Department Info */}
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Doctor:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">Dr. John Doe</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Department:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">Cardiology</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Date & Time */}
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              <CalendarToday sx={{ fontSize: 18, verticalAlign: 'middle', mr: 1 }} />
              Date:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">31 Jan 2025</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              <AccessTime sx={{ fontSize: 18, verticalAlign: 'middle', mr: 1 }} />
              Time:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1">04:30 PM</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Payment Status */}
        <Box textAlign="center" mt={2} p={2} sx={{ bgcolor: '#e8f5e9', borderRadius: 2, boxShadow: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
            <Payment sx={{ verticalAlign: 'middle', mr: 1 }} /> Payment Status: Paid
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OPDReceipt;
