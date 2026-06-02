import React, { useState, useEffect } from 'react';
import { FormControl, Grid, IconButton, TextField } from '@mui/material';
import { Cancel, Save } from '@mui/icons-material';
import { post } from 'api/api';
import { toast } from 'react-toastify';

const AddTPA = ({ close, getData }) => {
  const [error, setError] = useState({});
  const [inputData, setInputData] = useState({
    tpaCompanyName: ''
  });

  const handleInputChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
    if (error[e.target.name]) {
      setError({ ...error, [e.target.name]: '' });
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const newError = {};

    if (inputData.tpaCompanyName === '') {
      newError.tpaCompanyName = 'TPA company name is required';
    }

    setError(newError);

    if (Object.keys(newError).length === 0) {
      await post('insurance-company/tpa', inputData)
        .then(() => {
          setInputData({
            tpaCompanyName: ''
          });
          toast.success('TPA company Added');
          close();
          getData();
        })
        .catch((error) => {
          if (error.response.data.msg !== undefined) {
            toast.error(error.response.data.msg);
          } else {
            toast.error('Something went wrong, Please try later!!');
          }
        });
    }
  }

  return (
    <div className="modal" style={{ width: '400px' }}>
      <form onSubmit={handleSubmit}>
        <div className="popupHead">
          <h2>Add TPA</h2>
        </div>
        <div>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  label="TPA Company Name"
                  type="text"
                  variant="outlined"
                  name="tpaCompanyName"
                  value={inputData.tpaCompanyName}
                  onChange={handleInputChange}
                  error={error.tpaCompanyName ? true : false}
                  helperText={error.tpaCompanyName}
                />
              </FormControl>
            </Grid>
          </Grid>
        </div>
        <Grid item xs={12} mt={2}>
          <div className="btnGroup">
            <IconButton title="Save" className="btnPopup btnSave" type="submit">
              <Save />
            </IconButton>
            <IconButton title="Cancel" className="btnPopup btnCancel" onClick={close}>
              <Cancel />
            </IconButton>
          </div>
        </Grid>
      </form>
    </div>
  );
};

export default AddTPA;
