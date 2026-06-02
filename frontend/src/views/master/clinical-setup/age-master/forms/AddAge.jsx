import React, { useState, useEffect } from 'react';
import { IconButton, Grid, TextField, MenuItem } from '@mui/material';
import { Cancel, Save } from '@mui/icons-material';
import { get, post } from 'api/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddAgeGroup = ({ handleClose, getData }) => {
  const [inputData, setInputData] = useState({
    age: '',
    group: ''
  });
  const [error, setError] = useState({
    age: '',
    group: ''
  });

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

  // Validation function
  const validations = () => {
    const newErrors = {
      age: inputData.age ? '' : 'Age is required',
      group: inputData.group ? '' : 'Group is required'
    };

    setError(newErrors);

    // Return true if no errors
    return !Object.values(newErrors).some((err) => err !== '');
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();

    // Perform validations
    if (!validations()) {
      toast.error('Please fix the errors before submitting.');
      return;
    }

    // API Call
    try {
      const response = await post('age-group', { inputData });
      if (response.success === true) {
        setInputData({
          age: '',
          group: ''
        });
        handleClose();
        toast.success(response?.message);
        getData();
      }

      if (response.success === false) {
        toast.error(response.message);
      }
    } catch (error) {
      if (error.response && error.response.data.msg) {
        toast.error(error.response.data.msg);
      } else {
        toast.error('Something went wrong, please try later!');
      }
    }
  };

  return (
    <div className="modal">
      <h2 className="popupHead">Add Age Group</h2>
      <form onSubmit={handleSubmitData}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <TextField
              type="text"
              fullWidth
              label="Age Range"
              variant="outlined"
              onChange={handleInputChange}
              value={inputData.age}
              name="age"
              error={error.age !== ''}
              helperText={error.age}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="text"
              fullWidth
              label="Group"
              variant="outlined"
              onChange={handleInputChange}
              value={inputData.group}
              name="group"
              error={error.group !== ''}
              helperText={error.group}
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

export default AddAgeGroup;
