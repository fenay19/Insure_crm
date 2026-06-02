import React, { useState } from 'react';
import { IconButton, Grid, TextField } from '@mui/material';
import { Cancel, Save } from '@mui/icons-material';
import { put } from 'api/api';
import { toast } from 'react-toastify';

const EditProcedure = ({ handleClose, getData, editData }) => {
  const [inputData, setInputData] = useState({
    procedureName: editData.procedureName || ''
  });

  const [error, setError] = useState({ procedureName: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData((prev) => ({ ...prev, [name]: value.trimStart() })); // Prevents leading spaces
    setError((prev) => ({ ...prev, [name]: '' })); // Clear error on input change
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();
    
    const trimmedName = inputData.procedureName.trim();
    if (!trimmedName) {
      setError({ procedureName: 'Procedure Name is required' });
      toast.error('Procedure Name is required');
      return;
    }

    // Prevent unnecessary API call if no changes were made
    if (trimmedName === editData.procedureName) {
      toast.info('No changes detected');
      handleClose();
      return;
    }

    try {
      const response = await put(`procedure-master/${editData._id}`, { procedureName: trimmedName });
      toast.success(response.msg || 'Procedure updated successfully');
      handleClose();
      getData();
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Something went wrong, please try again later!');
    }
  };

  return (
    <div className="modal">
      <h2 className="popupHead">Update Procedure</h2>
      <form onSubmit={handleSubmitData}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Procedure Name"
              variant="outlined"
              onChange={handleInputChange}
              value={inputData.procedureName}
              name="procedureName"
              error={Boolean(error.procedureName)}
              helperText={error.procedureName}
            />
          </Grid>
          <Grid item xs={12}>
            <div className="btnGroup">
              <IconButton type="submit" title="Save" className="btnSave">
                <Save />
              </IconButton>
              <IconButton title="Cancel" onClick={handleClose} className="btnCancel">
                <Cancel />
              </IconButton>
            </div>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default EditProcedure;
