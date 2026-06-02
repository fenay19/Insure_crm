import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Card, CardHeader, CardContent, Divider, Grid, Typography } from '@mui/material';
import InvestigationMaster from './forms/InvestigationMaster';
import MachineMaster from './forms/MachineMaster';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';

const Radiology = () => {
  const [value, setValue] = React.useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Breadcrumb title="">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Radiology master
        </Typography>
      </Breadcrumb>
      <Grid container spacing={gridSpacing}>
        <Grid item>
          <Card>
            <CardContent style={{ width: '79vw' }}>
              <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <Tabs value={value} onChange={handleChange} centered>
                  <Tab label="Method/Machine Master" />
                  <Tab label="Investigation Master" />
                </Tabs>
                <Divider />
                <Box sx={{ mt: 2 }}>
                  {value === 0 && <MachineMaster />}
                  {value === 1 && <InvestigationMaster />}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Radiology;
