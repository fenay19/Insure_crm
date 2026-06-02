import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  Checkbox,
  Button,
  Chip,
  Box,
  Modal,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Table,
  TableContainer,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import { Cancel, InputTwoTone, Save } from '@mui/icons-material'
import { get, put } from 'api/api'
import { toast } from 'react-toastify'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { FaEye } from 'react-icons/fa'

const Sechedule = ({ close, secheduleData, getAppointmentSchedulling }) => {
  const [allData, setAllData] = useState([])
  const [doctors, setDoctors] = useState([])
  const [doctorsa, setDoctorsa] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modalData, setModalData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [timeIntervals, setTimeIntervals] = useState([])
  const [inputData, setInputData] = useState({
    ...secheduleData,
    timeInterval: '',
    month: [],
    schedule: []
  })

  const [visibleRows, setVisibleRows] = useState(20) // Number of rows to render initially
  const tableRef = useRef(null) // Ref for the table container

  // Load more rows when the user scrolls to the bottom
  const handleScroll = useCallback(() => {
    if (tableRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = tableRef.current
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        // Load more rows when the user is near the bottom
        setVisibleRows(prev => prev + 20)
      }
    }
  }, [])

  // Attach scroll event listener
  useEffect(() => {
    const tableElement = tableRef.current
    if (tableElement) {
      tableElement.addEventListener('scroll', handleScroll)
    }
    return () => {
      if (tableElement) {
        tableElement.removeEventListener('scroll', handleScroll)
      }
    }
  }, [handleScroll])

  // Slice the schedule data to render only visible rows
  const visibleSchedule = inputData.schedule.slice(0, visibleRows)

  // Rest of your component code...

  const [error, setError] = useState({
    doctorName: '',
    departmentName: '',
    slotA: '',
    slotB: '',
    modes: '',
    instructions: '',
    timeInterval: '',
    month: '',
    schedule: ''
  })

  const handleSave = event => {
    handleSubmitData(event)
  }

  const handleCancel = () => {
    close()
  }

  const handleData = e => {
    const name = e.target.name;
    const value = e.target.value;
  
    if (name === 'departmentName') {
      let dep = '';
      allData.forEach(v => {
        if (v._id === value) {
          dep = v.departmentName;
        }
      });
      setInputData(prev => ({
        ...prev,
        departmentId: value,
        departmentName: dep,
      }));
  
      let cons = [];
      doctorsa.forEach(v => {
        if (v.basicDetails.departmentId === value) {
          cons.push(v);
        }
      });
      setDoctors(cons);
      if (cons.length === 0) {
        setError(prev => ({
          ...prev,
          doctorName: `Doctor not belong to selected department`,
        }));
      } else {
        setError(prev => ({
          ...prev,
          doctorName: ``,
        }));
      }
    } else if (name === 'doctorName') {
      let dep = '';
      doctors.forEach(v => {
        if (v._id === value) {
          dep = v.basicDetails.firstName + ' ' + v.basicDetails.middleName + ' ' + v.basicDetails.lastName;
        }
      });
      setInputData(prev => ({
        ...prev,
        doctorId: value,
        doctorName: dep,
      }));
    } else if (name === 'month') {
      // Handle month selection/unselection
      const selectedMonths = e.target.value; // Array of selected months
  
      // Find months that were unchecked
      const uncheckedMonths = inputData.month.filter(month => !selectedMonths.includes(month));
  
      // Remove schedule data for unchecked months
      const updatedSchedule = inputData.schedule.filter(item => {
        const [month, day, year] = item.id.split('-');
        const monthYear = `${month} ${year}`;
        return !uncheckedMonths.includes(monthYear);
      });
  
      setInputData(prev => ({
        ...prev,
        month: selectedMonths,
        schedule: updatedSchedule,
      }));
    } else {
      setInputData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  
    setError(prev => ({
      ...prev,
      [name]: '',
    }));
  };

  const formatTimeWithAMPM = date => {
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12 || 12
    minutes = minutes.toString().padStart(2, '0')
    return `${hours}:${minutes} ${ampm}`
  }

  const generateTimeSlots = (startTime, endTime, interval) => {
    const slots = []
    let current = new Date(startTime)

    while (current < endTime) {
      let next = new Date(current.getTime() + interval * 60000)
      slots.push({ time: formatTimeWithAMPM(current), booked: false, status: 'VACANT' })
      current = next
    }

    console.log(slots)
    return slots
  }

  const generateDatesForMonths = (selectedMonths, existingSchedule = []) => {
    const newSchedules = [] // Array to store newly generated dates

    // Correct weekdays array
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    selectedMonths.forEach(monthWithYear => {
      const [month, yearString] = monthWithYear.split(' ')
      const year = parseInt(yearString, 10)
      const monthIndex = months.indexOf(month)

      if (monthIndex === -1) {
        alert(`Invalid month: ${month}`)
        return
      }

      // Check if the month already exists in the existing schedule
      const monthExists = existingSchedule.some(item => item.id.includes(`${month}-${year}`))

      if (monthExists) {
        // Skip generation for this month if it already exists
        return
      }

      // Get the number of days in the month
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()

      for (let day = 1; day <= daysInMonth; day++) {
        // Create the date object in UTC to avoid timezone issues
        const date = new Date(Date.UTC(year, monthIndex, day))

        // Generate the date string in YYYY-MM-DD format
        const dateString = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

        // Get the day of the week using UTC methods
        const dayOfWeek = weekdays[date.getUTCDay()]

        newSchedules.push({
          id: `${month}-${day}-${year}`, // e.g., "March-1-2025"
          date: dateString, // e.g., "2025-03-01"
          day: dayOfWeek, // e.g., "Saturday"
          selected: true, // Default selected state
          slotA: {
            fromTime: secheduleData.slotA?.fromTime ? new Date(secheduleData.slotA.fromTime) : null,
            toTime: secheduleData.slotA?.toTime ? new Date(secheduleData.slotA.toTime) : null,
            selected: true, // Default selected state
            timeSlotsIntervalWise: generateTimeSlots(
              secheduleData.slotA?.fromTime ? new Date(secheduleData.slotA.fromTime) : null,
              secheduleData.slotA?.toTime ? new Date(secheduleData.slotA.toTime) : null,
              parseInt(inputData?.timeInterval?.replace('min', '') || 15, 10)
            )
          },
          slotB: {
            fromTime: secheduleData.slotB?.fromTime ? new Date(secheduleData.slotB.fromTime) : null,
            toTime: secheduleData.slotB?.toTime ? new Date(secheduleData.slotB.toTime) : null,
            selected: true, // Default selected state
            timeSlotsIntervalWise: generateTimeSlots(
              secheduleData.slotB?.fromTime ? new Date(secheduleData.slotB.fromTime) : null,
              secheduleData.slotB?.toTime ? new Date(secheduleData.slotB.toTime) : null,
              parseInt(inputData?.timeInterval?.replace('min', '') || 15, 10)
            )
          }
        })
      }
    })

    // Combine existing schedule and new schedules
    const updatedSchedule = [...existingSchedule, ...newSchedules]

    setInputData(prev => ({
      ...prev,
      schedule: updatedSchedule
    }))
  }
 

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const getAvailableMonths = () => {
    const months = []
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()

    for (let i = 0; i < 12; i++) {
      const futureMonth = (currentMonth + i) % 12
      const futureYear = currentYear + Math.floor((currentMonth + i) / 12)
      const futureDate = new Date(futureYear, futureMonth, 1)

      months.push(futureDate.toLocaleString('default', { month: 'long' }) + ' ' + futureYear)
    }

    return months
  }

  const availableMonths = getAvailableMonths()

  useEffect(() => {
    if (inputData.month.length > 0 && availableMonths.length > 0) {
      // Filter out months that are already in the schedule
      const existingMonths = inputData.schedule.map(item => {
        const [month, day, year] = item.id.split('-')
        return `${month} ${year}`
      })

      const newMonths = inputData.month.filter(month => !existingMonths.includes(month))

      if (newMonths.length > 0) {
        // Generate dates only for newly selected months
        generateDatesForMonths(newMonths, inputData.schedule)
      }
    }
  }, [inputData.month])
  const handleEyeClick = slot => {
    const { fromTime, toTime } = slot
    const interval = inputData.timeInterval ? parseInt(inputData.timeInterval.replace('min', ''), 10) : null

    if (!interval || isNaN(interval)) {
      alert('Invalid time interval. Please provide a valid interval in minutes.')
      return
    }

    const slots = generateTimeSlots(fromTime, toTime, interval)

    setModalData(slots)
    setIsModalOpen(true)
  }

  const handleRowData = (sch, checked) => {
    setInputData(prev => ({
      ...prev,
      schedule: prev.schedule.map(item =>
        item.id === sch.id
          ? {
              ...item,
              selected: checked,
              slotA: {
                fromTime: item.slotA?.fromTime ? new Date(item.slotA.fromTime) : null,
                toTime: item.slotA?.toTime ? new Date(item.slotA.toTime) : null,
                selected: checked
              },
              slotB: {
                fromTime: item.slotB?.fromTime ? new Date(item.slotB.fromTime) : null,
                toTime: item.slotB?.toTime ? new Date(item.slotB.toTime) : null,
                selected: checked
              }
            }
          : item
      )
    }))
  }

  function handleSlotSelect (id, slot, checked) {
    setInputData(function (prev) {
      return {
        ...prev,
        schedule: prev.schedule.map(function (item) {
          if (item.id === id) {
            return {
              ...item,
              [slot]: {
                ...item[slot],
                selected: checked
              }
            }
          }
          return item
        })
      }
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
        if (v.employmentDetails.departmentOrSpeciality._id === secheduleData.departmentId) {
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

  const getIntervalData = async () => {
    try {
      const response = await get('time-interval')
      const intervals = response.allInterval.map((val, index) => ({
        ...val,
        sr: index + 1
      }))
      setTimeIntervals(intervals)
    } catch (error) {
      console.error('Error fetching intervals:', error)
    }
  }

  useEffect(() => {
    getIntervalData()
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
    if (
      inputData.doctorName !== '' &&
      inputData.departmentName !== '' &&
      inputData.startTime !== '' &&
      inputData.endTime !== '' &&
      inputData.timeInterval !== ''
    ) {
      setIsSubmitting(true)
      const response = await put(`appointmentSchedule-master/${secheduleData._id}`, inputData)
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

    if (secheduleData) {
      setInputData({
        doctorId: secheduleData.doctorId,
        doctorName: secheduleData.doctorName,
        departmentName: secheduleData.departmentName,
        departmentId: secheduleData.departmentId,
        slotA: secheduleData.slotA,
        slotB: secheduleData.slotB,
        timeInterval: secheduleData.timeInterval,
        month: secheduleData.month || [],
        schedule: secheduleData.schedule
          ? secheduleData.schedule.map(item => ({
              ...item,
              selected: item.selected,
              slotA: {
                fromTime: item.slotA?.fromTime ? new Date(item.slotA.fromTime) : null,
                toTime: item.slotA?.toTime ? new Date(item.slotA.toTime) : null,
                timeSlotsIntervalWise : item.slotA.timeSlotsIntervalWise,
                selected: item.selected
              },
              slotB: {
                fromTime: item.slotB?.fromTime ? new Date(item.slotB.fromTime) : null,
                toTime: item.slotB?.toTime ? new Date(item.slotB.toTime) : null,
                timeSlotsIntervalWise : item.slotB.timeSlotsIntervalWise,
                selected: item.selected
              }
            }))
          : []
      })
    }
  }, [secheduleData])

  return (
    <div className='wideModal'>
      <div>
        <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Schedule</h3>

        <form onSubmit={handleSave}>
          <header style={{ backgroundColor: '#eee', padding: '10px', borderRadius: '7px', color: '#fff' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
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
              <Grid item xs={12} md={3}>
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
              <Grid item xs={12} md={3}>
                <FormControl fullWidth error={!!error.timeInterval}>
                  <InputLabel>Time Interval</InputLabel>
                  <Select name='timeInterval' value={inputData.timeInterval} onChange={handleData} label='Time Interval'>
                    {timeIntervals.map(interval => (
                      <MenuItem key={interval.timeInterval} value={interval.timeInterval}>
                        {interval.timeInterval} min
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{error.timeInterval}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Month</InputLabel>
                  <Select
                    multiple
                    name='month'
                    value={inputData.month}
                    onChange={e => handleData(e)}
                    renderValue={selected => selected.join(', ')}
                    label='Month'
                  >
                    {availableMonths.map(month => (
                      <MenuItem key={month} value={month}>
                        <Checkbox checked={inputData.month.includes(month)} />
                        {month}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </header>
          <Card sx={{ padding: '3px' }}>
            <TableContainer ref={tableRef} style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <Table>
                <TableHead style={{ background: '#4ac7ed', color: '#fff' }}>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell style={{ color: '#fff', textAlign: 'center' }}>Date</TableCell>
                    <TableCell style={{ color: '#fff', textAlign: 'center' }}>Day</TableCell>
                    <TableCell style={{ color: '#fff', textAlign: 'center' }}>Slot A</TableCell>
                    <TableCell style={{ color: '#fff', textAlign: 'center' }}>Slot B</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {visibleSchedule.map(sch => (
                    <TableRow key={sch.id} style={{ backgroundColor: sch.selected === false ? '#fc6060' : 'transparent' }}>
                      <TableCell>
                        <Checkbox checked={sch.selected} onChange={e => handleRowData(sch, e.target.checked)} />
                      </TableCell>
                      <TableCell>
                        <TextField variant='standard' disabled value={sch.id} />
                      </TableCell>
                      <TableCell>{sch.day}</TableCell>
                      <TableCell
                        style={{
                          backgroundColor: sch.slotA?.selected === false ? '#fc6060' : 'transparent'
                        }}
                      >
                        <Checkbox checked={sch.slotA?.selected} onChange={e => handleSlotSelect(sch.id, 'slotA', e.target.checked)} />
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <TimePicker
                            label='From Time'
                            value={sch.slotA?.fromTime}
                            onChange={newValue =>
                              setInputData(prev => ({
                                ...prev,
                                schedule: prev.schedule.map(item =>
                                  item.id === sch.id ? { ...item, slotA: { ...item.slotA, fromTime: newValue } } : item
                                )
                              }))
                            }
                            renderInput={params => <TextField {...params} fullWidth />}
                          />
                        </LocalizationProvider>
                        -
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <TimePicker
                            label='To Time'
                            value={sch.slotA?.toTime}
                            onChange={newValue =>
                              setInputData(prev => ({
                                ...prev,
                                schedule: prev.schedule.map(item =>
                                  item.id === sch.id ? { ...item, slotA: { ...item.slotA, toTime: newValue } } : item
                                )
                              }))
                            }
                            renderInput={params => <TextField {...params} fullWidth />}
                          />
                        </LocalizationProvider>
                        <FaEye
                          style={{ marginLeft: '8px', color: '#126078', fontSize: '19px', cursor: 'pointer' }}
                          onClick={() => handleEyeClick(sch.slotA)}
                        />
                      </TableCell>
                      <TableCell
                        style={{
                          backgroundColor: sch.slotB?.selected === false ? '#fc6060' : 'transparent'
                        }}
                      >
                        <Checkbox checked={sch.slotB?.selected} onChange={e => handleSlotSelect(sch.id, 'slotB', e.target.checked)} />
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <TimePicker
                            label='From Time'
                            value={sch.slotB?.fromTime}
                            onChange={newValue =>
                              setInputData(prev => ({
                                ...prev,
                                schedule: prev.schedule.map(item =>
                                  item.id === sch.id ? { ...item, slotB: { ...item.slotB, fromTime: newValue } } : item
                                )
                              }))
                            }
                            renderInput={params => <TextField {...params} fullWidth />}
                          />
                        </LocalizationProvider>
                        -
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <TimePicker
                            label='To Time'
                            value={sch.slotB?.toTime}
                            onChange={newValue =>
                              setInputData(prev => ({
                                ...prev,
                                schedule: prev.schedule.map(item =>
                                  item.id === sch.id ? { ...item, slotB: { ...item.slotB, toTime: newValue } } : item
                                )
                              }))
                            }
                            renderInput={params => <TextField {...params} fullWidth />}
                          />
                        </LocalizationProvider>
                        <FaEye
                          style={{ marginLeft: '8px', color: '#126078', fontSize: '19px', cursor: 'pointer' }}
                          onClick={() => handleEyeClick(sch.slotB)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
          <Button style={{ marginTop: '1rem' }} type='submit' variant='contained' color='primary' disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
          <Button style={{ marginLeft: '1rem', marginTop: '1rem' }} variant='outlined' onClick={() => close()}>
            Cancel
          </Button>
          {/* Submit and Cancel buttons... */}
        </form>

        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth='sm' fullWidth>
          <DialogTitle>Time Slots</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, padding: '1rem' }}>
              {modalData.map((time, index) => (
                <Chip color='primary' key={index} label={time.time} />
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button variant='outlined' onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  )
}

export default Sechedule
