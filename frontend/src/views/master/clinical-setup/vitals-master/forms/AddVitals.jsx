import React, { useState, useEffect } from 'react';
import { IconButton, Grid, TextField, MenuItem } from '@mui/material';
import { Cancel, Save } from '@mui/icons-material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { get, post } from 'api/api';

const AddVitals = ({ handleClose, getData }) => {
  const [inputData, setInputData] = useState({
    vital: '',
    unit: '',
    age: '',
    group: '',
    range: ''
  });
  const [error, setError] = useState({
    vital: '',
    unit: '',
    age: '',
    group: '',
    range: ''
  });

  const [ageGroupData, setAgeGroupData] = useState([]);
  const [unitData, setUnitData] = useState([]);

  const handleCancel = () => {
    handleClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData((prev) => ({
      ...prev,
      [name]: value
    }));
    setError((prev) => ({
      ...prev,
      [name]: ''
    }));
  };

  const validations = () => {
    const newErrors = {
      vital: inputData.vital ? '' : 'Type of Vital is required',
      unit: inputData.unit ? '' : 'Unit is required',
      age: inputData.age ? '' : 'Age is required',
      group: inputData.group ? '' : 'Group is required',
      range: inputData.range ? '' : 'Range is required'
    };

    setError(newErrors);

    return !Object.values(newErrors).some((err) => err !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validations()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await post('vital-master', { inputData });
      if (response?.success) {
        toast.success('Vital added successfully!');
        handleClose();
        getData();
      } else {
        toast.error(response.message);
      }
      console.log('Submitting Data:', inputData);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const unitResponse = await get('clinical-setup/units');
        const ageGroupResponse = await get('age-group');
        setUnitData(unitResponse?.units || []);
        setAgeGroupData(ageGroupResponse?.data || []);
      } catch (error) {
        toast.error('Failed to fetch data');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="modal">
      <h2 className="popupHead">Add Vitals</h2>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={6}>
            <TextField
              type="text"
              fullWidth
              label="Vitals Name"
              variant="outlined"
              onChange={handleInputChange}
              value={inputData.vital}
              name="vital"
              error={error.vital !== ''}
              helperText={error.vital}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              fullWidth
              label="Unit"
              variant="outlined"
              onChange={handleInputChange}
              value={inputData.unit}
              name="unit"
              error={error.unit !== ''}
              helperText={error.unit}
            >
              {unitData.map((data, index) => (
                <MenuItem key={index} value={data?.unit}>
                  {data?.unit}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              fullWidth
              label="Age Range"
              variant="outlined"
              onChange={handleInputChange}
              value={inputData.age}
              name="age"
              error={error.age !== ''}
              helperText={error.age}
            >
              {ageGroupData?.map((data, index) => (
                <MenuItem key={index} value={data?.age}>
                  {data?.age}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              fullWidth
              label="Group"
              variant="outlined"
              onChange={handleInputChange}
              value={inputData.group}
              name="group"
              error={error.group !== ''}
              helperText={error.group}
            >
              {ageGroupData?.map((data, index) => (
                <MenuItem key={index} value={data?.group}>
                  {data?.group}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              type="text"
              fullWidth
              label="Range"
              variant="outlined"
              onChange={handleInputChange}
              value={inputData.range}
              name="range"
              error={error.range !== ''}
              helperText={error.range}
            />
          </Grid>
          <Grid item xs={12}>
            <div className="btnGroup">
              <IconButton type="submit" title="Save" className="btnSave">
                <Save />
              </IconButton>
              <IconButton title="Cancel" onClick={handleCancel} className="btnCancel">
                <Cancel />
              </IconButton>
            </div>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddVitals;
