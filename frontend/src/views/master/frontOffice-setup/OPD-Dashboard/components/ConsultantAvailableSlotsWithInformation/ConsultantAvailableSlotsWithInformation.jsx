import React from 'react';
import ConsultantRelatedInformationCards from '../ConsultantRelatedInformationCards/ConsultantRelatedInformationCards';
import TimeSlotsOfConsultant from '../TimeSlotsOfConsultant/TimeSlotsOfConsultant';
import { Divider, Paper, Typography } from '@mui/material';
function ConsultantAvailableSlotsWithInformation({ consultantSchedulingData }) {
  const drInfo = {
    departmentName: consultantSchedulingData?.consultantData?.employmentDetails?.departmentOrSpeciality?.departmentName,
    departmentId: consultantSchedulingData?.consultantData?.employmentDetails?.departmentOrSpeciality?._id,
    consultantId: consultantSchedulingData?.consultantData?._id,
    date: consultantSchedulingData?.date
  };

  return (
    <>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 3 }}>
        {/* DR NAME AND DEPARTMENT */}
        {consultantSchedulingData && (
          <Typography variant="h2" fontWeight="bold" textAlign="center" sx={{ my: 4 }}>
            <span style={{ color: '#d32f2f', textDecoration: 'underline' }}>
              {`${consultantSchedulingData?.consultantData?.basicDetails?.firstName} ${consultantSchedulingData?.consultantData?.basicDetails?.lastName}`}
            </span>{' '}
            |{' '}
            <span style={{ color: '#1976d2', textDecoration: 'underline' }}>
              {consultantSchedulingData?.consultantData?.employmentDetails?.departmentOrSpeciality?.departmentName}
            </span>
          </Typography>
        )}

        <ConsultantRelatedInformationCards drInfo={drInfo} />
        <Divider sx={{ mt: 3, mb: 5 }} />

        <TimeSlotsOfConsultant timeSlots={consultantSchedulingData} drInfo={drInfo} />
      </Paper>
    </>
  );
}

export default ConsultantAvailableSlotsWithInformation;
