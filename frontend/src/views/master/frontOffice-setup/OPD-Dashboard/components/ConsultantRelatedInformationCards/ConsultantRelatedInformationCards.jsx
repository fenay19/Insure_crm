import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { styled } from '@mui/material/styles';
import { Divider } from '@mui/material';
import { get } from 'api/api';

const StyledCard = styled(Card)(() => ({
  borderRadius: 12,
  overflow: 'hidden',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
  }
}));

const CardHeader = styled(Typography)({
  padding: '16px',
  fontWeight: 'bold',
  textAlign: 'center',
  fontSize: '1.2rem'
});

const CardContentWrapper = styled(CardContent)({
  textAlign: 'center',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
});

const EnhancedTypography = styled(Typography)({
  fontWeight: 'bold',
  fontSize: '1rem',
  letterSpacing: '0.5px'
});

function ConsultantRelatedInformationCards({ drInfo }) {
  const [cardsData, setCardsData] = useState({
    totalAppointments: 0,
    filteredAppointments: 0,
    newPatients: 0,
    followUpPatients: 0,
    totalRevenue: 0,
    checkedPatients: 0,
    waitingPatients: 0,
    appointments: []
  });

  useEffect(() => {
    if (drInfo?.consultantId) {
      get(`opd-patient/opd-dashboard-data-consultant/${drInfo.consultantId}`)
        .then((res) => {
          console.log('OPD Dashboard Data:', res);
          
          setCardsData({
     
            
            totalAppointments: res?.totalAppointments,
            newPatients: res?.newPatients,
            followUpPatients: res?.followUpPatients,
            totalRevenue: res?.totalRevenue,
            checkedPatients: res?.checkedPatients,
            waitingPatients: res?.waitingPatients,
            appointments: res?.appointments
          });
        })
        .catch((error) => {
          console.error('Error fetching OPD dashboard data:', error);
        });
    }
  }, [drInfo]);

  return (
    <>
    <Box
  sx={{
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    '@media (min-width: 600px)': {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', // Reduced card width
      gap: 1.5,
    },
  }}
>
  {/* Total Appointments Card */}
  <StyledCard sx={{ minHeight: 110 }}>
    <CardActionArea>
      <CardHeader sx={{ backgroundColor: '#1976d2', color: 'white', fontSize: '0.8rem', py: 0.5 }}>
        Total Appointments
      </CardHeader>
      <CardContentWrapper>
        <EnhancedTypography color="text.secondary" sx={{ fontSize: '0.8rem' }}>
          {cardsData?.totalAppointments || 0}
        </EnhancedTypography>
      </CardContentWrapper>
    </CardActionArea>
  </StyledCard>

  {/* No. of Registration Card */}
  <StyledCard sx={{ minHeight: 110 }}>
    <CardActionArea>
      <CardHeader sx={{ backgroundColor: '#d32f2f', color: 'white', fontSize: '0.8rem', py: 0.5 }}>
        No. of Registration
      </CardHeader>
      <CardContentWrapper>
        <EnhancedTypography color="text.secondary" sx={{ fontSize: '0.75rem' }}>
          <Typography><strong>New :</strong> {cardsData?.newPatients || 0}</Typography>
          <Typography><strong>Follow-Up :</strong> {cardsData?.followUpPatients || 0}</Typography>
        </EnhancedTypography>
      </CardContentWrapper>
    </CardActionArea>
  </StyledCard>

  {/* Check Patient Card */}
  <StyledCard sx={{ minHeight: 110 }}>
    <CardActionArea>
      <CardHeader sx={{ backgroundColor: '#388e3c', color: 'white', fontSize: '0.8rem', py: 0.5 }}>
        Check Patient
      </CardHeader>
      <CardContentWrapper>
        <EnhancedTypography color="text.secondary" sx={{ fontSize: '0.8rem' }}>
          {cardsData?.checkedPatients || 0}
        </EnhancedTypography>
      </CardContentWrapper>
    </CardActionArea>
  </StyledCard>

  {/* Waiting Patient Card */}
  <StyledCard sx={{ minHeight: 110 }}>
    <CardActionArea>
      <CardHeader sx={{ backgroundColor: '#f57c00', color: 'white', fontSize: '0.8rem', py: 0.5 }}>
        Waiting Patient
      </CardHeader>
      <CardContentWrapper>
        <EnhancedTypography color="text.secondary" sx={{ fontSize: '0.8rem' }}>
          {cardsData?.waitingPatients || 0}
        </EnhancedTypography>
      </CardContentWrapper>
    </CardActionArea>
  </StyledCard>

  {/* Revenue Card */}
  <StyledCard sx={{ minHeight: 110 }}>
    <CardActionArea>
      <CardHeader sx={{ backgroundColor: '#6a1b9a', color: 'white', fontSize: '0.8rem', py: 0.5 }}>
        Revenue
      </CardHeader>
      <CardContentWrapper>
        <EnhancedTypography color="text.secondary" sx={{ fontSize: '0.8rem' }}>
          ₹ {cardsData?.totalRevenue || 0}
        </EnhancedTypography>
      </CardContentWrapper>
    </CardActionArea>
  </StyledCard>
</Box>


    </>
  );
}

export default ConsultantRelatedInformationCards;
