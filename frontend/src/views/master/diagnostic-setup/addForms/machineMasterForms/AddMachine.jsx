import React, { useState, useEffect } from 'react';
import { IconButton, Grid, TextField, MenuItem } from '@mui/material';
import { Cancel, Save } from '@mui/icons-material';
import { post, get } from 'api/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddMachine = ({ handleClose, getData }) => {
  const [inputData, setInputData] = useState({
    machineName: '',
    methodName: '',
    department: '',
    departmentId: '', //when use will select department handleDepartmentChange will assign departmentId
    make: '',
    modelNumber: '',
    serialNumber: ''
  });

  const [error, setError] = useState({
    machineName: '',
    methodName: '',
    department: '',
    make: '',
    modelNumber: '',
    serialNumber: ''
  });

  const [allDepartments, setAllDepartments] = useState([]);

  /* this useEffect is for fetching other apis */
  useEffect(() => {
    /*department setup master api */
    const fetchDepartments = async () => {
      await get('department-setup').then((response) => {
        const dept = response.data.filter(
          (v) => v.departmentFunction?.isLab === true && v?.departmentType?.toLowerCase()?.trim() === 'clinical'
        );
        setAllDepartments(dept);
      });
    };

    fetchDepartments();
  }, []);

  // this function assign values in state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: '' }));
  };

  //assign department it when use selects department
  const handleDepartmentChange = (e) => {
    const selectedDepartmentName = e.target.value;
    const selectedDepartment = allDepartments.find((dept) => dept.departmentName === selectedDepartmentName);

    setInputData((prev) => ({
      ...prev,
      department: selectedDepartmentName,
      departmentId: selectedDepartment ? selectedDepartment._id : ''
    }));
  };

  //validation function checks all fields filled or not
  const validation = () => {
    const validationFields = [
      { field: 'machineName', message: 'Machine name is required' },
      { field: 'methodName', message: 'Method name is required' },
      { field: 'department', message: 'Department is required' },
      { field: 'make', message: 'Manufacturer is required' },
      { field: 'modelNumber', message: 'Model number is required' },
      { field: 'serialNumber', message: 'Serial number is required' }
    ];

    let isValid = true;
    const newError = {};

    validationFields.forEach(({ field, message }) => {
      if (!inputData[field]) {
        newError[field] = message;
        isValid = false;
      }
    });

    setError(newError);
    return isValid;
  };

  //function for sumbitting the form data
  const handleSubmitData = async (e) => {
    e.preventDefault();

    if (validation()) {
      await post('machine-pathology-master', inputData)
        .then((response) => {
          toast.success('Machine added successfully');
          setInputData({
            machineName: '',
            methodName: '',
            department: '',
            departmentId: '',
            make: '',
            modelNumber: '',
            serialNumber: ''
          });
          handleClose();
          getData();
        })
        .catch((error) => {
          toast.error('Something went wrong !');
        });
    }
  };

  console.log(inputData);
  return (
    <div className="modal">
      <h2 className="popupHead">Add Machine</h2>
      <form onSubmit={handleSubmitData}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Machine Name"
              variant="outlined"
              onChange={handleInputChange}
              value={inputData.machineName}
              name="machineName"
              error={!!error.machineName}
              helperText={error.machineName}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Method Name"
              variant="outlined"
              onChange={handleInputChange}
              value={inputData.methodName}
              name="methodName"
              error={!!error.methodName}
              helperText={error.methodName}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Department"
              variant="outlined"
              onChange={handleDepartmentChange}
              value={inputData.department}
              name="department"
              error={!!error.department}
              helperText={error.department}
            >
              {allDepartments.map((dept) => (
                <MenuItem key={dept._id} value={dept.departmentName}>
                  {dept.departmentName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Manufacturer"
              variant="outlined"
              onChange={handleInputChange}
              value={inputData.make}
              name="make"
              error={!!error.make}
              helperText={error.make}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Model Number"
              variant="outlined"
              onChange={handleInputChange}
              value={inputData.modelNumber}
              name="modelNumber"
              error={!!error.modelNumber}
              helperText={error.modelNumber}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Serial Number"
              variant="outlined"
              onChange={handleInputChange}
              value={inputData.serialNumber}
              name="serialNumber"
              error={!!error.serialNumber}
              helperText={error.serialNumber}
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

export default AddMachine;
