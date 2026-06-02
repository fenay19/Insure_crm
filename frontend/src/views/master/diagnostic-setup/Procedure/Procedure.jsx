import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Card, CardHeader, CardContent, Divider, Grid, Typography } from '@mui/material';

import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import ProcedureForm from './ProcedureForm';

const Procedure = () => {
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
          Procedure
        </Typography>
      </Breadcrumb>
      <Grid container spacing={gridSpacing}>
        <Grid item>
          <Card>
            <CardContent style={{ width: '79vw' }}>
              <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <Tabs value={value} onChange={handleChange} centered>
                  <Tab label="Procedure" />
                </Tabs>
                <Divider />
                <Box >{value === 0 && <ProcedureForm />}</Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Procedure;
