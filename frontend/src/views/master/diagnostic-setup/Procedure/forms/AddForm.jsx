import React, { useState } from 'react';
import { IconButton, Grid, TextField } from '@mui/material';
import { Cancel, Save } from '@mui/icons-material';
import { post } from 'api/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddProcedure = ({ handleClose, getData }) => {
  const [inputData, setInputData] = useState({ procedureName: '' });
  const [error, setError] = useState({ procedureName: '' });

  const handleCancel = () => {
    setInputData({ procedureName: '' });
    setError({ procedureName: '' });
    handleClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
    if (value.trim() !== '') {
      setError({ ...error, [name]: '' });
    }
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();
    const trimmedName = inputData.procedureName.trim();

    if (!trimmedName) {
      setError({ procedureName: 'Procedure name is required' });
      toast.error('Procedure name is required');
      return;
    }

    try {
      const response = await post('procedure-master', { procedureName: trimmedName });
      toast.success(response?.msg || 'Procedure added successfully');
      setInputData({ procedureName: '' });
      handleClose();
      getData();
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Something went wrong, please try later!');
    }
  };

  return (
    <div className="modal">
      <h2 className="popupHead">Add Procedure</h2>
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

export default AddProcedure;
