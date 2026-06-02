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
  IconButton,
  Checkbox,
  ListItemText
} from '@mui/material';
import { Cancel, Save } from '@mui/icons-material';
import { get, post } from 'api/api';
import { toast } from 'react-toastify';

const AddService = ({ handleClose, getData }) => {
  const [departments, setDepartments] = useState([]);
  const [consultant, setConsultant] = useState([]);
  const [depConsultant, setDepConsultant] = useState([]);
  const [billGroupData, setBillGroupData] = useState([]);

  // State for form inputs
  const [inputData, setInputData] = useState({
    serviceName: 'OPD Consultation',
    type: ['New', 'Follow Up'],
    department: '',
    consultantName: '',
    consultantId: '',
    billGroup: 'OPD Consultation Charges'
  });

  console.log('INPUT FD', inputData);
  // Error state for validation
  const [err, setErr] = useState({});

  // State for cancel functionality
  const [isCanceled, setIsCanceled] = useState(false);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [departmentsRes, consultantsRes, billGroupsRes] = await Promise.all([
          get('department-setup'),
          get('newConsultant'),
          get('billgroup-master')
        ]);
  
        const clinicalDepartments = (departmentsRes?.data || []).filter(
          (department) =>
            department?.departmentType?.toLowerCase()?.trim() === 'clinical'
        );
  
        setDepartments(clinicalDepartments ?? []);
        setConsultant(consultantsRes?.data ?? []);
        setBillGroupData(billGroupsRes?.data ?? []);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };
  
    fetchDropdownData();
  }, []);
  
  console.log('consultant', consultant);
  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputData((prevData) => ({
      ...prevData,
      [name]: value
    }));

    if (name === 'department') {
      const dep = consultant?.filter((v, i) => v.employmentDetails.departmentOrSpeciality.departmentName === value);
      setDepConsultant(dep);
    }
    if (name === 'consultantName') {
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
  const handlePatientSubmit = async (event) => {
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
        const response = await post('opd-consultant-service/add', inputData);

        if (response?.data) {
          toast.success('Service added successfully!');
          closeRegistration();
          getData();
        } else {
          toast.error('Failed to add service. Please try again.');
        }
      } catch (error) {
        toast.error('Failed to add service.');
      }
    }
  };

  // Handle cancel functionality and reset form

  // Close and reset form
  const closeRegistration = () => {
    handleClose();
    setInputData({
      serviceName: '',
      type: '',
      department: '',
      consultantName: '',
      billGroup: ''
    });
    setErr({});
    setIsCanceled(false); // Reset cancel state
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
        Add OPD Consultation
      </Typography>
      <form onSubmit={handlePatientSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              InputProps={{
                readOnly: true
              }}
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
              <Select
                multiple
                name="type"
                value={inputData.type || ['New', 'Follow Up']} // Default selection
                onChange={handleChange}
                renderValue={(selected) => selected.join(', ')} // Show selected values as a comma-separated list
                label="Type"
              >
                {['New', 'Follow Up'].map((option) => (
                  <MenuItem key={option} value={option}>
                    <Checkbox checked={inputData.type?.includes(option)} />
                    <ListItemText primary={option} />
                  </MenuItem>
                ))}
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
              <Select name="consultantName" value={inputData.consultantId} onChange={handleChange} label="Consultant Name">
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
            <TextField
              fullWidth
              name="billGroup"
              value={inputData.billGroup}
              label="Bill Group"
              variant="outlined"
              onChange={handleChange}
              error={!!err.billGroup}
              helperText={err.billGroup}
              InputProps={{
                readOnly: true
              }}
            />
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

export default AddService;
