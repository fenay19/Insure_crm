import { useState } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Popover,
  Box,
  Typography,
  Grid
} from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import { put } from 'api/api';

const EditHeightAndWeightDropdown = ({ data, getData, onClose }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedHeight, setSelectedHeight] = useState(data?.height?.height || null);
  const [selectedWeight, setSelectedWeight] = useState(data?.weight?.weight || null);

  const patient = useSelector((state) => state.patient.selectedPatient);
  const patientId = patient?.patientId?._id;

  const heightId = data?.height?._id;
  const weightId = data?.weight?._id;

  const options = Array.from({ length: 251 }, (_, i) => i);
  const filteredOptions = options.filter((num) => num.toString().includes(search));

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSave = async () => {
    if (!patientId || selectedHeight === null || selectedWeight === null) {
      toast.error('Please select both height and weight.');
      return;
    }

    try {
      const heightPayload = {
        height: selectedHeight,
        vitalName: 'Height',
        unit: 'cm',
      };

      const weightPayload = {
        weight: selectedWeight,
        vitalName: 'Weight',
        unit: 'kg',
      };

      await Promise.all([
        put(`form-setup/vital-master/update-single/${patientId}/${heightId}`, heightPayload),
        put(`form-setup/vital-master/update-single/${patientId}/${weightId}`, weightPayload),
      ]);

      toast.success('Height and weight updated successfully!');
      getData();
      onClose();
    } catch (error) {
      console.error('Error updating height/weight:', error);
      toast.error('Failed to update vitals.');
    }

    setSearch('');
    handleClose();
  };

  return (
    <>
      <Box width={250} my={2}>
        <Button variant="outlined" fullWidth onClick={handleClick}>
          Edit Height & Weight
        </Button>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          <Box p={2} width={300}>
            <Typography variant="subtitle1" gutterBottom>
              Update Vitals
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Height"
                  select
                  fullWidth
                  value={selectedHeight ?? ''}
                  onChange={(e) => setSelectedHeight(Number(e.target.value))}
                >
                  {options.map((num) => (
                    <MenuItem key={num} value={num}>
                      {num} cm
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Weight"
                  select
                  fullWidth
                  value={selectedWeight ?? ''}
                  onChange={(e) => setSelectedWeight(Number(e.target.value))}
                >
                  {options.map((num) => (
                    <MenuItem key={num} value={num}>
                      {num} kg
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleSave}
              disabled={selectedHeight === null || selectedWeight === null}
            >
              Save
            </Button>
          </Box>
        </Popover>
      </Box>

      <ToastContainer />
    </>
  );
};

export default EditHeightAndWeightDropdown;
