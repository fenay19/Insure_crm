import React, { useState } from 'react';
import { FormControl, Grid, IconButton, TextField } from '@mui/material';
import { Cancel, Save } from '@mui/icons-material';
import { post, put } from 'api/api';
import { toast } from 'react-toastify';

const EditCompany = ({ close, getData, editData }) => {
  const [error, setError] = useState({});
  const [inputData, setInputData] = useState({
    insuranceCompanyName: editData.insuranceCompanyName
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

    if (inputData.insuranceCompanyName === '') {
      newError.insuranceCompanyName = 'Insurance Company is required';
    }

    setError(newError);

    if (Object.keys(newError).length === 0) {
      await put(`insurance-company/${editData._id}`, inputData)
        .then(() => {
          setInputData({
            cooperativeCompanyName: ''
          });
          toast.success('insurance company Added');
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
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <div className="popupHead">
          <h2>Add Insurance Company</h2>
        </div>
        <div>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  label="Insurance Company"
                  type="text"
                  variant="outlined"
                  name="insuranceCompanyName"
                  value={inputData.insuranceCompanyName}
                  onChange={handleInputChange}
                  error={error.insuranceCompanyName ? true : false}
                  helperText={error.insuranceCompanyName}
                />
              </FormControl>
            </Grid>
          </Grid>
        </div>
        <Grid item xs={12}>
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

export default EditCompany;
