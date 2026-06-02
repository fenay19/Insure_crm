import React, { useState, useEffect } from 'react'
import { Box, Typography, Tabs, Tab, Divider, Grid, Modal, Button } from '@mui/material'
import Breadcrumb from 'component/Breadcrumb'
import { Link, useNavigate, useParams } from 'react-router-dom'

import BasicDetails from './EditPages/BasicDetails'
import PastEmploymentDetails from './EditPages/PastEmploymentDetails'
import EmploymentDetails from './EditPages/EmploymentDetails'
import Documentation from './EditPages/Documentation'
import HrFinance from './EditPages/HrFinance'
import SystemRights from './EditPages/SystemRights'
import SalaryAndWages from './EditPages/SalaryAndWages'
import AttendanceAndLeave from './EditPages/AttendanceAndLeave'
import { get} from 'api/api'
import { ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const UpdatePage = () => {
  const [value, setValue] = useState(0)
  const { id } = useParams()

  const fetchSingleAdministrativeData = async () => {
    const response = await get(`administrative/${id}`)
    setStoredAllData(response.data)
  }

  useEffect(() => {
    fetchSingleAdministrativeData()
  }, [id])

  const handleChange = (event, newValue) => {
    if (isFormVisible[getTabKey(newValue)]) {
      setValue(newValue)
    } else {
      alert('Please complete the current section before proceeding.')
    }
  }

  const [storedAllData, setStoredAllData] = useState({
    basicDetails: {},
    pastEmploymentDetails: [],
    employmentDetails: {},
    documentation: {},
    hrFinance: {},
    systemRights: {},
    salaryAndWages: {},
    attendanceAndLeave: {}
  })

  const [isFormVisible, setIsFormVisible] = useState({
    basicDetails: true,
    pastEmploymentDetails: true,
    employmentDetails: true,
    documentation: true,
    hrFinance: true,
    systemRights: true,
    salaryAndWages: true,
    attendanceAndLeave: true
  })

  const [isAllFormsValidate, setIsAllFormsValidate] = useState(false)

  const getTabKey = tabIndex => {
    switch (tabIndex) {
      case 0:
        return 'basicDetails'
      case 1:
        return 'pastEmploymentDetails'
      case 2:
        return 'employmentDetails'
      case 3:
        return 'documentation'
      case 4:
        return 'hrFinance'
      case 5:
        return 'systemRights'
      case 6:
        return 'salaryAndWages'
      case 7:
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
        return <Documentation setStoredAllData={setStoredAllData} setValue={setValue} storedAllData={storedAllData} />
      case 4:
        return <HrFinance setStoredAllData={setStoredAllData} setValue={setValue} storedAllData={storedAllData} />
      case 5:
        return <SystemRights setStoredAllData={setStoredAllData} setValue={setValue} storedAllData={storedAllData} />
      case 6:
        return <SalaryAndWages setStoredAllData={setStoredAllData} setValue={setValue} storedAllData={storedAllData} />
      case 7:
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
          Update Administrative
        </Typography>
      </Breadcrumb>

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

export default UpdatePage
