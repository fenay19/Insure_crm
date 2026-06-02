import React, { useState } from 'react';
import { IconButton, Grid, TextField } from '@mui/material';
import { Cancel, Save } from '@mui/icons-material';
import { put } from 'api/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditUnit = ({ handleClose, getData, editData }) => {
  const [inputData, setInputData] = useState({
    unit: editData?.unit || ''
  });
  const [error, setError] = useState({
    unit: ''
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

  const handleSubmitData = async (e) => {
    e.preventDefault();

    // Validation
    if (!inputData.unit.trim()) {
      setError({ unit: 'Unit is required' });
      return;
    }

    if (!editData?._id) {
      toast.error('Unit ID is missing, unable to update.');
      return;
    }

    try {
      const response = await put(`clinical-setup/units/edit/${editData._id}`, inputData);
      if (response?.success) {
        toast.success('Unit edited successfully');
        handleClose(); // Close the modal after success
        getData(); // Refresh data
      } else {
        toast.error(response?.message || 'Failed to edit the unit');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.msg || 'Something went wrong, please try later!';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="modal">
      <h2 className="popupHead">Edit Unit</h2>
      <form onSubmit={handleSubmitData}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <TextField
              type="text"
              fullWidth
              label="Unit"
              variant="outlined"
              onChange={handleInputChange}
              value={inputData.unit}
              name="unit"
              error={error.unit !== ''}
              helperText={error.unit}
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

export default EditUnit;
