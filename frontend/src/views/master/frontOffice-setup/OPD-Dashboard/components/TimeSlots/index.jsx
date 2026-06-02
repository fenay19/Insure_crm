import React, { useEffect, useState } from 'react'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Tooltip from '@mui/material/Tooltip'
import AddAppointment from 'views/master/frontOffice-setup/appointment/forms/AddAppointment'
import { get } from 'api/api'
import { useNavigate } from 'react-router'

const colors = {
  available: '#66cc66',
  warning: '#ffcc33',
  booked: '#33cccc',
  blocked: '#ff6666'
}

function TimeSlots () {
  const [open, setOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [allSlotsData, setAllSlotsData] = useState([])
  const [slotAData, setSlotAData] = useState([])
  const [slotBData, setSlotBData] = useState([])
  const navigate = useNavigate()
  const departmentName = window.localStorage.getItem('selected-department')

  const handleClick = (time, name, color) => {
    if (color === colors.available) {
      setSelectedSlot({ time, name, color })
      setOpen(true)
    } else if (color === colors.warning || color === colors.booked) {
      navigate('/master/appointment')
    } else {
      alert(`Time: ${time}, Name: ${name}`)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedSlot(null)
  }

  const generateTime = (fromTime, toTime, interval, details = []) => {
    const timeSlots = []
    const from = new Date(fromTime)
    const to = new Date(toTime)
    const intervalMs = interval * 60 * 1000

    let detailsIndex = 0 // To cycle through the details array

    for (let time = from; time < to; time = new Date(time.getTime() + intervalMs)) {
      const formattedTime = time.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })

      timeSlots.push({
        time: formattedTime,
        color: details[detailsIndex]?.color || colors.available,
        details: details[detailsIndex] || {}
      })

      detailsIndex = (detailsIndex + 1) % details.length
    }
    console.log(timeSlots)

    return timeSlots
  }

  
  const filterAndProcessSlots = () => {
    const slots = allSlotsData?.filter(data => data?.departmentName?.toLowerCase()?.trim() === departmentName?.toLowerCase()?.trim())

    if (!slots?.length) {
      setSlotAData([])
      setSlotBData([])
      return
    }

    console.log(slots)
    const schedule = slots[0]?.schedule || []

    const slotATime = schedule[0]?.slotA ?? slots[0]?.slotA
    const slotBTime = schedule[0]?.slotB ?? slots[0]?.slotB
    console.log('Slot AT IME', slotATime, slotBTime)
    const interval = slots[0]?.timeInterval || 30

    // Dummy slot details including available slots for testing
    const slotADetails = [
      {
        patientName: 'John Doe',
        doctorName: 'Dr. Smith',
        uhid: 'UH12345',
        opdNo: 'OPD12345',
        color: colors.blocked
      },
      {
        color: colors.booked
      },
      {
        color: colors.available // Green available slot
      }
    ]

    const slotBDetails = [
      {
        patientName: 'Jane Roe',
        doctorName: 'Dr. Brown',
        uhid: 'UH67890',
        opdNo: 'OPD67890',
        color: colors.blocked
      },
      {
        color: colors.warning
      },
      {
        color: colors.available // Green available slot
      }
    ]

    const slotATimes = slotATime ? generateTime(slotATime.fromTime, slotATime.toTime, interval, slotADetails) : []
    const slotBTimes = slotBTime ? generateTime(slotBTime.fromTime, slotBTime.toTime, interval, slotBDetails) : []

    setSlotAData(slotATimes)
    setSlotBData(slotBTimes)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await get('appointmentSchedule-master')
        if (res?.data?.length) {
          setAllSlotsData(res.data)
        } else {
          setAllSlotsData([])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setAllSlotsData([])
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (allSlotsData.length > 0) {
      filterAndProcessSlots()
    }
  }, [allSlotsData, departmentName])

  return (
    <Box sx={{ margin: '16px' }}>
      <Typography variant='h5' sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '16px' }}>
        Slot A
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.4, justifyContent: 'center', marginBottom: '24px' }}>
        {slotAData.map((slot, index) => (
          <Box key={index} sx={{ textAlign: 'center', margin: '4px' }}>
            <Typography variant='body2' sx={{ fontWeight: 600, fontSize: '0.75rem', marginBottom: '8px' }}>
              {slot.time}
            </Typography>
            <Tooltip
              title={
                slot.details?.patientName ? (
                  <div>
                    <Typography variant='body2'>Patient: {slot.details.patientName}</Typography>
                    <Typography variant='body2'>Doctor: {slot.details.doctorName}</Typography>
                    <Typography variant='body2'>UHID: {slot.details.uhid}</Typography>
                    <Typography variant='body2'>OPD NO: {slot.details.opdNo}</Typography>
                  </div>
                ) : (
                  ''
                )
              }
              placement='top'
              arrow
            >
              <Chip
                label='Slot A'
                onClick={() => handleClick(slot.time, 'Slot A', slot.color)}
                sx={{
                  backgroundColor: slot.color,
                  color: '#fff',
                  height: '32px',
                  fontSize: '0.9rem',
                  padding: '0 12px'
                }}
              />
            </Tooltip>
          </Box>
        ))}
      </Box>

      <Typography variant='h5' sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '16px' }}>
        Slot B
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.4, justifyContent: 'center' }}>
        {slotBData.map((slot, index) => (
          <Box key={index} sx={{ textAlign: 'center', margin: '4px' }}>
            <Typography variant='body2' sx={{ fontWeight: 600, fontSize: '0.75rem', marginBottom: '8px' }}>
              {slot.time}
            </Typography>
            <Tooltip
              title={
                slot.details?.patientName ? (
                  <div>
                    <Typography variant='body2'>Patient: {slot.details.patientName}</Typography>
                    <Typography variant='body2'>Doctor: {slot.details.doctorName}</Typography>
                    <Typography variant='body2'>UHID: {slot.details.uhid}</Typography>
                    <Typography variant='body2'>OPD NO: {slot.details.opdNo}</Typography>
                  </div>
                ) : (
                  ''
                )
              }
              placement='top'
              arrow
            >
              <Chip
                label='Slot B'
                onClick={() => handleClick(slot.time, 'Slot B', slot.color)}
                sx={{
                  backgroundColor: slot.color,
                  color: '#fff',
                  height: '32px',
                  fontSize: '0.9rem',
                  padding: '0 12px'
                }}
              />
            </Tooltip>
          </Box>
        ))}
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 4 }}>
          {selectedSlot && <AddAppointment close={handleClose} selectedSlot={selectedSlot} isOpdDashboard={true} />}
        </Box>
      </Modal>
    </Box>
  )
}

export default TimeSlots
