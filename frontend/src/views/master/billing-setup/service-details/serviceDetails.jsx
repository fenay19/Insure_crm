import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Card, CardContent, Divider, Grid, Typography } from '@mui/material';

import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import RadiologyService from './radiology-service/RadiologyService';
import PathalogyService from './pathalogy-service/PathalogyService';
import OpdPackage from './opd-package/OpdPackage';
import ServiceDetail from './service-detail/ServiceDetail';
import { ToastContainer } from 'react-toastify';
import OpdConsultation from './Opd-consultant/OpdConsultant';

const ServiceDetails = () => {
  const [value, setValue] = React.useState(0);

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
          Medicine master
        </Typography>
      </Breadcrumb>
      <Grid container spacing={gridSpacing}>
        <Grid item>
          <Card>
            <CardContent style={{ width: '80vw' }}>
              <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <Tabs value={value} onChange={handleChange} centered>
                  <Tab label="Service Details" />
                  {/* <Tab label="Radiology Service" />
                  <Tab label ="Pathalogy Service" /> */}
                  <Tab label="OPD Package" />
                  <Tab label="OPD Consultation" />
                </Tabs>
                <Divider />
                <Box sx={{ mt: 2 }}>
                  {value === 0 && <ServiceDetail />}
                  {/* {value === 1 && <RadiologyService/>}
                  {value === 2 && <PathalogyService/>} */}
                  {value === 1 && <OpdPackage />}
                  {value === 2 && <OpdConsultation />}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <ToastContainer />
      </Grid>
    </>
  );
};

export default ServiceDetails;
