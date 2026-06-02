import React, { useState, useEffect } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Button
} from '@mui/material';
import { Cancel, Save } from '@mui/icons-material';
import { get, post } from 'api/api';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const AddAppointment = ({ open, close, getAppointmentSchedulling }) => {
  const [allDepartment, setAllDepartment] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [inputData, setInputData] = useState({
    doctorName: '',
    departmentName: '',
    slotA: { fromTime: null, toTime: null },
    slotB: { fromTime: null, toTime: null },
    modes: [],
    instructions: '',
    repeateScheduling: false,
  });
  const [error, setError] = useState({});

  const modesOptions = ['Online', 'Telephonic',"Walkin"];

  async function fetchData() {
    try {
      const departmentResponse = await get('department-setup');
      const consultantResponse = await get('newConsultant');
      if (departmentResponse?.data) setAllDepartment(departmentResponse.data);
      if (consultantResponse?.data) setAllDoctors(consultantResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setInputData((prev) => ({
      ...prev,
      modes: checked ? [...prev.modes, value] : prev.modes.filter((mode) => mode !== value),
    }));
    setError((prev) => ({ ...prev, modes: '' }));
  };

  const handleData = (e) => {
    const { name, value } = e.target;

    if (name === 'departmentName') {
      setInputData((prev) => ({ ...prev, [name]: value }));
      const department = allDepartment.find((dept) => dept.departmentName === value);
      if (department) {
        const filteredDoctors = allDoctors.filter((doc) => doc.employmentDetails.departmentOrSpeciality._id === department._id);
        setDoctors(filteredDoctors);
        setError((prev) => ({
          ...prev,
          doctorName: filteredDoctors.length === 0 ? `No doctors available for ${value} department` : '',
        }));
      }
    } else {
      setInputData((prev) => ({ ...prev, [name]: value }));
    }
    setError((prev) => ({ ...prev, [name]: '' }));
  };

  const handleTimeChange = (slot, field, newValue) => {
    setInputData((prev) => ({
      ...prev,
      [slot]: { ...prev[slot], [field]: newValue },
    }));
    setError((prev) => ({ ...prev, [slot]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { doctorName, departmentName, slotA, slotB, modes, instructions } = inputData;

    // Error Validation
    const newError = {};
    if (!doctorName) newError.doctorName = 'Doctor name is required'; 
    if (!departmentName) newError.departmentName = 'Department is required';
    // if (!slotA.fromTime || !slotA.toTime) newError.slotA = 'Slot-1 is required';
    // if (!slotB.fromTime || !slotB.toTime) newError.slotB = 'Slot-2 is required';
    if (modes.length === 0) newError.modes = 'At least one mode is required';
    if (!instructions) newError.instructions = 'Instructions are required';

    if (Object.keys(newError).length > 0) {
      setError(newError);
      return;
    }

    const selectedDoctor = doctors.find((doc) => doc._id === doctorName);
    const doctorFullName = selectedDoctor
      ? `${selectedDoctor.basicDetails.firstName} ${selectedDoctor.basicDetails.middleName} ${selectedDoctor.basicDetails.lastName}`
      : '';

    const dataSend = {
      ...inputData,
      doctorId: doctorName,
      doctorName: doctorFullName,
      status: 'active',
    };

    try {
      await post('appointmentSchedule-master', dataSend).then((response)=>console.log(response)).catch((error)=>console.log(error));
      close();
      getAppointmentSchedulling();
      handleReset();
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const handleReset = () => {
    setInputData({
      doctorName: '',
      departmentName: '',
      slotA: { fromTime: null, toTime: null },
      slotB: { fromTime: null, toTime: null },
      modes: [],
      instructions: '',
      repeateScheduling: false,
    });
    setError({});
    close();
  };


  return (
    <>
      <div className="modal">
        <h2 className="popupHead">Add Doctor Schedule</h2>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!error.departmentName}>
                <InputLabel>Department</InputLabel>
                <Select label='Department' name="departmentName" value={inputData.departmentName} onChange={handleData}>
                  {allDepartment.map((item) => (
                    <MenuItem key={item._id} value={item.departmentName}>
                      {item.departmentName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{error.departmentName}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!error.doctorName}>
                <InputLabel>Consultant</InputLabel>
                <Select label='Consultant' name="doctorName" value={inputData.doctorName} onChange={handleData}>
                  {doctors.map((doc) => (
                    <MenuItem key={doc._id} value={doc._id}>
                      {doc.basicDetails.firstName} {doc.basicDetails.middleName} {doc.basicDetails.lastName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{error.doctorName}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
            <strong>Slot A</strong>
            <div style={{display:"flex",gap:"10px",marginTop:"10px"}}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="From Time"
                  value={inputData.slotA.fromTime}
                  onChange={(newValue) => handleTimeChange('slotA', 'fromTime', newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
                
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="To Time"
                  value={inputData.slotA.toTime}
                  onChange={(newValue) => handleTimeChange('slotA', 'toTime', newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
              </div>
            </Grid>

            <Grid item xs={12} md={6}>
            <strong>Slot B</strong>
            <div style={{display:"flex",gap:"10px",marginTop:"10px"}}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="From Time"
                  value={inputData.slotB.fromTime}
                  onChange={(newValue) => handleTimeChange('slotB', 'fromTime', newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
                
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="To Time"
                  value={inputData.slotB.toTime}
                  onChange={(newValue) => handleTimeChange('slotB', 'toTime', newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
              </div>
            </Grid>

            <Grid item xs={12}>
              <FormGroup style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                {modesOptions.map((mode) => (
                  <FormControlLabel
                    key={mode}
                    control={
                      <Checkbox
                        checked={inputData.modes.includes(mode)}
                        value={mode}
                        onChange={handleCheckboxChange}
                      />
                    }
                    label={mode}
                  />
                ))}
                <FormHelperText>{error.modes}</FormHelperText>
              </FormGroup>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Instructions"
                name="instructions"
                fullWidth
                multiline
                rows={4}
                value={inputData.instructions}
                onChange={handleData}
                error={!!error.instructions}
                helperText={error.instructions}
              />
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <Button type="submit" variant="contained" color="primary" startIcon={<Save />}>
                Save
              </Button>
              <Button onClick={handleReset} variant="outlined" color="error" startIcon={<Cancel />}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </>
  );
};

export default AddAppointment;
