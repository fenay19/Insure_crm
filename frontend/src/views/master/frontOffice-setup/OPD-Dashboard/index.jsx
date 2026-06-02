import React, { useEffect, useState, useCallback } from 'react';
import OPDRelatedInformationCard from './components/OPDRelatedInformationCard/OPDRelatedInformationCard';
import ConsultantDataTable from './components/ConsultantDataTable/ConsultantDataTable';
import ConsultantAvailableSlotsWithInformation from './components/ConsultantAvailableSlotsWithInformation/ConsultantAvailableSlotsWithInformation';
import { get } from 'api/api';

import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router';

const OPDDashboard = ({ filterDate }) => {
  const [ConsultantData, setConsultantData] = useState([]);
  const [consultantSchedulingData, setConsultantSchedulingData] = useState({});
  const [doctorAvailableClicked, setDoctorAvailableClicked] = useState(true);
  const navigate = useNavigate();

  const fetchConsultantData = useCallback(async () => {
    try {
      const response = await get('newConsultant');
      if (response.status === 200) {
        setConsultantData(response.data);
      } else {
        console.error('Failed to fetch data:', response.statusText);
        setConsultantData([]);
      }
    } catch (error) {
      console.error('Error fetching consultant data:', error);
      setConsultantData([]);
    }
  }, []);

 

  useEffect(() => {
    fetchConsultantData();
  }, [fetchConsultantData]);

  return (
    <>
      <OPDRelatedInformationCard filterDate={filterDate} />
      <Stack direction="row" spacing={2} my={3} justifyContent="center">
        <Button
          variant="contained"
          color="secondary"
          startIcon={<LocalHospitalIcon />}
          onClick={() => setDoctorAvailableClicked(!doctorAvailableClicked)}
          sx={{ fontSize: '1.1rem', padding: '12px 60px', backgroundColor: '#6a0dad', color: 'white' }} // Purple
        >
          Doctors Availability
        </Button>
        <Button
          variant="contained"
          startIcon={<EventAvailableIcon />}
          sx={{ backgroundColor: '#008080', color: 'white', fontSize: '1.1rem', padding: '12px 60px' }} // Teal
          onClick={() => navigate('/master/appointment')}
        >
          Appointment Booking
        </Button>
        <Button
          size="medium"
          variant="contained"
          sx={{ backgroundColor: '#FF4500', color: 'white', fontSize: '1.1rem', padding: '12px 60px' }} // Orange-Red
          startIcon={<AssignmentIcon />}
          onClick={() => navigate('/confirm-patientForm')}
        >
          OPD Registration
        </Button>
      </Stack>

      {doctorAvailableClicked && (
        <ConsultantDataTable consultantData={ConsultantData} setConsultantSchedulingData={setConsultantSchedulingData} />
      )}
      {Object.keys(consultantSchedulingData).length > 0 && (
        <ConsultantAvailableSlotsWithInformation consultantSchedulingData={consultantSchedulingData} />
      )}
    </>
  );
};

export default OPDDashboard;
