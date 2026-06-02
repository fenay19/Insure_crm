import React, { useEffect, useState } from 'react';
import { Paper, Typography, IconButton, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';

import { get, post } from 'api/api';
import { toast } from 'react-toastify';
import { Cancel, Save } from '@mui/icons-material';

const AddSetup = ({ close, getData }) => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    department: '',
    departmentId: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'department') {
      const dept = departments.find((department) => department._id === value);
      setFormData((prev) => ({ ...prev, department: dept.departmentName, departmentId: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await post('form-setup', formData)
      .then((response) => {
        toast.success(response.message);
        setFormData({
          department: '',
          departmentId: '',
          fields: []
        });
        getData();
        close();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    get('department-setup').then((response) => setDepartments(response.data));
  }, []);

  return (
    <Paper className="wideModal" sx={{ width: '400px !important' }}>
      <Typography variant="h4" gutterBottom>
        Select Department
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Department</InputLabel>
              <Select
                MenuProps={{
                  PaperProps: {
                    style: { maxHeight: 400 }
                  }
                }}
                label="Department"
                name="department"
                value={formData.departmentId}
                onChange={handleChange}
              >
                {departments.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.departmentName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid item xs={12} mt={3}>
          <div className="btnGroup">
            <IconButton type="submit" title="Save" className="btnSave">
              <Save />
            </IconButton>
            <IconButton
              type="submit"
              title="Cancel"
              onClick={() => {
                close();
              }}
              className="btnCancel"
            >
              <Cancel />
            </IconButton>
          </div>
        </Grid>
      </form>
    </Paper>
  );
};

export default AddSetup;
