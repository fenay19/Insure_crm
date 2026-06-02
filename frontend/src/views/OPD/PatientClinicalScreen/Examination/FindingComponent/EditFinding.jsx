// Converted to EditFindingsComponent
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import {
  useAddFindingOptionMutation,
  useDeleteFindingOptionsMutation,
  useGetAllFindingOptionsQuery
} from 'services/endpoints/Examination/opthalmology/findingOption';
import { put } from 'api/api';

const iopMethods = ['AT', 'NCT', 'Pachy'];
const colorMethods = ['Ishihara'];
const contrastMethods = ['Pelli Robson'];
const iopValues = Array.from({ length: 53 }, (_, i) => `${8 + i} mmHg`);
const colorValues = Array.from({ length: 24 }, (_, i) => `${i + 1} Plate`);
const contrastValues = ['-0.25', '-0.5', '-0.75', '1', '1.25', '1.5', '1.75', '2', '2.25'];

const EditFindingsComponent = ({ editData, getOpthalmicData, handleCloseDialogg }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('iop');
  const [currentEye, setCurrentEye] = useState('RE');
  const patient = useSelector((state) => state.patient.selectedPatient);

  const [addFinding, { isSuccess, isError }] = useAddFindingOptionMutation();
  const { data = [] } = useGetAllFindingOptionsQuery();
  const [deleteFindingOptions, { isSuccess: deleteSuccess, isError: deleteError }] = useDeleteFindingOptionsMutation();

  const [selectedValues, setSelectedValues] = useState({
    iopMethod: '',
    iopRE: '',
    iopLE: '',
    colorMethod: '',
    colorRE: [],
    colorLE: [],
    contrastMethod: '',
    contrastRE: '',
    contrastLE: ''
  });

  useEffect(() => {
    if (editData) setSelectedValues(editData);
  }, [editData]);

  const [newOption, setNewOption] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleOpenDialog = (field) => {
    setSelectedField(field);
    const category = field.includes('iop') ? 'iop' : field.includes('color') ? 'color' : 'contrast';
    setCurrentCategory(category);
    const eye = field.includes('RE') ? 'RE' : 'LE';
    setCurrentEye(eye);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);
  const handleOpenAddDialog = () => setAddDialogOpen(true);
  const handleCloseAddDialog = () => {
    setNewOption('');
    setAddDialogOpen(false);
  };

  const handleChipSelect = (option) => {
    const field = `${currentCategory}${currentEye}`;
    if (currentCategory === 'color') {
      setSelectedValues((prev) => {
        const current = prev[field] || [];
        const exists = current.includes(option);
        const updated = exists ? current.filter((o) => o !== option) : [...current, option];
        return { ...prev, [field]: updated };
      });
    } else {
      setSelectedValues((prev) => ({ ...prev, [selectedField]: option }));
      setOpenDialog(false);
    }
  };

  async function handleSave() {
    try {
      if (editData?._id) {
        const res = await put(`patient-opthelmic/update/${patient?.patientId?._id}/finding/${editData?._id}`, selectedValues);

        if (res?.success) {
          toast.success('Updated Successfully');
          getOpthalmicData();
          handleCloseDialogg();
        }
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  }

  const handleSaveOption = async () => {
    if (newOption.trim()) {
      await addFinding({ finding: newOption.trim(), category: currentCategory, eye: currentEye });
    }
  };

  const handleDeleteOption = async (optionToDelete) => {
    await deleteFindingOptions({ finding: optionToDelete, category: currentCategory, eye: currentEye });
  };

  const dynamicOptions =
    data?.filter((item) => item.category === currentCategory && item.eye === currentEye).map((item) => item.finding) || [];

  const staticOptions = {
    iop: iopValues,
    color: colorValues,
    contrast: contrastValues
  };

  const mergedOptions = [...staticOptions[currentCategory], ...dynamicOptions];
  const staticSet = new Set(staticOptions[currentCategory]);

  useEffect(() => {
    if (isSuccess) {
      toast.success('Added successfully');
      handleCloseAddDialog();
    }
    if (isError) toast.error('Something went wrong');
  }, [isSuccess, isError]);

  useEffect(() => {
    if (deleteSuccess) toast.success('Deleted Successfully');
    if (deleteError) toast.error('Failed to delete');
  }, [deleteError, deleteSuccess]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ boxShadow: 3, padding: 3, backgroundColor: '#fff', borderRadius: 2 }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', borderBottom: 1, paddingBottom: 1, textAlign: 'center', color: '#fff', backgroundColor: '#126078', padding: 2 }}>
              Edit Findings
            </Typography>

            <Grid container spacing={2} direction="column" mt={2}>
              {['IOP', 'Color', 'Contrast'].map((category, index) => (
                <Grid item key={index}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3}>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{category}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <FormControl fullWidth size="medium">
                        <InputLabel>Method</InputLabel>
                        <Select
                          value={selectedValues[`${category.toLowerCase()}Method`] || ''}
                          onChange={(e) => setSelectedValues((prev) => ({ ...prev, [`${category.toLowerCase()}Method`]: e.target.value }))}
                          label="Method"
                        >
                          {(category === 'IOP' ? iopMethods : category === 'Color' ? colorMethods : contrastMethods).map((method) => (
                            <MenuItem key={method} value={method}>{method}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    {['RE', 'LE'].map((eye) => (
                      <Grid item xs={3} key={eye}>
                        <TextField
                          label={eye === 'RE' ? 'Right Eye' : 'Left Eye'}
                          value={selectedValues[`${category.toLowerCase()}${eye}`] || ''}
                          onClick={() => handleOpenDialog(`${category.toLowerCase()}${eye}`)}
                          InputProps={{ readOnly: true }}
                          fullWidth
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              ))}
            </Grid>

            <Box display="flex" justifyContent="flex-end" mt={3}>
              <Button variant="contained" color="primary" onClick={handleSave}>Update</Button>
            </Box>
          </Box>
        </Grid>

        {/* Selection Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Select Finding</DialogTitle>
          <DialogContent>
            <Grid container spacing={1}>
              {mergedOptions.map((option) => (
                <Grid item key={option}>
                  <Chip
                    label={option}
                    clickable
                    color={currentCategory === 'color'
                      ? selectedValues[`${currentCategory}${currentEye}`]?.includes(option)
                        ? 'primary'
                        : 'default'
                      : selectedValues[selectedField] === option ? 'primary' : 'default'}
                    onClick={() => handleChipSelect(option)}
                    onDelete={!staticSet.has(option) ? () => handleDeleteOption(option) : undefined}
                  />
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleOpenAddDialog} variant="contained">Add</Button>
            <Button onClick={handleCloseDialog} variant="contained">Close</Button>
          </DialogActions>
        </Dialog>

        {/* Add Finding Dialog */}
        <Dialog open={addDialogOpen} onClose={handleCloseAddDialog}>
          <DialogTitle>Add New Finding</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="New Finding"
              fullWidth
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddDialog}>Cancel</Button>
            <Button onClick={handleSaveOption} variant="contained">Add</Button>
          </DialogActions>
        </Dialog>
      </Grid>
      <ToastContainer />
    </>
  );
};

export default EditFindingsComponent;
