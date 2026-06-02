import React, { useEffect, useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  IconButton,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { get, post, put } from 'api/api';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
const EditOutSourceDiagnostics = ({ getData, handleClose, editData }) => {
  const [labData, setLabData] = useState({
    labName: editData.labName,
    address: editData.address,
    contact: editData.contact,
    departmentId: [],
    addOtherLab: []
  });

  useEffect(() => {
    const mainDepartmentIds = editData.departmentId.map((item) => item._id);

    const otherLabDepartmentIds = editData.addOtherLab.map((item) => item.departmentId.map((department) => department._id));

    console.log('Main Department IDs:', mainDepartmentIds);
    console.log('Other Lab Department IDs:', otherLabDepartmentIds);

    setLabData((prev) => ({
      ...prev,
      departmentId: mainDepartmentIds,
      addOtherLab: editData.addOtherLab.map((item) => ({
        ...item,
        departmentId: item.departmentId.map((department) => department._id)
      }))
    }));
  }, [editData]);

  const [departments, setDepartments] = useState([]);

  // Validation state
  const [errors, setErrors] = useState({
    labName: '',
    address: '',
    contact: '',
    departmentId: '',
    otherLabs: []
  });

  const fetchData = async () => {
    const departmentData = await get('department-setup');
    if (departmentData.data.length > 0) {
      setDepartments(departmentData.data);
    } else {
      setDepartments([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle changes for main lab fields
  const handleMainLabChange = (e) => {
    const { name, value } = e.target;
    setLabData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear the error message when the user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleMainLabDepartmentChange = (event) => {
    const { value } = event.target;
    setLabData((prev) => ({
      ...prev,
      departmentId: typeof value === 'string' ? value.split(',') : value
    }));

    // Clear department error
    if (errors.departmentId) {
      setErrors((prev) => ({
        ...prev,
        departmentId: ''
      }));
    }
  };

  // Add a new "Other Lab" entry
  const addOtherLab = () => {
    setLabData((prev) => ({
      ...prev,
      addOtherLab: [...prev.addOtherLab, { labName: '', address: '', contact: '', departmentId: [] }]
    }));
  };

  // Remove an "Other Lab" entry
  const removeOtherLab = (index) => {
    setLabData((prev) => ({
      ...prev,
      addOtherLab: prev.addOtherLab.filter((_, i) => i !== index)
    }));
  };

  // Handle changes for "Other Lab" fields
  const handleOtherLabChange = (index, field, value) => {
    const updatedLabs = [...labData.addOtherLab];
    updatedLabs[index][field] = value;
    setLabData((prev) => ({
      ...prev,
      addOtherLab: updatedLabs
    }));

    // Clear error for that field if user starts typing
    if (errors.otherLabs[index]?.[field]) {
      const newOtherLabErrors = [...errors.otherLabs];
      newOtherLabErrors[index][field] = '';
      setErrors((prev) => ({
        ...prev,
        otherLabs: newOtherLabErrors
      }));
    }
  };

  const handleOtherLabDepartmentChange = (index, value) => {
    const updatedLabs = [...labData.addOtherLab];
    updatedLabs[index].departmentId = value;
    setLabData((prev) => ({
      ...prev,
      addOtherLab: updatedLabs
    }));

    // Clear department error for other labs
    if (errors.otherLabs[index]?.departmentId) {
      const newOtherLabErrors = [...errors.otherLabs];
      newOtherLabErrors[index].departmentId = '';
      setErrors((prev) => ({
        ...prev,
        otherLabs: newOtherLabErrors
      }));
    }
  };

  // Simple validation for main lab and other labs
  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    // Validate main lab fields
    if (!labData.labName) {
      newErrors.labName = 'Lab Name is required';
      valid = false;
    } else {
      newErrors.labName = '';
    }

    if (!labData.address) {
      newErrors.address = 'Address is required';
      valid = false;
    } else {
      newErrors.address = '';
    }

    if (!labData.contact) {
      newErrors.contact = 'Contact is required';
      valid = false;
    } else {
      newErrors.contact = '';
    }

    if (labData.departmentId.length === 0) {
      newErrors.departmentId = 'At least one department must be selected';
      valid = false;
    } else {
      newErrors.departmentId = '';
    }

    // Validate other labs fields
    const otherLabErrors = [];
    labData.addOtherLab.forEach((lab, index) => {
      const labErrors = {};
      if (!lab.labName) labErrors.labName = 'Lab Name is required';
      if (!lab.address) labErrors.address = 'Address is required';
      if (!lab.contact) labErrors.contact = 'Contact is required';
      if (lab.departmentId.length === 0) labErrors.departmentId = 'At least one department must be selected';

      otherLabErrors[index] = labErrors;
      if (Object.keys(labErrors).length > 0) valid = false;
    });
    newErrors.otherLabs = otherLabErrors;
    setErrors(newErrors);
    return valid;
  };

  // Handle form submission

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before sending data
    if (validateForm()) {
      try {
        const response = await put(`outsourceDiagnostic-master/${editData._id}`, labData);

        console.log(response);

        if (response.lab) {
          toast.success(response.msg);
          handleClose();
          getData();
          setLabData({
            labName: '',
            address: '',
            contact: '',
            departmentId: [],
            addOtherLab: []
          });
        } else {
          toast.error(response.error);
        }
      } catch (error) {
        toast.error('Something went wrong');
        console.error('Error:', error);
      }
    } else {
      toast.error('Form has errors');
      console.log('Form has errors');
    }
  };

  return (
    <div style={{ padding: '30px', height: '600px', overflowY: 'auto' }}>
      <Typography variant="h4" align="center" gutterBottom style={{ marginBottom: '30px' }}>
        Add Labs
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Main Lab Section */}
        <Typography variant="h6" style={{ marginBottom: '20px' }}>
          Main Lab Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Lab Name"
              variant="outlined"
              name="labName"
              value={labData.labName}
              onChange={handleMainLabChange}
              error={!!errors.labName}
              helperText={errors.labName}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Address"
              variant="outlined"
              name="address"
              value={labData.address}
              onChange={handleMainLabChange}
              error={!!errors.address}
              helperText={errors.address}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Contact"
              variant="outlined"
              name="contact"
              value={labData.contact}
              onChange={handleMainLabChange}
              error={!!errors.contact}
              helperText={errors.contact}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth error={!!errors.departmentId}>
              <InputLabel>Department</InputLabel>
              <Select
                multiple
                label="Department"
                value={labData.departmentId}
                onChange={handleMainLabDepartmentChange}
                renderValue={(selected) =>
                  departments
                    .filter((dept) => selected.includes(dept._id))
                    .map((dept) => dept.departmentName)
                    .join(', ')
                }
              >
                {departments.map((dept) => (
                  <MenuItem key={dept._id} value={dept._id}>
                    <Checkbox checked={labData.departmentId.includes(dept._id)} />
                    <ListItemText primary={dept.departmentName} />
                  </MenuItem>
                ))}
              </Select>
              {errors.departmentId && (
                <Typography variant="body2" color="error">
                  {errors.departmentId}
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>

        {/* Other Labs Section */}
        <Typography variant="h6" style={{ margin: '40px 0 20px' }}>
          Outsource Lab Details
        </Typography>
        {labData.addOtherLab.map((lab, index) => (
          <Grid container spacing={2} key={index} style={{ marginBottom: '10px' }}>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="Lab Name"
                variant="outlined"
                value={lab.labName}
                onChange={(e) => handleOtherLabChange(index, 'labName', e.target.value)}
                error={!!errors.otherLabs[index]?.labName}
                helperText={errors.otherLabs[index]?.labName}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="Address"
                variant="outlined"
                value={lab.address}
                onChange={(e) => handleOtherLabChange(index, 'address', e.target.value)}
                error={!!errors.otherLabs[index]?.address}
                helperText={errors.otherLabs[index]?.address}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="Contact"
                variant="outlined"
                value={lab.contact}
                onChange={(e) => handleOtherLabChange(index, 'contact', e.target.value)}
                error={!!errors.otherLabs[index]?.contact}
                helperText={errors.otherLabs[index]?.contact}
              />
            </Grid>
            <Grid item xs={3} style={{ display: 'inline-flex' }}>
              <FormControl fullWidth error={!!errors.otherLabs[index]?.departmentId}>
                <InputLabel>Department</InputLabel>
                <Select
                  multiple
                  label="Department"
                  value={lab.departmentId}
                  onChange={(e) => handleOtherLabDepartmentChange(index, e.target.value)}
                  renderValue={(selected) =>
                    departments
                      .filter((dept) => selected.includes(dept._id))
                      .map((dept) => dept.departmentName)
                      .join(', ')
                  }
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept._id} value={dept._id}>
                      <Checkbox checked={lab.departmentId.includes(dept._id)} />
                      <ListItemText primary={dept.departmentName} />
                    </MenuItem>
                  ))}
                </Select>
                {errors.otherLabs[index]?.departmentId && (
                  <Typography variant="body2" color="error">
                    {errors.otherLabs[index]?.departmentId}
                  </Typography>
                )}
              </FormControl>

              <IconButton onClick={() => removeOtherLab(index)}>
                <MdDelete />
              </IconButton>
            </Grid>
            {/* Remove button stays aligned */}
          </Grid>
        ))}

        <Button variant="outlined" color="primary" startIcon={<Add />} onClick={addOtherLab} style={{ marginTop: '10px' }}>
          Add Lab
        </Button>

        <div style={{ marginTop: '30px' }}>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditOutSourceDiagnostics;
