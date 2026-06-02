import { Box, Grid, Typography, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'

import DepartmentWiseDoctor from '../DeptWiseDrCard'
import DashboardCard from 'component/DashboardCard'
import { get } from 'api/api'

const DashboardHeader = ({ handleSelectedDoctorAvailability, drData, isDoctorAvailable }) => {
  const theme = useTheme()
  const { appointment, registration, checkPatient, waitingPatient, revenue } = drData
  const [doctorData, setDoctorData] = useState([])
  const [prefix, setPrefix] = useState([])
  const [appointments, setAppointments] = useState([])
  const [allOpdRegistrationData, setAllOpdRegistrationData] = useState([])
  const [dailyPaidAmountOfOpd, setDailyPaidAmountOfOpd] = useState({})
  const [dailyAppointments, setDailyAppointments] = useState(0)

  const doctorDataToDisplay = doctorData?.map(data => {
    const prefixId = data?.basicDetails?.prefix
    const prefixName = prefix?.filter(data => data?._id === prefixId)?.map(data => data?.prefix)
    const name = `${data?.basicDetails?.firstName} ${data?.basicDetails?.middleName} ${data?.basicDetails?.lastName}`
    const department = data?.employmentDetails?.departmentOrSpeciality?.departmentName

    const obj = {
      label: `${prefixName?.at(-1)}. ${name}`,
      department: `${department}`,
      id: data?._id,
      value: 'Available'
    }

    return obj
  })

  const allOpdRegistrationIds = new Set(allOpdRegistrationData?.map(data => data?.patientId))
  const noOfOpdRegistration = appointments?.filter(data => allOpdRegistrationIds.has(data?._id))
  const { newPatients, followUpPatients } = noOfOpdRegistration?.reduce(
    (acc, data) => {
      if (data?.consultationType === 'New') acc.newPatients.push(data)
      if (data?.consultationType === 'Follow-Up') acc.followUpPatients.push(data)
      return acc
    },
    { newPatients: [], followUpPatients: [] }
  ) || { newPatients: [], followUpPatients: [] }

  useEffect(() => {
    get('newConsultant').then(res => {
      setDoctorData(res?.data || [])
    })
    get('prefix').then(res => {
      setPrefix(res?.allPrefix || [])
    })
    get('patient-appointment/all').then(res => {
      setAppointments(res?.data ?? [])
    })

    get('opd-patient').then(res => {
      setAllOpdRegistrationData(res?.data ?? [])
    })

    get('opd-billing/getDailyOPDRevenue').then(res => {
      setDailyPaidAmountOfOpd(res.success === true ? res : {})
    })

    get('patient-appointment/opd/getDailyAppoitments').then(res => {
      setDailyAppointments(res.success === true ? res.data : 0)
    })
  }, [])


  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 2,
        overflow: 'hidden',
        padding: 2
      }}
    >
      {/* Left Section: Main Cards */}
      <Grid
        container
        spacing={2}
        sx={{
          flexGrow: 1,
          width: { xs: '100%', lg: '70%' }
        }}
      >
        <Grid item xs={12}>
          {/* First Row: 4 Cards */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard title='No. of Appointment' headerColor='#FF6F61' sx={{ height: '100%' }}>
                <Typography variant='h4' sx={{ color: '#FF6F61', fontWeight: 'bold', fontSize: '20px' }}>
                  {dailyAppointments}
                </Typography>
              </DashboardCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard title='No. of OPD Registration' headerColor='#4CAF50' sx={{ height: '100%' }}>
                <Typography sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <div>New:</div>
                  <div style={{ color: '#388E3C' }}>{newPatients?.length || 0}</div>
                </Typography>
                <Typography sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <div>Follow Up:</div>
                  <div style={{ color: '#388E3C' }}>{followUpPatients?.length || 0}</div>
                </Typography>
              </DashboardCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard title='OPD Revenue Daily' headerColor='#D32F2F' sx={{ height: '100%' }}>
                <Typography variant='h4' sx={{ color: '#D32F2F', fontWeight: 'bold', fontSize: '20px' }}>
                  {dailyPaidAmountOfOpd.totalRevenue}
                </Typography>
              </DashboardCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard title='Receipts' headerColor='#FF9800' sx={{ height: '100%' }}>
                <Typography sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <div>Cash:</div>
                  <div style={{ color: '#F57C00' }}>{dailyPaidAmountOfOpd.cashRevenue}</div>
                </Typography>
                <Typography sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <div>Credit:</div>
                  <div style={{ color: '#F57C00' }}>{dailyPaidAmountOfOpd.revenueByOtherModes}</div>
                </Typography>
              </DashboardCard>
            </Grid>
          </Grid>

          {/* Second Row: 5 Cards */}
          <Grid container spacing={2} sx={{ marginTop: 1.5 }}>
            {[
              { title: 'Total Appointment', value: appointment, color: '#2196F3' },
              { title: 'No. of Registration', value: registration, color: '#8BC34A' },
              { title: 'Check Patient', value: checkPatient, color: '#cba50b' },
              { title: 'Waiting Patient', value: waitingPatient, color: '#9C27B0' },
              { title: 'Revenue', value: revenue, color: '#00BCD4' }
            ].map((card, index) => (
              <Grid item xs={12} sm={6} md={2.4} key={index}>
                <DashboardCard title={card.title} headerColor={card.color} sx={{ height: '100%' }}>
                  {isDoctorAvailable.value === 'Available' && (
                    <Typography variant='h4' sx={{ color: card.color, fontWeight: 'bold', fontSize: '20px' }}>
                      {card.value}
                    </Typography>
                  )}
                </DashboardCard>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Right Section: Department-wise Doctor Availability */}
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={4}
        sx={{
          width: { xs: '100%', lg: '30%' },
          marginTop: { xs: 2, lg: 0 }
        }}
      >
        <Box
          sx={{
            height: '100%'
          }}
        >
          <DepartmentWiseDoctor
            type='table'
            rows={doctorDataToDisplay}
            color={theme.palette.warning.main}
            onClick={handleSelectedDoctorAvailability}
          />
        </Box>
      </Grid>
    </Box>
  )
}

export default DashboardHeader
