import React, { useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  Button,
  TextField,
  DialogActions
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { post, put } from 'api/api';
import { useSelector } from 'react-redux';
import {
  useAddVisionOptionMutation,
  useDeleteVisionOptionsMutation,
  useGetAllVisionOptionsQuery
} from 'services/endpoints/Examination/opthalmology/visionOptions';

const VisionComponent = ({ departmentId, getOpthalmicData, allReadyOpthalmicId }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('unaided'); // default category

  const patient = useSelector((state) => state.patient.selectedPatient);
  const [addVision, { isSuccess, isError }] = useAddVisionOptionMutation();
  const { data = [] } = useGetAllVisionOptionsQuery();
  const [deleteVisonOptions, { isSuccess: deleteSuccess, isError: deleteError }] = useDeleteVisionOptionsMutation();

  const [selectedValues, setSelectedValues] = useState({
    unaidedRE: '',
    unaidedLE: '',
    correctedRE: '',
    correctedLE: '',
    pinholeRE: '',
    pinholeLE: '',
    nearVisionRE: '',
    nearVisionLE: ''
  });

  const [newVision, setNewVision] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const staticVisionSet = new Set([
    '6/60',
    '6/36',
    '6/24',
    '6/18',
    '6/12',
    '6/9',
    '6/6',
    '6/5',
    '6/4',
    '6/60P',
    '6/36P',
    '6/24P',
    '6/18P',
    '6/12P',
    '6/9P',
    '6/6P',
    '6/5P',
    '6/4P',
    'N4',
    'N5',
    'N6',
    'N8',
    'N12',
    'N18',
    'N24',
    'N36',
    'N60',
    'CF-1/2M',
    'CF-1M',
    'CF-2M',
    'CF-3M'
  ]);

  const visionOptionCategories = {
    unaided: Array.from(staticVisionSet),
    corrected: Array.from(staticVisionSet),
    pinhole: Array.from(staticVisionSet),
    nearVision:Array.from(staticVisionSet)
  };
  const [currentEye, setCurrentEye] = useState('RE'); // 👁️

  const handleOpenDialog = (field) => {
    setSelectedField(field);
  
    const lowerField = field.toLowerCase();
    const category = lowerField.includes('unaided')
      ? 'unaided'
      : lowerField.includes('corrected')
      ? 'corrected'
      : lowerField.includes('pinhole')
      ? 'pinhole'
      : lowerField.includes('nearvision') || lowerField.includes('near vision')
      ? 'nearVision'  // notice the capital "V" here
      : '';
  
    setCurrentCategory(category);
  
    const eye = field.includes('RE') ? 'RE' : 'LE';
    setCurrentEye(eye);
    setOpenDialog(true);
  };
  

  const handleCloseDialog = () => setOpenDialog(false);
  const handleOpenAddDialog = () => setAddDialogOpen(true);
  const handleCloseAddDialog = () => {
    setNewVision('');
    setAddDialogOpen(false);
  };

  const handleChipSelect = (option) => {
    setSelectedValues((prev) => ({ ...prev, [selectedField]: option }));
    setOpenDialog(false);
  };

  const handleSave = async () => {
    try {
      const visionData = { vision: selectedValues };
      let res;
      if (allReadyOpthalmicId?.vision) {
        res = await put(`patient-opthelmic/vision/${allReadyOpthalmicId?.vision}`, visionData);
      } else {
        res = await post(`patient-opthelmic/vision`, {
          patientId: patient?.patientId?._id,
          consultantId: patient?.consultantId,
          opdPatientId: patient?._id,
          departmentId,
          ...visionData
        });
      }
      if (res?.success) {
        toast.success(allReadyOpthalmicId?.vision ? 'Updated Successfully' : 'Created Successfully');
        getOpthalmicData();
        setSelectedValues({
          unaidedRE: '',
          unaidedLE: '',
          correctedRE: '',
          correctedLE: '',
          pinholeRE: '',
          pinholeLE: '',
          nearVisionRE: '',
          nearVisionLE: ''
        });
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const handleSaveVision = async () => {
    if (newVision.trim()) {
      await addVision({
        vision: newVision.trim(),
        category: currentCategory,
        eye: currentEye
      });
    }
  };

  const handleDeleteVision = async (optionToDelete) => {
    await deleteVisonOptions({
      vision: optionToDelete,
      category: currentCategory,

      eye: currentEye
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success('Added successfully');
      handleCloseAddDialog();
    }
    if (isError) {
      toast.error('Something went wrong');
    }
  }, [isSuccess, isError]);

  const mergedVisionOptions = [
    ...(visionOptionCategories[currentCategory] || []),
    ...((data || []).filter((item) => item.category === currentCategory).map((item) => item.vision) || [])
  ];

  useEffect(() => {
    if (deleteSuccess) {
      toast.success('Deleted Successfully');
    }
    if (deleteError) {
      toast.error('Failed to delete');
    }
  }, [deleteError, deleteSuccess]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ boxShadow: 3, padding: 3, backgroundColor: '#fff', borderRadius: 2 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                borderBottom: 1,
                paddingBottom: 1,
                textAlign: 'center',
                color: '#fff',
                backgroundColor: '#126078',
                padding: 2
              }}
            >
              Vision
            </Typography>

            <Grid container spacing={2} direction="column" mt={2}>
              {['Unaided', 'Corrected', 'Pinhole', 'Near Vision'].map((category, index) => (
                <Grid item key={index}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {category}
                      </Typography>
                    </Grid>
                    {['RE', 'LE'].map((eye) => (
                      <Grid item xs={3} key={eye}>
                        <FormControl fullWidth size="medium">
                          <TextField
                            label={`${eye === 'RE' ? 'Right Eye' : 'Left Eye'}`}
                            value={selectedValues[`${category.toLowerCase()}${eye}`] || ''}
                            onClick={() => handleOpenDialog(`${category.toLowerCase()}${eye}`)}
                            InputProps={{ readOnly: true }}
                          />
                        </FormControl>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              ))}
            </Grid>

            <Box display="flex" justifyContent="flex-end" mt={3}>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Dialog for Chip Selection */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Select Vision</DialogTitle>
          <DialogContent>
            <Grid container spacing={1}>
              {mergedVisionOptions.map((option) => (
                <Grid item key={option}>
                  <Chip
                    label={option}
                    clickable
                    color={selectedValues[selectedField] === option ? 'primary' : 'default'}
                    onClick={() => handleChipSelect(option)}
                    {...(!staticVisionSet.has(option) && {
                      onDelete: () => handleDeleteVision(option)
                    })}
                  />
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleOpenAddDialog} variant="contained">
              Add
            </Button>
            <Button onClick={handleCloseDialog} variant="contained">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Vision Dialog */}
        <Dialog open={addDialogOpen} onClose={handleCloseAddDialog}>
          <DialogTitle>Add New Vision</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="New Vision"
              fullWidth
              value={newVision}
              onChange={(e) => setNewVision(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddDialog}>Cancel</Button>
            <Button onClick={handleSaveVision} variant="contained">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
      <ToastContainer />
    </>
  );
};

export default VisionComponent;
