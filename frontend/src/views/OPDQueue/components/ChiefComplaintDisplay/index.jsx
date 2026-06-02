import React from 'react';
import { Box, Typography, Chip, Divider } from '@mui/material';

const ChiefComplaintDisplay = ({ data }) => {
  console.log("DATA", data);

  if (!data || data.length === 0 || !data[0]?.chiefComplaint) {
    return <Typography>No Chief Complaint Data</Typography>;
  }

  const patientData = data[0]; // Extract the first patient record
  const chiefComplaintList = patientData.chiefComplaint; // Extract chiefComplaint array

  const extractData = (array, key = 'data') =>
    Array.isArray(array) ? array.map((item) => (typeof item === 'object' ? item[key] ?? 'N/A' : String(item))) : [];

  return (
    <Box sx={{ p: 4, borderRadius: 3, backgroundColor: '#f9f9f9' }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', color: '#333' }}>
        Chief Complaints
      </Typography>

      {chiefComplaintList.map((chiefComplaint, idx) => (
        <Box key={idx} sx={{ mb: 3, p: 3, border: '1px solid #ddd', borderRadius: 2, backgroundColor: '#fff' }}>
          
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976D2' }}>
            Complaint: {chiefComplaint.chiefComplaint || 'N/A'}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Notes */}
          {chiefComplaint.notes?.trim() && (
            <Typography variant="body1" sx={{ mt: 1, fontStyle: 'italic', color: '#555' }}>
              <strong>Notes:</strong> {chiefComplaint.notes}
            </Typography>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            
            {/* Location */}
            {extractData(chiefComplaint.Location).length > 0 && (
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#333' }}>Location:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {extractData(chiefComplaint.Location).map((text, index) => (
                    <Chip key={index} label={text} sx={{ backgroundColor: '#E3F2FD', color: '#1976D2' }} />
                  ))}
                </Box>
              </Box>
            )}

            {/* Description */}
            {extractData(chiefComplaint.description).length > 0 && (
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#333' }}>Description:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {extractData(chiefComplaint.description).map((text, index) => (
                    <Chip key={index} label={text} sx={{ backgroundColor: '#FFF3E0', color: '#E65100' }} />
                  ))}
                </Box>
              </Box>
            )}

            {/* Since */}
            {extractData(chiefComplaint.since).length > 0 && (
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#333' }}>Since:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {extractData(chiefComplaint.since).map((text, index) => (
                    <Chip key={index} label={text} sx={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }} />
                  ))}
                </Box>
              </Box>
            )}

            {/* Treatment */}
            {extractData(chiefComplaint.treatment).length > 0 && (
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#333' }}>Treatment:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {extractData(chiefComplaint.treatment).map((text, index) => (
                    <Chip key={index} label={text} sx={{ backgroundColor: '#FBE9E7', color: '#C62828' }} />
                  ))}
                </Box>
              </Box>
            )}

            {/* Symptoms */}
            {extractData(chiefComplaint.symptoms, 'with').length > 0 && (
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#333' }}>Symptoms:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {extractData(chiefComplaint.symptoms, 'with').map((text, index) => (
                    <Chip key={index} label={text} sx={{ backgroundColor: '#EDE7F6', color: '#4527A0' }} />
                  ))}
                </Box>
              </Box>
            )}

          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default ChiefComplaintDisplay;
