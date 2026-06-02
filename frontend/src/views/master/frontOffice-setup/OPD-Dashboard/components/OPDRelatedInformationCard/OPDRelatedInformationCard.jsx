import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { styled } from '@mui/material/styles';
import { get } from 'api/api';
import { TextField } from '@mui/material';

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
  fontSize: '1.3rem'
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
  fontSize: '1.2rem',
  letterSpacing: '0.5px'
});

const OPDRelatedInformationCard = ({ filterDate }) => {
  const [opdCardsData, setOpdCardsData] = useState({
    appointments: [],
    newPatients: 0,
    followUpPatients: 0,
    cash: 0,
    credit: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    get(`opd-patient/opd-dashboard-data/${filterDate?.value}`).then((res) => {
      setOpdCardsData({
        appointments: res?.appointments ?? [],
        cash: res?.cashRevenue || 0,
        credit: res?.creditRevenue || 0,
        newPatients: res?.newPatients || 0,
        followUpPatients: res?.followUpPatients || 0,
        totalRevenue: res?.totalRevenue || 0
      });
    });
  }, [filterDate]);

  return (
    <>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          padding: '16px',
          '@media (min-width: 600px)': {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 4
          }
        }}
      >
        <StyledCard>
          <CardActionArea>
            <CardHeader sx={{ backgroundColor: '#1976d2', color: 'white' }}>No. of Appointments</CardHeader>
            <CardContentWrapper>
              <EnhancedTypography color="text.secondary">{opdCardsData?.appointments?.length||0}</EnhancedTypography>
            </CardContentWrapper>
          </CardActionArea>
        </StyledCard>

        <StyledCard>
          <CardActionArea>
            <CardHeader sx={{ backgroundColor: '#d32f2f', color: 'white' }}>No. of OPD Registration</CardHeader>
            <CardContentWrapper>
              <EnhancedTypography variant="h5" color="text.secondary">
                <Typography>
                  <strong>New :</strong> {opdCardsData?.newPatients||0}
                </Typography>
                <Typography>
                  <strong>Follow-Up :</strong> {opdCardsData?.followUpPatients||0}
                </Typography>
              </EnhancedTypography>
            </CardContentWrapper>
          </CardActionArea>
        </StyledCard>

        <StyledCard>
          <CardActionArea>
            <CardHeader sx={{ backgroundColor: '#388e3c', color: 'white' }}>OPD Revenue Daily</CardHeader>
            <CardContentWrapper>
              <EnhancedTypography variant="h5" color="text.secondary">
                ₹ {opdCardsData?.totalRevenue || 0}
              </EnhancedTypography>
            </CardContentWrapper>
          </CardActionArea>
        </StyledCard>

        <StyledCard>
          <CardActionArea>
            <CardHeader sx={{ backgroundColor: '#f57c00', color: 'white' }}>Receipt</CardHeader>
            <CardContentWrapper>
              <EnhancedTypography variant="h5" color="text.secondary">
                Cash : {opdCardsData?.cash || 0}
              </EnhancedTypography>
              <EnhancedTypography variant="h5" color="text.secondary">
                Credit : {opdCardsData?.credit || 0}
              </EnhancedTypography>
            </CardContentWrapper>
          </CardActionArea>
        </StyledCard>
      </Box>
    </>
  );
};

export default OPDRelatedInformationCard;
