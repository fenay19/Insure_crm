import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Card, CardContent, Divider, Grid, Typography } from '@mui/material';

import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import ParentPayee from './parent-payee/ParentPayee';
import PayeeCategory from './payee-category/PayeeCategory';
import PatientPayee from './patient-payee/PatientPayee';
import { ToastContainer } from 'react-toastify';


const Category = () => {
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
          Category Master
        </Typography>
      </Breadcrumb>
      <Grid container spacing={gridSpacing}>
        <Grid item>
          <Card>
            <CardContent style={{ width: '79vw' }}>
              <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <Tabs value={value} onChange={handleChange} centered>
                  <Tab label ="Payee Category" />
                  {/* <Tab label ="Parent Payee" />
                  <Tab label="Patient Payee" /> */}
                </Tabs>
                <Divider />
                <Box sx={{ mt: 2 }}>
                  {value === 0 && <PayeeCategory/>}
                  {/* {value === 1 &&<ParentPayee/>}
                  {value === 2 && <PatientPayee/>} */}

                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <ToastContainer/>
    </>
  );
};

export default Category;
