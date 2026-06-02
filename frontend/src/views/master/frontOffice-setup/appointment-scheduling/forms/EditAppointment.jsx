import React, { useState, useEffect } from 'react'
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  IconButton,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@mui/material'

import { Cancel, Save } from '@mui/icons-material'
import { get, put } from 'api/api'
import { toast } from 'react-toastify'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

const EditAppointment = ({ close, item, getAppointmentSchedulling }) => {
  console.log(item)

  const [allData, setAllData] = useState([])
  const [doctors, setDoctors] = useState([])
  const [doctorsa, setDoctorsa] = useState([])
  const [inputData, setInputData] = useState({
    doctorName: item.doctorName,
    doctorId: item.doctorId,
    departmentName: item.departmentName,
    departmentId: item.departmentId,

    slotA: {
      fromTime: new Date(item.slotA.fromTime),
      toTime: new Date(item.slotA.toTime)
    },
    slotB: {
      fromTime: new Date(item.slotB.fromTime),
      toTime: new Date(item.slotB.toTime)
    },
    modes: item.modes || [],
    instructions: item.instructions
  })

  const [error, setError] = useState({
    doctorName: '',
    departmentName: '',
    slotA: '',
    slotB: '',
    modes: '',
    instructions: ''
  })

  const modesOptions = ['Online', 'Telephonic', 'Walkin']

  const handleCheckboxChange = e => {
    const { value, checked } = e.target
    setInputData(prev => ({
      ...prev,
      modes: checked ? [...prev.modes, value] : prev.modes.filter(mode => mode !== value)
    }))
    setError(prev => ({ ...prev, modes: '' }))
  }

  const handleTimeChange = (slot, field, newValue) => {
    setInputData(prev => ({
      ...prev,
      [slot]: { ...prev[slot], [field]: newValue }
    }))
    setError(prev => ({ ...prev, [slot]: '' }))
  }

  const handleData = e => {
    const name = e.target.name
    const value = e.target.value
    if (name === 'departmentName') {
      let dep = ''
      allData.forEach(v => {
        if (v._id === value) {
          dep = v.departmentName
        }
      })
      setInputData(prev => {
        return { ...prev, departmentId: value, departmentName: dep }
      })

      let cons = []
      doctorsa.forEach(v => {
        if (v.employmentDetails.departmentOrSpeciality._id === value) {
          cons.push(v)
        }
      })
      setDoctors(cons)
      if (cons.length === 0) {
        setError(prev => {
          return { ...prev, doctorName: `Doctor not belong to selected department` }
        })
      } else {
        setError(prev => {
          return { ...prev, doctorName: `` }
        })
      }
    } else if (name === 'doctorName') {
      let dep = ''
      doctors.forEach(v => {
        if (v._id === value) {
          dep = v.basicDetails.firstName + ' ' + v.basicDetails.middleName + ' ' + v.basicDetails.lastName
        }
      })
      setInputData(prev => {
        return { ...prev, doctorId: value, doctorName: dep }
      })
    } else {
      setInputData(prev => {
        return { ...prev, [name]: value }
      })
    }
    setError(prev => {
      return { ...prev, [name]: '' }
    })
  }

  async function FetchData () {
    try {
      await get('department-setup').then(res => {
        setAllData(res.data)
      })
      const responsed = await get('newConsultant')
      const datad = await responsed
      setDoctorsa(datad.data)
      let pay1 = []
      datad.data.forEach(v => {
        if (v.employmentDetails.departmentOrSpeciality._id === item.departmentId) {
          pay1.push(v)
        }
      })
      setDoctors(pay1)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    FetchData()
    // eslint-disable-next-line
  }, [])

  const handleSubmitData = async e => {
    e.preventDefault()
    if (inputData.doctorName === '') {
      setError(prev => {
        return { ...prev, doctorName: 'Doctor name is required' }
      })
    }
    if (inputData.departmentName === '') {
      setError(prev => {
        return { ...prev, departmentName: 'Department Name is required' }
      })
    }
    if (inputData.startTime === '') {
      setError(prev => {
        return { ...prev, startTime: 'Start Time is required' }
      })
    }
    if (inputData.endTime === '') {
      setError(prev => {
        return { ...prev, endTime: 'End Time is required' }
      })
    }
    if (inputData.timeInterval === '') {
      setError(prev => {
        return { ...prev, timeInterval: 'Time Interval is required' }
      })
    }
    if (inputData.scheduling === '') {
      setError(prev => {
        return { ...prev, scheduling: 'Scheduling is required' }
      })
    }
    if (
      inputData.doctorName !== '' &&
      inputData.departmentName !== '' &&
      inputData.startTime !== '' &&
      inputData.endTime !== '' &&
      inputData.timeInterval !== '' &&
      inputData.scheduling !== ''
    ) {
      const response = await put(`appointmentSchedule-master/${item._id}`, inputData)
      if (response) {
        close()
        getAppointmentSchedulling()
        toast.success(`${inputData.doctorName} Doctor Appointment Updated!!`)
      } else {
        toast.error('Something went wrong, Please try later!!')
      }
    }
  }

  useEffect(() => {
    FetchData()
    if (item) {
      setInputData({
        doctorId: item.doctorId,
        doctorName: item.doctorName,
        departmentName: item.departmentName,
        departmentId: item.departmentId,
        slotA: {
          fromTime: item.slotA.fromTime ? new Date(item.slotA.fromTime) : null,
          toTime: item.slotA.toTime ? new Date(item.slotA.toTime) : null,
        },
        slotB: {
          fromTime: item.slotB.fromTime ? new Date(item.slotB.fromTime) : null,
          toTime: item.slotB.toTime ? new Date(item.slotB.toTime) : null,
        },
        modes: item.modes || [],
        instructions: item.instructions
      })
    }
    // eslint-disable-next-line
  }, [item])

  return (
    <>
      <div className='modal'>
        <h2 className='popupHead'>Update Doctor Schedule</h2>
        <form>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={error.departmentName !== '' ? true : false}>
                <InputLabel htmlFor='department'>Department</InputLabel>
                <Select
                  MenuProps={{
                    PaperProps: {
                      style: { maxHeight: 300 }
                    }
                  }}
                  label='Department'
                  name='departmentName'
                  value={inputData.departmentId}
                  onChange={handleData}
                  variant='outlined'
                >
                  {allData.map((r, ind) => {
                    return (
                      <MenuItem value={r._id} key={ind}>
                        {r.departmentName}
                      </MenuItem>
                    )
                  })}
                </Select>
                <FormHelperText style={{ marginLeft: '-1px' }}>{error.departmentName}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant='outlined' error={error.doctorName !== '' ? true : false}>
                <InputLabel>Doctor</InputLabel>
                <Select
                  MenuProps={{
                    PaperProps: {
                      style: { maxHeight: 300 }
                    }
                  }}
                  label='Doctor'
                  name='doctorName'
                  value={inputData.doctorId}
                  onChange={handleData}
                >
                  {doctors.map((item, index) => {
                    return (
                      <MenuItem key={index} value={item._id}>
                        {item.basicDetails.firstName + ' ' + item.basicDetails.middleName + ' ' + item.basicDetails.lastName}
                      </MenuItem>
                    )
                  })}
                </Select>
                <FormHelperText>{error.doctorName}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <strong>Slote A</strong>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePicker
                    label='From Time'
                    value={inputData.slotA.fromTime}
                    onChange={newValue => handleTimeChange('slotA', 'fromTime', newValue)}
                    renderInput={params => <TextField {...params} fullWidth />}
                    slotProps={{
                      textField: {
                        error: !!error.slotA,
                        helperText: error.slotA
                      }
                    }}
                  />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePicker
                    label='To Time'
                    value={inputData.slotA.toTime ? new Date(inputData.slotA.toTime) : null} // Convert to Date
                    onChange={newValue => handleTimeChange('slotA', 'toTime', newValue)}
                    renderInput={params => <TextField {...params} fullWidth />}
                    slotProps={{
                      textField: {
                        error: !!error.slotA,
                        helperText: error.slotA
                      }
                    }}
                  />
                </LocalizationProvider>
              </div>
            </Grid>

            <Grid item xs={12} md={6}>
              <strong>Slote B</strong>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePicker
                    label='From Time'
                    value={inputData.slotB.fromTime}
                    onChange={newValue => handleTimeChange('slotB', 'fromTime', newValue)}
                    renderInput={params => <TextField {...params} fullWidth />}
                    slotProps={{
                      textField: {
                        error: !!error.slotB,
                        helperText: error.slotB
                      }
                    }}
                  />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePicker
                    label='To Time'
                    value={inputData.slotB.toTime}
                    onChange={newValue => handleTimeChange('slotB', 'toTime', newValue)}
                    renderInput={params => <TextField {...params} fullWidth />}
                    slotProps={{
                      textField: {
                        error: !!error.slotB,
                        helperText: error.slotB
                      }
                    }}
                  />
                </LocalizationProvider>
              </div>
            </Grid>

            <Grid item xs={12}>
              <FormGroup style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                {modesOptions.map(mode => (
                  <FormControlLabel
                    key={mode}
                    control={<Checkbox checked={inputData.modes.includes(mode)} value={mode} onChange={handleCheckboxChange} />}
                    label={mode}
                  />
                ))}
              </FormGroup>
              <FormHelperText error={!!error.modes}>{error.modes}</FormHelperText>
            </Grid>

            {/* Instructions */}
            <Grid item xs={12}>
              <TextField
                label='Instructions'
                name='instructions'
                fullWidth
                multiline
                rows={3}
                value={inputData.instructions}
                onChange={handleData}
                error={!!error.instructions}
                helperText={error.instructions}
              />
            </Grid>

            <Grid item xs={12}>
              <div className='btnGroup'>
                <IconButton onClick={handleSubmitData} title='Update' className='btnPopup btnSave'>
                  <Save />
                </IconButton>
                <IconButton
                  type='submit'
                  title='Cancel'
                  className='btnPopup btnCancel'
                  onClick={() => {
                    setError({
                      doctorName: '',
                      departmentName: '',
                      slotA: {},
                      slotB: {},
                      modes: [],
                      instructions: ''
                    })
                    close()
                  }}
                >
                  <Cancel />
                </IconButton>
              </div>
            </Grid>
          </Grid>
        </form>
      </div>
    </>
  )
}

export default EditAppointment
