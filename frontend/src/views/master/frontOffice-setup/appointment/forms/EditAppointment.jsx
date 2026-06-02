import React, { useState, useEffect } from 'react'
import {
  Button,
  Modal,
  InputLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  TextField,
  Select,
  MenuItem,
  Grid,
  FormHelperText,
  Box,
  IconButton,
  Typography,
  Chip
} from '@mui/material'
import { FormLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { Cancel, Close, KeyboardTab, Save } from '@mui/icons-material'
import { get, put } from 'api/api'
import { toast } from 'react-toastify'
import { FaSave } from 'react-icons/fa'

const EditAppointment = ({ editData, getData, close }) => {
  const [prefix, setPrefix] = useState([])
  const [departments, setDepartments] = useState([])
  const [consultant, setConsultant] = useState([])
  const [consultanta, setConsultanta] = useState([])
  const [availability, setAvailability] = useState({});
  const [openBookTime, setOpenBookTime] = useState(false);

  const [inputData, setInputData] = useState({
    prefix: editData?.prefix,
    prefixId: editData?.prefixId._id,
    patientFirstName: editData?.patientFirstName,
    patientMiddleName: editData?.patientMiddleName,
    patientLastName: editData?.patientLastName,
    age: editData?.age,
    gender: editData?.gender,
    contact: editData.contact,
    address: editData?.address,
    country: editData?.country,
    state: editData?.state,
    city: editData?.city,
    pincode: editData?.pincode,
    departmentName: editData?.departmentName,
    departmentId: editData.departmentId._id,
    consultantName: editData?.consultantName,
    consultantId: editData?.consultantId._id,
    time: '',
    date: editData?.date,
    consultationType: editData?.consultationType,
    appointmentMode: editData?.appointmentMode
  })
  const [err, setErr] = useState({
    prefix: '',
    patientFirstName: '',
    patientMiddleName: '',
    patientLastName: '',
    age: '',
    gender: '',
    contact: '',
    address: '',
    country: '',
    state: '',
    city: '',
    pincode: '',
    departmentName: '',
    consultantName: '',
    time: '',
    date: '',
    consultationType: '',
    appointmentMode: ''
  })

  useEffect(() => {
    Promise.all([
      get('department-setup').then(response => setDepartments(response.data)),
      get('newConsultant').then(response => setConsultanta(response.data)),
      get('prefix').then(response => setPrefix(response.allPrefix))
    ])
  }, [])

  // useEffect(() => {
  //   if (editData) {
  //     const { prefixId, departmentId, consultantId, ...rest } = editData
     
  //     const consultantName =
  //       consultanta?.find(c => c._id === consultantId._id)?.basicDetails?.firstName +
  //         ' ' +
  //         consultanta?.find(c => c._id === consultantId._id)?.basicDetails?.middleName +
  //         ' ' +
  //         consultanta?.find(c => c._id === consultantId._id)?.basicDetails?.lastName || ''
  //     setInputData({
  //       ...rest,
  //       prefix: prefixId.prefix,
  //       prefixId: prefixId._id,
  //       departmentName: departmentId.departmentName,
  //       departmentId: departmentId._id,
  //       consultantName: consultantName,
  //       consultantId: consultantId._id
  //     })
  //   }
  // }, [editData, prefix, departments, consultanta])

  const closeRegistration = () => {
    close()
   
    setInputData({
      prefix: '',
      prefixId: '',
      patientFirstName: '',
      patientMiddleName: '',
      patientLastName: '',
      age: '',
      gender: '',
      contact: '',
      address: '',
      country: '',
      state: '',
      city: '',
      pincode: '',
      departmentName: '',
      departmentId: '',
      consultantName: '',
      consultantId: '',
      time: '',
      date: '',
      consultationType: '',
      appointmentMode: ''
    })
    setErr({
      prefix: '',
      patientFirstName: '',
      patientMiddleName: '',
      patientLastName: '',
      age: '',
      gender: '',
      contact: '',
      address: '',
      country: '',
      state: '',
      city: '',
      pincode: '',
      departmentName: '',
      consultantName: '',
      time: '',
      date: '',
      consultationType: '',
      appointmentMode: ''
    })
  }

  const handleChange = event => {
    const { name, value } = event.target
    if (name === 'prefix') {
      let preName = ''
      prefix.forEach(val => {
        if (value === val._id) {
          preName = val.prefix
        }
      })
      setInputData(prev => {
        return {
          ...prev,
          prefixId: value,
          prefix: preName
        }
      })
    } else if (name === 'departmentName') {
      const dep = departments.find(v => v._id === value)?.departmentName || ''
      const cons = consultanta?.filter(v => v.employmentDetails?.departmentOrSpeciality?._id === value)
      setConsultant(cons)

      setInputData(prev => ({
        ...prev,
        departmentId: value,
        departmentName: dep,
        time: ''
      }))
      setErr(prev => ({
        ...prev,
        consultantName: cons.length === 0 ? `Consultant not belong to ${dep} department` : ''
      }))
    } else if (name === 'consultantName') {
      const consultantBook = consultanta.find(v => v._id === value)
      const dep = consultantBook
        ? `${consultantBook?.basicDetails?.prefix?.prefix}. ${consultantBook.basicDetails.firstName} ${consultantBook.basicDetails.middleName} ${consultantBook.basicDetails.lastName}`
        : ''


      setInputData(prev => ({
        ...prev,
        consultantId: value,
        consultantName: dep,
        time: ''
      }))
      setErr(prev => ({
        ...prev,
        time: ''
      }))
    } else {
      setInputData(prev => ({
        ...prev,
        [name]: value
      }))
    }
    setErr(prev => ({
      ...prev,
      [name]: ''
    }))
  }

  //     const interval = timeInterval.includes('Min')
  //       ? parseInt(timeInterval.replace(' Min', ''), 10)
  //       : parseInt(timeInterval.replace(' Hour', ''), 10) * 60;
  //     const start = new Date(`2022-01-01T${startTime}`);
  //     const end = new Date(`2022-01-01T${endTime}`);
  //     if (start < end && interval > 0) {
  //       const slots = [];
  //       let current = new Date(start);
  //       while (current <= end) {
  //         slots.push(
  //           current.toLocaleTimeString([], {
  //             hour: '2-digit',
  //             minute: '2-digit'
  //           })
  //         );
  //         current.setMinutes(current.getMinutes() + interval);
  //       }
  //       setTimeSlots(slots);
  //     }
  //   } else {
  //     alert('Please fill in all fields.');
  //   }
  // };

  const onBlurPincodeHandler = async () => {
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${inputData.pincode}`)
      const data = await response.json()
      if (data[0].Status === 'Success') {
        const { State, District, Country, Pincode } = data[0].PostOffice[0]
        setInputData(prev => ({
          ...prev,
          state: State,
          city: District,
          country: Country,
          pincode: Pincode
        }))
      } else {
        console.error('Invalid Pincode')
      }
    } catch (error) {
      console.error('Error fetching pincode data:', error)
    }
  }

  const handlePatientSubmit = async event => {
    event.preventDefault()
    const errors = {}
    if (!inputData.prefix) errors.prefix = 'Prefix is required'
    if (!inputData.patientFirstName) errors.patientFirstName = 'Patient First Name is required'
    if (!inputData.patientLastName) errors.patientLastName = 'Patient Last Name is required'
    if (!inputData.patientMiddleName) errors.patientMiddleName = 'Patient Middle Name is required'
    if (!inputData.age) errors.age = 'Age is required'
    if (!inputData.gender) errors.gender = 'Gender is required'
    if (!inputData.contact) errors.contact = 'Mobile No. is required'
    else if (inputData.contact.length !== 10) errors.contact = 'Enter Valid Mobile No.'
    if (!inputData.address) errors.address = 'Address is required'
    if (!inputData.city) errors.city = 'City is required'
    if (!inputData.country) errors.country = 'Country is required'
    if (!inputData.state) errors.state = 'State is required'
    if (!inputData.pincode) errors.pincode = 'Pincode is required'
    else if (inputData.pincode.length !== 6) errors.pincode = 'Enter 6-digit pincode'
    if (!inputData.departmentName) errors.departmentName = 'Department Name is required'
    if (!inputData.consultantName) errors.consultantName = 'Consultant Name is required'
    if (!inputData.time) errors.time = 'Time is required'
    if (!inputData.date) errors.date = 'Date is required'
    if (!inputData.consultationType) errors.consultationType = 'Consultant Type is required'
    if (!inputData.appointmentMode) errors.appointmentMode = 'Mode of Appointment is required'

    setErr(errors)

    if (Object.keys(errors).length === 0) {
      try {
        await put(`patient-appointment/${editData._id}`, inputData)
        console.log("PATIENT",inputData)
        toast.success('Appointment updated successfully')
        closeRegistration()
        getData()
      } catch (error) {
        toast.error('Something went wrong. Please try later!!')
      }
    }
  }

  useEffect(() => {
    if (inputData.pincode.length > 5) {
      onBlurPincodeHandler()
    }
  }, [inputData.pincode])
  // Slots Fetch
 
  useEffect(() => {

    if(editData.departmentId._id){
      const filteredConsultants = consultanta.filter(consultant => consultant.employmentDetails?.departmentOrSpeciality?._id === editData.departmentId._id)
      setConsultant(filteredConsultants)
    }

  },[editData.departmentId._id, consultanta])


   const slotAData = availability?.slotA?.timeSlotsIntervalWise;
    const slotBData = availability?.slotB?.timeSlotsIntervalWise;
  
    const handleChipClick = (slot) => {
      setInputData((prev) => ({
        ...prev,
        time: slot
      }));
      setOpenBookTime(false); 
    };

    useEffect(() => {
      async function fetchAvailability() {
        const response = await get(`appointmentSchedule-master/getData/checkConsultantAvailableOrNot/${inputData?.consultantId}`);
  
        if (response?.available) {
          setAvailability(response?.schedule);
        }
      }
      if (inputData?.consultantId) {
        fetchAvailability();
      }
    }, [inputData?.consultantId]);

  return (
    <div>
      <div className='modal' style={{ height: '85vh' }}>
        <h2>Edit Appointment</h2>
        <form onSubmit={handlePatientSubmit}>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={3}>
              <FormControl variant='outlined' fullWidth error={!!err.prefix}>
                <InputLabel variant='outlined'>Prefix</InputLabel>
                <Select
                  MenuProps={{
                    PaperProps: {
                      style: { maxHeight: 300 }
                    }
                  }}
                  label='Prefix'
                  name='prefix'
                  value={inputData.prefixId}
                  onChange={handleChange}
                  variant='outlined'
                >
                  {prefix.map(val => (
                    <MenuItem value={val._id} key={val._id}>
                      {val.prefix}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{err.prefix}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                id='PatientFirstName'
                label='Patient First Name'
                variant='outlined'
                name='patientFirstName'
                onChange={handleChange}
                value={inputData.patientFirstName}
                error={!!err.patientFirstName}
                helperText={err.patientFirstName}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                id='PatientMiddleName'
                label='Patient Middle Name'
                variant='outlined'
                name='patientMiddleName'
                onChange={handleChange}
                value={inputData.patientMiddleName}
                error={!!err.patientMiddleName}
                helperText={err.patientMiddleName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id='PatientLastName'
                label='Patient Last Name'
                variant='outlined'
                name='patientLastName'
                onChange={handleChange}
                value={inputData.patientLastName}
                error={!!err.patientLastName}
                helperText={err.patientLastName}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label='Age'
                variant='outlined'
                type='number'
                name='age'
                value={inputData.age}
                onChange={handleChange}
                error={!!err.age}
                helperText={err.age}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl error={!!err.gender}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'start',
                    alignItems: 'center'
                  }}
                >
                  <FormLabel style={{ marginRight: '6px' }}>Gender:</FormLabel>
                  <RadioGroup row name='gender' value={inputData.gender} onChange={handleChange}>
                    <FormControlLabel value='Male' control={<Radio size='small' />} label='Male' />
                    <FormControlLabel value='Female' control={<Radio size='small' />} label='Female' />
                    <FormControlLabel value='Other' control={<Radio size='small' />} label='Other' />
                  </RadioGroup>
                </div>
                <FormHelperText>{err.gender}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Mobile No.'
                variant='outlined'
                name='contact'
                value={inputData.contact}
                onChange={handleChange}
                error={!!err.contact}
                helperText={err.contact}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Address'
                variant='outlined'
                name='address'
                value={inputData.address}
                onChange={handleChange}
                error={!!err.address}
                helperText={err.address}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Pincode'
                variant='outlined'
                type='number'
                name='pincode'
                value={inputData.pincode}
                onChange={handleChange}
                error={!!err.pincode}
                helperText={err.pincode}
                onBlur={onBlurPincodeHandler}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='City'
                variant='outlined'
                name='city'
                value={inputData.city}
                onChange={handleChange}
                error={!!err.city}
                helperText={err.city}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='State'
                variant='outlined'
                name='state'
                value={inputData.state}
                onChange={handleChange}
                error={!!err.state}
                helperText={err.state}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Country'
                variant='outlined'
                name='country'
                value={inputData.country}
                onChange={handleChange}
                error={!!err.country}
                helperText={err.country}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant='outlined' error={!!err.departmentName}>
                <InputLabel>Department/Speciality</InputLabel>
                <Select
                  MenuProps={{
                    PaperProps: {
                      style: { maxHeight: 300 }
                    }
                  }}
                  label='Department/Speciality'
                  name='departmentName'
                  value={inputData.departmentId}
                  onChange={handleChange}
                >
                  {departments.map(item => (
                    <MenuItem key={item._id} value={item._id}>
                      {item.departmentName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{err.departmentName}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant='outlined' error={!!err.consultantName}>
                <InputLabel>Consultant Name</InputLabel>
                <Select
                  MenuProps={{
                    PaperProps: {
                      style: { maxHeight: 300 }
                    }
                  }}
                  label='Consultant Name'
                  name='consultantName'
                  value={inputData.consultantId}
                  onChange={handleChange}
                >
                  {consultant.map(item => (
                    <MenuItem key={item._id} value={item._id}>
                      {`${item.basicDetails.prefix.prefix}. ${item.basicDetails.firstName} ${item.basicDetails.middleName} ${item.basicDetails.lastName}`}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{err.consultantName}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Date'
                variant='outlined'
                name='date'
                type='date'
                value={inputData.date}
                onChange={handleChange}
                error={!!err.date}
                helperText={err.date}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Slot'
                variant='outlined'
                name='time'
                value={inputData.time}
                error={!!err.time}
                helperText={err.time}
                onChange={handleChange}
                onClick={() => setOpenBookTime(true)}
               
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Consultation Type</InputLabel>
                <Select
                  label='Consultation Type'
                  variant='outlined'
                  name='consultationType'
                  value={inputData.consultationType}
                  onChange={handleChange}
                  required
                  error={!!err.consultationType}
                >
                  <MenuItem value='New'>New</MenuItem>
                  <MenuItem value='Follow-Up'>Follow-Up</MenuItem>
                </Select>
                <span>{err.consultationType}</span>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant='outlined' error={!!err.appointmentMode}>
                <InputLabel>Mode of Appointment</InputLabel>
                <Select
                  MenuProps={{
                    PaperProps: {
                      style: { maxHeight: 300 }
                    }
                  }}
                  label='Mode of Appointment'
                  name='appointmentMode'
                  value={inputData.appointmentMode}
                  onChange={handleChange}
                >
                  <MenuItem value='Telephonic'>Telephonic</MenuItem>
                  <MenuItem value='Walk In'>Walk In</MenuItem>
                  <MenuItem value='Online'>Online</MenuItem>
                </Select>
                <FormHelperText>{err.appointmentMode}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <div className='btnGroup'>
                <Button color='primary' type='submit' title='Save' className='btnSave'>
                  <FaSave style={{ fontSize: '1.5rem' }} />
                </Button>
                <Button title='Cancel' onClick={closeRegistration} className='btnCancel'>
                  <Cancel />
                </Button>
              </div>
            </Grid>
          </Grid>
        </form>
      </div>

        <Modal open={openBookTime} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
              <Box
                sx={{
                  position: 'absolute',
                  top: '30%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '40%',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  backgroundColor: '#ffffff',
                  borderRadius: 3,
                  boxShadow: 24,
                  padding: 4
                }}
                className="modal-container"
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h4" sx={{ mb: 2 }}>
                    Slots
                  </Typography>
                  <IconButton
                    onClick={() => {
                      setOpenBookTime(false);
                    }}
                  >
                    <Close />
                  </IconButton>
                </Box>
      
                <Paper
                  elevation={3}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: '#f9f9f9'
                  }}
                >
                  <Grid container spacing={4}>
                    {/* Slot A */}
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          padding: 3,
                          border: '1px solid #e0e0e0',
                          borderRadius: 2,
                          backgroundColor: '#ffffff'
                        }}
                      >
                        <Typography variant="h6" gutterBottom>
                          Slot A
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          {slotAData?.map((slot, index) => (
                            <Chip
                              key={index}
                              label={slot?.time}
                              color="primary"
                              sx={{ margin: '5px' }}
                              onClick={() => handleChipClick(slot?.time)}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Grid>
      
                    {/* Slot B */}
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          padding: 3,
                          border: '1px solid #e0e0e0',
                          borderRadius: 2,
                          backgroundColor: '#ffffff'
                        }}
                      >
                        <Typography variant="h6" gutterBottom>
                          Slot B
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          {slotBData?.map((slot, index) => (
                            <Chip
                              key={index}
                              label={slot?.time}
                              color="secondary"
                              sx={{ margin: '5px' }}
                              onClick={() => handleChipClick(slot?.time)}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            </Modal>
    </div>
  )
}

export default EditAppointment
