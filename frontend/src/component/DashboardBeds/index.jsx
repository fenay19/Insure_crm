import React from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import { FaBed } from 'react-icons/fa6';

const DashboardBeds = ({ floors, cardStyle, iconStyle, titleStyle }) => {
  return (
    <Card>
      <Box sx={{ padding: '2rem' }}>
        <Grid container spacing={3}>
          {floors.map((floor, floorIndex) => (
            <Grid item xs={12} key={floorIndex}>
              <Grid container alignItems="center" spacing={2}>
                {/* Floor Title */}
                <Grid item xs={12} sm={4}>
                  <Typography variant="h5" sx={{ ...titleStyle }}>
                    {floor.name}
                  </Typography>
                </Grid>

                {/* Floor Rooms */}
                <Grid item xs={12} sm={8}>
                  <Grid container spacing={2} justifyContent="space-between">
                    {floor.rooms.map((room, index) => (
                      <Grid item xs={12} sm={4} md={3.8} key={index}>
                        <Card
                          sx={{
                            background: room.background,
                            height: '100%',
                            borderRadius: 2,
                            ...cardStyle
                          }}
                        >
                          <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" sx={{ marginBottom: 1 }}>
                              {room.name}
                            </Typography>
                            <FaBed
                              style={{
                                fontSize: 30,
                                color: 'white',
                                ...iconStyle
                              }}
                            />
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Card>
  );
};

export default DashboardBeds;
