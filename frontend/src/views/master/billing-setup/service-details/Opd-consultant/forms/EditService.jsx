import React, { useState, useEffect } from 'react';
import {
  Button,
  InputLabel,
  FormControl,
  TextField,
  Select,
  MenuItem,
  Grid,
  FormHelperText,
  Paper,
  Typography,
  IconButton
} from '@mui/material';
import { Cancel, Save } from '@mui/icons-material';
import { get, put } from 'api/api'; // Import `put` for update requests
import { toast } from 'react-toastify';

const EditService = ({ handleClose, getData, editData }) => {
  const [departments, setDepartments] = useState([]);
  const [consultant, setConsultant] = useState([]);
  const [billGroupData, setBillGroupData] = useState([]);
  const [depConsultant, setDepConsultant] = useState([]);

  // State for form inputs
  const [inputData, setInputData] = useState({
    serviceName: '',
    type: '',
    department: '',
    consultantName: '',
    consultantId: '',
    billGroup: ''
  });

  // Error state for validation
  const [err, setErr] = useState({});

  useEffect(() => {
    // Fetch dropdown data
    Promise.all([get('department-setup'), get('newConsultant'), get('billgroup-master')])
      .then(([departmentsRes, consultantsRes, billGroupsRes]) => {
        const clinicalDepartments = (departmentsRes?.data || []).filter(
          (department) => department?.departmentType?.toLowerCase()?.trim() === 'clinical'
        );

        setDepartments(clinicalDepartments ?? []);
        setConsultant(consultantsRes?.data ?? []);
        setBillGroupData(billGroupsRes?.data ?? []);
      })
      .catch((error) => {
        console.error('Error fetching dropdown data:', error);
      });

    // Pre-fill form with existing service data
    if (editData) {
      setInputData({
        serviceName: editData.serviceName || '',
        type: editData.type || '',
        department: editData.department || '',
        consultantName: editData.consultantName || '',
        consultantId: editData.consultantId || '',
        billGroup: editData.billGroup || ''
      });

      // Filter consultants based on the department of the editData
      const dep = consultant?.filter((v) => v.employmentDetails.departmentOrSpeciality.departmentName === editData.department);
      setDepConsultant(dep);
    }
  }, [editData, consultant]);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputData((prevData) => ({
      ...prevData,
      [name]: value
    }));

    if (name === 'department') {
      const dep = consultant?.filter((v) => v.employmentDetails.departmentOrSpeciality.departmentName === value);
      setDepConsultant(dep);
    }

    if (name === 'consultantId') {
      const cons = consultant?.find((x) => x._id === value);
      if (cons) {
        setInputData((prev) => ({
          ...prev,
          consultantName: `${cons.basicDetails.firstName} ${cons.basicDetails.middleName} ${cons.basicDetails.lastName}`,
          consultantId: value
        }));
      }
    }
  };

  // Handle form submission
  const handleEditSubmit = async (event) => {
    event.preventDefault();
    const errors = {};

    // Validation
    if (!inputData.serviceName) errors.serviceName = 'Service Name is required.';
    if (!inputData.type) errors.type = 'Type is required.';
    if (!inputData.department) errors.department = 'Department is required.';
    if (!inputData.consultantName) errors.consultantName = 'Consultant Name is required.';
    if (!inputData.billGroup) errors.billGroup = 'Bill Group is required.';

    setErr(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const response = await put(`opd-consultant-service/${editData._id}`, inputData);

        if (response?.data) {
          toast.success('Service updated successfully!');
          closeForm();
          getData();
        } else {
          toast.error('Failed to update service. Please try again.');
        }
      } catch (error) {
        toast.error('Failed to update service.');
      }
    }
  };

  // Close and reset form
  const closeForm = () => {
    handleClose();
    setInputData({
      serviceName: '',
      type: '',
      department: '',
      consultantName: '',
      consultantId: '',
      billGroup: ''
    });
    setErr({});
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: '30vw',
        margin: '2rem auto',
        padding: '2rem',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px'
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Edit OPD Consultation
      </Typography>
      <form onSubmit={handleEditSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="serviceName"
              label="Service Name"
              variant="outlined"
              name="serviceName"
              onChange={handleChange}
              value={inputData.serviceName}
              error={!!err.serviceName}
              helperText={err.serviceName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!err.type}>
              <InputLabel>Type</InputLabel>
              <Select name="type" value={inputData.type} onChange={handleChange} label="Type">
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Follow Up">Follow Up</MenuItem>
              </Select>
              <FormHelperText>{err.type}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!err.department}>
              <InputLabel>Department</InputLabel>
              <Select name="department" value={inputData.department} onChange={handleChange} label="Department">
                {departments.map((item) => (
                  <MenuItem key={item._id} value={item.departmentName}>
                    {item.departmentName}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{err.department}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!err.consultantName}>
              <InputLabel>Consultant Name</InputLabel>
              <Select name="consultantId" value={inputData.consultantId} onChange={handleChange} label="Consultant Name">
                {depConsultant.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {`${item.basicDetails.firstName} ${item.basicDetails.middleName} ${item.basicDetails.lastName}`}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{err.consultantName}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!err.billGroup}>
              <InputLabel>Bill Group</InputLabel>
              <Select name="billGroup" value={inputData.billGroup} onChange={handleChange} label="Bill Group">
                {billGroupData.map((r) => (
                  <MenuItem key={r.billGroupName} value={r.billGroupName}>
                    {r.billGroupName}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{err.billGroup}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="flex-end" spacing={2}>
              <Grid item>
                <IconButton title="Save" type="submit" className="btnSave">
                  <Save />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton title="Cancel" onClick={handleClose} className="btnCancel">
                  <Cancel />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default EditService;
