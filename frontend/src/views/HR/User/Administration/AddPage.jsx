import React, { useState } from 'react'
import { Box, Typography, Tabs, Tab, Divider, Grid, Button } from '@mui/material'
import Breadcrumb from 'component/Breadcrumb'
import { Link, useNavigate } from 'react-router-dom'

import BasicDetails from './Pages/BasicDetails'
import PastEmploymentDetails from './Pages/PastEmploymentDetails'
import EmployementDetails from './Pages/EmployementDetails'
import Documentation from './Pages/Documentation'
import SystemRights from './Pages/SystemRights'
import EducationDetails from './Pages/EducationDetails'
import SalaryAndWages from './Pages/SalaryAndWages'
import AttendanceAndLeave from './Pages/AttendanceAndLeave'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const AddPage = () => {
  const [value, setValue] = useState(0)
  const navigate = useNavigate();

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
    EducationDetails: {},
    systemRights: {},
    salaryAndWages: {},
    attendanceAndLeave: {},
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
        return <EmployementDetails setValue={setValue} setStoredAllData={setStoredAllData} storedAllData={storedAllData} />
      case 3:
        return <Documentation setValue={setValue} setStoredAllData={setStoredAllData} storedAllData={storedAllData} />
      case 4:
        return <EducationDetails setValue={setValue} setStoredAllData={setStoredAllData} storedAllData={storedAllData} />
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
          Add User
        </Typography>
      </Breadcrumb>

      <Button sx={{ mb: 2 }} variant="contained" onClick={() => navigate('/users/company-staff')}>
        Back
      </Button>
      {/* Tabs for Master Selection */}
      <Box
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Tabs value={value} onChange={handleChange} variant='scrollable' scrollButtons='auto'>
          <Tab label='Basic Details' />
          <Tab label='Past Employment Details' />
          <Tab label='Current Employment Details' />
          <Tab label='Documentation' />
          <Tab label='Education' />
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

export default AddPage
