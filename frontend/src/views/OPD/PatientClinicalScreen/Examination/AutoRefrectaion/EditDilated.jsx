import React, { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  Button,
  TextField,
  DialogActions
} from '@mui/material';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { put } from 'api/api';
import {
  useAddArDilatedOptionMutation,
  useDeleteArDilatedOptionMutation,
  useGetAllArDilatedOptionsQuery
} from 'services/endpoints/Examination/opthalmology/arDilated';

const axisOptions = Array.from({ length: 37 }, (_, i) => `${i * 5}°`);
const cylinderOptions = ['+6', '+5', '+4', '+3', '+2', '+1', '0', '-1', '-2', '-3', '-4', '-5', '-6'];
const eyeDropOptions = ['Tropicamide', 'Cyclopentolate', 'Phenylephrine', 'Homatropine'];

const EditDilatedComponent = ({ getOpthalmicData, editData, handleCloseDialogg }) => {
  const additionLeftAndRightSphere = [
    ...new Set([
      '+20.50',
      '+20.25',
      '+20.00',
      '+19.75',
      '+19.50',
      '+19.25',
      '+19.00',
      '+18.75',
      '+18.50',
      '+18.25',
      '+18.00',
      '+17.75',
      '+17.50',
      '+17.25',
      '+17.00',
      '+16.75',
      '+16.50',
      '+16.25',
      '+16.00',
      '+15.75',
      '+15.50',
      '+15.25',
      '+15.00',
      '+14.75',
      '+14.50',
      '+14.25',
      '+14.00',
      '+13.75',
      '+13.50',
      '+13.25',
      '+13.00',
      '+12.75',
      '+12.50',
      '+12.25',
      '+12.00',
      '+11.75',
      '+11.50',
      '+11.25',
      '+11.00',
      '+10.75',
      '+10.50',
      '+10.25',
      '+10.00',
      '+9.75',
      '+9.50',
      '+9.25',
      '+9.00',
      '+8.75',
      '+8.50',
      '+8.25',
      '+8.00',
      '+7.75',
      '+7.50',
      '+7.00',
      '+6.75',
      '+6.50',
      '+6.25',
      '+6.00',
      '+5.75',
      '+5.50',
      '+5.25',
      '+5.00',
      '+4.75',
      '+4.50',
      '+4.25',
      '+4.00',
      '+3.75',
      '+3.50',
      '+3.25',
      '+3.00',
      '+2.75',
      '+2.50',
      '+2.25',
      '+2.00',
      '+1.75',
      '+1.50',
      '+1.25',
      '+1.00',
      '+0.75',
      '+0.50',
      '+0.25',
      '+0.00'
    ])
  ];

  const minusValues = [
    ...new Set([
      '-0.25',
      '-0.50',
      '-0.75',
      '-1.00',
      '-1.25',
      '-1.50',
      '-1.75',
      '-2.00',
      '-2.25',
      '-2.50',
      '-2.75',
      '-3.00',
      '-3.25',
      '-3.50',
      '-3.75',
      '-4.00',
      '-4.25',
      '-4.50',
      '-4.75',
      '-5.00',
      '-5.25',
      '-5.50',
      '-5.75',
      '-6.00',
      '-6.25',
      '-6.50',
      '-6.75',
      '-7.00',
      '-7.50',
      '-7.75',
      '-8.00',
      '-8.25',
      '-8.50',
      '-8.75',
      '-9.00',
      '-9.25',
      '-9.50',
      '-9.75',
      '-10.00',
      '-10.25',
      '-10.50',
      '-10.75',
      '-11.00',
      '-11.25',
      '-11.50',
      '-11.75',
      '-12.00',
      '-12.25',
      '-12.50',
      '-12.75',
      '-13.00',
      '-13.25',
      '-13.50',
      '-13.75',
      '-14.00',
      '-14.25',
      '-14.50',
      '-14.75',
      '-15.00',
      '-15.25',
      '-15.50',
      '-15.75',
      '-16.00',
      '-16.25',
      '-16.50',
      '-16.75',
      '-17.00',
      '-17.25',
      '-17.50',
      '-17.75',
      '-18.00',
      '-18.25',
      '-18.50',
      '-18.75',
      '-19.00',
      '-19.25',
      '-19.50',
      '-19.75',
      '-20.00',
      '-20.25',
      '-20.50'
    ])
  ];
  const patient = useSelector((state) => state.patient.selectedPatient);
  const [selectedField, setSelectedField] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [customInputDialog, setCustomInputDialog] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [valueType, setValueType] = useState({
    spherical: 'plus', // default 'plus'
    cylinder: 'minus' // default 'minus'
  });
  const [selectedValues, setSelectedValues] = useState({
    sphericalRE: '',
    sphericalLE: '',
    cylinderRE: '',
    cylinderLE: '',
    axisRE: '',
    axisLE: '',
    eyeDrop: ''
  });

  const [customOptions, setCustomOptions] = useState([]);

  const [addArDilatedOption] = useAddArDilatedOptionMutation();
  const [deleteArDilatedOption] = useDeleteArDilatedOptionMutation();
  const { data: fetchedOptions = [], refetch } = useGetAllArDilatedOptionsQuery();

  useEffect(() => {
    setCustomOptions(fetchedOptions);
  }, [fetchedOptions]);

  useEffect(() => {
    if (editData) {
      setSelectedValues(editData);
    }
  }, [editData]);

  const handleOpenDialog = (field) => {
    setSelectedField(field);
    setOpenDialog(true);
  };

  const handleChipSelect = (option) => {
    setSelectedValues((prev) => ({ ...prev, [selectedField]: option }));
    setOpenDialog(false);
    setSelectedField('');
  };

  const handleDelete = async (option) => {
    const match = selectedField.match(/(spherical|cylinder|axis)(RE|LE)/i);
    if (!match) return;
    const [_, category, eye] = match;

    try {
      await deleteArDilatedOption({ name: option, category, eye });
      await refetch();
      toast.success('Option deleted successfully');
    } catch {
      toast.error('Failed to delete option');
    }
  };

  const getOptions = (field) => {
    if (!field) return [];

    let baseOptions = [];

    if (field.includes('axis')) {
      baseOptions = axisOptions;
    } else if (field.includes('cylinder') || field.includes('spherical')) {
      // const additionValues = additionLeftAndRightSphere?.filter(val => !val.startsWith('-'));
      // const minusValues = additionLeftAndRightSphere?.filter(val => val.startsWith('-'));

      const type = valueType[field.includes('spherical') ? 'spherical' : 'cylinder'];

      if (type === 'plus') {
        baseOptions = additionLeftAndRightSphere.reverse();
      } else {
        baseOptions = minusValues;
      }
    }

    const dynamicOptions = customOptions
      ?.filter((opt) => `${opt.category}${opt.eye}`.toLowerCase() === field.toLowerCase())
      ?.map((opt) => opt.name);

    return [...new Set([...baseOptions, ...dynamicOptions])];
  };

  async function handleSave() {
    try {
      if (editData?._id) {
        const res = await put(`patient-opthelmic/update/${patient?.patientId?._id}/autoRefraction/${editData?._id}`, selectedValues);

        if (res?.success) {
          toast.success('Updated Successfully');
          getOpthalmicData();
          handleCloseDialogg();
          setSelectedValues({
            sphericalRE: '',
            sphericalLE: '',
            cylinderRE: '',
            cylinderLE: '',
            axisRE: '',
            axisLE: '',
            eyeDrop: ''
          });
        }
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  }

  const handleEyeDropChange = (e) => {
    setSelectedValues((prev) => ({
      ...prev,
      eyeDrop: e.target.value
    }));
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ boxShadow: 3, padding: 3, backgroundColor: '#fff', borderRadius: 2 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              borderBottom: 1,
              paddingBottom: 1,
              color: '#fff',
              backgroundColor: '#126078',
              padding: 2,
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            Edit AR (Auto Refraction) Dilated
          </Typography>
          {/* Eye Drop Name - Only one selection for both eyes */}
          <Grid container spacing={2} mt={1}>
            <Grid item xs={4}>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                Eye Drop Name
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <FormControl fullWidth size="medium">
                <InputLabel>Eye Drop</InputLabel>
                <Select
                  value={selectedValues.eyeDrop}
                  onChange={handleEyeDropChange}
                  label="Eye Drop Name"
                  sx={{ backgroundColor: '#fff', color: '#000' }}
                >
                  {eyeDropOptions.map((drop) => (
                    <MenuItem key={drop} value={drop}>
                      {drop}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={2} direction="column" mt={2}>
            {['spherical', 'cylinder', 'axis'].map((category) => (
              <Grid item key={category}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={4}>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {category}
                    </Typography>
                  </Grid>
                  {['RE', 'LE'].map((eye) => (
                    <Grid item xs={4} key={eye}>
                      <FormControl fullWidth size="medium">
                        <InputLabel>{eye === 'RE' ? 'Right Eye' : 'Left Eye'}</InputLabel>
                        <Select
                          value={selectedValues[`${category}${eye}`] || ''}
                          onClick={() => handleOpenDialog(`${category}${eye}`)}
                          readOnly
                          error={!selectedValues[`${category}${eye}`]}
                          label={eye === 'RE' ? 'Right Eye' : 'Left Eye'}
                        >
                          <MenuItem value={selectedValues[`${category}${eye}`]}>{selectedValues[`${category}${eye}`] || 'Select'}</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            ))}
          </Grid>

          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button variant="contained" color="primary" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Updating...' : 'Update'}
            </Button>
          </Box>
        </Box>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Select Option</DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            {(selectedField.includes('cylinder') || selectedField.includes('spherical')) && (
              <Grid container spacing={1} sx={{ mb: 2, mt: 3 }}>
                <Grid item>
                  <Button
                    variant={
                      valueType[selectedField.includes('spherical') ? 'spherical' : 'cylinder'] === 'plus' ? 'contained' : 'outlined'
                    }
                    onClick={() =>
                      setValueType((prev) => ({
                        ...prev,
                        [selectedField.includes('spherical') ? 'spherical' : 'cylinder']: 'plus'
                      }))
                    }
                  >
                    Plus
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant={
                      valueType[selectedField.includes('spherical') ? 'spherical' : 'cylinder'] === 'minus' ? 'contained' : 'outlined'
                    }
                    onClick={() =>
                      setValueType((prev) => ({
                        ...prev,
                        [selectedField.includes('spherical') ? 'spherical' : 'cylinder']: 'minus'
                      }))
                    }
                  >
                    Minus
                  </Button>
                </Grid>
              </Grid>
            )}
            {getOptions(selectedField).map((option) => (
              <Grid item key={option}>
                <Chip
                  label={option}
                  clickable
                  color={selectedValues[selectedField] === option ? 'primary' : 'default'}
                  onClick={() => handleChipSelect(option)}
                  onDelete={
                    customOptions.some(
                      (opt) => opt.name === option && `${opt.category}${opt.eye}`.toLowerCase() === selectedField.toLowerCase()
                    )
                      ? () => handleDelete(option)
                      : undefined
                  }
                />
              </Grid>
            ))}
          </Grid>
          <Box mt={2}>
            <Button variant="contained" size="small" onClick={() => setCustomInputDialog(true)}>
              + Add
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={customInputDialog} onClose={() => setCustomInputDialog(false)}>
        <DialogTitle>Add Value</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Value"
            fullWidth
            variant="outlined"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomInputDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              if (customValue) {
                const match = selectedField.match(/(spherical|cylinder|axis)(RE|LE)/i);
                if (match) {
                  const [_, category, eye] = match;
                  await addArDilatedOption({ name: customValue, category, eye });
                  await refetch();
                }
                setCustomInputDialog(false);
                setOpenDialog(false);
                setCustomValue('');
              }
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default EditDilatedComponent;
