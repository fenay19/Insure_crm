import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useGetPatientOutQuery } from 'services/endpoints/OPDPatient/opdPatientApi';
import Print from 'views/OPD/PatientClinicalScreen/Print/Print';
import { useDispatch } from 'react-redux';
import { selectPatient } from 'reduxSlices/getPatientSlice';

const PatientTable = () => {
  const loginData = JSON.parse(window.localStorage.getItem('loginData'));
  const { data, isLoading, isError } = useGetPatientOutQuery(loginData?.refId);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedPatient, setSelectedPatient] = React.useState(null);
  const dispatch = useDispatch();
  const handleView = (patient) => {
    setSelectedPatient(patient);
    dispatch(selectPatient(patient));
    setOpenDialog(true);
  };

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          mx: 'auto',
          mt: 4,
          overflowX: 'auto'
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#445', color:"white"  }}>
              <TableCell sx={{ color:"white" }}>
                <strong>Sr. No</strong>
              </TableCell>
              <TableCell sx={{ color:"white" }}>
                <strong>Patient Name</strong>
              </TableCell>
              <TableCell  sx={{ color:"white" }}>
                <strong>Consultant</strong>
              </TableCell>
              <TableCell  sx={{ color:"white" }}>
                <strong>Department</strong>
              </TableCell>
              <TableCell  sx={{ color:"white" }}>
                <strong>Date</strong>
              </TableCell>
              <TableCell  sx={{ color:"white" }}>
                <strong>Time</strong>
              </TableCell>
              <TableCell  sx={{ color:"white" }}>
                <strong>EMR</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="error">Error fetching patient data</Typography>
                </TableCell>
              </TableRow>
            ) : data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No Patient Out
                </TableCell>
              </TableRow>
            ) : (
              data?.map((row, index) => (
                <TableRow key={row?._id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{`${row?.patientFirstName || ''} ${row?.patientMiddleName || ''} ${row?.patientLastName || ''}`}</TableCell>
                  <TableCell>{row?.consultantName || '-'}</TableCell>
                  <TableCell>{row?.departmentName || '-'}</TableCell>
                  <TableCell>{row?.date || '-'}</TableCell>
                  <TableCell>{row?.time || '-'}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        handleView(row);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* EMR Dialog */}
      <Dialog
  open={openDialog}
  onClose={() => setOpenDialog(false)}
  fullWidth
  maxWidth="xl" // makes the dialog as wide as possible
>
  <DialogTitle>Patient EMR</DialogTitle>
  <DialogContent dividers>
    <Print />
  </DialogContent>
  <DialogActions>
    <Button variant="contained" onClick={() => setOpenDialog(false)}>
      Close
    </Button>
  </DialogActions>
</Dialog>

    </>
  );
};

export default PatientTable;
