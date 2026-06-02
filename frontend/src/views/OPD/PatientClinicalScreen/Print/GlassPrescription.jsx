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

const PrintGlassPrescription = ({ glassPrescription }) => {
  if (!glassPrescription || glassPrescription.length === 0) return null;

  return (
    <Box className="glassPrints" sx={{ mt: 2 }}>
      {glassPrescription.map((record, idx) => (
        <React.Fragment key={record._id}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, mb: 1, color: '#333',backgroundColor: '#f5f5f5',p:0.5 }}
          >
            Glass Prescription {glassPrescription.length > 1 ? `#${idx + 1}` : ''}
          </Typography>

          <TableContainer component={Paper} elevation={1} sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#126078' }}>
                  {['Eye', 'Type', 'Sphere', 'Cylinder', 'Axis', 'Vision'].map((head) => (
                    <TableCell
                      key={head}
                      align="center"
                      sx={headCellStyle}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {['right', 'left'].map((eye) =>
                  record[eye]?.map((prescription) => (
                    <React.Fragment key={`${eye}-${prescription._id}`}>
                      {['distance', 'add'].map((type) => (
                        <TableRow key={`${eye}-${prescription._id}-${type}`}>
                          {type === 'distance' && (
                            <TableCell rowSpan={2} align="center" sx={cellStyle}>
                              {eye.charAt(0).toUpperCase() + eye.slice(1)}
                            </TableCell>
                          )}
                          <TableCell align="center" sx={cellStyle}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </TableCell>
                          <TableCell align="center" sx={cellStyle}>
                            {prescription[type]?.sphere || '—'}
                          </TableCell>
                          <TableCell align="center" sx={cellStyle}>
                            {prescription[type]?.cylinder || '—'}
                          </TableCell>
                          <TableCell align="center" sx={cellStyle}>
                            {prescription[type]?.axis || '—'}
                          </TableCell>
                          <TableCell align="center" sx={cellStyle}>
                            {prescription[type]?.vision || '—'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </React.Fragment>
      ))}
    </Box>
  );
};

// Styles
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
  border: '1px solid #ccc'
};

export default PrintGlassPrescription;
