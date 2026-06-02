import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText
} from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { get, put } from 'api/api';

function EmploymentDetails({ setValue, setStoredAllData, storedAllData }) {
  const [deparmentData, setDepartmentData] = useState([]);
  const [empRoleData, setEmpRoleData] = useState([]);
  const [designationData, setDesignationData] = useState([]);
  const [filteredDesignation, setFilteredDesignation] = useState([]);
  const typeOfEmployeeData = ['Contract', 'Outsource', 'Part time', 'Full time', 'Visiting', 'Trainee', 'Probationer'];

  const [nursingAndParamedicalReportTo, setNursingAndParamedicalReportTo] = useState([]);

  async function fetchNursingAndParamedicalReportToData() {
    const response = await get('nursingAndParamedical/nursingAndParamedicalData/reportTo');
    setNursingAndParamedicalReportTo(response.data.length > 0 ? response.data : []);
  }

  async function fetchDepartmentData() {
    const response = await get('department-setup');
    setDepartmentData(response.data || []);
  }

  async function fetchEmployeeRole() {
    const response = await get('employee-role');
    setEmpRoleData(response.employeeRole || []);
  }

  async function fetchDesignation() {
    const response = await get('designation-master');
    setDesignationData(response.data);
  }

  useEffect(() => {
    fetchDepartmentData();
    fetchEmployeeRole();
    fetchDesignation();
    fetchNursingAndParamedicalReportToData();
  }, []);

  const [employmentDetails, setEmploymentDetails] = useState({
    departmentOrSpeciality: []
  });

  const [errors, setErrors] = useState({
    departmentOrSpeciality: [],
    empRole: '',
    designation: '',
    typeOfEmployee: '',
    joiningDate: '',
    location: '',
    reportTo: ''
  });

  useEffect(() => {
    setEmploymentDetails(
      Object.keys(storedAllData.employmentDetails).length > 0
        ? storedAllData.employmentDetails
        : {
            departmentOrSpeciality: [],
            empRole: '',
            designation: '',
            typeOfEmployee: '',
            OPD: [],
            IPD: [],
            emergency: [],
            joiningDate: '',
            location: '',
            appointmentDate: '',
            reportTo: '',
            description: ''
          }
    );
  }, [storedAllData.employmentDetails]);

  useEffect(() => {
    const selectedEmployeeRole = employmentDetails.empRole;
    if (selectedEmployeeRole) {
      const filteredDesigationAccordingToEmpRole = designationData.filter((item) => item.empRoleId === selectedEmployeeRole);
      setFilteredDesignation(filteredDesigationAccordingToEmpRole);
    }
  }, [employmentDetails.empRole, designationData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmploymentDetails((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleMultiSelectChange = (event) => {
    const { name, value } = event.target;

    setEmploymentDetails((prev) => ({
      ...prev,
      [name]: typeof value === 'string' ? value.split(',') : value
    }));
  };

  const employmentDetailValidation = () => {
    const validations = [
      { field: 'departmentOrSpeciality', message: 'Department Or Speciality is required' },
      { field: 'empRole', message: 'Employee role is required' },
      { field: 'designation', message: 'Designation is required' },
      { field: 'typeOfEmployee', message: 'Type of employee is required' },
      { field: 'joiningDate', message: 'Joining date is required' },
      { field: 'location', message: 'Location is required' },
      { field: 'reportTo', message: 'Reporting manager is required' }
    ];

    let isValid = true;
    let newErrors = {};

    validations.forEach(({ field, message }) => {
      if (!employmentDetails[field]) {
        newErrors[field] = message;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (employmentDetailValidation()) {
    if (true) {
      if (storedAllData.submittedFormId) {
        const response = await put(`nursingAndParamedical/employmentDetails/${storedAllData?.submittedFormId}`, { employmentDetails });
        if (response.success === true) {
          setStoredAllData((prev) => ({
            ...prev,
            employmentDetails: response.data.employmentDetails
          }));
          toast.success(response.message);
          setValue((prev) => prev + 1);
        } else {
          toast.error(response.message);
        }
      } else {
        toast.error('Please submit the Basic Details first');
        setValue(0);
      }
    }
  };

  const handleDepChange = (event) => {
    let value = event.target.value;

    if (value.includes('all')) {
      // If all are selected, unselect all; otherwise, select all
      value = selectedDepartments.length === allDepartmentIds.length ? [] : allDepartmentIds;
    }

    // Get the corresponding department names based on selected IDs
    const selectedDepartmentNames = deparmentData?.filter((dept) => value.includes(dept._id)).map((dept) => dept.departmentName);

    setEmploymentDetails((prev) => ({
      ...prev,
      departmentId: value,
      departmentOrSpeciality: value
    }));
  };
  const selectedDepartments = Array.isArray(employmentDetails.departmentId) ? employmentDetails.departmentId : [];
  const allDepartmentIds = deparmentData?.map((r) => r._id);
  return (
    <Box sx={{ padding: 4, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ maxWidth: 900, width: '100%', boxShadow: 3 }}>
        <CardHeader
          title="Current Employment Details Form"
          titleTypographyProps={{ variant: 'h5', align: 'center' }}
          sx={{ backgroundColor: '#f5f5f5', padding: 2 }}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Department */}
              {/* <Grid item xs={12} sm={4}>
                <TextField
                  select
                  label='Department/Speciality'
                  name='departmentOrSpeciality'
                  value={employmentDetails.departmentOrSpeciality || ''}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.departmentOrSpeciality}
                  helperText={errors.departmentOrSpeciality}
                >
                  {deparmentData.map((item, index) => (
                    <MenuItem key={item._id} value={item._id}>
                      {item.departmentName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid> */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="department">Department/Speciality</InputLabel>
                  <Select
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 300 } // Adjust maxHeight as needed
                      }
                    }}
                    label="Department/Speciality"
                    name="departmentOrSpeciality"
                    multiple
                    value={selectedDepartments?.length ? selectedDepartments : employmentDetails?.departmentOrSpeciality || []}
                    onChange={handleDepChange}
                    variant="outlined"
                    renderValue={(selected) =>
                      selected.length === allDepartmentIds.length
                        ? 'All Departments'
                        : deparmentData
                            ?.filter((r) => selected.includes(r._id))
                            .map((r) => r.departmentName)
                            .join(', ')
                    }
                  >
                    {/* Select All Option */}
                    <MenuItem value="all">
                      <em>{employmentDetails?.departmentId?.length === allDepartmentIds?.length ? 'Deselect All' : 'Select All'}</em>
                    </MenuItem>

                    {/* Dynamic Department Options */}
                    {deparmentData.map((r) => (
                      <MenuItem key={r._id} value={r._id}>
                        {r.departmentName}
                      </MenuItem>
                    ))}
                  </Select>
                  {/* <FormHelperText>{error.department}</FormHelperText> */}
                </FormControl>
              </Grid>
              {/* Employee Role */}
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  label="Employee Role"
                  name="empRole"
                  value={employmentDetails.empRole || ''}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.empRole}
                  helperText={errors.empRole}
                >
                  {empRoleData.map((item, index) => (
                    <MenuItem key={item._id} value={item._id}>
                      {item.employeeRole}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Designation */}
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  label="Designation"
                  name="designation"
                  value={employmentDetails.designation || ''}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.designation}
                  helperText={errors.designation}
                >
                  {filteredDesignation?.length > 0 ? (
                    filteredDesignation.map((item, index) => (
                      <MenuItem key={item._id} value={item._id}>
                        {item.designationName}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem>No Data Found</MenuItem>
                  )}
                </TextField>
              </Grid>

              {/* Type of Employee */}
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  label="Type of Employee"
                  name="typeOfEmployee"
                  value={employmentDetails.typeOfEmployee || ''}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.typeOfEmployee}
                  helperText={errors.typeOfEmployee}
                >
                  {typeOfEmployeeData.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={4}>
                {/* OPD Multi-select */}
                <FormControl fullWidth>
                  <InputLabel id="opd-checkbox-label">OPD</InputLabel>
                  <Select
                    labelId="opd-checkbox-label"
                    id="opd-checkbox"
                    multiple
                    name="OPD"
                    value={employmentDetails.OPD || []}
                    onChange={handleMultiSelectChange}
                    input={<OutlinedInput label="OPD" />}
                    renderValue={(selected) => selected.join(', ')}
                  >
                    <MenuItem value="Regular OPD (has fixed)">
                      <Checkbox checked={employmentDetails?.OPD?.includes('Regular OPD (has fixed)')} />
                      <ListItemText primary="Regular OPD (has fixed)" />
                    </MenuItem>
                    <MenuItem value="Only on call-basis (no fixed hours)">
                      <Checkbox checked={employmentDetails?.OPD?.includes('Only on call-basis (no fixed hours)')} />
                      <ListItemText primary="Only on call-basis (no fixed hours)" />
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                {/* IPD Multi-select */}
                <FormControl fullWidth>
                  <InputLabel id="ipd-checkbox-label">IPD</InputLabel>
                  <Select
                    labelId="ipd-checkbox-label"
                    id="ipd-checkbox"
                    name="IPD"
                    multiple
                    value={employmentDetails.IPD || []}
                    onChange={handleMultiSelectChange}
                    input={<OutlinedInput label="IPD" />}
                    renderValue={(selected) => selected.join(', ')}
                  >
                    <MenuItem value="Regular (Provides complete care)">
                      <Checkbox checked={employmentDetails?.IPD?.includes('Regular (Provides complete care)')} />
                      <ListItemText primary="Regular (Provides complete care)" />
                    </MenuItem>
                    <MenuItem value="Only on call basis (only referred patients are seen, and opinion provided/procedure performed)">
                      <Checkbox
                        checked={employmentDetails?.IPD?.includes(
                          'Only on call basis (only referred patients are seen, and opinion provided/procedure performed)'
                        )}
                      />
                      <ListItemText primary="Only on call basis (only referred patients are seen, and opinion provided/procedure performed)" />
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="emergency-checkbox-label">Emergency</InputLabel>
                  <Select
                    labelId="emergency-checkbox-label"
                    id="emergency-checkbox"
                    name="emergency"
                    multiple
                    value={employmentDetails.emergency || []}
                    onChange={handleMultiSelectChange}
                    input={<OutlinedInput label="Emergency" />}
                    renderValue={(selected) => selected.join(', ')}
                  >
                    <MenuItem value="Can attend emergency">
                      <Checkbox checked={employmentDetails?.emergency?.includes('Can attend emergency')} />
                      <ListItemText primary="Can attend emergency" />
                    </MenuItem>
                    <MenuItem value="Can't attend emergency">
                      <Checkbox checked={employmentDetails?.emergency?.includes("Can't attend emergency")} />
                      <ListItemText primary="Can't attend emergency" />
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Relieving Date */}
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Appointment Date"
                  name="appointmentDate"
                  type="date"
                  value={employmentDetails?.appointmentDate?.slice(0, 10) || ''}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Joining Date */}
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Joining Date"
                  name="joiningDate"
                  type="date"
                  value={employmentDetails?.joiningDate?.slice(0, 10) || ''}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.joiningDate}
                  helperText={errors.joiningDate}
                />
              </Grid>

              {/* Location */}
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Location"
                  name="location"
                  value={employmentDetails.location}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.location}
                  helperText={errors.location}
                />
              </Grid>

              {/* Report To */}
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  label="Report To"
                  name="reportTo"
                  value={employmentDetails.reportTo || ''}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.reportTo}
                  helperText={errors.reportTo || ''}
                >
                  {nursingAndParamedicalReportTo && nursingAndParamedicalReportTo.length > 0 ? (
                    nursingAndParamedicalReportTo.map((item) => (
                      <MenuItem key={item._id} value={item._id}>
                        {item.basicDetails.firstName && item.basicDetails.lastName
                          ? `${item.basicDetails.firstName} ${item.basicDetails.lastName}`
                          : 'No Name Available'}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No data found</MenuItem>
                  )}
                </TextField>
              </Grid>
              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  value={employmentDetails.description}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={4}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button type="submit" variant="contained" color="primary" disabled={storedAllData.employmentDetails._id}>
                    Save & Next
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default EmploymentDetails;
