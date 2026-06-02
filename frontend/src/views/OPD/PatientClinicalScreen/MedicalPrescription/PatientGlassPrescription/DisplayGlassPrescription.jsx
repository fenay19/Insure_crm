import { Close, Edit } from '@mui/icons-material';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import { remove } from 'api/api';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import EditGlassPrescription from './EditGlassPrescription';

const DisplayGlassPrescription = ({ editData, getGlassPrescription }) => {
  const [open, setOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  if (!editData) return null;

  const handleDelete = async (prescriptionId, eyeId) => {
    console.log(prescriptionId, eyeId);
    try {
      const res = await remove(`patient-glass-prescription/${prescriptionId}/${eyeId}`);
      if (res?.success) {
        toast.success('Deleted Successfully');
        getGlassPrescription();
      } else {
        toast.error('Failed to delete');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const handleEdit = (prescription) => {
    console.log('ORes', prescription);
    setSelectedPrescription(prescription);
    setOpen(true);
  };

  return (
    <>
      <Box>
        {editData && (
          <TableContainer component={Paper} elevation={2} sx={{ mt: 2, p: 2 }}>
            <Table sx={{ border: '1px solid rgba(0, 0, 0, 0.2)' }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#126078' }}>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', border: '1px solid #126078' }}>
                    Eye
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', border: '1px solid #126078' }}>
                    Type
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', border: '1px solid #126078' }}>
                    Sphere
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', border: '1px solid #126078' }}>
                    Cylinder
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', border: '1px solid #126078' }}>
                    Axis
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', border: '1px solid #126078' }}>
                    Vision
                  </TableCell>
                  <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', border: '1px solid #126078' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {['right', 'left'].map((eye) =>
                  editData[eye]?.map((prescription) => (
                    <React.Fragment key={`${eye}-${prescription._id}`}>
                      {['distance', 'add'].map((type) => (
                        <TableRow key={`${eye}-${prescription._id}-${type}`}>
                          {type === 'distance' && (
                            <TableCell rowSpan={2} align="center" sx={{ border: '1px solid rgba(0, 0, 0, 0.2)' }}>
                              {eye.charAt(0).toUpperCase() + eye.slice(1)}
                            </TableCell>
                          )}
                          <TableCell align="center" sx={{ border: '1px solid rgba(0, 0, 0, 0.2)' }}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </TableCell>
                          <TableCell align="center" sx={{ border: '1px solid rgba(0, 0, 0, 0.2)' }}>
                            {prescription[type]?.sphere || 'N/A'}
                          </TableCell>
                          <TableCell align="center" sx={{ border: '1px solid rgba(0, 0, 0, 0.2)' }}>
                            {prescription[type]?.cylinder || 'N/A'}
                          </TableCell>
                          <TableCell align="center" sx={{ border: '1px solid rgba(0, 0, 0, 0.2)' }}>
                            {prescription[type]?.axis || 'N/A'}
                          </TableCell>
                          <TableCell align="center" sx={{ border: '1px solid rgba(0, 0, 0, 0.2)' }}>
                            {prescription[type]?.vision || 'N/A'}
                          </TableCell>
                          {type === 'distance' && (
                            <TableCell rowSpan={2} align="center" sx={{ border: '1px solid rgba(0, 0, 0, 0.2)' }}>
                              <IconButton size="small" onClick={() => handleEdit({ ...prescription, type: eye })}>
                                <Edit sx={{ fontSize: '16px', color: 'blue' }} />
                              </IconButton>
                              <IconButton size="small" onClick={() => handleDelete(editData?._id, prescription._id)}>
                                <Close sx={{ fontSize: '16px', color: 'red', ml: 4 }} />
                              </IconButton>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xl" sx={{ py: 5 }}>
        <DialogTitle>Edit Glass Prescription</DialogTitle>
        <DialogContent>
          <EditGlassPrescription
            existingPrescription={selectedPrescription}
            getGlassPrescription={getGlassPrescription}
            onClose={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DisplayGlassPrescription;
