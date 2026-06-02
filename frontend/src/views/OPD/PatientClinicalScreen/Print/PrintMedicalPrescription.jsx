import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';

const PrintMedicalPrescription = ({ medicalPrescription }) => {
  const prescriptions = medicalPrescription?.flatMap((entry) => entry.prescription || []);
  const showChanging = prescriptions?.some((item) => item.changing);

  return (
    <Box className="medPrints" sx={{ mt: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#333', backgroundColor: '#f5f5f5',p:0.5 }}>
        Medical Prescription
      </Typography>

      <TableContainer component={Paper} elevation={1} sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#126078' }}>
              <TableCell sx={headCellStyle}>Sr. No.</TableCell>
              <TableCell sx={headCellStyle}>Brand / Generic Name</TableCell>
              <TableCell sx={headCellStyle}>Type</TableCell>
              <TableCell sx={headCellStyle}>Tablet</TableCell>
              <TableCell sx={headCellStyle}>Dose</TableCell>
              <TableCell sx={headCellStyle}>Duration</TableCell>
              <TableCell sx={headCellStyle}>Instructions</TableCell>
              {showChanging && <TableCell sx={headCellStyle}>Changing</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {prescriptions?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showChanging ? 8 : 7} align="center" sx={cellStyle}>
                  No prescriptions available.
                </TableCell>
              </TableRow>
            ) : (
              prescriptions.map((v, ind) => (
                <TableRow key={v._id || ind}>
                  <TableCell sx={cellStyle}>{ind + 1}</TableCell>
                  <TableCell sx={cellStyle}>
                    <div><strong>Brand:</strong> {v.brandName || 'N/A'}</div>
                    {v.genericName && (
                      <div style={{ fontSize: '10px', color: '#555' }}>
                        <strong>Generic:</strong> {v.genericName}
                      </div>
                    )}
                  </TableCell>
                  <TableCell sx={cellStyle}>{v.type || 'N/A'}</TableCell>
                  <TableCell sx={cellStyle}>{v.intake || 'N/A'}</TableCell>
                  <TableCell sx={cellStyle}>{v.dose || 'N/A'}</TableCell>
                  <TableCell sx={cellStyle}>{v.duration || 'N/A'}</TableCell>
                  <TableCell sx={cellStyle}>
                    {v.notes && <div><strong>Note:</strong> {v.notes}</div>}
                    {v.when && <div><strong>When:</strong> {v.when}</div>}
                    <div>
                      <strong>Frequency:</strong>{' '}
                      {['Once', 'Twice', 'Thrice'].includes(v.time)
                        ? `${v.time} a day`
                        : v.time
                        ? `Every ${v.time}`
                        : 'N/A'}
                    </div>
                    <div>
                      <strong>Dose:</strong> {v.morning || 0} - {v.evening || 0} - {v.night || 0}
                    </div>
                  </TableCell>
                  {showChanging && (
                    <TableCell sx={cellStyle}>{v.changing || '—'}</TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// Shared Styles
const headCellStyle = {
  color: '#fff',
  fontWeight: 600,
  fontSize: '11px',
  padding: '6px 8px',
  border: '1px solid #ccc'
};

const cellStyle = {
  fontSize: '10.5px',
  padding: '5px 6px',
  border: '1px solid #ccc',
  verticalAlign: 'top'
};

export default PrintMedicalPrescription;
