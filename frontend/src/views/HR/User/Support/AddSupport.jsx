import React, { useState } from 'react'
import { Box, Typography, Tabs, Tab, Divider, Grid } from '@mui/material'
import Breadcrumb from 'component/Breadcrumb'
import { Link } from 'react-router-dom'

import BasicDetails from './Pages/BasicDetails'
import PastEmploymentDetails from './Pages/PastEmploymentDetails'
import EmploymentDetails from './Pages/EmployementDetails'
import Documentation from './Pages/Documentation'
import SystemRights from './Pages/SystemRights'
import HRFinance from './Pages/HRFinance'
import SalaryAndWages from './Pages/SalaryAndWages'
import AttendanceAndLeave from './Pages/AttendanceAndLeave'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AddSupport = () => {
  const [value, setValue] = useState(0)

  const [storedAllData, setStoredAllData] = useState({
    basicDetails: {},
    pastEmploymentDetails: [
      {
        organisationName: '',
        designation: '',
        empCode: '',
        joiningDate: '',
        relievingDate: '',
        inHandSalary: '',
        yearsOfExperience: '',
        note: ''
      }
    ],
    employmentDetails: {},
    documentation: {},
    submittedFormId: ''
  })

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const renderMasterContent = () => {
    switch (value) {
      case 0:
        return <BasicDetails setValue={setValue} setStoredAllData={setStoredAllData} storedAllData={storedAllData} />
      case 1:
        return <PastEmploymentDetails setValue={setValue} setStoredAllData={setStoredAllData} storedAllData={storedAllData} />
      case 2:
        return <EmploymentDetails setValue={setValue} setStoredAllData={setStoredAllData} storedAllData={storedAllData} />
      case 3:
        return <Documentation setValue={setValue} setStoredAllData={setStoredAllData} storedAllData={storedAllData} />
      case 4:
        return <HRFinance setValue={setValue} setStoredAllData={setStoredAllData} storedAllData={storedAllData} />
      case 5:
        return <SystemRights setValue={setValue} setStoredAllData={setStoredAllData} storedAllData={storedAllData} />
      case 6:
        return <SalaryAndWages setValue={setValue} setStoredAllData={setStoredAllData} storedAllData={storedAllData} />
      case 7:
        return <AttendanceAndLeave setValue={setValue} setStoredAllData={setStoredAllData} storedAllData={storedAllData} />
      default:
        return null
    }
  }

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb>
        <Typography component={Link} to='/' variant='subtitle2' color='inherit' className='link-breadcrumb'>
          Home
        </Typography>
        <Typography variant='subtitle2' color='primary' className='link-breadcrumb'>
          Add Support
        </Typography>
      </Breadcrumb>

      {/* Tabs for Master Selection */}
      <Box
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        <Tabs value={value} onChange={handleChange} variant='scrollable' scrollButtons='auto'>
          <Tab label='Basic Details' />
          <Tab label='Past Employment Details' />
          <Tab label='Current Employment Details' />
          <Tab label='Documentation' />
          <Tab label='HR Finance' />
          <Tab label='System Rights' />
          <Tab label='Salary & Wages' />
          <Tab label='Attendance/Leaves' />
        </Tabs>
        <Divider />
      </Box>

      {/* Render the selected master content */}
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            {renderMasterContent()}
          </Grid>
        </Grid>
      </Box>
      <ToastContainer />
    </>
  )
}

export default AddSupport
