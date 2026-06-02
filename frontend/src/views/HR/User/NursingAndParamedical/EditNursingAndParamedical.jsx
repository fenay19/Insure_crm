import React, { useState, useEffect } from 'react'
import { Box, Typography, Tabs, Tab, Divider, Grid, Button } from '@mui/material'
import Breadcrumb from 'component/Breadcrumb'
import { Link, useNavigate, useParams } from 'react-router-dom'

import BasicDetails from './EditPages/BasicDetails'
import PastEmploymentDetails from './EditPages/PastEmploymentDetails'
import EmploymentDetails from './EditPages/EmploymentDetails'
import Qualification from './EditPages/Qualification' // Imported Qualification component
import Documentation from './EditPages/Documentation'
import HrFinance from './EditPages/HrFinance'
import SystemRights from './EditPages/SystemRights'
import SalaryAndWages from './EditPages/SalaryAndWages'
import AttendanceAndLeave from './EditPages/AttendanceAndLeave'
import { get } from 'api/api'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const EditNursingAndParamedical = () => {
  const [value, setValue] = useState(0)
  const { id } = useParams()
  const navigate = useNavigate();


  const fetchSingleAdministrativeData = async () => {
    const response = await get(`nursingAndParamedical/${id}`)
    console.log(response)
    setStoredAllData(response.data)
  }

  useEffect(() => {
    fetchSingleAdministrativeData()
  }, [id])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const [storedAllData, setStoredAllData] = useState({
    basicDetails: {},
    pastEmploymentDetails: [],
    employmentDetails: {},
    qualification: {},
    additionalDetails: {},
    documentation: {},
    hrFinance: {},
    systemRights: {},
    salaryAndWages: {},
    attendanceAndLeave: {}
  })

  const getTabKey = tabIndex => {
    switch (tabIndex) {
      case 0:
        return 'basicDetails'
      case 1:
        return 'pastEmploymentDetails'
      case 2:
        return 'employmentDetails'
      case 3:
        return 'qualification' // Add case for Qualification
      case 4:
        return 'documentation'
      case 5:
        return 'hrFinance'
      case 6:
        return 'systemRights'
      case 7:
        return 'salaryAndWages'
      case 8:
        return 'attendanceAndLeave'
      default:
        return ''
    }
  }

  const renderMasterContent = () => {
    switch (value) {
      case 0:
        return <BasicDetails setStoredAllData={setStoredAllData} setValue={setValue} storedAllData={storedAllData} />
      case 1:
        return <PastEmploymentDetails setStoredAllData={setStoredAllData} setValue={setValue} storedAllData={storedAllData} />
      case 2:
        return <EmploymentDetails setStoredAllData={setStoredAllData} setValue={setValue} storedAllData={storedAllData} />
      case 3:
        return <Qualification setStoredAllData={setStoredAllData} setValue={setValue} storedAllData={storedAllData} /> // Add Qualification component here
      case 4:
        return <Documentation setStoredAllData={setStoredAllData} setValue={setValue} storedAllData={storedAllData} />
      case 5:
        return <HrFinance setStoredAllData={setStoredAllData} setValue={setValue} storedAllData={storedAllData} />
      case 6:
        return <SystemRights setStoredAllData={setStoredAllData} setValue={setValue} storedAllData={storedAllData} />
      case 7:
        return <SalaryAndWages setStoredAllData={setStoredAllData} setValue={setValue} storedAllData={storedAllData} />
      case 8:
        return <AttendanceAndLeave setStoredAllData={setStoredAllData} setValue={setValue} storedAllData={storedAllData} />
      default:
        return null
    }
  }

  return (
    <>
      <Breadcrumb>
        <Typography component={Link} to='/' variant='subtitle2' color='inherit' className='link-breadcrumb'>
          Home
        </Typography>
        <Typography variant='subtitle2' color='primary' className='link-breadcrumb'>
          Update Nursing and Paramedical
        </Typography>
      </Breadcrumb>
      <Button sx={{ mb: 2 }} variant="contained" onClick={() => navigate('/users/nursing-paramedical')}>
        Back
      </Button>
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
          <Tab label='Qualification' /> {/* Add Qualification Tab */}
          <Tab label='Documentation' />
          <Tab label='HR Finance' />
          <Tab label='System Rights' />
          <Tab label='Salary & Wages' />
          <Tab label='Attendance/Leaves' />
        </Tabs>
        <Divider />
      </Box>

      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {renderMasterContent()}
          </Grid>
        </Grid>
      </Box>

      <ToastContainer />
    </>
  )
}

export default EditNursingAndParamedical
