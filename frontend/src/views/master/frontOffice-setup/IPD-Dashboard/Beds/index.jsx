import React from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import { FaBed } from 'react-icons/fa6';

const HospitalLayout = () => {
  const rooms = [
    { name: 'Private room | 1', background: '#90EE90' },
    { name: 'Semi-private room | 2', background: '#ffff80' },
    { name: 'General ward Female GW1', background: '#ff4d4d' },
    { name: 'General ward male GW2', background: '#ff4d4d' },
    { name: 'General ward pediatric GW3', background: '#ff4d4d' },
    { name: 'Private room 1,3', background: '#d9d9d9' }
  ];

  return (
    <Card>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
        <Grid container spacing={3}>
          {/* First Floor Title and Cards  */}
          <Grid item xs={12}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="h5">First Floor</Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Grid container spacing={2} justifyContent="space-between">
                  {rooms.slice(0, 3).map((room, index) => (
                    <Grid item xs={12} sm={4} md={3.8} key={index}>
                      <Card sx={{ background: room.background, height: '100%', borderRadius: 2 }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ marginBottom: 1 }}>
                            {room.name}
                          </Typography>
                          <FaBed style={{ fontSize: 30, color: 'white' }} />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Second Floor Title and Cards  */}
          <Grid item xs={12}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="h5">Second Floor</Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Grid container spacing={2} justifyContent="space-between">
                  {rooms.slice(3).map((room, index) => (
                    <Grid item xs={12} sm={4} md={3.8} key={index}>
                      <Card sx={{ background: room.background, height: '100%', borderRadius: 2 }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ marginBottom: 1 }}>
                            {room.name}
                          </Typography>
                          <FaBed style={{ fontSize: 30, color: 'white' }} />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

export default HospitalLayout;
