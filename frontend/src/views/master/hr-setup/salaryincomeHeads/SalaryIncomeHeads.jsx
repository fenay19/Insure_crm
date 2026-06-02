import React, { useEffect, useState } from 'react'
import { Box, Typography, Tabs, Tab, Divider } from '@mui/material'
import Breadcrumb from 'component/Breadcrumb'
import { Link } from 'react-router-dom'
import Income from '../salaryincomeHeads/tabs/Income/Income'
import PT from './tabs/PT/PT'
import SalaryIncomeDeduction from '../salaryIncomeDeduction/SalaryIncomeDeduction'
import { useSelector } from 'react-redux'

const SalaryIncomeHeads= () => {
  const [value, setValue] = useState(0)
  const [isAdmin,setAdmin]=useState(false);
  const [salaryIncomeHeadPermission,setSalaryIncomeHeadPermission]=useState({
      View: false,
      Add: false,
      Edit: false,
      Delete: false
  });
  const systemRights = useSelector((state)=>state.systemRights.systemRights);
  useEffect(()=>{
    const loginRole=localStorage.getItem('loginRole');
    if (loginRole === 'admin') {
    setAdmin(true);
    }
    if (systemRights?.actionPermissions?.["salary-income-head"]) {
    setSalaryIncomeHeadPermission(systemRights.actionPermissions["salary-income-head"]);
    }
  },[systemRights]);
  // Handle Tab change
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  // Render the appropriate master content based on the selected tab
  const renderMasterContent = () => {
    switch (value) {
      case 0:
        return <PT salaryIncomeHeadPermission={salaryIncomeHeadPermission} isAdmin={isAdmin}/>
      case 1:
        return <Income salaryIncomeHeadPermission={salaryIncomeHeadPermission} isAdmin={isAdmin}/>
      case 2:
        return <SalaryIncomeDeduction salaryIncomeHeadPermission={salaryIncomeHeadPermission} isAdmin={isAdmin}/>

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
          Salary Income Heads
        </Typography>
      </Breadcrumb>

      {/* Tabs for Master Selection */}
      <Box sx={{ width: '100%'}}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label='PT'/>
          <Tab label='Income'/>
          <Tab label='Deduction' />
        </Tabs>
        <Divider />
      </Box>
      {/* Render the selected master content */}
      <Box sx={{ mt: 0 }}>{renderMasterContent()}</Box>
    </>
  )
}

export default SalaryIncomeHeads
