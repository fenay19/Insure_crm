import React, { useCallback, useEffect, useState } from 'react';
import OPDQueueHeader from './Header';
import { Box, Card, Grow, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import ConsultantRelatedInformationCards from 'views/master/frontOffice-setup/OPD-Dashboard/components/ConsultantRelatedInformationCards/ConsultantRelatedInformationCards';
import { get } from 'api/api';
import PatientTable from './components/UserTable';
import Dashboard from './components/Dashboard/Dashboard';

const OPDQueue = () => {
  const patient = useSelector((state) => state.patient.selectedPatient);
  const isPatientOut = patient?.status?.toLowerCase()?.trim() === 'patient out';

  return (
    <>
      {/* <Dashboard /> */}
      <Card>
        <OPDQueueHeader />
        <Grow in={isPatientOut}>
          <Box
            sx={{
              width: '170px',
              backgroundColor: 'red',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              boxShadow: '0px 4px 10px rgba(0,0,0,0.2)',
              zIndex: 1000,
              textAlign: 'center',
              position: 'fixed',
              bottom: '2rem',
              right: '60px',
              fontWeight: 'bold',
              animation: 'blink 2.3s infinite',
              '@keyframes blink': {
                '0%': { opacity: 1 },
                '50%': { opacity: 0 },
                '100%': { opacity: 1 }
              }
            }}
          >
            <Typography variant="h4" color="white">
              Patient Out
            </Typography>
          </Box>
        </Grow>
      </Card>
    </>
  );
};

export default OPDQueue;
