import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
} from '@mui/material';
import { useGetConsultantsQuery } from 'services/endpoints/consultants/consultantApi';
import { get } from 'api/api';

function DrInformationCard({ drInfo }) {
  const { data = [] } = useGetConsultantsQuery();
  const [totalAppointments, setTotalAppointments] = useState(null);
  const [img, setImg] = useState()
  const filteredConsultant = data?.find(item => item?._id === drInfo?.consultantId);
  const { firstName, middleName, lastName } = filteredConsultant?.basicDetails || {};
  const specialization =
    filteredConsultant?.employmentDetails?.departmentOrSpeciality?.departmentName || 'N/A';

  useEffect(() => {
    if (drInfo?.consultantId) {
      get(`opd-patient/opd-dashboard-data-consultant/${drInfo.consultantId}`)
        .then(res => setTotalAppointments(res?.totalAppointments || 0))
        .catch(err => console.error('Error fetching appointments:', err));
    }
  }, [drInfo]);

console.log(filteredConsultant?.basicDetails?.profilePhoto);


  return (
    <Paper
      elevation={4}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 3,
        p: 3,
        background: 'linear-gradient(135deg, #2aa5f9 0%, #1c75d8 100%)',
        color: 'white',
        overflow: 'hidden',
        flexWrap: 'wrap',
       height:"90%"
      }}
    >
      {/* Text Content */}
      <Box sx={{ flex: 1, minWidth: 250 }}>
        <Typography variant="subtitle1" sx={{ fontSize: 14, mb: 1, color:"white" }}>
          Good Morning,
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 'bold',color:"white" }}>
          Dr. {`${firstName || ''} ${middleName || ''} ${lastName || ''} (${specialization})`}
        </Typography>

        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          You have total
          <Chip
            label={`${totalAppointments ?? '...'}`} 
            size="small"
            sx={{
              backgroundColor: '#f44336',
              color: 'white',
              fontWeight: 'bold',
            }}
          />
          appointments today.
        </Typography>

       
      </Box>

      {/* Doctor Illustration (Optional) */}
      {/* <Box
        component="img"
        src={filteredConsultant?.basicDetails?.profilePhoto} // Replace with actual path or use import
        alt="Doctor"
        sx={{
          height: 150,
          width: 'auto',
          ml: 2,
          display: { xs: 'none', sm: 'block' },
        }}
      /> */}
    </Paper>
  );
}

export default DrInformationCard;
