import React from 'react';
import { Card, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const PatientPreviousDetails = () => {
  return (
    <Card sx={{ p: 3, boxShadow: 2, borderRadius: 2, mt: -3 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        Patient Previous Details
      </Typography>
      <hr />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Patient Remark</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Patient Outstanding</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Counter Visit</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Card Holder</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Card Benefits</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Card History</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Card Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Good</TableCell>
              <TableCell>none</TableCell>
              <TableCell>0</TableCell>
              <TableCell>Abc xy</TableCell>
              <TableCell>none</TableCell>
              <TableCell>none</TableCell>
              <TableCell>none</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default PatientPreviousDetails;
