import React from 'react';
import { Box, Typography, Chip, Card, CardContent, Divider } from '@mui/material';

const MedicalPrescriptionDisplay = ({ data }) => {
    console.log("INSIDE THE MED",data)
  if (!data || data.length === 0) {
    return <Typography>No Medication Data</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {data?.map((med, index) => (
        <Card key={index} sx={{ borderRadius: 3, boxShadow: 3, p: 2, backgroundColor: '#f9f9f9' }}>
          <CardContent>
            {/* Chips for Type + Brand Name + Dose */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip label={med.type} sx={{ backgroundColor: '#E3F2FD', color: '#1976D2' }} />
              <Chip label={med.brandName} sx={{ backgroundColor: '#FFF3E0', color: '#E65100' }} />
              <Chip label={med.dose} sx={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }} />
            </Box>

            {/* Heading */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', textTransform: 'uppercase' }}>
              Tablet Details
            </Typography>
            <Divider sx={{ my: 2 }} />

            {/* Medication Details */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body1">
                <strong>Intake:</strong> {med.intake}
              </Typography>
              <Typography variant="body1">
                <strong>Timing:</strong> {med.time} ({med.when})
              </Typography>
              <Typography variant="body1">
                <strong>Duration:</strong> {med.duration}
              </Typography>
              {med.notes && (
                <Typography variant="body1" sx={{ fontStyle: 'italic', color: '#555' }}>
                  <strong>Notes:</strong> {med.notes}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default MedicalPrescriptionDisplay;
